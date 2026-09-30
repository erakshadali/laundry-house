export type Unit = "kg" | "item" | "set";
export type OrderStatus =
  | "scheduled"
  | "picked_up"
  | "washing"
  | "ready"
  | "delivered"
  | "cancelled";

export interface Service {
  id: string;
  category: string; // CATEGORIES id
  name: string;
  description: string;
  price: number;
  unit: Unit;
  active: boolean;
}

export interface OrderItem {
  serviceId: string;
  name: string;
  qty: number;
  unitPrice: number;
  unit: Unit;
}

export interface Order {
  id: string;
  createdAt: string;
  customer: { name: string; phone: string; address: string; city: string };
  items: OrderItem[];
  date: string; // YYYY-MM-DD (IST)
  slotId: string;
  notes: string;
  payment: "cod" | "online";
  status: OrderStatus;
  total: number;
}

export interface DB {
  services: Service[];
  orders: Order[];
}
