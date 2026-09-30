import type { Metadata } from "next";
import { Navbar } from "@/components/site/Navbar";
import { BookingWizard } from "@/components/book/BookingWizard";
import { listServices } from "@/lib/store";
import { addDays, todayIST } from "@/lib/utils";

export const metadata: Metadata = { title: "Book a pickup | The Laundry House" };
export const dynamic = "force-dynamic";

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const services = await listServices(true);
  const today = todayIST();
  const dates = Array.from({ length: 10 }, (_, i) => addDays(today, i));
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-surface px-5 py-10 md:px-10">
        <BookingWizard
          services={services}
          dates={dates}
          initial={{ service: sp.service, city: sp.city, date: sp.date, slot: sp.slot }}
        />
      </main>
    </>
  );
}
