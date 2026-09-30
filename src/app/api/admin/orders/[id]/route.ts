import { NextResponse } from "next/server";
import { z } from "zod";
import { updateOrderStatus } from "@/lib/store";

const schema = z.object({ status: z.enum(["scheduled", "picked_up", "washing", "ready", "delivered", "cancelled"]) });

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  const order = await updateOrderStatus(id, parsed.data.status);
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  return NextResponse.json({ order });
}
