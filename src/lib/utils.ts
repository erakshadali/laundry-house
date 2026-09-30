import { BUSINESS } from "./config";

export const formatINR = (n: number) => "₹" + n.toLocaleString("en-IN");

const IST = "Asia/Kolkata";

export function todayIST(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: IST }).format(new Date());
}

export function hourIST(): number {
  return Number(
    new Intl.DateTimeFormat("en-GB", { timeZone: IST, hour: "2-digit", hour12: false }).format(new Date()),
  );
}

export function addDays(date: string, n: number): string {
  const d = new Date(date + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function prettyDate(date: string): string {
  return new Date(date + "T00:00:00Z").toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

export function waLink(text: string, phone: string = BUSINESS.whatsapp) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

export function cn(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}
