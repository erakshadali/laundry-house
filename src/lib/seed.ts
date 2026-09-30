import { CITIES, SLOTS } from "./config";
import type { DB, Order, OrderStatus, Service } from "./types";
import { addDays, todayIST } from "./utils";

/**
 * Noida rate card from thelaundryhouseindia.com/stores (starting prices, exclusive of GST).
 * [item, starting price (dry clean), steam press price]. Editable in the admin.
 */
const GARMENT_RATES: [string, number, number][] = [
  ["Undershirt / Tie", 100, 50],
  ["Bikini / Swimming Costume / Shorts", 100, 50],
  ["Scarf / Stocking", 100, 50],
  ["Shirt / T-Shirt", 125, 65],
  ["Dupatta / Blouse", 125, 65],
  ["Pants / Jeans / Slacks / Salwar", 150, 75],
  ["Dhoti / Pyjama / Capri", 150, 75],
  ["Sweat Shirt / Sweat Pants", 200, 100],
  ["Brassiere / Dress / Half Jacket", 200, 100],
  ["Bath Robe", 200, 75],
  ["Kameez / Skirt / Kurta", 200, 100],
  ["Saree", 225, 100],
  ["Pullover / Cardigan", 275, 140],
  ["Sports Jacket / Jumper / Dangree / Shawl", 300, 150],
  ["Blazer / Jacket", 300, 150],
  ["Sports Jacket / Coat", 300, 150],
  ["Dress (Long)", 350, 175],
  ["Overcoat / Long Coat", 400, 200],
];
const COUTURE_RATES: [string, number, number][] = [["Wedding Dress (Bari)", 999, 399]];

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function seedServices(): Service[] {
  const make = (category: string, rows: [string, number, number][]): Service[] =>
    rows.flatMap(([name, dc, sp]) => [
      { id: `${category}-${slug(name)}-dc`, category, name: `${name} (Dry clean)`, description: "Starting price, exclusive of GST.", price: dc, unit: "item" as const, active: true },
      { id: `${category}-${slug(name)}-sp`, category, name: `${name} (Steam press)`, description: "Finishing only, exclusive of GST.", price: sp, unit: "item" as const, active: true },
    ]);
  return [...make("garment", GARMENT_RATES), ...make("couture", COUTURE_RATES)];
}
/** Made-up orders so the local demo dashboard is not empty. Never used in production. */
export function seed(): DB {
  const services = seedServices();
  const names = ["Aarav Sharma", "Priya Singh", "Rohit Verma", "Neha Gupta", "Karan Mehta", "Sneha Iyer", "Vikram Rao", "Anjali Das", "Rahul Jain", "Pooja Nair", "Amit Kumar", "Divya Menon", "Sanjay Patel", "Ritu Bansal"];
  const statuses: OrderStatus[] = ["delivered", "delivered", "delivered", "ready", "washing", "picked_up", "scheduled"];
  const today = todayIST();
  const orders: Order[] = names.map((name, i) => {
    const dayOffset = i < 10 ? -(i % 7) : i % 2;
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
