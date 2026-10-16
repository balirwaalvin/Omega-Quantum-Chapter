import type { ReactNode } from "react";
import { AlphaBackdrop } from "@/components/brand/AlphaBackdrop";
import { AlphaNavbar } from "@/components/brand/AlphaNavbar";
import { Footer } from "@/components/brand/Footer";
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
      <div className="relative z-10">
        <AlphaNavbar />
      </div>

      <main className="relative z-10 mx-auto flex w-full max-w-[355px] flex-1 items-center justify-center px-3 py-4">
        <div className="alpha-card-frame w-full">
          <div className="overflow-hidden rounded-[8px] bg-black/85 backdrop-blur-md">
            <AlphaCardLogoBanner />

            <div className="px-5 pt-4 pb-4">
              {title ? (
                <h1 className="mb-2.5 text-center text-xs font-bold uppercase tracking-[0.16em] text-slate-200">
                  {title}
                </h1>
              ) : null}
              {children}
            </div>
          </div>
        </div>
      </main>

      <div className="relative z-10">
        <Footer light />
      </div>
    </div>
  );
}


