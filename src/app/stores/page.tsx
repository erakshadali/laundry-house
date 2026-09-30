import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { FloatingActions, Footer } from "@/components/site/Sections";
import { Reveal } from "@/components/site/Motion";
import { BUSINESS, CITIES } from "@/lib/config";

export const metadata: Metadata = { title: "Cities | The Laundry House" };

export default function StoresPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-gradient-to-b from-ivory to-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-16 md:px-8 md:py-20">
            <span className="w-fit rounded-full bg-gold/30 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em]">Cities</span>
            <h1 className="max-w-3xl text-4xl font-extrabold md:text-6xl">Serving you across India</h1>
            <p className="max-w-2xl text-lg text-muted">Pick your city to book a free pickup. Store addresses and timings are shown below.</p>
          </div>
        </section>
        <section className="bg-white pb-20">
          <div className="mx-auto grid max-w-7xl gap-6 px-5 md:grid-cols-2 md:px-8 lg:grid-cols-3">
            {CITIES.map((c, i) => (
              <Reveal key={c} delay={(i % 3) * 0.08}>
                <div className="flex h-full flex-col gap-3 rounded-3xl border border-line p-7 transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-xl">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-gold text-night">
                    <MapPin className="size-5" aria-hidden />
                  </span>
                  <h2 className="text-2xl font-extrabold">{c}</h2>
                  <p className="text-[15px] leading-relaxed text-muted">
                    [Store address], {c}
                    <br />
                    {BUSINESS.phone} · {BUSINESS.hours}
                  </p>
                  <Link href={`/book?city=${encodeURIComponent(c)}`} className="mt-auto w-fit rounded-xl bg-night px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.03]">
                    Book pickup here
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-7xl px-5 text-xs text-muted md:px-8">City list and store details are placeholders until the client supplies their real locations.</p>
        </section>
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
