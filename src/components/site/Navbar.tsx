"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { MessageCircle, Menu, Phone, X } from "lucide-react";
import { BUSINESS } from "@/lib/config";
import { waLink } from "@/lib/utils";
import { LogoMark } from "./icons";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/rates", label: "Rates" },
  { href: "/stores", label: "Stores" },
  { href: "/about", label: "About" },
  { href: "/track", label: "Track order" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();
  // Close the menu whenever the page changes (links, back button, anything).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  // While the mobile menu is open: lock page scroll and let Escape close it.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-[70]">
      <div className="hidden bg-night text-xs text-white md:block">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-8">
          <span className="text-white/80">Doorstep pickup &amp; delivery in Noida · {BUSINESS.hours}</span>
          <span className="flex items-center gap-5">
            <a href={`tel:${BUSINESS.phoneRaw}`} className="flex items-center gap-1.5 hover:text-gold">
              <Phone className="size-3.5" aria-hidden /> {BUSINESS.phone}
            </a>
            <a href={waLink("Hi! I'd like to know more.")} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-gold">
              <MessageCircle className="size-3.5" aria-hidden /> WhatsApp
            </a>
          </span>
        </div>
      </div>
      <motion.div className={`bg-white transition-shadow duration-300 ${scrolled ? "shadow-[0_6px_24px_rgba(15,42,92,0.10)]" : "border-b border-line"}`}>
        <div className="relative z-10 mx-auto flex h-[72px] bg-white max-w-7xl items-center gap-8 px-5 md:px-8">
          <Link href="/" className="flex flex-1 items-center gap-3 md:flex-none">
            <LogoMark />
            <span className="text-lg font-extrabold leading-none text-night md:text-xl">
              The Laundry House
              <span className="mt-0.5 hidden text-[10px] font-semibold tracking-[0.25em] text-gold-deep sm:block">LAUNDRY · DRY CLEAN · IRON</span>
            </span>
          </Link>
          <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Main">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="rounded-full px-4 py-2 text-sm font-medium text-night transition-colors hover:bg-surface">
                {l.label}
              </Link>
            ))}
          </nav>
          <Link href="/book" className="hidden rounded-xl bg-gold px-6 py-3 text-sm font-bold text-night shadow-sm transition-transform hover:scale-[1.03] md:block">
            Book Now
          </Link>
          <button type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)} className="flex size-11 items-center justify-center rounded-xl bg-surface text-night lg:hidden">
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <>
          {/* Backdrop: swallows taps so nothing underneath (floating buttons, bottom bar, page links) is triggered, and a tap outside closes the menu. */}
          <div className="fixed inset-0 bg-night/40 lg:hidden" onClick={() => setOpen(false)} aria-hidden />
          <motion.nav initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="absolute inset-x-0 top-full flex max-h-[calc(100dvh-72px)] flex-col gap-1 overflow-y-auto border-t border-line bg-white px-5 pb-5 pt-3 shadow-xl lg:hidden" aria-label="Mobile">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 font-medium hover:bg-surface">
                {l.label}
              </Link>
            ))}
            <Link href="/book" onClick={() => setOpen(false)} className="mt-2 rounded-xl bg-gold py-3.5 text-center font-bold text-night">
              Book Now
            </Link>
          </motion.nav>
          </>
        )}
      </motion.div>
    </header>
  );
}
