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

export function Accordion({ items, mobileLimit }: { items: { q: string; a: string }[]; mobileLimit?: number }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.q} className={mobileLimit !== undefined && i >= mobileLimit ? "max-md:hidden" : ""}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 py-3.5 text-left text-[15px] font-semibold md:gap-6 md:py-6 md:text-lg"
            >
              {it.q}
              <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 md:size-9", isOpen ? "rotate-45 bg-gold text-night" : "bg-surface text-night")}>
                <Plus className="size-4 md:size-5" />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                  <p className="max-w-3xl pb-4 text-sm leading-relaxed text-muted md:pb-6 md:text-base">{it.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

interface RateRow {
  key: string;
  name: string;
  category: string;
  unit: string;
  dc?: Service;
  sp?: Service;
  single?: Service;
}

/** Puts an item's "(Dry clean)" and "(Steam press)" rates on one row. */
function toRows(list: Service[]): RateRow[] {
  const map = new Map<string, RateRow>();
  for (const s of list) {
    const m = s.name.match(/^(.*) \((Dry clean|Steam press)\)$/);
    if (!m) {
      map.set(s.id, { key: s.id, name: s.name, category: s.category, unit: s.unit, single: s });
      continue;
    }
    const base = `${s.category}|${m[1]}`;
    const row = map.get(base) ?? { key: base, name: m[1], category: s.category, unit: s.unit };
    if (m[2] === "Dry clean") row.dc = s;
    else row.sp = s;
    map.set(base, row);
  }
  return [...map.values()];
}

/** Rate list with category tabs; `full` adds search and shows every row. `mobileRows` limits rows on phones. */
export function RateCard({ services, full = false, mobileRows }: { services: Service[]; full?: boolean; mobileRows?: number }) {
  const cats = CATEGORIES.filter((c) => services.some((s) => s.category === c.id));
  const [tab, setTab] = useState<string>(cats[0]?.id ?? "");
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const all = toRows(services);
  const rows = query ? all.filter((r) => r.name.toLowerCase().includes(query)) : all.filter((r) => r.category === tab);
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
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
                "shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors md:px-5 md:py-2.5",
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
              className="h-11 w-full rounded-full border border-line bg-white pl-11 pr-4 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/40 md:h-12"
            />
          </label>
        )}
      </div>
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
        <div className="flex items-center justify-end gap-4 border-b border-line bg-surface px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-muted md:px-7">
          <span className="w-16 text-right md:w-24">Dry clean</span>
          <span className="w-16 text-right md:w-24">Steam press</span>
          <span className="hidden w-14 sm:block" />
        </div>
        <AnimatePresence mode="wait">
          <motion.ul key={query ? "search" : tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="divide-y divide-line">
            {rows.length === 0 && <li className="px-6 py-8 text-center text-muted">No items found.</li>}
            {rows.map((r, i) => {
              const bookId = (r.dc ?? r.sp ?? r.single)!.id;
              return (
                <li key={r.key} className={cn("flex items-center justify-between gap-3 px-4 py-3 md:px-7 md:py-4", mobileRows !== undefined && i >= mobileRows && "max-md:hidden")}>
                  <div className="min-w-0 flex-1 text-sm font-semibold leading-snug md:text-base">{r.name}</div>
                  <div className="flex shrink-0 items-center gap-4">
                    {r.single ? (
                      <span className="w-[8.5rem] text-right text-sm font-bold md:w-[12.5rem] md:text-lg">
                        {formatINR(r.single.price)} <span className="text-xs font-normal text-muted">/ {r.single.unit}</span>
                      </span>
                    ) : (
                      <>
                        <span className="w-16 text-right text-sm font-bold md:w-24 md:text-lg">{r.dc ? formatINR(r.dc.price) : "–"}</span>
                        <span className="w-16 text-right text-sm font-bold md:w-24 md:text-lg">{r.sp ? formatINR(r.sp.price) : "–"}</span>
                      </>
                    )}
                    <Link href={`/book?service=${bookId}`} className="hidden w-14 rounded-full bg-gold px-3 py-2 text-center text-xs font-bold text-night transition-transform hover:scale-105 sm:block">
                      Book
                    </Link>
                  </div>
                </li>
              );
            })}
          </motion.ul>
        </AnimatePresence>
      </div>
      <p className={cn("text-xs text-muted", mobileRows !== undefined && "max-md:hidden")}>Starting prices per item, exclusive of GST. Designer and bridal apparel is charged based on quality and specific requirements.</p>
    </div>
  );
}