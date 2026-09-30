"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { LayoutDashboard, LogOut, Package, Tags } from "lucide-react";
import { BUSINESS, SLOTS, STATUSES } from "@/lib/config";
import type { Order, OrderStatus, Service } from "@/lib/types";
import { cn, formatINR, prettyDate, waLink } from "@/lib/utils";
import { LogoMark } from "@/components/site/icons";

const nav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: Package },
  { href: "/admin/services", label: "Services and pricing", icon: Tags },
];

export function Sidebar() {
  const path = usePathname();
  const router = useRouter();
  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }
  return (
    <aside className="flex shrink-0 flex-col gap-1.5 bg-ink p-4 md:sticky md:top-0 md:h-screen md:w-[248px] md:p-5">
      <div className="flex items-center gap-3 px-2 pb-4 md:pb-6">
        <LogoMark className="size-10" />
        <div className="leading-tight text-white">
          <div className="font-extrabold">The Laundry House</div>
          <div className="text-xs font-semibold text-[#A39B88]">Admin</div>
        </div>
      </div>
      <nav className="flex gap-1.5 overflow-x-auto md:flex-col" aria-label="Admin">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? path === "/admin" : path.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-3 text-[15px] font-bold transition",
                active ? "bg-aqua text-ink" : "text-[#CFC7B6] hover:bg-white/10",
              )}
            >
              <Icon className="size-5" aria-hidden /> {label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto hidden flex-col gap-2 md:flex">
        <Link href="/" className="rounded-xl px-3.5 py-2 text-sm font-semibold text-[#CFC7B6] hover:bg-white/10">View website</Link>
        <button onClick={logout} className="flex items-center gap-3 rounded-xl bg-white/[0.07] px-3.5 py-3 text-left text-sm font-bold text-[#CFC7B6] hover:bg-white/15">
          <LogOut className="size-4" aria-hidden /> Sign out
        </button>
      </div>
    </aside>
  );
}

