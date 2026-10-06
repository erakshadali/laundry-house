import Link from "next/link";
import { ArrowRight, BadgeCheck, MapPin, MessageCircle, Phone, Star } from "lucide-react";
import { BUSINESS, CATEGORIES, FAQS, FEATURES, REVIEWS, STEPS, STORES } from "@/lib/config";
import type { Service } from "@/lib/types";
import { waLink } from "@/lib/utils";
import { Accordion, Carousel, Counter, RateCard, Reveal } from "./Motion";
import { MobileBar } from "./MobileKit";
import { Photo } from "./Photo";
import { LogoMark, ServiceIcon } from "./icons";

const wrap = "mx-auto max-w-7xl px-5 md:px-8";
const section = "py-6 md:py-24";

function Head({ eyebrow, title, sub, center = false }: { eyebrow: string; title: string; sub?: string; center?: boolean }) {
  return (
    <Reveal className={`mb-3 flex max-w-2xl flex-col gap-2 md:mb-12 md:gap-3 ${center ? "mx-auto items-center text-center" : ""}`}>
      <span className="hidden rounded-full bg-gold/25 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-night md:inline-block md:px-4 md:py-1.5 md:text-xs">{eyebrow}</span>
      <h2 className="text-2xl font-extrabold text-night md:text-5xl">{title}</h2>
      {sub && <p className="hidden text-lg text-muted md:block">{sub}</p>}
    </Reveal>
  );
}

