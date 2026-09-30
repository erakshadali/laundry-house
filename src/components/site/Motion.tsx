"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useInView, useMotionValue, useScroll, useSpring } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import { CATEGORIES } from "@/lib/config";
import type { Service } from "@/lib/types";
import { cn, formatINR } from "@/lib/utils";
import Link from "next/link";

/** Thin yellow bar at the top that fills as you scroll. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.3 });
  return <motion.div aria-hidden style={{ scaleX }} className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gold" />;
}

export function Reveal({
  children,
  delay = 0,
  className,
  y = 28,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const value = useMotionValue(0);
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(value, to, { duration: 1.8, ease: "easeOut", onUpdate: (v) => setShown(Math.round(v)) });
    return () => controls.stop();
  }, [inView, to, value]);
  return (
    <span ref={ref}>
      {shown}
      {suffix}
    </span>
  );
}

/** Swipeable, snap-scrolling row with arrow buttons. */
export function Carousel({ children, label }: { children: React.ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * 340, behavior: "smooth" });
  return (
    <div className="relative">
      <div ref={ref} className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 md:-mx-8 md:px-8" role="region" aria-label={label} tabIndex={0}>
        {children}
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button aria-label="Previous" onClick={() => scroll(-1)} className="flex size-12 items-center justify-center rounded-full border-2 border-night text-night transition-colors hover:bg-night hover:text-white">
          <ChevronLeft className="size-5" />
        </button>
        <button aria-label="Next" onClick={() => scroll(1)} className="flex size-12 items-center justify-center rounded-full bg-gold text-night transition-transform hover:scale-105">
          <ChevronRight className="size-5" />
        </button>
      </div>
    </div>
  );
}

export function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.q}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-6 py-6 text-left text-lg font-semibold"
            >
              {it.q}
              <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-full transition-all duration-300", isOpen ? "rotate-45 bg-gold text-night" : "bg-surface text-night")}>
                <Plus className="size-5" />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                  <p className="max-w-3xl pb-6 leading-relaxed text-muted">{it.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

/** Rate list with category tabs; `full` adds search and shows every row. */
export function RateCard({ services, full = false }: { services: Service[]; full?: boolean }) {
  const cats = CATEGORIES.filter((c) => services.some((s) => s.category === c.id));
  const [tab, setTab] = useState<string>(cats[0]?.id ?? "");
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const rows = query
    ? services.filter((s) => (s.name + " " + s.description).toLowerCase().includes(query))
    : services.filter((s) => s.category === tab);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0" role="tablist" aria-label="Service categories">
          {cats.map((c) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={!query && tab === c.id}
              onClick={() => {
                setTab(c.id);
                setQ("");
              }}
              className={cn(
                "shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors",
                !query && tab === c.id ? "bg-night text-white" : "bg-surface text-night hover:bg-line",
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
        {full && (
          <label className="relative block md:w-72">
            <span className="sr-only">Search rates</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search an item"
              className="h-12 w-full rounded-full border border-line bg-white pl-11 pr-4 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/40"
            />
          </label>
        )}
      </div>
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
        <AnimatePresence mode="wait">
          <motion.ul key={query ? "search" : tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="divide-y divide-line">
            {rows.length === 0 && <li className="px-6 py-8 text-center text-muted">No items found.</li>}
            {rows.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-4 px-5 py-4 md:px-7">
                <div className="min-w-0">
                  <div className="font-semibold">{s.name}</div>
                  <div className="text-sm text-muted">{s.description}</div>
                </div>
                <div className="flex shrink-0 items-center gap-4">
                  <div className="text-right">
                    <span className="text-lg font-bold">{formatINR(s.price)}</span>
                    <span className="text-xs text-muted"> / {s.unit}</span>
                  </div>
                  <Link href={`/book?service=${s.id}`} className="hidden rounded-full bg-gold px-4 py-2 text-xs font-bold text-night transition-transform hover:scale-105 sm:block">
                    Book
                  </Link>
                </div>
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>
      <p className="text-xs text-muted">Starting prices, exclusive of GST. Designer and bridal apparel is charged based on quality and specific requirements.</p>
    </div>
  );
}
