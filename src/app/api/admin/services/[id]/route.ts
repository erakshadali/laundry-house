import { NextResponse } from "next/server";
import { z } from "zod";
import { updateService } from "@/lib/store";

const schema = z.object({ price: z.number().min(0).max(100000).optional(), active: z.boolean().optional() });

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  const svc = await updateService(id, parsed.data);
  if (!svc) return NextResponse.json({ error: "Service not found" }, { status: 404 });
  return NextResponse.json({ service: svc });
}
