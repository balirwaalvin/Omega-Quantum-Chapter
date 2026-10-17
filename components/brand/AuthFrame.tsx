"use client";

import { useState, type ReactNode } from "react";
import { AlphaBackdrop } from "@/components/brand/AlphaBackdrop";
import { AlphaNavbar } from "@/components/brand/AlphaNavbar";
import { AlphaCardLogoBanner } from "@/components/brand/PartnerMark";
import { QuantumIntroLoader } from "@/components/brand/QuantumIntroLoader";

export function AuthFrame({
  title,
  children,
  showIntro = true,
}: {
  title?: string;
  children: ReactNode;
  showIntro?: boolean;
}) {
  const [introFinished, setIntroFinished] = useState(!showIntro);
  const [replayCount, setReplayCount] = useState(0);

  return (
    <div className="relative flex min-h-screen flex-col justify-between text-white">
      {/* Creative Introductory Quantum Loading Animation & Motion Effect */}
      {showIntro && !introFinished && (
        <QuantumIntroLoader
          key={replayCount}
          onComplete={() => setIntroFinished(true)}
        />
      )}

      <AlphaBackdrop />

      {/* Centered Sign In / Sign Up Card with smooth entry transition */}
      <main
        className={`relative z-10 mx-auto flex w-full max-w-[420px] flex-1 items-center justify-center px-4 py-8 sm:py-12 transition-all duration-700 ease-out ${
          introFinished
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-3 pointer-events-none"
        }`}
      >
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

      {/* Menu bar content at the bottom with replay intro button */}
      <div
        className={`relative z-10 w-full transition-opacity duration-700 ${
          introFinished ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="relative">
          <AlphaNavbar position="bottom" />
          
          {/* Subtle replay intro button in bottom-right corner of screen */}
          <button
            type="button"
            onClick={() => {
              setIntroFinished(false);
              setReplayCount((prev) => prev + 1);
            }}
            title="Replay Quantum Intro Animation"
            className="hidden sm:inline-flex absolute right-4 bottom-2 z-20 items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[10px] font-medium text-white/60 backdrop-blur-xs transition hover:border-[#7fb3ff]/50 hover:bg-black/70 hover:text-white"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#7fb3ff] animate-pulse" />
            <span>Replay Intro</span>
          </button>
        </div>
      </div>
    </div>
  );
}
