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
  title: "The Laundry House | Premium Laundry & Dry Cleaning in Noida",
  description:
    "Premium garment care in Noida: dry cleaning, steam press, wedding couture, sneakers and bags, home and auto fabrics. Doorstep pickup and delivery. Book online or on WhatsApp.",
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
