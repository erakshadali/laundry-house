import { neon } from "@neondatabase/serverless";
import { SLOTS, SLOT_CAPACITY } from "./config";
import { seedServices } from "./seed";
import type { Order, OrderStatus, Service } from "./types";
import type { NewOrderInput } from "./store-types";
import { addDays, hourIST, todayIST } from "./utils";

/** Production store: Postgres (Neon). Same functions as store-file.ts. */
const sql = neon(process.env.DATABASE_URL!);

let ready: Promise<void> | null = null;

function ensureSchema(): Promise<void> {
  ready ??= (async () => {
    await sql`CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY, category TEXT NOT NULL, name TEXT NOT NULL, description TEXT NOT NULL,
      price INTEGER NOT NULL, unit TEXT NOT NULL, active BOOLEAN NOT NULL DEFAULT TRUE, pos INTEGER NOT NULL DEFAULT 0
    )`;
    await sql`CREATE SEQUENCE IF NOT EXISTS order_seq START 1001`;
    await sql`CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY, created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      customer JSONB NOT NULL, items JSONB NOT NULL, date TEXT NOT NULL, slot_id TEXT NOT NULL,
      notes TEXT NOT NULL DEFAULT '', payment TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'scheduled', total INTEGER NOT NULL
    )`;
    await sql`CREATE INDEX IF NOT EXISTS orders_date_slot ON orders (date, slot_id)`;
    const [{ n }] = (await sql`SELECT count(*)::int AS n FROM services`) as { n: number }[];
    if (n === 0) {
      const list = seedServices();
      for (let i = 0; i < list.length; i++) {
        const s = list[i];
        await sql`INSERT INTO services (id, category, name, description, price, unit, active, pos)
          VALUES (${s.id}, ${s.category}, ${s.name}, ${s.description}, ${s.price}, ${s.unit}, ${s.active}, ${i})
          ON CONFLICT (id) DO NOTHING`;
      }
    }
  })().catch((e) => {
    ready = null;
    throw e;
  });
  return ready;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const toService = (r: any): Service => ({
  id: r.id, category: r.category, name: r.name, description: r.description, price: r.price, unit: r.unit, active: r.active,
});
const toOrder = (r: any): Order => ({
  id: r.id,
  createdAt: new Date(r.created_at).toISOString(),
  customer: r.customer,
  items: r.items,
  date: r.date,
  slotId: r.slot_id,
  notes: r.notes,
  payment: r.payment,
  status: r.status,
  total: r.total,
});

export async function listServices(activeOnly = false): Promise<Service[]> {
  await ensureSchema();
  const rows = activeOnly
    ? await sql`SELECT * FROM services WHERE active ORDER BY pos`
    : await sql`SELECT * FROM services ORDER BY pos`;
  return rows.map(toService);
}

export async function updateService(id: string, patch: Partial<Pick<Service, "price" | "active" | "name" | "description">>) {
  await ensureSchema();
  const rows = await sql`UPDATE services SET
      price = COALESCE(${patch.price ?? null}::int, price),
      active = COALESCE(${patch.active ?? null}::boolean, active),
      name = COALESCE(${patch.name ?? null}::text, name),
      description = COALESCE(${patch.description ?? null}::text, description)
    WHERE id = ${id} RETURNING *`;
  return rows[0] ? toService(rows[0]) : null;
}

export async function listOrders(): Promise<Order[]> {
  await ensureSchema();
  const rows = await sql`SELECT * FROM orders ORDER BY date DESC, id DESC LIMIT 1000`;
  return rows.map(toOrder);
}

export async function findOrder(id: string, phone: string) {
  await ensureSchema();
  const rows = await sql`SELECT * FROM orders WHERE upper(id) = upper(${id.trim()}) AND customer->>'phone' = ${phone.trim()} LIMIT 1`;
  return rows[0] ? toOrder(rows[0]) : null;
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  await ensureSchema();
  const rows = await sql`UPDATE orders SET status = ${status} WHERE id = ${id} RETURNING *`;
  return rows[0] ? toOrder(rows[0]) : null;
}

export async function slotAvailability(date: string) {
  await ensureSchema();
  const rows = (await sql`SELECT slot_id, count(*)::int AS n FROM orders WHERE date = ${date} AND status <> 'cancelled' GROUP BY slot_id`) as { slot_id: string; n: number }[];
  const used = new Map(rows.map((r) => [r.slot_id, r.n]));
  const today = todayIST();
  const hour = hourIST();
  return SLOTS.map((s) => {
    const left = Math.max(0, SLOT_CAPACITY - (used.get(s.id) ?? 0));
    const past = date < today || (date === today && hour >= s.startHour);
    return { id: s.id, label: s.label, left, capacity: SLOT_CAPACITY, disabled: past || left === 0, past };
  });
}

export async function createOrder(input: NewOrderInput): Promise<{ order: Order } | { error: string }> {
  await ensureSchema();
  const today = todayIST();
  const slot = SLOTS.find((s) => s.id === input.slotId);
  if (!slot) return { error: "Invalid time slot." };
  if (input.date < today || input.date > addDays(today, 30)) return { error: "Please pick a valid date." };
  if (input.date === today && hourIST() >= slot.startHour) return { error: "That slot has already started. Pick a later one." };

  const ids = input.items.map((i) => i.serviceId);
  const found = (await sql`SELECT * FROM services WHERE active AND id = ANY(${ids})`).map(toService);
  const items = [];
  for (const it of input.items) {
    const svc = found.find((s) => s.id === it.serviceId);
    if (!svc) return { error: "A selected service is unavailable." };
    items.push({ serviceId: svc.id, name: svc.name, qty: it.qty, unitPrice: svc.price, unit: svc.unit });
  }
  const total = items.reduce((sum, i) => sum + i.qty * i.unitPrice, 0);

  // One statement: only inserts if the slot still has room, so two people cannot take the last place.
  const rows = await sql`INSERT INTO orders (id, customer, items, date, slot_id, notes, payment, status, total)
    SELECT 'TLH-' || nextval('order_seq'), ${JSON.stringify(input.customer)}::jsonb, ${JSON.stringify(items)}::jsonb,
           ${input.date}, ${input.slotId}, ${input.notes}, ${input.payment}, 'scheduled', ${total}
    WHERE (SELECT count(*) FROM orders WHERE date = ${input.date} AND slot_id = ${input.slotId} AND status <> 'cancelled') < ${SLOT_CAPACITY}
    RETURNING *`;
  if (!rows[0]) return { error: "That slot just filled up. Please choose another." };
  return { order: toOrder(rows[0]) };
}
