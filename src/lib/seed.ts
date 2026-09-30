import { CITIES, SLOTS } from "./config";
import type { DB, Order, OrderStatus, Service } from "./types";
import { addDays, todayIST } from "./utils";

/** Sample rate card - the client will provide the real one (editable in the admin). */
export function seedServices(): Service[] {
  return [
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
