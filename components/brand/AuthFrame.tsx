import type { ReactNode } from "react";
import { AlphaBackdrop } from "@/components/brand/AlphaBackdrop";
import { AlphaNavbar } from "@/components/brand/AlphaNavbar";
import { AlphaCardLogoBanner } from "@/components/brand/PartnerMark";

export function AuthFrame({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col justify-between text-white">
      <AlphaBackdrop />

      {/* Centered Sign In Card */}
      <main className="relative z-10 mx-auto flex w-full max-w-[420px] flex-1 items-center justify-center px-4 py-8 sm:py-12">
        <div className="alpha-card-frame w-full">
          <div className="overflow-hidden rounded-[8px] bg-black/85 backdrop-blur-md">
            <AlphaCardLogoBanner />

            <div className="px-6 pt-5 pb-5 sm:px-7 sm:pt-6 sm:pb-6">
              {title ? (
                <h1 className="mb-3 text-center text-xs font-bold uppercase tracking-[0.16em] text-slate-200">
                  {title}
                </h1>
              ) : null}
              {children}
            </div>
          </div>
        </div>
      </main>

      {/* Menu bar content at the bottom instead of the top */}
      <div className="relative z-10 w-full">
        <AlphaNavbar position="bottom" />
      </div>
    </div>
  );
}


