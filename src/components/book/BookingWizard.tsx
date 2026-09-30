"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Minus, Plus } from "lucide-react";
import { CATEGORIES, CITIES, BUSINESS, SLOTS } from "@/lib/config";
import type { Order, Service } from "@/lib/types";
import { cn, formatINR, prettyDate, waLink } from "@/lib/utils";
import { ServiceIcon } from "@/components/site/icons";

interface SlotInfo {
  id: string;
  label: string;
  left: number;
  disabled: boolean;
}

const STEPS = ["Services", "Date and slot", "Address", "Review and pay"];

/** Details from the customer's last booking, kept only in this browser. */
function loadSaved(): { name?: string; phone?: string; address?: string; city?: string } {
  try {
    return JSON.parse(localStorage.getItem("lh_customer") || "{}");
  } catch {
    return {};
  }
}
const input =
  "h-12 w-full rounded-xl border border-[#DDD3C2] bg-white px-4 text-[15px] outline-none focus:border-aqua focus:ring-2 focus:ring-aqua/30";

export function BookingWizard({
  services,
  dates,
  initial,
}: {
  services: Service[];
  dates: string[];
  initial: { service?: string; city?: string; date?: string; slot?: string; items?: string };
}) {
  const [step, setStep] = useState(0);
  const [qty, setQty] = useState<Record<string, number>>(() => {
    // ?items=id:qty,id:qty comes from the rate calculator; ?service=id is a single item.
    const fromItems: Record<string, number> = {};
    for (const part of (initial.items ?? "").split(",")) {
      const [id, n] = part.split(":");
      const count = Math.min(100, Math.max(1, parseInt(n, 10) || 0));
      if (id && count && services.some((s) => s.id === id)) fromItems[id] = count;
    }
    if (Object.keys(fromItems).length) return fromItems;
    return initial.service && services.some((s) => s.id === initial.service) ? { [initial.service]: 1 } : {};
  });
  const [date, setDate] = useState(initial.date && dates.includes(initial.date) ? initial.date : dates[0]);
  const [slotId, setSlotId] = useState<string>(initial.slot ?? "");
  const [slots, setSlots] = useState<SlotInfo[]>([]);
  const [slotsDate, setSlotsDate] = useState("");
  const loadingSlots = slotsDate !== date;
  const [saved] = useState(loadSaved);
  const [name, setName] = useState(saved.name ?? "");
  const [phone, setPhone] = useState(saved.phone ?? "");
  const [city, setCity] = useState<string>(
    CITIES.includes(initial.city as never) ? initial.city! : CITIES.includes(saved.city as never) ? saved.city! : CITIES[0],
  );
  const [address, setAddress] = useState(saved.address ?? "");
  const [notes, setNotes] = useState("");
  const [payment, setPayment] = useState<"cod" | "online">("cod");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<Order | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/slots?date=${date}`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        setSlots(d.slots ?? []);
        setSlotsDate(date);
        setSlotId((cur) => (d.slots?.some((s: SlotInfo) => s.id === cur && !s.disabled) ? cur : ""));
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [date]);

  const lines = useMemo(
    () => services.filter((s) => (qty[s.id] ?? 0) > 0).map((s) => ({ s, q: qty[s.id] })),
    [services, qty],
  );
  const total = lines.reduce((sum, l) => sum + l.q * l.s.price, 0);
  const selectedCount = lines.reduce((sum, l) => sum + l.q, 0);
  const slotLabel = SLOTS.find((s) => s.id === slotId)?.label;

  function next() {
    setError("");
    if (step === 0 && lines.length === 0) return setError("Add at least one service.");
    if (step === 1 && !slotId) return setError("Pick a time slot.");
    if (step === 2) {
      if (name.trim().length < 2) return setError("Enter your name.");
      if (!/^[6-9]\d{9}$/.test(phone)) return setError("Enter a valid 10 digit mobile number.");
      if (address.trim().length < 5) return setError("Enter your full address.");
    }
    setStep(step + 1);
  }

  async function submit() {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name, phone, address, city },
          items: lines.map((l) => ({ serviceId: l.s.id, qty: l.q })),
          date,
          slotId,
          notes,
          payment,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        if (res.status === 409) setStep(1);
        return;
      }
      try {
        localStorage.setItem("lh_customer", JSON.stringify({ name, phone, address, city }));
        localStorage.setItem("lh_last", JSON.stringify({ id: data.order.id, phone }));
      } catch {
        /* private mode: skip remembering */
      }
      setDone(data.order);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    const doneSlot = SLOTS.find((s) => s.id === done.slotId)?.label ?? "";
    const msg = [
      `Hi! I just booked a pickup on The Laundry House.`,
      ``,
      `Order: ${done.id}`,
      `Name: ${done.customer.name}`,
      `Phone: ${done.customer.phone}`,
      `Address: ${done.customer.address}, ${done.customer.city}`,
      `Pickup: ${prettyDate(done.date)}, ${doneSlot}`,
      `Items: ${done.items.map((i) => `${i.name} x ${i.qty}`).join(", ")}`,
      `Estimated total: ${formatINR(done.total)}`,
      `Payment: ${done.payment === "cod" ? "Pay on delivery" : "Online"}`,
      done.notes ? `Notes: ${done.notes}` : "",
    ].join("\n");
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-3xl bg-white p-10 text-center shadow-xl"
      >
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.15 }}
          className="flex size-20 items-center justify-center rounded-full bg-aqua text-ink"
        >
          <Check className="size-10" aria-hidden />
        </motion.span>
        <h1 className="text-3xl font-extrabold">Pickup booked!</h1>
        <p className="text-muted">
          Order <b className="text-ink">{done.id}</b> on {prettyDate(done.date)}, {slotLabel}. Keep your order ID and phone number to track it.
        </p>
        <p className="rounded-xl bg-mint px-4 py-3 text-sm font-semibold text-night">Last step: send your booking on WhatsApp so our team can confirm it instantly.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href={waLink(msg)} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#25D366] px-7 py-3.5 font-bold text-white">
            Send booking on WhatsApp
          </a>
          <Link href="/track" className="rounded-full border-2 border-ink px-7 py-3 font-bold text-ink">Track order</Link>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-6 pb-28 xl:grid-cols-[190px_minmax(0,1fr)_320px] xl:gap-8 xl:pb-0">
      <ol className="flex min-w-0 gap-4 overflow-x-auto pb-1 xl:flex-col xl:gap-6 xl:overflow-visible" aria-label="Steps">
        {STEPS.map((label, i) => (
          <li key={label} className="flex shrink-0 items-center gap-3" aria-current={i === step ? "step" : undefined}>
            <span
              className={cn(
                "flex size-9 items-center justify-center rounded-full border-2 text-sm font-extrabold",
                i < step && "border-aqua bg-aqua text-ink",
                i === step && "border-ink bg-ink text-white",
                i > step && "border-[#DDD3C2] bg-white text-muted",
              )}
            >
              {i < step ? <Check className="size-4" /> : i + 1}
            </span>
            <span className={cn("text-sm font-bold", i > step ? "text-muted" : "text-ink")}>{label}</span>
          </li>
        ))}
      </ol>

      <div className="flex min-h-[520px] min-w-0 flex-col gap-6 rounded-3xl bg-white p-4 shadow-[0_6px_24px_rgba(10,10,11,0.07)] sm:p-6 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.22 }}
            className="flex flex-1 flex-col gap-5"
          >
            {step === 0 && (
              <>
                <Heading title="Choose your services" sub="Set the quantity. Weight is confirmed at pickup." />
                <div className="flex flex-col gap-6">
                  {CATEGORIES.map((cat) => {
                    const items = services.filter((s) => s.category === cat.id);
                    if (!items.length) return null;
                    return (
                      <div key={cat.id} className="flex flex-col gap-3">
                        <div className="text-xs font-bold uppercase tracking-[0.22em] text-aqua-dark">{cat.name}</div>
                  {items.map((s) => {
                    const q = qty[s.id] ?? 0;
                    return (
                      <div key={s.id} className={cn("flex items-center gap-3 rounded-2xl border p-4", q > 0 ? "border-aqua bg-[#F4EBD6]" : "border-line")}>
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-mint text-aqua-dark">
                          <ServiceIcon name={s.category} className="size-6" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-[15px] font-bold leading-snug">{s.name}</div>
                          <div className="whitespace-nowrap text-sm text-muted">{formatINR(s.price)} / {s.unit}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button aria-label={`Decrease ${s.name}`} onClick={() => setQty({ ...qty, [s.id]: Math.max(0, q - 1) })} className="flex size-9 items-center justify-center rounded-full border border-[#DDD3C2] bg-white disabled:opacity-40" disabled={q === 0}>
                            <Minus className="size-4" />
                          </button>
                          <span className="w-6 text-center font-extrabold" aria-live="polite">{q}</span>
                          <button aria-label={`Increase ${s.name}`} onClick={() => setQty({ ...qty, [s.id]: Math.min(100, q + 1) })} className="flex size-9 items-center justify-center rounded-full bg-ink text-white">
                            <Plus className="size-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <Heading title="Choose pickup date and time" sub="Greyed slots are full or already started." />
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {dates.map((d) => {
                    const dt = new Date(d + "T00:00:00Z");
                    const sel = d === date;
                    return (
                      <button
                        key={d}
                        onClick={() => setDate(d)}
                        aria-pressed={sel}
                        className={cn("min-w-[72px] rounded-2xl border px-3 py-3 text-center transition", sel ? "border-ink bg-ink text-white" : "border-line bg-surface hover:border-aqua")}
                      >
                        <div className="text-xs font-semibold opacity-80">{dt.toLocaleDateString("en-IN", { weekday: "short", timeZone: "UTC" })}</div>
                        <div className="text-xl font-extrabold">{dt.getUTCDate()}</div>
                        <div className="text-xs font-semibold opacity-80">{dt.toLocaleDateString("en-IN", { month: "short", timeZone: "UTC" })}</div>
                      </button>
                    );
                  })}
                </div>
                <div className="font-extrabold">Available slots on {prettyDate(date)}</div>
                <div className={cn("grid gap-3 sm:grid-cols-2 xl:grid-cols-3", loadingSlots && "opacity-50")}>
                  {slots.map((s) => {
                    const sel = s.id === slotId;
                    return (
                      <button
                        key={s.id}
                        disabled={s.disabled}
                        onClick={() => setSlotId(s.id)}
                        aria-pressed={sel}
                        className={cn(
                          "flex items-center justify-between rounded-2xl border-[1.5px] px-5 py-4 text-left transition",
                          s.disabled && "cursor-not-allowed border-[#F1F4F8] bg-[#F1F4F8] text-[#8B98A9]",
                          !s.disabled && !sel && "border-[#DDD3C2] hover:border-aqua",
                          sel && "border-aqua bg-[#F4EBD6]",
                        )}
                      >
                        <span className="font-bold">{s.label}</span>
                        <span className="text-xs font-bold">{sel ? "Selected" : s.left === 0 ? "Full" : s.disabled ? "Closed" : `${s.left} left`}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <Heading title="Where should we pick up?" sub="We use this only to collect and deliver your order." />
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-2 text-sm font-bold text-muted">Full name
                    <input className={input} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-bold text-muted">Mobile number
                    <input className={input} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} inputMode="numeric" autoComplete="tel" placeholder="10 digit number" />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-bold text-muted">Nearest store                    <select className={input} value={city} onChange={(e) => setCity(e.target.value)}>
                      {CITIES.map((a) => <option key={a}>{a}</option>)}
                    </select>
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-bold text-muted sm:col-span-2">Full address
                    <input className={input} value={address} onChange={(e) => setAddress(e.target.value)} autoComplete="street-address" placeholder="Flat / house no, society, landmark" />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-bold text-muted sm:col-span-2">Notes (optional)
                    <textarea className={cn(input, "h-24 py-3")} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Gate code, call before arriving..." />
                  </label>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <Heading title="Review and pay" sub="Check everything, then confirm your pickup." />
                <div className="rounded-2xl bg-surface p-5 text-[15px] leading-7">
                  <div><b>Pickup:</b> {prettyDate(date)}, {slotLabel}</div>
                  <div><b>Name:</b> {name} ({phone})</div>
                  <div><b>Address:</b> {address}, {city}</div>
                  {notes && <div><b>Notes:</b> {notes}</div>}
                </div>
                <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Payment method">
                  <PayOption active={payment === "cod"} onClick={() => setPayment("cod")} title="Pay on delivery" text="Cash or UPI when we deliver." />
                  <PayOption active={false} disabled title="Pay online" text="UPI and cards. Coming soon." />
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {error && <p role="alert" className="hidden rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 xl:block">{error}</p>}

        <div className="hidden justify-between gap-3 xl:flex">
          {step > 0 ? (
            <button onClick={() => { setError(""); setStep(step - 1); }} className="rounded-full border-[1.5px] border-[#DDD3C2] px-7 py-3.5 font-bold">Back</button>
          ) : (
            <Link href="/" className="rounded-full border-[1.5px] border-[#DDD3C2] px-7 py-3.5 font-bold">Cancel</Link>
          )}
          {step < 3 ? (
            <button onClick={next} className="rounded-full bg-aqua px-8 py-3.5 font-extrabold text-ink transition hover:brightness-110">Continue</button>
          ) : (
            <button onClick={submit} disabled={submitting} className="rounded-full bg-aqua px-8 py-3.5 font-extrabold text-ink transition hover:brightness-110 disabled:opacity-60">
              {submitting ? "Booking..." : "Confirm booking"}
            </button>
          )}
        </div>
      </div>

      {/* Phone and tablet: the action bar stays on screen so Continue never needs scrolling. */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_24px_rgba(15,42,92,0.14)] xl:hidden">
        {error && <p role="alert" className="mb-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">{error}</p>}
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <div className="min-w-0 flex-1">
            {selectedCount > 0 ? (
              <>
                <div className="text-xs font-semibold text-muted">{selectedCount} item{selectedCount > 1 ? "s" : ""} selected</div>
                <div className="text-lg font-extrabold leading-tight">{formatINR(total)} <span className="text-xs font-medium text-muted">estimate</span></div>
              </>
            ) : (
              <div className="text-sm font-semibold text-muted">{step === 0 ? "Select items to continue" : "Nothing selected yet"}</div>
            )}
          </div>
          {step > 0 && (
            <button onClick={() => { setError(""); setStep(step - 1); }} className="rounded-full border-[1.5px] border-[#DDD3C2] px-5 py-3 text-sm font-bold">Back</button>
          )}
          {step < 3 ? (
            <button onClick={next} className={"rounded-full bg-aqua px-7 py-3 text-sm font-extrabold text-ink transition active:scale-95 " + (step === 0 && selectedCount === 0 ? "opacity-60" : "")}>Continue</button>
          ) : (
            <button onClick={submit} disabled={submitting} className="rounded-full bg-aqua px-7 py-3 text-sm font-extrabold text-ink transition active:scale-95 disabled:opacity-60">
              {submitting ? "Booking..." : "Confirm"}
            </button>
          )}
        </div>
      </div>

      <aside className="flex h-fit flex-col gap-4 rounded-3xl bg-ink p-7 text-white xl:sticky xl:top-24">
        <div className="text-lg font-extrabold">Your order</div>
        {lines.length === 0 && <p className="text-sm text-[#CFC7B6]">Nothing added yet.</p>}
        {lines.map((l) => (
          <div key={l.s.id} className="flex justify-between text-[15px]">
            <span>{l.s.name} x {l.q}</span>
            <span>{formatINR(l.q * l.s.price)}</span>
          </div>
        ))}
        <div className="flex justify-between text-[15px] text-[#E2C98F]"><span>Doorstep pickup and delivery</span><span>Confirmed on WhatsApp</span></div>
        <div className="h-px bg-white/20" />
        <div className="flex justify-between text-xl font-extrabold"><span>Estimated total</span><span>{formatINR(total)}</span></div>
        <p className="text-xs leading-relaxed text-[#CFC7B6]">Final amount is confirmed after weighing at pickup.</p>
        {slotLabel && (
          <div className="rounded-xl bg-white/10 p-4 text-sm">
            <div className="font-extrabold">Pickup slot</div>
            {prettyDate(date)}, {slotLabel}
          </div>
        )}
        <a href={waLink("Hi! I need help with a booking.", BUSINESS.whatsapp)} target="_blank" rel="noopener noreferrer" className="text-center text-sm font-bold text-aqua underline">Need help? WhatsApp us</a>
      </aside>
    </div>
  );
}

function Heading({ title, sub }: { title: string; sub: string }) {
  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight md:text-[28px]">{title}</h1>
      <p className="mt-1 text-[15px] text-muted">{sub}</p>
    </div>
  );
}

function PayOption({ active, onClick, title, text, disabled }: { active: boolean; onClick?: () => void; title: string; text: string; disabled?: boolean }) {
  return (
    <button
      role="radio"
      aria-checked={active}
      disabled={disabled}
      onClick={onClick}
      className={cn("rounded-2xl border-[1.5px] p-5 text-left", active ? "border-aqua bg-[#F4EBD6]" : "border-[#DDD3C2]", disabled && "cursor-not-allowed opacity-50")}
    >
      <div className="font-extrabold">{title}</div>
      <div className="text-sm text-muted">{text}</div>
    </button>
  );
}
