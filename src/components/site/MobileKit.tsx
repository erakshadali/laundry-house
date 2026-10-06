"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BadgeIndianRupee,
  Building2,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Download,
  Info,
  MapPin,
  MessageCircle,
  PackageSearch,
  Phone,
  Shirt,
  Star,
} from "lucide-react";
import { BUSINESS, FAQS, FEATURES, REVIEWS, STORES } from "@/lib/config";
import { cn, waLink } from "@/lib/utils";
import { Accordion } from "./Motion";

interface InstallEvent extends Event {
  prompt: () => Promise<void>;
}

/** Phone-only grid of big tap targets, like an app home screen. */
export function QuickActions() {
  const [installEvt, setInstallEvt] = useState<InstallEvent | null>(null);
  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstallEvt(e as InstallEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  const tiles = [
    { href: "/book", label: "Book pickup", icon: CalendarCheck, hot: true },
    { href: "/rates", label: "Rates", icon: BadgeIndianRupee },
    { href: "/track", label: "Track order", icon: PackageSearch },
    { href: "/stores", label: "Stores", icon: MapPin },
    { href: waLink("Hi! I'd like to book a laundry pickup."), label: "WhatsApp", icon: MessageCircle, external: true },
    { href: "/services", label: "Services", icon: Shirt },
    { href: "/about", label: "About us", icon: Info },
    { href: "/franchise", label: "Franchise", icon: Building2 },
  ];
  const cls = (hot?: boolean) =>
    cn(
      "flex flex-col items-center justify-center gap-1.5 rounded-2xl border px-1 py-3 text-center text-[11px] font-semibold leading-tight transition-transform active:scale-95",
      hot ? "border-gold bg-gold text-night" : "border-line bg-white text-night",
    );
  return (
    <section className="px-4 pb-1 pt-4 md:hidden" aria-label="Quick actions">
      <div className="grid grid-cols-4 gap-2">
        {tiles.map(({ href, label, icon: Icon, hot, external }) =>
          external ? (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" className={cls(hot)}>
              <Icon className="size-6 text-[#1FA855]" aria-hidden /> {label}
            </a>
          ) : (
            <Link key={label} href={href} className={cls(hot)}>
              <Icon className="size-6" aria-hidden /> {label}
            </Link>
          ),
        )}
      </div>
      {installEvt && (
        <button
          onClick={async () => {
            await installEvt.prompt();
            setInstallEvt(null);
          }}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-night py-3 text-sm font-bold text-white"
        >
          <Download className="size-4" aria-hidden /> Install the app on your phone
        </button>
      )}
    </section>
  );
}

const TABS = ["Why us", "Stores", "Reviews", "FAQ"] as const;

/** Phone-only: Why us, Stores, Reviews and FAQ in one tabbed card instead of four long sections. */
export function ExploreTabs() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Why us");
  const [rev, setRev] = useState(0);
  return (
    <section className="bg-surface px-4 py-5 md:hidden" aria-label="Explore">
      <div className="mb-3 flex gap-1.5 overflow-x-auto" role="tablist" aria-label="Explore">
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={cn("min-h-11 shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors", tab === t ? "bg-night text-white" : "bg-white text-night")}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="min-h-[300px] rounded-2xl bg-white p-3.5 shadow-sm">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            {tab === "Why us" && (
              <ul className="grid grid-cols-2 gap-2">
                {FEATURES.map((f) => (
                  <li key={f.title} className="rounded-xl bg-surface p-3">
                    <div className="text-[13px] font-bold leading-tight">{f.title}</div>
                    <div className="mt-1 text-[11px] leading-snug text-muted">{f.text.length > 70 ? f.text.slice(0, 68).trimEnd() + "…" : f.text}</div>
                  </li>
                ))}
              </ul>
            )}
            {tab === "Stores" && (
              <ul className="divide-y divide-line">
                {STORES.map((s) => (
                  <li key={s.id} className="flex items-center justify-between gap-3 py-2.5">
                    <div className="min-w-0">
                      <div className="text-sm font-bold">{s.name}</div>
                      <div className="truncate text-xs text-muted">{s.address}</div>
                    </div>
                    <a href={`tel:+91${s.phone}`} aria-label={`Call ${s.name}`} className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gold text-night">
                      <Phone className="size-4" aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            )}
            {tab === "Reviews" && (
              <div className="flex min-h-[270px] flex-col justify-between gap-3">
                <motion.figure key={rev} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }} className="flex flex-col gap-3 rounded-xl bg-ivory p-4">
                    <div className="flex gap-0.5 text-gold" aria-label="5 out of 5 stars">
                      {Array.from({ length: 5 }).map((_, k) => (
                        <Star key={k} className="size-4 fill-current" aria-hidden />
                      ))}
                    </div>
                    <blockquote className="text-sm leading-relaxed">{REVIEWS[rev].text}</blockquote>
                    <figcaption className="text-sm font-bold">{REVIEWS[rev].who}</figcaption>
                </motion.figure>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted">{rev + 1} of {REVIEWS.length}</span>
                  <div className="flex gap-2">
                    <button aria-label="Previous review" onClick={() => setRev((rev + REVIEWS.length - 1) % REVIEWS.length)} className="flex size-10 items-center justify-center rounded-full border-2 border-night">
                      <ChevronLeft className="size-5" />
                    </button>
                    <button aria-label="Next review" onClick={() => setRev((rev + 1) % REVIEWS.length)} className="flex size-10 items-center justify-center rounded-full bg-gold text-night">
                      <ChevronRight className="size-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
            {tab === "FAQ" && <Accordion items={[...FAQS]} />}
        </motion.div>
      </div>
    </section>
  );
}

/** Phone-only bar that stays at the bottom of the screen. */
export function MobileBar() {
  const item = "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-semibold";
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-6px_20px_rgba(15,42,92,0.10)] backdrop-blur md:hidden" aria-label="Quick contact">
      <a href={`tel:${BUSINESS.phoneRaw}`} className={cn(item, "text-night")}>
        <Phone className="size-5" aria-hidden /> Call
      </a>
      <a href={waLink("Hi! I have a question about The Laundry House.")} target="_blank" rel="noopener noreferrer" className={cn(item, "text-night")}>
        <MessageCircle className="size-5 text-[#1FA855]" aria-hidden /> WhatsApp
      </a>
      <Link href="/book" className={cn(item, "m-1.5 rounded-xl bg-gold text-night")}>
        <CalendarCheck className="size-5" aria-hidden /> Book now
      </Link>
    </nav>
  );
}
