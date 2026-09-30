import type { Metadata } from "next";
import { Sidebar } from "@/components/admin/AdminBits";

export const metadata: Metadata = { title: "Admin | The Laundry House", robots: { index: false } };

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-1 flex-col bg-surface md:flex-row">
      <Sidebar />
      <main className="min-w-0 flex-1 overflow-x-hidden p-4 pb-24 sm:p-5 sm:pb-24 md:p-9">{children}</main>
    </div>
  );
}
