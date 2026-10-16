import type { Metadata } from "next";
import Link from "next/link";
import { OmegaLockup } from "@/components/brand/Logo";
import { Motto } from "@/components/brand/Motto";

export const metadata: Metadata = { title: "Offline" };

export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6">
      <OmegaLockup size="md" theme="light" />
      <h1 className="mt-6 text-3xl font-semibold text-ucu-blue">
        You are offline
      </h1>
      <p className="mt-3 text-sm leading-6 text-muted">
        Cached learning pages and the events list may still open. Sign-in and
        new posts need a connection.
      </p>
      <Link href="/dashboard" className="btn mt-6 w-fit">
        Try again
      </Link>
      <Motto className="mt-10 text-sm text-forest" />
    </main>
  );
}
