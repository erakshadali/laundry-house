"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarCheck } from "lucide-react";
import { CATEGORIES, CITIES, SLOTS } from "@/lib/config";
import type { Service } from "@/lib/types";

const field =
  "h-12 w-full rounded-xl border border-line bg-white px-3 text-[15px] text-night outline-none focus:border-gold focus:ring-2 focus:ring-gold/40";
const label = "flex flex-col gap-1.5 text-xs font-bold uppercase tracking-wide text-muted";

/** Booking form right under the hero. Sends the choices to the full booking wizard. */
export function QuickBook({ services, today }: { services: Service[]; today: string }) {
  const router = useRouter();
  const [store, setStore] = useState<string>(CITIES[0]);
  const [cat, setCat] = useState<string>(CATEGORIES[0].id);
  const [date, setDate] = useState(today);
  const [slot, setSlot] = useState<string>(SLOTS[3].id);

  function go(e: React.FormEvent) {
    e.preventDefault();
    const service = services.find((s) => s.category === cat)?.id ?? "";
    const q = new URLSearchParams({ city: store, date, slot });
    if (service) q.set("service", service);
    router.push(`/book?${q.toString()}`);
  }

  return (
    <div className="relative z-10 mx-auto -mt-6 max-w-6xl px-4 md:-mt-10 md:px-8">
      <motion.form
        onSubmit={go}
        aria-label="Quick booking"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="grid grid-cols-2 gap-3 rounded-3xl bg-white p-4 shadow-[0_20px_50px_rgba(15,42,92,0.18)] md:p-6 lg:grid-cols-[1.3fr_1.1fr_1fr_1fr_auto] lg:items-end lg:gap-4"
      >
        <label className={`${label} col-span-2 lg:col-span-1`}>
          Nearest store
          <select className={field} value={store} onChange={(e) => setStore(e.target.value)}>
            {CITIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className={`${label} col-span-2 lg:col-span-1`}>
          Service
          <select className={field} value={cat} onChange={(e) => setCat(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className={label}>
          Pickup date
          <input className={field} type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} required />
        </label>
        <label className={label}>
          Time
          <select className={field} value={slot} onChange={(e) => setSlot(e.target.value)}>
            {SLOTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <button className="col-span-2 flex h-12 items-center justify-center gap-2 rounded-xl bg-gold px-7 font-bold text-night shadow-md transition-transform hover:scale-[1.03] lg:col-span-1">
          <CalendarCheck className="size-5" aria-hidden /> Book now
        </button>
      </motion.form>
    </div>
  );
}
