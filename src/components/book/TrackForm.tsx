"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { SLOTS } from "@/lib/config";
import type { Order } from "@/lib/types";
import { cn, formatINR, prettyDate } from "@/lib/utils";

type Found = Omit<Order, "customer"> & { name: string; city: string };

const FLOW = [
  { id: "scheduled", label: "Pickup scheduled", text: "We will arrive in your chosen slot." },
  { id: "picked_up", label: "Picked up", text: "Your clothes are on their way to us." },
  { id: "washing", label: "Being cleaned", text: "Washing and finishing in progress." },
  { id: "ready", label: "Ready for delivery", text: "Out for delivery soon." },
  { id: "delivered", label: "Delivered", text: "Enjoy your fresh clothes!" },
];

const input =
  "h-12 w-full rounded-xl border border-[#DDD3C2] bg-white px-4 text-[15px] outline-none focus:border-aqua focus:ring-2 focus:ring-aqua/30";

/** The order ID and phone from this browser's last booking, so tracking is one tap. */
function loadLast(): { id?: string; phone?: string } {
  try {
    return JSON.parse(localStorage.getItem("lh_last") || "{}");
  } catch {
    return {};
  }
}

export function TrackForm() {
  const [last] = useState(loadLast);
  const [id, setId] = useState(last.id ?? "");
  const [phone, setPhone] = useState(last.phone ?? "");
  const [order, setOrder] = useState<Found | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function look(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOrder(null);
    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, phone }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error ?? "Could not find that order.");
      else setOrder(data.order);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const current = order ? FLOW.findIndex((f) => f.id === order.status) : -1;

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Track your order</h1>
        <p className="mt-1 text-muted">Enter your order ID and the mobile number you booked with.</p>
      </div>
      <form onSubmit={look} className="grid gap-4 rounded-3xl bg-white p-6 shadow-[0_6px_24px_rgba(10,10,11,0.07)] sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-bold text-muted">Order ID
          <input className={input} value={id} onChange={(e) => setId(e.target.value)} placeholder="TLH-1001" required />
        </label>
        <label className="flex flex-col gap-2 text-sm font-bold text-muted">Mobile number
          <input className={input} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} inputMode="numeric" required />
        </label>
        <button disabled={loading} className="rounded-full bg-aqua py-3.5 font-extrabold text-ink disabled:opacity-60 sm:col-span-2">
          {loading ? "Searching..." : "Track order"}
        </button>
        {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 sm:col-span-2">{error}</p>}
      </form>

      {order && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-white p-6 shadow-[0_6px_24px_rgba(10,10,11,0.07)] md:p-8">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-2">
            <div>
              <div className="text-xl font-extrabold">{order.id}</div>
              <div className="text-sm text-muted">
                {prettyDate(order.date)}, {SLOTS.find((s) => s.id === order.slotId)?.label} · {order.city}
              </div>
            </div>
            <div className="text-xl font-extrabold">{formatINR(order.total)}</div>
          </div>
          {order.status === "cancelled" ? (
            <p className="rounded-xl bg-red-50 px-4 py-3 font-semibold text-red-700">This order was cancelled.</p>
          ) : (
            <ol className="flex flex-col">
              {FLOW.map((f, i) => {
                const done = i <= current;
                return (
                  <li key={f.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span className={cn("flex size-8 items-center justify-center rounded-full border-2", done ? "border-aqua bg-aqua text-ink" : "border-[#DDD3C2] bg-white")}>
                        {done && <Check className="size-4" aria-hidden />}
                      </span>
                      {i < FLOW.length - 1 && <span className={cn("w-0.5 flex-1", i < current ? "bg-aqua" : "bg-line")} />}
                    </div>
                    <div className="pb-6">
                      <div className={cn("font-extrabold", !done && "text-muted")}>{f.label}{i === current && " (now)"}</div>
                      <div className="text-sm text-muted">{f.text}</div>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </motion.div>
      )}
    </div>
  );
}
