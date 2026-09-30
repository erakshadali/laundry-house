import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/site/Navbar";
import { CtaBand, FloatingActions, Footer } from "@/components/site/Sections";
import { Reveal } from "@/components/site/Motion";
import { Photo } from "@/components/site/Photo";
import { ServiceIcon } from "@/components/site/icons";
import { CATEGORIES } from "@/lib/config";
import { listServices } from "@/lib/store";
import { formatINR } from "@/lib/utils";

export const metadata: Metadata = { title: "Services | The Laundry House" };
export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await listServices(true);
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-gradient-to-b from-ivory to-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-16 md:px-8 md:py-20">
            <span className="w-fit rounded-full bg-gold/30 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em]">Our services</span>
            <h1 className="max-w-3xl text-4xl font-extrabold md:text-6xl">Everything your wardrobe needs</h1>
            <p className="max-w-2xl text-lg text-muted">Six specialist services, each with its own process and fabric knowledge. Free pickup and delivery on every order.</p>
          </div>
        </section>

        <section className="bg-white pb-20">
          <div className="mx-auto flex max-w-7xl flex-col gap-10 px-5 md:px-8">
            {CATEGORIES.map((c, i) => {
              const items = services.filter((s) => s.category === c.id);
              return (
                <Reveal key={c.id}>
                  <article id={c.id} className="grid scroll-mt-32 overflow-hidden rounded-3xl border border-line bg-white shadow-sm lg:grid-cols-2">
                    <div className={`relative min-h-[300px] bg-surface ${i % 2 ? "lg:order-2" : ""}`}>
                      <Photo src={c.image} alt={c.caption} caption={c.caption} position={c.pos} sizes="(min-width: 1024px) 50vw, 100vw" />
                    </div>
                    <div className="flex flex-col gap-4 p-8 md:p-10">
                      <span className="flex size-12 items-center justify-center rounded-2xl bg-gold text-night">
                        <ServiceIcon name={c.id} className="size-6" />
                      </span>
                      <h2 className="text-3xl font-extrabold">{c.name}</h2>
                      <p className="text-muted">{c.blurb}</p>
                      <ul className="divide-y divide-line border-y border-line">
                        {items.map((s) => (
                          <li key={s.id} className="flex items-center justify-between gap-4 py-3">
                            <span className="font-medium">{s.name}</span>
                            <span className="font-bold">
                              {formatINR(s.price)} <span className="text-xs font-normal text-muted">/ {s.unit}</span>
                            </span>
                          </li>
                        ))}
                      </ul>
                      <Link href={`/book?service=${items[0]?.id ?? ""}`} className="mt-2 w-fit rounded-xl bg-night px-7 py-3.5 font-bold text-white transition-transform hover:scale-[1.03]">
                        Book {c.name}
                      </Link>
                    </div>
                  </article>
                </Reveal>
              );
            })}
            <p className="text-xs text-muted">Sample rates for the demo. Final rates are confirmed after inspection.</p>
          </div>
        </section>
        <CtaBand />
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
