import { promises as fs } from "fs";
import path from "path";
import { CITIES, SLOTS, SLOT_CAPACITY } from "./config";
import type { DB, Order, OrderStatus, Service } from "./types";
import { addDays, hourIST, todayIST } from "./utils";

/**
 * Demo data store: a JSON file behind a tiny API.
 * To go to production, keep these function signatures and swap the
 * internals for Postgres (Neon / Supabase) - nothing else changes.
 * On Vercel the filesystem is ephemeral, so /tmp is used for the demo.
 */
const FILE = process.env.VERCEL
  ? "/tmp/laundry-hub-db.json"
  : path.join(process.cwd(), "data", "db.json");

let queue: Promise<unknown> = Promise.resolve();

function seed(): DB {
  // Sample prices - the client will provide the real rate card.
  const services: Service[] = [
    { id: "couture-lehenga", category: "couture", name: "Lehenga / Gown", description: "Specialist clean with preservation box.", price: 1500, unit: "item", active: true },
    { id: "couture-saree", category: "couture", name: "Silk / Embroidered Saree", description: "Fabric-specific clean and press.", price: 600, unit: "item", active: true },
    { id: "couture-sherwani", category: "couture", name: "Sherwani / Suit Set", description: "Dry clean, steam and garment bag.", price: 1100, unit: "item", active: true },
    { id: "wash-fold", category: "wash", name: "Wash & Fold", description: "Everyday laundry, priced per kg.", price: 110, unit: "kg", active: true },
    { id: "wash-iron", category: "wash", name: "Wash & Iron", description: "Washed, dried and steam pressed, per kg.", price: 149, unit: "kg", active: true },
    { id: "wash-bedding", category: "wash", name: "Bedsheet / Blanket", description: "Deep wash and dry.", price: 199, unit: "item", active: true },
    { id: "dc-shirt", category: "dryclean", name: "Shirt / Kurta", description: "Dry clean, pressed and hung.", price: 120, unit: "item", active: true },
    { id: "dc-trouser", category: "dryclean", name: "Trousers / Jeans", description: "Dry clean and press.", price: 120, unit: "item", active: true },
    { id: "dc-suit", category: "dryclean", name: "Suit (2 piece)", description: "Dry clean, steam and finish.", price: 500, unit: "item", active: true },
    { id: "dc-saree", category: "dryclean", name: "Saree (plain)", description: "Dry clean and fold.", price: 350, unit: "item", active: true },
    { id: "iron-shirt", category: "iron", name: "Shirt / Trousers", description: "Steam press on a hanger.", price: 25, unit: "item", active: true },
    { id: "iron-saree", category: "iron", name: "Saree Press", description: "Steam press and fold.", price: 120, unit: "item", active: true },
    { id: "iron-suit", category: "iron", name: "Suit Press", description: "Steam press, 2 piece.", price: 150, unit: "item", active: true },
    { id: "shoe-sneaker", category: "sneakers", name: "Sneaker Deep Clean", description: "Deep clean and conditioning.", price: 599, unit: "item", active: true },
    { id: "shoe-bag", category: "sneakers", name: "Handbag Restoration", description: "Clean, condition and restore leather.", price: 1199, unit: "item", active: true },
    { id: "home-curtain", category: "home", name: "Curtains (per panel)", description: "Deep clean and steam finish.", price: 350, unit: "item", active: true },
    { id: "home-sofa", category: "home", name: "Sofa (per seat)", description: "Upholstery shampoo and dry.", price: 450, unit: "item", active: true },
    { id: "home-car", category: "home", name: "Car Interior Detailing", description: "Seats, mats and interior deep clean.", price: 2499, unit: "item", active: true },
  ];

  const names = ["Aarav Sharma", "Priya Singh", "Rohit Verma", "Neha Gupta", "Karan Mehta", "Sneha Iyer", "Vikram Rao", "Anjali Das", "Rahul Jain", "Pooja Nair", "Amit Kumar", "Divya Menon", "Sanjay Patel", "Ritu Bansal"];
  const statuses: OrderStatus[] = ["delivered", "delivered", "delivered", "ready", "washing", "picked_up", "scheduled"];
  const today = todayIST();
  const orders: Order[] = names.map((name, i) => {
    const dayOffset = i < 10 ? -(i % 7) : i % 2; // spread over the past week, a few upcoming
    const date = addDays(today, dayOffset);
    const svc = services[(i * 3) % services.length];
    const qty = svc.unit === "kg" ? 4 + (i % 5) : 1 + (i % 3);
    const status: OrderStatus = dayOffset < -1 ? "delivered" : dayOffset > 0 ? "scheduled" : statuses[i % statuses.length];
    return {
      id: `TLH-${1001 + i}`,
      createdAt: new Date().toISOString(),
      customer: { name, phone: `90000000${String(10 + i).padStart(2, "0")}`, address: `Flat ${100 + i}, Sample Society`, city: CITIES[i % CITIES.length] },
      items: [{ serviceId: svc.id, name: svc.name, qty, unitPrice: svc.price, unit: svc.unit }],
      date,
      slotId: SLOTS[i % SLOTS.length].id,
      notes: "",
      payment: i % 3 === 0 ? "online" : "cod",
      status,
      total: qty * svc.price,
    };
  });
  return { services, orders };
}

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

/* ---------- services ---------- */
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

/* ---------- orders ---------- */
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

export interface NewOrderInput {
  customer: Order["customer"];
  items: { serviceId: string; qty: number }[];
  date: string;
  slotId: string;
  notes: string;
  payment: Order["payment"];
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
