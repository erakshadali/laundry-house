import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/site/Navbar";
import { CtaBand, FloatingActions, Footer, HowItWorks, WhyUs } from "@/components/site/Sections";
import { Reveal } from "@/components/site/Motion";
import { ABOUT } from "@/lib/config";

export const metadata: Metadata = { title: "About us | The Laundry House" };

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-gradient-to-b from-ivory to-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-12 md:px-8 md:py-20">
            <span className="w-fit rounded-full bg-gold/30 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em]">Who we are</span>
            <h1 className="max-w-3xl text-4xl font-extrabold md:text-6xl">Caring for what you wear</h1>
            <p className="max-w-3xl text-base leading-relaxed text-muted md:text-lg">{ABOUT.lead}</p>
          </div>
        </section>

        <section className="bg-white pb-12 md:pb-20">
          <div className="mx-auto grid max-w-7xl gap-5 px-5 md:grid-cols-2 md:gap-8 md:px-8">
            {[
              { t: ABOUT.safeTitle, d: ABOUT.safe },
              { t: ABOUT.techTitle, d: ABOUT.tech },
            ].map((b, i) => (
              <Reveal key={b.t} delay={i * 0.1}>
                <div className="flex h-full flex-col gap-3 rounded-3xl border border-line bg-surface p-6 md:p-10">
                  <h2 className="text-2xl font-extrabold md:text-3xl">{b.t}</h2>
                  <p className="leading-relaxed text-muted">{b.d}</p>
                  <Link href="/book" className="mt-2 w-fit rounded-xl bg-gold px-6 py-3 text-sm font-bold text-night transition-transform hover:scale-[1.03]">
                    Book now
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <HowItWorks />
        <WhyUs />
        <CtaBand />
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
