import type { Metadata } from "next";
import { Navbar } from "@/components/site/Navbar";
import { FloatingActions } from "@/components/site/Sections";
import { TrackForm } from "@/components/book/TrackForm";

export const metadata: Metadata = { title: "Track your order | The Laundry House" };

export default function TrackPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-surface px-5 pb-28 pt-12 md:px-10 md:pb-12">
        <TrackForm />
      </main>
      <FloatingActions />
    </>
  );
}
