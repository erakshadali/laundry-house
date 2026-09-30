import Link from "next/link";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { PrintButton, StatusPill } from "@/components/admin/AdminBits";
import { BUSINESS, SLOTS } from "@/lib/config";
import { listOrders } from "@/lib/store";
import { addDays, formatINR, prettyDate, todayIST, waLink } from "@/lib/utils";

export const dynamic = "force-dynamic";

/** The rider's list: every pickup for a day, grouped by time slot. */
export default async function PickupsPage({ searchParams }: { searchParams: Promise<{ date?: string; store?: string }> }) {
  const sp = await searchParams;
  const today = todayIST();
  const date = sp.date && /^\d{4}-\d{2}-\d{2}$/.test(sp.date) ? sp.date : today;
  const orders = (await listOrders()).filter((o) => o.date === date && o.status !== "cancelled");
  const stores = [...new Set(orders.map((o) => o.customer.city))].sort();
  const store = sp.store && stores.includes(sp.store) ? sp.store : "";
  const shown = store ? orders.filter((o) => o.customer.city === store) : orders;
  const q = (extra: Record<string, string>) => "?" + new URLSearchParams({ date, ...(store ? { store } : {}), ...extra }).toString();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3 print:hidden">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Pickups</h1>
          <p className="text-sm text-muted">
            {prettyDate(date)} · {shown.length} order{shown.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href={q({ date: addDays(date, -1) })} className="rounded-full bg-white px-4 py-2 text-sm font-bold shadow-sm">← Previous</Link>
          <Link href={q({ date: today })} className="rounded-full bg-white px-4 py-2 text-sm font-bold shadow-sm">Today</Link>
          <Link href={q({ date: addDays(date, 1) })} className="rounded-full bg-white px-4 py-2 text-sm font-bold shadow-sm">Next →</Link>
          <PrintButton />
        </div>
      </div>

      {stores.length > 1 && (
        <div className="flex flex-wrap gap-2 print:hidden" role="tablist" aria-label="Filter by store">
          <Link href={"?" + new URLSearchParams({ date }).toString()} className={`rounded-full px-4 py-2 text-sm font-bold ${!store ? "bg-night text-white" : "bg-white text-muted"}`}>
            All stores
          </Link>
          {stores.map((s) => (
            <Link key={s} href={"?" + new URLSearchParams({ date, store: s }).toString()} className={`rounded-full px-4 py-2 text-sm font-bold ${store === s ? "bg-night text-white" : "bg-white text-muted"}`}>
              {s}
            </Link>
          ))}
        </div>
      )}

      {shown.length === 0 && <p className="rounded-2xl bg-white p-8 text-center text-muted">No pickups for this day.</p>}

      {SLOTS.map((slot) => {
        const list = shown.filter((o) => o.slotId === slot.id);
        if (!list.length) return null;
        return (
          <section key={slot.id} className="flex flex-col gap-3 break-inside-avoid">
            <h2 className="flex items-center gap-3 text-lg font-extrabold">
              {slot.label}
              <span className="rounded-full bg-gold px-3 py-0.5 text-xs font-bold text-night">{list.length}</span>
            </h2>
            <div className="grid gap-3 lg:grid-cols-2">
              {list.map((o) => (
                <article key={o.id} className="flex flex-col gap-2 rounded-2xl bg-white p-4 shadow-sm md:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-base font-extrabold">{o.customer.name}</div>
                      <div className="text-xs font-semibold text-muted">{o.id} · {o.customer.city}</div>
                    </div>
                    <StatusPill status={o.status} />
                  </div>
                  <div className="text-sm">{o.customer.address}</div>
                  <div className="text-sm text-muted">
                    {o.items.map((i) => `${i.name} x ${i.qty}`).join(", ")} · <b className="text-night">{formatINR(o.total)}</b> · {o.payment === "cod" ? "Pay on delivery" : "Paid online"}
                  </div>
                  {o.notes && <div className="rounded-lg bg-mint px-3 py-2 text-sm">Note: {o.notes}</div>}
                  <div className="mt-1 flex flex-wrap gap-2 print:hidden">
                    <a href={`tel:+91${o.customer.phone}`} className="flex items-center gap-1.5 rounded-full bg-night px-4 py-2 text-xs font-bold text-white">
                      <Phone className="size-3.5" aria-hidden /> {o.customer.phone}
                    </a>
                    <a
                      href={waLink(`Hi ${o.customer.name}, this is ${BUSINESS.name}. Our executive will reach you for order ${o.id} in your ${slot.label} slot.`, "91" + o.customer.phone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-full bg-[#25D366] px-4 py-2 text-xs font-bold text-white"
                    >
                      <MessageCircle className="size-3.5" aria-hidden /> WhatsApp
                    </a>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(o.customer.address + ", " + o.customer.city)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-full border-2 border-night px-4 py-[6px] text-xs font-bold"
                    >
                      <MapPin className="size-3.5" aria-hidden /> Map
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