export function StatsStrip() {
  const stats = [
    { n: 6, s: "", label: "Stores across Noida" },
    { n: 10, s: "", label: "Cities across India" },
    { n: 60, s: "k+", label: "Customers served" },
    { n: 9, s: "", label: "Specialist services" },
  ];
  return (
    <section className="bg-night text-white">
      <div className={`${wrap} grid grid-cols-4 gap-x-1 py-4 md:gap-y-8 md:py-10`}>
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-xl font-extrabold text-gold md:text-5xl">
              <Counter to={s.n} suffix={s.s} />
            </div>
            <div className="mt-0.5 text-[10px] leading-tight text-white/75 md:mt-1 md:text-sm">{s.label}</div>
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
            <Link key={c.id} href={`/book`} className="group relative h-[270px] w-[74%] shrink-0 snap-start overflow-hidden rounded-2xl bg-surface shadow-md sm:w-[300px] md:aspect-[3/4] md:h-auto md:w-[320px] md:rounded-3xl">
              <Photo src={c.image} alt={c.caption} caption={c.caption} sizes="320px" position={c.pos} className="transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-night via-night/40 to-transparent" aria-hidden />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-4 text-white md:gap-2 md:p-6">
                <span className="flex size-8 items-center justify-center rounded-lg bg-gold text-night md:size-10 md:rounded-xl">
                  <ServiceIcon name={c.id} className="size-4 md:size-5" />
                </span>
                <h3 className="text-lg font-bold md:text-xl">{c.name}</h3>
                <p className="line-clamp-2 text-xs leading-relaxed text-white/80 md:line-clamp-none md:text-sm">{c.blurb}</p>
                <span className="mt-0.5 flex items-center gap-2 text-sm font-bold text-gold md:mt-1">
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
        <div className="relative grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-10">
          <div className="absolute left-[12%] right-[12%] top-8 hidden border-t-2 border-dashed border-night/25 md:block" aria-hidden />
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1} className="relative flex items-center gap-2.5 rounded-2xl bg-white p-3 shadow-sm md:flex-col md:gap-4 md:bg-transparent md:p-0 md:text-center md:shadow-none">
              <span className="relative flex size-8 shrink-0 items-center justify-center rounded-full bg-gold text-base font-extrabold text-night shadow-md shadow-gold/40 md:size-16 md:text-2xl md:shadow-lg">{i + 1}</span>
              <h3 className="text-[13px] font-bold leading-tight md:text-xl">{s.title}</h3>
              <p className="hidden text-[15px] leading-relaxed text-muted md:block">{s.text}</p>
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
        <RateCard services={services} mobileRows={3} />
        <div className="mt-5 grid grid-cols-2 gap-3 md:mt-8 md:flex md:flex-wrap">
          <Link href="/rates" className="rounded-xl bg-night px-4 py-3 text-center text-sm font-bold text-white transition-transform hover:scale-[1.03] md:px-7 md:py-3.5 md:text-base">
            Full rate list
          </Link>
          <Link href="/book" className="rounded-xl bg-gold px-4 py-3 text-center text-sm font-bold text-night transition-transform hover:scale-[1.03] md:px-7 md:py-3.5 md:text-base">
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
    <section className="bg-night py-5 text-white md:py-16">
      <div className={`${wrap} grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]`}>
        <Reveal className="flex flex-col gap-3 md:gap-5">
          <span className="hidden w-fit rounded-full bg-[#25D366]/20 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#5EE08F] md:block">Book on WhatsApp</span>
          <h2 className="text-2xl font-extrabold md:text-5xl">
            Book your pickup in <span className="text-gold">30 seconds</span>
          </h2>
          <p className="hidden max-w-lg text-lg text-white/75 md:block">Prefer chatting? Message us on WhatsApp and we will schedule your pickup, share rates and confirm your slot.</p>
          <div className="grid grid-cols-2 gap-3 md:flex md:flex-wrap">
            <a href={waLink("Hi! I'd like to book a laundry pickup.")} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.03] md:px-7 md:py-4 md:text-base">
              <MessageCircle className="size-5" aria-hidden /> Chat on WhatsApp
            </a>
            <a href={`tel:${BUSINESS.phoneRaw}`} className="flex items-center justify-center gap-2 rounded-xl border-2 border-white/40 px-4 py-[10px] text-sm font-bold transition-colors hover:border-gold hover:text-gold md:px-7 md:py-[14px] md:text-base">
              <Phone className="size-5" aria-hidden /> Call us
            </a>
          </div>
        </Reveal>
        <Reveal delay={0.15} className="hidden lg:block">
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
        <div className="grid grid-cols-3 gap-2 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 0.08}>
              <div className="flex h-full flex-col items-center gap-1.5 rounded-xl border border-line bg-white p-2.5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-xl md:items-start md:gap-3 md:rounded-3xl md:p-7 md:text-left">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gold/25 text-night md:size-12 md:rounded-2xl">
                  <BadgeCheck className="size-5 md:size-6" aria-hidden />
                </span>
                <h3 className="text-[11px] font-semibold leading-tight md:text-lg md:font-bold">{f.title}</h3>
                <p className="hidden text-[15px] leading-relaxed text-muted md:block">{f.text}</p>
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
      <div className={`${wrap} grid items-center gap-5 md:gap-12 lg:grid-cols-[0.8fr_1.2fr]`}>
        <Reveal className="flex flex-col gap-2 md:gap-5">
          <span className="hidden w-fit rounded-full bg-gold/25 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] md:block">Our stores</span>
          <h2 className="text-2xl font-extrabold md:text-5xl">Six stores across Noida</h2>
          <p className="hidden text-lg text-muted md:block">Pick your nearest store for pickup, or walk in. Store hours: 9:00 am to 8:00 pm.</p>
          <Link href="/stores" className="hidden w-fit rounded-xl bg-night px-7 py-3.5 font-bold text-white transition-transform hover:scale-[1.03] md:block">
            View store details
          </Link>
        </Reveal>
        <div className="grid grid-cols-3 gap-2 md:grid-cols-2 md:gap-3">
          {STORES.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.04}>
              <Link href={`/book?city=${encodeURIComponent(s.name)}`} className="group flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-2 py-2.5 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:shadow-lg md:items-start md:justify-start md:gap-3 md:rounded-2xl md:px-5 md:py-4 md:text-left">
                <MapPin className="hidden size-4 shrink-0 text-gold-deep md:mt-1 md:block" aria-hidden />
                <span>
                  <span className="block text-[13px] font-semibold md:text-base">{s.name.replace("Noida ", "")}</span>
                  <span className="hidden text-sm text-muted md:block">{s.address}</span>
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
        <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0">
          {sample.map((r, i) => (
            <Reveal key={i} delay={i * 0.1} className="w-[82%] shrink-0 snap-center md:w-auto">
              <figure className="flex h-full flex-col gap-2 rounded-2xl bg-ivory p-4 md:gap-4 md:rounded-3xl md:p-8">
                <div className="hidden gap-1 text-gold md:flex" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} className="size-4 fill-current md:size-5" aria-hidden />
                  ))}
                </div>
                <blockquote className="line-clamp-3 flex-1 text-sm leading-relaxed md:line-clamp-none md:text-base">{r.t}</blockquote>
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
      <div className={`${wrap} grid gap-4 md:gap-12 lg:grid-cols-[0.8fr_1.2fr]`}>
        <Reveal className="flex flex-col gap-2 md:gap-4">
          <span className="hidden w-fit rounded-full bg-gold/25 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] md:block">FAQ</span>
          <h2 className="text-2xl font-extrabold md:text-5xl">Questions, answered</h2>
          <p className="hidden text-lg text-muted md:block">Cannot find what you need? Message us on WhatsApp.</p>
        </Reveal>
        <Reveal delay={0.1}>
          <Accordion items={[...FAQS]} mobileLimit={2} />
        </Reveal>
      </div>
    </section>
  );
}

