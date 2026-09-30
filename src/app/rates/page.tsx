import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { FloatingActions, Footer } from "@/components/site/Sections";
import { RateCard } from "@/components/site/Motion";
import { listServices } from "@/lib/store";
import { waLink } from "@/lib/utils";

export const metadata: Metadata = { title: "Rates | The Laundry House" };
export const dynamic = "force-dynamic";

export default async function RatesPage() {
  const services = await listServices(true);
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-gradient-to-b from-ivory to-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-16 md:px-8 md:py-20">
            <span className="w-fit rounded-full bg-gold/30 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em]">Rate list</span>
            <h1 className="max-w-3xl text-4xl font-extrabold md:text-6xl">Simple, transparent pricing</h1>
            <p className="max-w-2xl text-lg text-muted">Browse by category or search for an item. Pickup and delivery are always free.</p>
          </div>
        </section>
        <section className="bg-white pb-20">
          <div className="mx-auto max-w-5xl px-5 md:px-8">
            <RateCard services={services} full />
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/book" className="rounded-xl bg-gold px-8 py-4 font-bold text-night transition-transform hover:scale-[1.03]">
                Schedule a pickup
              </Link>
              <a
                href={waLink("Hi! Please share your latest rate list.")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl bg-[#25D366] px-8 py-4 font-bold text-white transition-transform hover:scale-[1.03]"
              >
                <MessageCircle className="size-5" aria-hidden /> Ask on WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
