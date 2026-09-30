import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/AdminBits";

export const metadata: Metadata = { title: "Admin sign in | The Laundry House", robots: { index: false } };

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-1 items-center justify-center bg-ink px-5">
      <LoginForm />
    </main>
  );
}
