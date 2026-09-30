import type { Metadata } from "next";
import { Eye, Mail, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { FloatingActions, Footer } from "@/components/site/Sections";
import { Accordion, Reveal } from "@/components/site/Motion";
import { BUSINESS } from "@/lib/config";
import { waLink } from "@/lib/utils";

export const metadata: Metadata = { title: "Franchise | The Laundry House" };

// All figures and answers below are the client's own, from thelaundryhouseindia.com/franchise.
const stats = [
  { v: "60k+", l: "Customers served" },
  { v: "14%", l: "Target ROI" },
  { v: "Zero", l: "Inventory risk" },
  { v: "Day 1", l: "Cash flow" },
];
const provides = ["SOP playbooks", "Specialised training", "Quality audits", "Launch marketing", "Tech stack"];
const youProvide = ["Prime location", "Staff management", "Service excellence", "Local leadership"];
const faqs = [
  { q: "What is the typical investment for a TLH franchise?", a: "It varies with location and store format, typically ₹1.75–2.5 Cr. This covers the Live Laundry Studio setup, state-of-the-art equipment, initial marketing and the franchise fee." },
  { q: "How soon can I expect an operational break-even?", a: "Most franchise partners achieve operational break-even within approximately 6 months, subject to location performance and execution discipline." },
  { q: "What is the Live Laundry Studio concept?", a: "A transparent store layout where customers can see their garments being processed. This open-kitchen approach builds trust, reduces disputes and increases walk-in and repeat business." },
  { q: "Do I need prior experience in the laundry industry?", a: "No. We look for partners with business acumen and a commitment to quality, and provide end-to-end training for your staff and management team, with ongoing operational audits." },
  { q: "Is there a risk of dead stock or inventory loss?", a: "No. This is a service business with zero inventory management, so there is no stock that can expire or go out of fashion." },
  { q: "Can I scale from one unit to an area development model?", a: "Yes. Once your first unit hits break-even, the system allows \"spoke\" units that feed into your existing high-capacity studio." },
];

export default function FranchisePage() {
  const msg = "Hi! I'm interested in a The Laundry House franchise. Please share the details.";
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-night text-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-12 md:px-8 md:py-20">
            <span className="w-fit rounded-full bg-gold/25 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-gold">Partner with TLH</span>
            <h1 className="max-w-3xl text-4xl font-extrabold md:text-6xl">India&apos;s leading premium garment care franchise</h1>
            <p className="max-w-2xl text-base text-white/80 md:text-lg">A high-margin, process-driven model with about 6 month operational break-even and no outside dependencies.</p>
            <div className="flex flex-wrap gap-3">
              <a href={waLink(msg)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 font-bold text-white">
                <MessageCircle className="size-5" aria-hidden /> Enquire on WhatsApp
              </a>
              <a href={`mailto:${BUSINESS.email}?subject=Franchise%20enquiry`} className="flex items-center gap-2 rounded-xl bg-gold px-6 py-3.5 font-bold text-night">
                <Mail className="size-5" aria-hidden /> Email us
              </a>
            </div>
          </div>
          <div className="border-t border-white/10">
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-6 px-5 py-8 md:grid-cols-4 md:px-8">
              {stats.map((s) => (
                <div key={s.l} className="text-center">
                  <div className="text-3xl font-extrabold text-gold md:text-5xl">{s.v}</div>
                  <div className="mt-1 text-sm text-white/75">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-10 md:py-20">
          <div className="mx-auto grid max-w-7xl items-center gap-6 px-5 md:gap-12 md:px-8 lg:grid-cols-2">
            <Reveal className="flex flex-col gap-3">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-gold text-night">
                <Eye className="size-6" aria-hidden />
              </span>
              <h2 className="text-2xl font-extrabold md:text-4xl">The Live Laundry Studio</h2>
              <p className="leading-relaxed text-muted">Transparency is our greatest marketing tool. Customers watch their garments being processed in real time, which reduces disputes and builds instant trust.</p>
            </Reveal>
            <Reveal delay={0.1} className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-night p-5 text-white">
                <div className="mb-2 font-bold text-gold">TLH provides</div>
                <ul className="space-y-1 text-sm text-white/85">{provides.map((p) => <li key={p}>✓ {p}</li>)}</ul>
              </div>
              <div className="rounded-2xl border border-line bg-surface p-5">
                <div className="mb-2 font-bold">You provide</div>
                <ul className="space-y-1 text-sm text-muted">{youProvide.map((p) => <li key={p}>✓ {p}</li>)}</ul>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="bg-surface py-10 md:py-20">
          <div className="mx-auto grid max-w-7xl gap-6 px-5 md:gap-12 md:px-8 lg:grid-cols-[0.8fr_1.2fr]">
            <h2 className="text-2xl font-extrabold md:text-4xl">Franchise questions</h2>
            <Accordion items={faqs} />
          </div>
        </section>
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
