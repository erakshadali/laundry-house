import { NextResponse } from "next/server";
import { COOKIE, SESSION_SECONDS, checkPassword, signSession } from "@/lib/auth";

// Basic brute-force guard: 8 wrong attempts per IP per 10 minutes (per server instance).
const attempts = new Map<string, { n: number; reset: number }>();

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const rec = attempts.get(ip);
  if (rec && rec.reset > now && rec.n >= 8) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  const { password } = (await req.json().catch(() => ({}))) as { password?: string };
  if (!password || !checkPassword(password)) {
    attempts.set(ip, rec && rec.reset > now ? { n: rec.n + 1, reset: rec.reset } : { n: 1, reset: now + 10 * 60 * 1000 });
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }
  attempts.delete(ip);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, signSession(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(COOKIE);
  return res;
}
