import { NextResponse } from "next/server";
import { findOrder } from "@/lib/store";

// POST so the phone number never appears in a URL.
export async function POST(req: Request) {
  const { id, phone } = (await req.json().catch(() => ({}))) as { id?: string; phone?: string };
  if (!id || !phone) return NextResponse.json({ error: "Enter order ID and phone" }, { status: 400 });
  const order = await findOrder(id, phone);
  if (!order) return NextResponse.json({ error: "No order found with those details" }, { status: 404 });
  const { customer, ...rest } = order;
  return NextResponse.json({ order: { ...rest, name: customer.name, city: customer.city } });
}
