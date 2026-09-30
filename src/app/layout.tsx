import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ScrollProgress } from "@/components/site/Motion";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Laundry House | Laundry & Dry Cleaning with Free Pickup & Delivery",
  description:
    "Premium laundry, dry cleaning, ironing, wedding wear and sneaker care with free doorstep pickup and delivery. Book online or on WhatsApp.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <ScrollProgress />
        {children}
      </body>
    </html>
  );
}
