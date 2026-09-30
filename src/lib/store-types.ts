import type { Order } from "./types";

export interface NewOrderInput {
  customer: Order["customer"];
  items: { serviceId: string; qty: number }[];
  date: string;
  slotId: string;
  notes: string;
  payment: Order["payment"];
}
