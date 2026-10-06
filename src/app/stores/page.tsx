import type { Metadata } from "next";
import Link from "next/link";
import { Clock, MapPin, Phone } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { FloatingActions, Footer } from "@/components/site/Sections";
import { Reveal } from "@/components/site/Motion";
import { STORES } from "@/lib/config";

export const metadata: Metadata = { title: "Stores in Noida | The Laundry House" };

export default function StoresPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-gradient-to-b from-ivory to-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-16 md:px-8 md:py-20">
            <span className="w-fit rounded-full bg-gold/30 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em]">Our stores</span>
            <h1 className="max-w-3xl text-4xl font-extrabold md:text-6xl">Find a Laundry House in Noida</h1>
            <p className="max-w-2xl text-lg text-muted">Six stores across Noida. Walk in, or book a pickup from your nearest store.</p>
          </div>
        </section>
        <section className="bg-white pb-20">
          <div className="mx-auto grid max-w-7xl gap-6 px-5 md:grid-cols-2 md:px-8 lg:grid-cols-3">
            {STORES.map((s, i) => (
              <Reveal key={s.id} delay={(i % 3) * 0.08}>
                <div className="flex h-full flex-col gap-3 rounded-3xl border border-line p-7 transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-xl">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-gold text-night">
                    <MapPin className="size-5" aria-hidden />
                  </span>
                  <h2 className="text-2xl font-extrabold">{s.name}</h2>
                  <p className="text-[15px] leading-relaxed text-muted">{s.address}</p>
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <Clock className="size-4 shrink-0" aria-hidden /> {s.hours}
                  </div>
                  <a href={`tel:+91${s.phone}`} className="flex min-h-11 w-fit items-center gap-2 text-sm font-semibold hover:text-gold-deep md:min-h-0">
                    <Phone className="size-4 shrink-0" aria-hidden /> {s.phone}
                  </a>
                  <div className="mt-auto flex flex-wrap gap-2 pt-2">
                    <Link href={`/book?city=${encodeURIComponent(s.name)}`} className="rounded-xl bg-night px-5 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.03]">
                      Book pickup
                    </Link>
                    {s.map && (
                      <a href={s.map} target="_blank" rel="noopener noreferrer" className="rounded-xl border-2 border-night px-5 py-[10px] text-sm font-bold transition-colors hover:bg-night hover:text-white">
                        Directions
                      </a>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
