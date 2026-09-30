import { createHash, createHmac, timingSafeEqual } from "crypto";

export const COOKIE = "lh_admin";
export const SESSION_SECONDS = 60 * 60 * 24 * 7;

function secret() {
  return process.env.AUTH_SECRET || "dev-only-secret-change-me";
}

export function signSession(): string {
  const exp = String(Math.floor(Date.now() / 1000) + SESSION_SECONDS);
  const sig = createHmac("sha256", secret()).update(exp).digest("base64url");
  return `${exp}.${sig}`;
}

export function verifySession(token?: string): boolean {
  if (!token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig) return false;
  const expected = createHmac("sha256", secret()).update(exp).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  return Number(exp) > Math.floor(Date.now() / 1000);
}

export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const h = (s: string) => createHash("sha256").update(s).digest();
  return timingSafeEqual(h(input), h(expected));
}
