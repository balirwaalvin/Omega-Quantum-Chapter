"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";

interface QuantumIntroLoaderProps {
  onComplete?: () => void;
  autoStart?: boolean;
}

const PHASES = [
  { threshold: 0, tag: "SYSTEM_INIT", text: "Initializing Qubit Superlattice..." },
  { threshold: 25, tag: "SUPERPOSITION", text: "Calibrating Bloch State Vectors..." },
  { threshold: 55, tag: "ENTANGLEMENT", text: "Entangling Quantum Gate Circuits..." },
  { threshold: 85, tag: "COHERENCE_100%", text: "Omega Quantum Chapter Portal Ready" },
];

export function QuantumIntroLoader({ onComplete }: QuantumIntroLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const completeAndExit = useCallback(() => {
    setIsExiting(true);
    const timeout = setTimeout(() => {
      setIsDismissed(true);
      onComplete?.();
    }, 600);
    return () => clearTimeout(timeout);
  }, [onComplete]);

  // Handle skip key (Escape or Space)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        completeAndExit();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [completeAndExit]);

  // Smooth animation progression
  useEffect(() => {
    if (isDismissed) return;

    const startTime = performance.now();
    const duration = 2400; // 2.4s intro runtime

    let animationFrameId: number;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const linearRatio = Math.min(elapsed / duration, 1);

      // Smooth ease-out curve
      const easedRatio =
        linearRatio < 0.5
          ? 2 * linearRatio * linearRatio
          : 1 - Math.pow(-2 * linearRatio + 2, 2) / 2;

      const currentProgress = Math.min(Math.round(easedRatio * 100), 100);
      setProgress(currentProgress);

      if (linearRatio < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        // Hold for 300ms at 100% then smoothly transition
        setTimeout(() => {
          completeAndExit();
        }, 320);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isDismissed, completeAndExit]);

  if (isDismissed) return null;

  // Find active phase message
  const currentPhase =
    [...PHASES].reverse().find((p) => progress >= p.threshold) || PHASES[0];

  return (
    <div
      role="dialog"
      aria-label="Quantum Computing Chapter startup sequence"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#011422] transition-all duration-600 ease-out select-none ${
        isExiting ? "opacity-0 scale-105 pointer-events-none filter blur-sm" : "opacity-100 scale-100"
      }`}
    >
      {/* Background ambient quantum gradient & particle vacuum */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Central glowing quantum core aura */}
        <div
          className="animate-quantum-glow absolute top-1/2 left-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60"
          style={{
            background:
              "radial-gradient(circle, rgba(39, 103, 185, 0.45) 0%, rgba(181, 0, 79, 0.28) 45%, rgba(1, 20, 34, 0) 70%)",
          }}
        />

        {/* Ambient subtle perspective grid */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "44px 44px",
            maskImage: "radial-gradient(circle at center, black 40%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(circle at center, black 40%, transparent 80%)",
          }}
        />

        {/* Floating quantum energy particles */}
        <div className="absolute top-1/4 left-1/5 h-2 w-2 rounded-full bg-[#7fb3ff] shadow-[0_0_12px_#7fb3ff] animate-ping opacity-75" />
        <div className="absolute bottom-1/3 right-1/4 h-2 w-2 rounded-full bg-[#f1c40f] shadow-[0_0_12px_#f1c40f] animate-ping opacity-75 delay-300" />
        <div className="absolute top-1/3 right-1/5 h-1.5 w-1.5 rounded-full bg-[#b5004f] shadow-[0_0_10px_#b5004f] animate-ping opacity-75 delay-500" />
      </div>

      {/* Skip button top right */}
      <div className="absolute top-5 right-5 z-20">
        <button
          type="button"
          onClick={completeAndExit}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold tracking-wider text-white/90 backdrop-blur-md transition-all hover:bg-white/20 hover:text-white"
        >
          <span>Skip</span>
          <svg className="h-3 w-3 fill-current" viewBox="0 0 20 20">
            <path d="M4.5 3.5a1 1 0 0 0-1 1v11a1 1 0 0 0 1.555.832l8-5.5a1 1 0 0 0 0-1.664l-8-5.5A1 1 0 0 0 4.5 3.5zm11 1a1 1 0 0 1 1 1v9a1 1 0 1 1-2 0v-9a1 1 0 0 1 1-1z" />
          </svg>
        </button>
      </div>

      {/* Main Quantum Motion Stage */}
      <div className="relative z-10 flex flex-col items-center px-4 text-center">
        {/* Orbital Rings & Central Logo Pod */}
        <div className="relative mb-6 flex h-52 w-52 items-center justify-center sm:h-60 sm:w-60">
          {/* Orbiting Quantum Rings Container */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            {/* Orbital Ring 1: Blue / Cyan */}
            <div className="animate-quantum-orbit-1 absolute h-52 w-52 rounded-full border border-[#2767b9]/60 shadow-[0_0_18px_rgba(39,103,185,0.4)] sm:h-60 sm:w-60">
              <div className="absolute -top-1.5 left-1/2 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-[#7fb3ff] shadow-[0_0_12px_#7fb3ff]" />
            </div>

            {/* Orbital Ring 2: Magenta */}
            <div className="animate-quantum-orbit-2 absolute h-52 w-52 rounded-full border border-[#b5004f]/60 shadow-[0_0_18px_rgba(181,0,79,0.4)] sm:h-60 sm:w-60">
              <div className="absolute top-1/2 -right-1.5 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-[#ff4d94] shadow-[0_0_12px_#ff4d94]" />
            </div>

            {/* Orbital Ring 3: Gold / Yellow */}
            <div className="animate-quantum-orbit-3 absolute h-52 w-52 rounded-full border border-[#ffd700]/50 shadow-[0_0_18px_rgba(255,215,0,0.3)] sm:h-60 sm:w-60">
              <div className="absolute -bottom-1.5 left-1/2 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-[#ffd700] shadow-[0_0_12px_#ffd700]" />
            </div>
          </div>

          {/* Central Illuminated Emblem Pod */}
          <div className="animate-quantum-float relative z-10 flex h-36 w-36 items-center justify-center rounded-2xl border-2 border-white/80 bg-white/95 p-3.5 shadow-[0_0_40px_rgba(39,103,185,0.5),0_0_60px_rgba(181,0,79,0.3)] backdrop-blur-md sm:h-40 sm:w-40 sm:p-4">
            {/* Subtle inner pulse flare */}
            <div className="absolute inset-1 rounded-xl bg-gradient-to-tr from-blue-50/50 via-transparent to-pink-50/50" />

            {/* Quantum Computing Chapter Official Logo */}
            <div className="relative h-full w-full">
              <Image
                src="/brand/qcc-logo-transparent.png"
                alt="Quantum Computing Chapter UCU"
                fill
                priority
                className="object-contain drop-shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* Title & University Subtitle */}
        <div className="mb-5 space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#7fb3ff]">
            Uganda Christian University
          </p>
          <h2 className="text-lg font-extrabold tracking-wide text-white sm:text-xl">
            Quantum Computing Chapter
          </h2>
          <p className="text-xs font-medium text-slate-300">
            Department Of Computing &amp; Technology
          </p>
        </div>

        {/* Loading Progress Bar & Technical Status Readout */}
        <div className="w-72 max-w-[85vw] space-y-2 sm:w-80">
          {/* Status info bar */}
          <div className="flex items-center justify-between font-mono text-[11px]">
            <span className="font-semibold text-[#7fb3ff]">{currentPhase.tag}</span>
            <span className="font-bold text-white">{progress}%</span>
          </div>

          {/* Futuristic High-Precision Progress Bar */}
          <div className="relative h-2 w-full overflow-hidden rounded-full border border-white/20 bg-black/60 p-0.5 shadow-inner">
            <div
              className="relative h-full rounded-full transition-all duration-150 ease-out"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #2767b9 0%, #7fb3ff 50%, #b5004f 100%)",
                boxShadow: "0 0 10px rgba(39, 103, 185, 0.8)",
              }}
            >
              {/* Scanline beam traversing the progress bar */}
              <div className="animate-quantum-scanline absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent" />
            </div>
          </div>

          {/* Subtext description ticker */}
          <p className="h-4 truncate font-mono text-[11px] text-slate-400">
            {currentPhase.text}
          </p>
        </div>
      </div>

      {/* Footer System Version */}
      <div className="absolute bottom-4 z-10 text-center font-mono text-[10px] text-slate-400/80">
        OMEGA SYSTEM V0.1 · QUANTUM ENGINE ONLINE
      </div>
    </div>
  );
}
