import { OrdersTable, RevenueChart } from "@/components/admin/AdminBits";
import { SLOTS, SLOT_CAPACITY } from "@/lib/config";
import { listOrders } from "@/lib/store";
import { addDays, formatINR, todayIST } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function Overview() {
  const orders = await listOrders();
  const today = todayIST();
  const live = orders.filter((o) => o.status !== "cancelled");

  const todays = live.filter((o) => o.date === today);
  const inProcess = live.filter((o) => ["picked_up", "washing", "ready"].includes(o.status)).length;
  const ready = live.filter((o) => o.status === "ready").length;
  const revenueToday = todays.reduce((s, o) => s + o.total, 0);
  const upcoming = live.filter((o) => o.date > today).length;

  const chart = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(today, i - 6);
    return {
      day: new Date(d + "T00:00:00Z").toLocaleDateString("en-IN", { weekday: "short", timeZone: "UTC" }),
      revenue: live.filter((o) => o.date === d).reduce((s, o) => s + o.total, 0),
    };
  });

  const stats = [
    { label: "Pickups today", value: String(todays.length), note: `${upcoming} upcoming` },
    { label: "In process", value: String(inProcess), note: `${ready} ready for delivery` },
    { label: "Booked value today", value: formatINR(revenueToday), note: "Excludes cancelled" },
    { label: "Total orders", value: String(orders.length), note: "All time" },
  ];

  const slotUse = SLOTS.map((s) => ({
    label: s.label,
    used: todays.filter((o) => o.slotId === s.id).length,
  }));

  const recent = orders.slice(0, 6);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">Welcome back</h1>
        <p className="text-sm text-muted">Here is what is happening at The Laundry House today.</p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 md:gap-4 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col gap-0.5 rounded-2xl bg-white p-3.5 shadow-[0_4px_18px_rgba(10,10,11,0.07)] md:gap-1 md:p-5">
            <div className="text-xs font-semibold text-muted md:text-sm">{s.label}</div>
            <div className="text-2xl font-extrabold tracking-tight md:text-3xl">{s.value}</div>
            <div className="text-[11px] font-bold text-[#0F7A55] md:text-[13px]">{s.note}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex min-w-0 flex-col gap-3">
          <h2 className="text-lg font-extrabold">Latest orders</h2>
          <OrdersTable orders={recent} compact />
        </div>
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl bg-white p-5 shadow-[0_4px_18px_rgba(10,10,11,0.07)]">
            <h2 className="mb-2 text-lg font-extrabold">Revenue, last 7 days</h2>
            <RevenueChart data={chart} />
          </div>
          <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-[0_4px_18px_rgba(10,10,11,0.07)]">
            <h2 className="text-lg font-extrabold">Today&apos;s pickup slots</h2>
            {slotUse.map((s) => (
              <div key={s.label} className="flex flex-col gap-1.5">
                <div className="flex justify-between text-[13px] font-bold">
                  <span>{s.label}</span>
                  <span className="text-muted">{s.used} of {SLOT_CAPACITY}</span>
                </div>
                <div className="h-2.5 rounded-full bg-[#E9F0F6]" role="progressbar" aria-valuenow={s.used} aria-valuemax={SLOT_CAPACITY} aria-label={s.label}>
                  <div className={`h-2.5 rounded-full ${s.used >= SLOT_CAPACITY ? "bg-pop" : "bg-aqua"}`} style={{ width: `${Math.min(100, (s.used / SLOT_CAPACITY) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