export function RevenueChart({ data }: { data: { day: string; revenue: number }[] }) {
  return (
    <div className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#55657A" }} />
          <Tooltip cursor={{ fill: "rgba(34,184,230,0.08)" }} formatter={(v) => [formatINR(Number(v)), "Revenue"]} />
          <Bar dataKey="revenue" fill="#C9A96A" radius={[8, 8, 0, 0]} animationDuration={900} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export const statusStyle: Record<OrderStatus, string> = {
  scheduled: "bg-[#EDE9FE] text-[#5B21B6]",
  picked_up: "bg-[#E0F2FE] text-[#075985]",
  washing: "bg-[#FEF3C7] text-[#92400E]",
  ready: "bg-[#DCFCE7] text-[#166534]",
  delivered: "bg-[#E2E8F0] text-[#334155]",
  cancelled: "bg-[#FEE2E2] text-[#991B1B]",
};

export function StatusPill({ status }: { status: OrderStatus }) {
  const label = STATUSES.find((s) => s.id === status)?.label ?? status;
  return <span className={cn("inline-block rounded-full px-3 py-1 text-xs font-extrabold", statusStyle[status])}>{label}</span>;
}

const waText: Record<OrderStatus, string> = {
  scheduled: "your pickup is confirmed",
  picked_up: "we have picked up your clothes",
  washing: "your clothes are being cleaned",
  ready: "your order is ready and will be delivered soon",
  delivered: "your order has been delivered. Thank you!",
  cancelled: "your order has been cancelled",
};

export function OrdersTable({ orders: initial, compact = false }: { orders: Order[]; compact?: boolean }) {
  const router = useRouter();
  const [orders, setOrders] = useState(initial);
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState("");

  async function setStatus(id: string, status: OrderStatus) {
    setBusy(id);
    setErr("");
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusy(null);
    if (!res.ok) return setErr("Could not update the order. Please try again.");
    setOrders((os) => os.map((o) => (o.id === id ? { ...o, status } : o)));
    router.refresh();
  }

  const shown = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="flex flex-col gap-4">
      {!compact && (
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by status">
          {[{ id: "all", label: "All" }, ...STATUSES].map((s) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={filter === s.id}
              onClick={() => setFilter(s.id as "all" | OrderStatus)}
              className={cn("rounded-full px-4 py-2 text-sm font-bold", filter === s.id ? "bg-ink text-white" : "bg-white text-muted hover:bg-line")}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
      {err && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{err}</p>}
      <div className="overflow-x-auto rounded-2xl bg-white shadow-[0_4px_18px_rgba(10,10,11,0.07)]">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs font-extrabold text-muted">
              <th className="px-5 py-3">ORDER</th>
              <th className="px-3 py-3">CUSTOMER</th>
              <th className="px-3 py-3">PICKUP</th>
              <th className="px-3 py-3">AMOUNT</th>
              <th className="px-3 py-3">STATUS</th>
              {!compact && <th className="px-3 py-3">ACTIONS</th>}
            </tr>
          </thead>
          <tbody>
            {shown.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-8 text-center text-muted">No orders here yet.</td></tr>
            )}
            {shown.map((o) => (
              <tr key={o.id} className="border-b border-[#EEF3F8] last:border-0">
                <td className="px-5 py-3.5 font-extrabold">{o.id}</td>
                <td className="px-3 py-3.5">
                  {o.customer.name}
                  <div className="text-xs text-muted">{o.customer.city} · {o.customer.phone}</div>
                </td>
                <td className="px-3 py-3.5">
                  {prettyDate(o.date)}
                  <div className="text-xs text-muted">{SLOTS.find((s) => s.id === o.slotId)?.label}</div>
                </td>
                <td className="px-3 py-3.5 font-bold">
                  {formatINR(o.total)}
                  <div className="text-xs font-semibold text-muted">{o.payment === "cod" ? "On delivery" : "Online"}</div>
                </td>
                <td className="px-3 py-3.5">
                  {compact ? (
                    <StatusPill status={o.status} />
                  ) : (
                    <select
                      aria-label={`Status for ${o.id}`}
                      value={o.status}
                      disabled={busy === o.id}
                      onChange={(e) => setStatus(o.id, e.target.value as OrderStatus)}
                      className={cn("rounded-full border-0 px-3 py-1.5 text-xs font-extrabold", statusStyle[o.status])}
                    >
                      {STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                    </select>
                  )}
                </td>
                {!compact && (
                  <td className="px-3 py-3.5">
                    <a
                      href={waLink(`Hi ${o.customer.name}, ${waText[o.status]}. Order ${o.id} - ${BUSINESS.name}.`, "91" + o.customer.phone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-[#25D366] px-3.5 py-2 text-xs font-extrabold text-white"
                    >
                      WhatsApp
                    </a>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ServicesEditor({ services: initial }: { services: Service[] }) {
  const router = useRouter();
  const [services, setServices] = useState(initial);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState("");

  async function patch(id: string, body: { price?: number; active?: boolean }) {
    setMsg("");
    const res = await fetch(`/api/admin/services/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) return setMsg("Could not save. Please try again.");
    const { service } = await res.json();
    setServices((ss) => ss.map((s) => (s.id === id ? service : s)));
    setDraft((d) => Object.fromEntries(Object.entries(d).filter(([k]) => k !== id)));
    setMsg(`Saved ${service.name}.`);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4">
      <p aria-live="polite" className="min-h-5 text-sm font-semibold text-aqua-dark">{msg}</p>
      <div className="grid gap-4 lg:grid-cols-2">
        {services.map((s) => {
          const value = draft[s.id] ?? String(s.price);
          const changed = Number(value) !== s.price;
          return (
            <div key={s.id} className={cn("flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-[0_4px_18px_rgba(10,10,11,0.07)]", !s.active && "opacity-60")}>
              <div className="flex items-center justify-between">
                <div className="font-extrabold">{s.name}</div>
                <label className="flex items-center gap-2 text-sm font-bold text-muted">
                  <input type="checkbox" checked={s.active} onChange={(e) => patch(s.id, { active: e.target.checked })} className="size-4 accent-[#C9A96A]" />
                  Visible
                </label>
              </div>
              <p className="text-sm text-muted">{s.description}</p>
              <div className="flex items-end gap-3">
                <label className="flex flex-col gap-1 text-xs font-bold text-muted">Price per {s.unit} (₹)
                  <input
                    type="number"
                    min={0}
                    value={value}
                    onChange={(e) => setDraft({ ...draft, [s.id]: e.target.value })}
                    className="h-11 w-36 rounded-xl border border-[#DDD3C2] px-3 text-base font-bold text-ink outline-none focus:border-aqua"
                  />
                </label>
                <button
                  disabled={!changed || value === ""}
                  onClick={() => patch(s.id, { price: Number(value) })}
                  className="h-11 rounded-full bg-aqua px-6 text-sm font-extrabold text-ink disabled:opacity-40"
                >
                  Save
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!res.ok) return setError("Wrong password. Try again.");
    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="flex w-full max-w-sm flex-col gap-4 rounded-3xl bg-white p-8 shadow-2xl">
      <div className="flex items-center gap-3">
        <LogoMark />
        <div className="font-extrabold leading-tight">The Laundry House<div className="text-xs font-semibold text-muted">Admin sign in</div></div>
      </div>
      <label className="flex flex-col gap-2 text-sm font-bold text-muted">Password
        <input
          type="password"
          autoFocus
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-12 rounded-xl border border-[#DDD3C2] px-4 text-base text-ink outline-none focus:border-aqua focus:ring-2 focus:ring-aqua/30"
          required
        />
      </label>
      {error && <p role="alert" className="text-sm font-semibold text-red-700">{error}</p>}
      <button disabled={loading} className="rounded-full bg-aqua py-3.5 font-extrabold text-ink disabled:opacity-60">
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