export function CtaBand() {
  return (
    <section className="bg-white pb-6 pt-2 md:py-16">
      <div className={wrap}>
        <Reveal className="flex flex-col items-start justify-between gap-3 rounded-3xl bg-gold p-4 md:flex-row md:items-center md:gap-8 md:rounded-[2rem] md:p-14">
          <div>
            <h2 className="text-xl font-extrabold text-night md:text-5xl">Ready for fresh, clean clothes?</h2>
            <p className="mt-1 hidden text-sm text-night/80 md:mt-2 md:block md:text-lg">Book a pickup in under a minute.</p>
          </div>
          <Link href="/book" className="w-full rounded-xl bg-night px-9 py-3.5 text-center font-bold text-white transition-transform hover:scale-[1.04] md:w-auto md:py-4">
            Schedule Your Pickup
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

const footLink = "flex min-h-11 items-center transition-colors hover:text-gold md:min-h-0";

export function Footer() {
  return (
    <footer id="contact" className="bg-night pt-16 text-white/75">
      <div className={`${wrap} grid gap-10 pb-12 md:grid-cols-[1.5fr_1fr_1fr_1.2fr]`}>
        <div>
          <div className="flex items-center gap-3 text-xl font-extrabold text-white">
            <LogoMark /> {BUSINESS.name}
          </div>
          <p className="mt-4 max-w-xs leading-relaxed">{BUSINESS.tagline}. Premium laundry and dry cleaning with doorstep pickup and delivery.</p>
          <div className="mt-3 flex gap-2 text-sm font-semibold md:mt-5 md:gap-4">
            <a href={BUSINESS.instagram} target="_blank" rel="noopener noreferrer" className={footLink}>Instagram</a>
            <a href={BUSINESS.youtube} target="_blank" rel="noopener noreferrer" className={footLink}>YouTube</a>
          </div>
        </div>
        <div className="flex flex-col text-sm md:gap-2">
          <div className="mb-1 mt-1 font-bold text-white md:mt-0">Services</div>
          {CATEGORIES.map((c) => (
            <Link key={c.id} href="/services" className={footLink}>{c.name}</Link>
          ))}
        </div>
        <div className="flex flex-col text-sm md:gap-2">
          <div className="mb-1 mt-1 font-bold text-white md:mt-0">Quick links</div>
          <Link href="/rates" className={footLink}>Rates</Link>
          <Link href="/stores" className={footLink}>Stores</Link>
          <Link href="/about" className={footLink}>About us</Link>
          <Link href="/franchise" className={footLink}>Franchise</Link>
          <Link href="/track" className={footLink}>Track order</Link>
          <Link href="/book" className={footLink}>Book a pickup</Link>
        </div>
        <div className="flex flex-col text-sm md:gap-2">
          <div className="mb-1 mt-1 font-bold text-white md:mt-0">Contact</div>
          <div>{BUSINESS.phone}</div>
          <div>{BUSINESS.email}</div>
          <div>{BUSINESS.address}</div>
          <div>{BUSINESS.hours}</div>
        </div>
      </div>
      <div className="border-t border-white/10 py-3 pb-24 text-center text-xs md:py-5 md:pb-5">
        © {new Date().getFullYear()} {BUSINESS.name} ·{" "}
        <a href="https://thelaundryhouseindia.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center px-1 underline-offset-2 hover:text-gold hover:underline md:min-h-0 md:px-0">Privacy Policy</a> ·{" "}
        <a href="https://thelaundryhouseindia.com/terms_and_condition" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center px-1 underline-offset-2 hover:text-gold hover:underline md:min-h-0 md:px-0">Terms &amp; Conditions</a>
      </div>
    </footer>
  );
}

export function FloatingActions() {
  return (
    <>
    <MobileBar />
    <div className="fixed bottom-5 right-5 z-50 hidden flex-col gap-3 md:flex">
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
    </>
  );
}
