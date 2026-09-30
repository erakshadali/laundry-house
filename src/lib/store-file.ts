import { promises as fs } from "fs";
import path from "path";
import { SLOTS, SLOT_CAPACITY } from "./config";
import { seed } from "./seed";
import type { DB, Order, OrderStatus, Service } from "./types";
import type { NewOrderInput } from "./store-types";
import { addDays, hourIST, todayIST } from "./utils";

/** Local development store: a JSON file. Production uses Postgres (see store-pg.ts). */
const FILE = process.env.VERCEL ? "/tmp/laundry-hub-db.json" : path.join(process.cwd(), "data", "db.json");

let queue: Promise<unknown> = Promise.resolve();

async function load(): Promise<DB> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8")) as DB;
  } catch {
    const db = seed();
    await save(db);
    return db;
  }
}

async function save(db: DB) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(db, null, 2));
}

function mutate<T>(fn: (db: DB) => T | Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    const db = await load();
    const result = await fn(db);
    await save(db);
    return result;
  });
  queue = run.catch(() => undefined);
  return run;
}

async function read(): Promise<DB> {
  await queue;
  return load();
}

export async function listServices(activeOnly = false) {
  const { services } = await read();
  return activeOnly ? services.filter((s) => s.active) : services;
}

export function updateService(id: string, patch: Partial<Pick<Service, "price" | "active" | "name" | "description">>) {
  return mutate((db) => {
    const s = db.services.find((x) => x.id === id);
    if (!s) return null;
    Object.assign(s, patch);
    return s;
  });
}

export async function listOrders() {
  const { orders } = await read();
  return [...orders].sort((a, b) => (a.date === b.date ? b.id.localeCompare(a.id) : b.date.localeCompare(a.date)));
}

export async function findOrder(id: string, phone: string) {
  const { orders } = await read();
  return orders.find((o) => o.id.toUpperCase() === id.trim().toUpperCase() && o.customer.phone === phone.trim()) ?? null;
}

export function updateOrderStatus(id: string, status: OrderStatus) {
  return mutate((db) => {
    const o = db.orders.find((x) => x.id === id);
    if (!o) return null;
    o.status = status;
    return o;
  });
}

export async function slotAvailability(date: string) {
  const { orders } = await read();
  const today = todayIST();
  const hour = hourIST();
  return SLOTS.map((s) => {
    const used = orders.filter((o) => o.date === date && o.slotId === s.id && o.status !== "cancelled").length;
    const left = Math.max(0, SLOT_CAPACITY - used);
    const past = date < today || (date === today && hour >= s.startHour);
    return { id: s.id, label: s.label, left, capacity: SLOT_CAPACITY, disabled: past || left === 0, past };
  });
}

export function createOrder(input: NewOrderInput) {
  return mutate<{ order: Order } | { error: string }>((db) => {
    const today = todayIST();
    const slot = SLOTS.find((s) => s.id === input.slotId);
    if (!slot) return { error: "Invalid time slot." };
    if (input.date < today || input.date > addDays(today, 30)) return { error: "Please pick a valid date." };
    if (input.date === today && hourIST() >= slot.startHour) return { error: "That slot has already started. Pick a later one." };
    const used = db.orders.filter((o) => o.date === input.date && o.slotId === input.slotId && o.status !== "cancelled").length;
    if (used >= SLOT_CAPACITY) return { error: "That slot just filled up. Please choose another." };

    const items = [];
    for (const it of input.items) {
      const svc = db.services.find((s) => s.id === it.serviceId && s.active);
      if (!svc) return { error: "A selected service is unavailable." };
      items.push({ serviceId: svc.id, name: svc.name, qty: it.qty, unitPrice: svc.price, unit: svc.unit });
    }
    const nums = db.orders.map((o) => Number(o.id.replace("TLH-", ""))).filter(Number.isFinite);
    const order: Order = {
      id: `TLH-${(nums.length ? Math.max(...nums) : 1000) + 1}`,
      createdAt: new Date().toISOString(),
      customer: input.customer,
      items,
      date: input.date,
      slotId: input.slotId,
      notes: input.notes,
      payment: input.payment,
      status: "scheduled",
      total: items.reduce((sum, i) => sum + i.qty * i.unitPrice, 0),
    };
    db.orders.push(order);
    return { order };
  });
}
