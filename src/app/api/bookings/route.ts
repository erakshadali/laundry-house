import { NextResponse } from "next/server";
import { z } from "zod";
import { CITIES } from "@/lib/config";
import { createOrder } from "@/lib/store";

const schema = z.object({
  customer: z.object({
    name: z.string().trim().min(2).max(80),
    phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10 digit mobile number"),
    address: z.string().trim().min(5).max(200),
    city: z.enum(CITIES),
  }),
  items: z.array(z.object({ serviceId: z.string(), qty: z.number().int().min(1).max(100) })).min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  slotId: z.string(),
  notes: z.string().max(300).default(""),
  payment: z.enum(["cod", "online"]),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid booking" }, { status: 400 });
  }
  const result = await createOrder(parsed.data);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 409 });
  return NextResponse.json({ order: result.order }, { status: 201 });
}
