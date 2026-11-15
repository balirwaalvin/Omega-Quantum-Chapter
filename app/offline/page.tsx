import type { Metadata } from "next";
import Link from "next/link";
import { AlphaBackdrop } from "@/components/brand/AlphaBackdrop";
import { AlphaNavbar } from "@/components/brand/AlphaNavbar";
import { OmegaLockup } from "@/components/brand/Logo";
import { Motto } from "@/components/brand/Motto";
import { AlphaCardLogoBanner } from "@/components/brand/PartnerMark";

export const metadata: Metadata = { title: "Offline" };

export default function OfflinePage() {
  return (
    <div className="relative flex min-h-screen flex-col justify-between text-white">
      <AlphaBackdrop />

      <main className="relative z-10 mx-auto flex w-full max-w-md flex-1 items-center justify-center px-4 py-8">
        <div className="alpha-card-frame w-full">
          <div className="overflow-hidden rounded-[8px] bg-black/85 backdrop-blur-md">
            <AlphaCardLogoBanner />
            <div className="flex flex-col items-center px-6 py-7 text-center">
              <OmegaLockup size="sm" theme="dark" showSubtitle={false} />
              <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#7fb3ff]">
                Network Status &middot; Offline Mode
              </p>
              <h1 className="mt-1 text-2xl font-bold text-white">
                You are offline
              </h1>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                Cached learning pages, Bloch Sphere, and the Circuit Lab still
                run locally in your browser. Sign-in and new posts require a
                connection.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-md bg-[#2767b9] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#1f569d]"
                >
                  Try Again
                </Link>
                <Link
                  href="/playground"
                  className="inline-flex items-center justify-center rounded-md bg-[#f7fbfc] px-4 py-2 text-xs font-semibold text-ucu-blue transition hover:bg-white"
                >
                  Offline Circuit Lab
                </Link>
              </div>
              <Motto className="mt-5 text-[11px] text-[#7fb3ff]" />
            </div>
          </div>
        </div>
      </main>

      <div className="relative z-10 w-full">
        <AlphaNavbar position="bottom" />
      </div>
    </div>
  );
}
