import fs from "fs";
import path from "path";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import {
  Cities,
  CtaBand,
  Faq,
  FloatingActions,
  Footer,
  HowItWorks,
  RatesPreview,
  Reviews,
  ServiceCarousel,
  StatsStrip,
  WhatsAppBand,
  WhyUs,
} from "@/components/site/Sections";
import { listServices } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const services = await listServices(true);
  const hasVideo = fs.existsSync(path.join(process.cwd(), "public", "hero.mp4"));
  return (
    <>
      <Navbar />
      <main>
        <Hero videoSrc={hasVideo ? "/hero.mp4" : null} />
        <StatsStrip />
        <ServiceCarousel />
        <HowItWorks />
        <RatesPreview services={services} />
        <WhatsAppBand />
        <WhyUs />
        <Cities />
        <Reviews />
        <Faq />
        <CtaBand />
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
