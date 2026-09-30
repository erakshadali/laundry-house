"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarCheck, MessageCircle, Truck } from "lucide-react";
import { waLink } from "@/lib/utils";

const item = (i: number) => ({
  initial: { opacity: 0, y: 26 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay: 0.1 + i * 0.12, ease: [0.22, 1, 0.36, 1] as const },
});

export function Hero({ videoSrc }: { videoSrc: string | null }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-ivory to-white">
      <div className="absolute -right-40 -top-40 size-[560px] rounded-full bg-gold/30 blur-3xl" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] items-center gap-12 px-5 py-12 md:px-8 md:py-24 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex min-w-0 flex-col gap-6">
          <motion.div {...item(0)} className="w-fit rounded-full bg-white px-4 py-2 text-sm font-semibold text-night shadow-sm">
            <span className="mr-2 inline-block size-2 rounded-full bg-gold align-middle" />
            India&apos;s fastest growing garment care service
          </motion.div>
          <motion.h1 {...item(1)} className="text-[2.15rem] font-extrabold leading-[1.1] text-night sm:text-5xl md:text-6xl">
            Premium Laundry &amp; Dry Cleaning,{" "}
            <span className="relative inline md:inline-block md:whitespace-nowrap">
              <span className="relative z-10">Picked Up &amp; Delivered</span>
              <motion.span
                aria-hidden
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
                className="absolute inset-x-0 bottom-1 z-0 hidden h-3 origin-left bg-gold md:bottom-2 md:block md:h-4"
              />
            </span>
          </motion.h1>
          <motion.p {...item(2)} className="max-w-xl text-lg leading-relaxed text-muted">
            Dry cleaning, steam press, wedding couture, sneakers and bags, and home fabrics. Doorstep pickup and delivery, handled by fabric specialists.
          </motion.p>
          <motion.div {...item(3)} className="flex flex-wrap gap-3">
            <Link href="/book" className="flex items-center gap-2 rounded-xl bg-night px-7 py-4 font-bold text-white shadow-lg shadow-night/20 transition-transform hover:scale-[1.03]">
              <CalendarCheck className="size-5" aria-hidden /> Schedule Your Pickup
            </Link>
            <Link href="/rates" className="rounded-xl bg-gold px-7 py-4 font-bold text-night shadow-lg shadow-gold/30 transition-transform hover:scale-[1.03]">
              See Our Rates
            </Link>
          </motion.div>
          <motion.a
            {...item(4)}
            href={waLink("Hi! I'd like to book a laundry pickup.")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-fit items-center gap-2 text-sm font-semibold text-night underline-offset-4 hover:underline"
          >
            <MessageCircle className="size-5 text-[#1FA855]" aria-hidden /> Or book instantly on WhatsApp
          </motion.a>
          <motion.ul {...item(5)} className="mt-2 flex flex-wrap gap-x-8 gap-y-2 text-sm font-medium text-night/80">
            <li>✓ Doorstep pickup &amp; delivery</li>
            <li>✓ Fabric-safe cleaning</li>
            <li>✓ 6 stores across Noida</li>
          </motion.ul>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.25 }} className="relative mx-auto w-full max-w-[520px]">
          <div className="absolute -inset-3 -rotate-3 rounded-[2.5rem] bg-gold" aria-hidden />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-surface shadow-2xl">
            {videoSrc ? (
              <video className="size-full object-cover" src={videoSrc} poster="/images/hero.jpg" autoPlay muted loop playsInline aria-hidden />
            ) : (
              <Image src="/images/hero.jpg" alt="Neatly folded, freshly cleaned clothes" fill priority sizes="(min-width: 1024px) 480px, 90vw" className="object-cover" style={{ objectPosition: "45% 50%" }} />
            )}
          </div>
          <div className="floaty absolute bottom-6 left-3 flex items-center gap-3 rounded-2xl bg-white p-3 shadow-xl sm:bottom-10 md:-left-10 md:p-4">
            <span className="flex size-11 items-center justify-center rounded-xl bg-gold text-night">
              <Truck className="size-5" aria-hidden />
            </span>
            <div>
              <div className="text-sm font-bold">Doorstep pickup</div>
              <div className="text-xs text-muted">At your chosen time slot</div>
            </div>
          </div>
          <div className="floaty-slow absolute right-3 top-4 rounded-2xl bg-night p-3 text-white shadow-xl sm:top-8 md:-right-8 md:p-4">
            <div className="text-xl font-extrabold leading-none text-gold md:text-2xl">9 AM – 8 PM</div>
            <div className="mt-1 text-xs text-white/80">Stores open daily</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
