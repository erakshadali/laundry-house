import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { QuickBook } from "@/components/site/QuickBook";
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
import { todayIST } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function Home() {
  const services = await listServices(true);
  // Optional hero video: put the file in /public and set HERO_VIDEO=/hero.mp4 in the environment.
  const heroVideo = process.env.HERO_VIDEO || null;
  return (
    <>
      <Navbar />
      <main>
        <Hero videoSrc={heroVideo} />
        <QuickBook services={services} today={todayIST()} />
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
