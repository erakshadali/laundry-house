import Link from "next/link";
import { ArrowRight, BadgeCheck, MapPin, MessageCircle, Phone, Star } from "lucide-react";
import { BUSINESS, CATEGORIES, FAQS, FEATURES, REVIEWS, STEPS, STORES } from "@/lib/config";
import type { Service } from "@/lib/types";
import { waLink } from "@/lib/utils";
import { Accordion, Carousel, Counter, RateCard, Reveal } from "./Motion";
import { Photo } from "./Photo";
import { LogoMark, ServiceIcon } from "./icons";

const wrap = "mx-auto max-w-7xl px-5 md:px-8";
const section = "py-20 md:py-24";

function Head({ eyebrow, title, sub, center = false }: { eyebrow: string; title: string; sub?: string; center?: boolean }) {
  return (
    <Reveal className={`mb-12 flex max-w-2xl flex-col gap-3 ${center ? "mx-auto items-center text-center" : ""}`}>
      <span className="rounded-full bg-gold/25 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-night">{eyebrow}</span>
      <h2 className="text-3xl font-extrabold text-night md:text-5xl">{title}</h2>
      {sub && <p className="text-lg text-muted">{sub}</p>}
    </Reveal>
  );
}

export function StatsStrip() {
  const stats = [
    { n: 6, s: "", label: "Stores across Noida" },
    { n: 4, s: "", label: "Specialist services" },
    { n: 10, s: "", label: "Cities across India" },
    { n: 11, s: "h", label: "Open hours, every day" },
  ];
  return (
    <section className="bg-night text-white">
      <div className={`${wrap} grid grid-cols-2 gap-y-8 py-10 md:grid-cols-4`}>
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-4xl font-extrabold text-gold md:text-5xl">
              <Counter to={s.n} suffix={s.s} />
            </div>
            <div className="mt-1 text-sm text-white/75">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ServiceCarousel() {
  return (
    <section id="services" className={`${section} scroll-mt-28 bg-white`}>
      <div className={wrap}>
        <Head eyebrow="Our services" title="Everything your wardrobe needs" sub="Pick a service, choose a slot, and we take care of the rest." />
        <Carousel label="Services">
          {CATEGORIES.map((c) => (
            <Link key={c.id} href={`/book`} className="group relative aspect-[3/4] w-[280px] shrink-0 snap-start overflow-hidden rounded-3xl bg-surface shadow-md md:w-[320px]">
              <Photo src={c.image} alt={c.caption} caption={c.caption} sizes="320px" position={c.pos} className="transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-night via-night/40 to-transparent" aria-hidden />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-6 text-white">
                <span className="flex size-10 items-center justify-center rounded-xl bg-gold text-night">
                  <ServiceIcon name={c.id} className="size-5" />
                </span>
                <h3 className="text-xl font-bold">{c.name}</h3>
                <p className="text-sm leading-relaxed text-white/80">{c.blurb}</p>
                <span className="mt-1 flex items-center gap-2 text-sm font-bold text-gold">
                  Book now <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </span>
              </div>
            </Link>
          ))}
        </Carousel>
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section id="how" className={`${section} scroll-mt-28 bg-ivory`}>
      <div className={wrap}>
        <Head center eyebrow="How it works" title="Laundry day, sorted in four steps" />
        <div className="relative grid gap-10 md:grid-cols-4">
          <div className="absolute left-[12%] right-[12%] top-8 hidden border-t-2 border-dashed border-night/25 md:block" aria-hidden />
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1} className="relative flex flex-col items-center gap-4 text-center">
              <span className="relative flex size-16 items-center justify-center rounded-full bg-gold text-2xl font-extrabold text-night shadow-lg shadow-gold/40">{i + 1}</span>
              <h3 className="text-xl font-bold">{s.title}</h3>
              <p className="text-[15px] leading-relaxed text-muted">{s.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function RatesPreview({ services }: { services: Service[] }) {
  return (
    <section id="rates" className={`${section} scroll-mt-28 bg-white`}>
      <div className={wrap}>
        <Head eyebrow="Our rates" title="Simple, transparent pricing" sub="Starting prices per item, exclusive of GST. Pick a category to see the rates." />
        <RateCard services={services} />
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/rates" className="rounded-xl bg-night px-7 py-3.5 font-bold text-white transition-transform hover:scale-[1.03]">
            View full rate list
          </Link>
          <Link href="/book" className="rounded-xl bg-gold px-7 py-3.5 font-bold text-night transition-transform hover:scale-[1.03]">
            Book a pickup
          </Link>
        </div>
      </div>
    </section>
  );
}

export function WhatsAppBand() {
  const steps = ["Tap the button and say Hi", "Share your address and items", "Pick a pickup slot", "We confirm on WhatsApp"];
  return (
    <section className="bg-night py-16 text-white">
      <div className={`${wrap} grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]`}>
        <Reveal className="flex flex-col gap-5">
          <span className="w-fit rounded-full bg-[#25D366]/20 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#5EE08F]">Book on WhatsApp</span>
          <h2 className="text-3xl font-extrabold md:text-5xl">
            Book your pickup in <span className="text-gold">30 seconds</span>
          </h2>
          <p className="max-w-lg text-lg text-white/75">Prefer chatting? Message us on WhatsApp and we will schedule your pickup, share rates and confirm your slot.</p>
          <div className="flex flex-wrap gap-3">
            <a href={waLink("Hi! I'd like to book a laundry pickup.")} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl bg-[#25D366] px-7 py-4 font-bold text-white transition-transform hover:scale-[1.03]">
              <MessageCircle className="size-5" aria-hidden /> Chat on WhatsApp
            </a>
            <a href={`tel:${BUSINESS.phoneRaw}`} className="flex items-center gap-2 rounded-xl border-2 border-white/40 px-7 py-[14px] font-bold transition-colors hover:border-gold hover:text-gold">
              <Phone className="size-5" aria-hidden /> Call us
            </a>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <ol className="flex flex-col gap-3">
            {steps.map((s, i) => (
              <li key={s} className="flex items-center gap-4 rounded-2xl bg-white/10 px-5 py-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gold font-extrabold text-night">{i + 1}</span>
                <span className="font-medium">{s}</span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}

export function WhyUs() {
  return (
    <section className={`${section} bg-white`}>
      <div className={wrap}>
        <Head center eyebrow="Why choose us" title="Garment care you can trust" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 0.08}>
              <div className="flex h-full flex-col gap-3 rounded-3xl border border-line bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-xl">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-gold/25 text-night">
                  <BadgeCheck className="size-6" aria-hidden />
                </span>
                <h3 className="text-lg font-bold">{f.title}</h3>
                <p className="text-[15px] leading-relaxed text-muted">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Cities() {
  return (
    <section className={`${section} bg-surface`}>
      <div className={`${wrap} grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]`}>
        <Reveal className="flex flex-col gap-5">
          <span className="w-fit rounded-full bg-gold/25 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em]">Our stores</span>
          <h2 className="text-3xl font-extrabold md:text-5xl">Six stores across Noida</h2>
          <p className="text-lg text-muted">Pick your nearest store for pickup, or walk in. Open every day, 9:00 am to 8:00 pm.</p>
          <Link href="/stores" className="w-fit rounded-xl bg-night px-7 py-3.5 font-bold text-white transition-transform hover:scale-[1.03]">
            View store details
          </Link>
        </Reveal>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {STORES.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.04}>
              <Link href={`/book?city=${encodeURIComponent(s.name)}`} className="group flex items-start gap-3 rounded-2xl border border-line bg-white px-5 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:shadow-lg">
                <MapPin className="mt-1 size-4 shrink-0 text-gold-deep" aria-hidden />
                <span>
                  <span className="block font-semibold">{s.name}</span>
                  <span className="block text-sm text-muted">{s.address}</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Reviews() {
  const sample = REVIEWS.map((r) => ({ t: r.text, w: r.who }));
  return (
    <section className={`${section} bg-white`}>
      <div className={wrap}>
        <Head center eyebrow="Reviews" title="Loved by our customers" sub="Garment care for important people, by people who care." />
        <div className="grid gap-6 md:grid-cols-3">
          {sample.map((r, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <figure className="flex h-full flex-col gap-4 rounded-3xl bg-ivory p-8">
                <div className="flex gap-1 text-gold" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} className="size-5 fill-current" aria-hidden />
                  ))}
                </div>
                <blockquote className="flex-1 leading-relaxed">{r.t}</blockquote>
                <figcaption className="text-sm font-bold">{r.w}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section className={`${section} bg-surface`}>
      <div className={`${wrap} grid gap-12 lg:grid-cols-[0.8fr_1.2fr]`}>
        <Reveal className="flex flex-col gap-4">
          <span className="w-fit rounded-full bg-gold/25 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em]">FAQ</span>
          <h2 className="text-3xl font-extrabold md:text-5xl">Questions, answered</h2>
          <p className="text-lg text-muted">Cannot find what you need? Message us on WhatsApp.</p>
        </Reveal>
        <Reveal delay={0.1}>
          <Accordion items={[...FAQS]} />
        </Reveal>
      </div>
    </section>
  );
}

export function CtaBand() {
  return (
    <section className="bg-white py-16">
      <div className={wrap}>
        <Reveal className="flex flex-col items-start justify-between gap-8 rounded-[2rem] bg-gold p-10 md:flex-row md:items-center md:p-14">
          <div>
            <h2 className="text-3xl font-extrabold text-night md:text-5xl">Ready for fresh, clean clothes?</h2>
            <p className="mt-2 text-lg text-night/80">Book a pickup in under a minute.</p>
          </div>
          <Link href="/book" className="rounded-xl bg-night px-9 py-4 font-bold text-white transition-transform hover:scale-[1.04]">
            Schedule Your Pickup
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer id="contact" className="bg-night pt-16 text-white/75">
      <div className={`${wrap} grid gap-10 pb-12 md:grid-cols-[1.5fr_1fr_1fr_1.2fr]`}>
        <div>
          <div className="flex items-center gap-3 text-xl font-extrabold text-white">
            <LogoMark /> {BUSINESS.name}
          </div>
          <p className="mt-4 max-w-xs leading-relaxed">{BUSINESS.tagline}. Premium laundry and dry cleaning with doorstep pickup and delivery.</p>
          <div className="mt-5 flex gap-4 text-sm font-semibold">
            <a href={BUSINESS.instagram} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-gold">Instagram</a>
            <a href={BUSINESS.youtube} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-gold">YouTube</a>
          </div>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <div className="mb-1 font-bold text-white">Services</div>
          {CATEGORIES.map((c) => (
            <Link key={c.id} href="/services" className="transition-colors hover:text-gold">{c.name}</Link>
          ))}
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <div className="mb-1 font-bold text-white">Quick links</div>
          <Link href="/rates" className="transition-colors hover:text-gold">Rates</Link>
          <Link href="/stores" className="transition-colors hover:text-gold">Stores</Link>
          <Link href="/track" className="transition-colors hover:text-gold">Track order</Link>
          <Link href="/book" className="transition-colors hover:text-gold">Book a pickup</Link>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <div className="mb-1 font-bold text-white">Contact</div>
          <div>{BUSINESS.phone}</div>
          <div>{BUSINESS.email}</div>
          <div>{BUSINESS.address}</div>
          <div>{BUSINESS.hours}</div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs">
        © {new Date().getFullYear()} {BUSINESS.name} · Demo website
      </div>
    </footer>
  );
}

export function FloatingActions() {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
      <a href={`tel:${BUSINESS.phoneRaw}`} aria-label="Call us" className="flex size-12 items-center justify-center rounded-full bg-night text-white shadow-xl transition-transform hover:scale-110">
        <Phone className="size-5" aria-hidden />
      </a>
      <a
        href={waLink("Hi! I have a question about The Laundry House.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="wa-ring flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-transform hover:scale-110"
      >
        <MessageCircle className="size-7" aria-hidden />
      </a>
    </div>
  );
}
