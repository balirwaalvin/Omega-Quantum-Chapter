"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

interface QuantumIntroLoaderProps {
  onComplete?: () => void;
}

const PHASES = [
  { threshold: 0, tag: "SYSTEM_INIT", text: "Initializing Cryogenic Qubit Superlattice..." },
  { threshold: 22, tag: "SUPERPOSITION", text: "Calibrating Bloch State Vectors & Polarizations..." },
  { threshold: 52, tag: "ENTANGLEMENT", text: "Entangling Multiqubit Bell Pairs & Gate Circuits..." },
  { threshold: 82, tag: "QUANTUM_COHERENCE", text: "Stabilizing Quantum Phase Fidelity at 99.8%..." },
  { threshold: 96, tag: "OMEGA_PORTAL_READY", text: "Omega Quantum Chapter System Online" },
];

const QUBIT_REGISTERS = [
  { id: "q0", label: "|q₀⟩", gate: "INIT", activateAt: 15 },
  { id: "q1", label: "|q₁⟩", gate: "H", activateAt: 35 },
  { id: "q2", label: "|q₂⟩", gate: "CNOT", activateAt: 55 },
  { id: "q3", label: "|q₃⟩", gate: "X", activateAt: 75 },
  { id: "q4", label: "|q₄⟩", gate: "|ψ⟩", activateAt: 92 },
];

export function QuantumIntroLoader({ onComplete }: QuantumIntroLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Canvas particle entanglement mesh animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Particle nodes for quantum network
    const particleCount = Math.min(Math.floor((width * height) / 22000), 55);
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.75,
      vy: (Math.random() - 0.5) * 0.75,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.4 ? "39, 103, 185" : "181, 0, 79", // blue or magenta
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw entanglement connecting lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.3;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(127, 179, 255, ${alpha})`;
            ctx.lineWidth = 0.85;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particle nodes
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, 0.8)`;
        ctx.shadowColor = `rgba(${p.color}, 0.9)`;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Progression: rolls through continuously and smoothly without skipping
  useEffect(() => {
    if (isDismissed) return;

    const startTime = performance.now();
    const duration = 2800; // 2.8s total smooth sequence

    let animationFrameId: number;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const linearRatio = Math.min(elapsed / duration, 1);

      // Smooth cubic ease-out curve
      const easedRatio =
        linearRatio < 0.5
          ? 2 * linearRatio * linearRatio
          : 1 - Math.pow(-2 * linearRatio + 2, 2) / 2;

      const currentProgress = Math.min(Math.round(easedRatio * 100), 100);
      setProgress(currentProgress);

      if (linearRatio < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        // Hold on 100% for 380ms for final lockup, then trigger smooth exit
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(() => {
            setIsDismissed(true);
            onComplete?.();
          }, 650);
        }, 380);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isDismissed, onComplete]);

  if (isDismissed) return null;

  // Find active phase message
  const currentPhase =
    [...PHASES].reverse().find((p) => progress >= p.threshold) || PHASES[0];

  return (
    <div
      role="dialog"
      aria-label="Quantum Computing Chapter startup sequence"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#011422] transition-all duration-650 ease-out select-none ${
        isExiting
          ? "opacity-0 scale-105 pointer-events-none filter blur-sm"
          : "opacity-100 scale-100"
      }`}
    >
      {/* HTML5 Canvas: Dynamic Particle Entanglement Network */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-60"
      />

      {/* Background ambient lighting & radial energy cores */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Expanding Quantum Energy Waves from center */}
        <div className="animate-quantum-ripple-1 absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#2767b9]/40" />
        <div className="animate-quantum-ripple-2 absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#b5004f]/40" />

        {/* Central glowing quantum core aura */}
        <div
          className="animate-quantum-glow absolute top-1/2 left-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70"
          style={{
            background:
              "radial-gradient(circle, rgba(39, 103, 185, 0.45) 0%, rgba(181, 0, 79, 0.28) 45%, rgba(1, 20, 34, 0) 70%)",
          }}
        />

        {/* High-tech quantum circuit lines on left and right */}
        <svg
          className="absolute left-6 top-1/2 -translate-y-1/2 hidden lg:block h-96 w-32 opacity-25"
          viewBox="0 0 120 400"
          fill="none"
        >
          <path
            d="M10 20 H70 V120 H110 V200 H40 V300 H90 V380"
            stroke="url(#circuitGrad)"
            strokeWidth="1.5"
            className="animate-quantum-circuit"
          />
          <circle cx="10" cy="20" r="3" fill="#7fb3ff" />
          <circle cx="110" cy="200" r="3" fill="#ffd700" />
          <circle cx="90" cy="380" r="3" fill="#ff4d94" />
          <defs>
            <linearGradient id="circuitGrad" x1="0" y1="0" x2="0" y2="400" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2767b9" />
              <stop offset="0.5" stopColor="#7fb3ff" />
              <stop offset="1" stopColor="#b5004f" />
            </linearGradient>
          </defs>
        </svg>

        <svg
          className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:block h-96 w-32 opacity-25"
          viewBox="0 0 120 400"
          fill="none"
        >
          <path
            d="M110 20 H50 V120 H10 V200 H80 V300 H30 V380"
            stroke="url(#circuitGrad2)"
            strokeWidth="1.5"
            className="animate-quantum-circuit"
          />
          <circle cx="110" cy="20" r="3" fill="#ff4d94" />
          <circle cx="10" cy="200" r="3" fill="#7fb3ff" />
          <circle cx="30" cy="380" r="3" fill="#ffd700" />
          <defs>
            <linearGradient id="circuitGrad2" x1="0" y1="0" x2="0" y2="400" gradientUnits="userSpaceOnUse">
              <stop stopColor="#b5004f" />
              <stop offset="0.5" stopColor="#ffd700" />
              <stop offset="1" stopColor="#2767b9" />
            </linearGradient>
          </defs>
        </svg>

        {/* Ambient perspective grid */}
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
      </div>

      {/* Main Center Quantum Stage */}
      <div className="relative z-10 flex flex-col items-center px-4 text-center">
        {/* Multi-layered Quantum Orbital Halo & Central Logo Pod */}
        <div className="relative mb-6 flex h-60 w-60 items-center justify-center sm:h-72 sm:w-72">
          {/* Outermost Dashed Celestial Dial */}
          <div className="animate-quantum-spin-slow pointer-events-none absolute h-60 w-60 rounded-full border border-dashed border-[#7fb3ff]/30 sm:h-72 sm:w-72" />

          {/* Counter-rotating Quantum Compass Ring */}
          <div className="animate-quantum-spin-counter pointer-events-none absolute h-52 w-52 rounded-full border border-dotted border-[#ff4d94]/35 sm:h-64 sm:w-64" />

          {/* 3D Tilted Orbital Electron Rings */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            {/* Orbital Ring 1: Blue / Cyan */}
            <div className="animate-quantum-orbit-1 absolute h-56 w-56 rounded-full border border-[#2767b9]/75 shadow-[0_0_20px_rgba(39,103,185,0.45)] sm:h-68 sm:w-68">
              <div className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-[#7fb3ff] shadow-[0_0_14px_#7fb3ff]" />
            </div>

            {/* Orbital Ring 2: Magenta */}
            <div className="animate-quantum-orbit-2 absolute h-56 w-56 rounded-full border border-[#b5004f]/75 shadow-[0_0_20px_rgba(181,0,79,0.45)] sm:h-68 sm:w-68">
              <div className="absolute top-1/2 -right-2 h-4 w-4 -translate-y-1/2 rounded-full bg-[#ff4d94] shadow-[0_0_14px_#ff4d94]" />
            </div>

            {/* Orbital Ring 3: Gold / Yellow */}
            <div className="animate-quantum-orbit-3 absolute h-56 w-56 rounded-full border border-[#ffd700]/65 shadow-[0_0_20px_rgba(255,215,0,0.35)] sm:h-68 sm:w-68">
              <div className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-[#ffd700] shadow-[0_0_14px_#ffd700]" />
            </div>
          </div>

          {/* Central Floating Holographic Emblem Pod */}
          <div className="animate-quantum-float relative z-10 flex h-36 w-36 items-center justify-center rounded-2xl border-2 border-white/90 bg-white/98 p-3.5 shadow-[0_0_45px_rgba(39,103,185,0.6),0_0_75px_rgba(181,0,79,0.35)] backdrop-blur-md sm:h-44 sm:w-44 sm:p-4">
            {/* Shimmer flare passing across logo */}
            <div className="animate-quantum-shimmer pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
              <div className="h-full w-12 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            </div>

            {/* Subtle inner gradient lighting */}
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

        {/* Title & Department Hierarchy */}
        <div className="mb-4 space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#7fb3ff]/30 bg-[#2767b9]/15 px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.24em] text-[#7fb3ff]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7fb3ff] animate-ping" />
            <span>Uganda Christian University</span>
          </div>

          <h2 className="text-xl font-extrabold tracking-wide text-white sm:text-2xl drop-shadow-md">
            Quantum Computing Chapter
          </h2>

          <p className="text-xs font-semibold text-slate-300">
            Department Of Computing &amp; Technology
          </p>
        </div>

        {/* Qubit State Register Telemetry Array */}
        <div className="mb-4 flex items-center justify-center gap-2">
          {QUBIT_REGISTERS.map((qubit) => {
            const isActive = progress >= qubit.activateAt;
            return (
              <div
                key={qubit.id}
                className={`flex flex-col items-center rounded-lg border px-2 py-1 text-[10px] font-mono transition-all duration-300 ${
                  isActive
                    ? "border-[#7fb3ff]/80 bg-[#2767b9]/25 text-[#7fb3ff] shadow-[0_0_10px_rgba(39,103,185,0.4)] scale-105"
                    : "border-white/10 bg-white/5 text-slate-400 opacity-50"
                }`}
              >
                <span className="font-bold">{qubit.label}</span>
                <span className="text-[9px] text-white/80">{qubit.gate}</span>
              </div>
            );
          })}
        </div>

        {/* Live Loading Progress Bar & Telemetry */}
        <div className="w-80 max-w-[88vw] space-y-2 sm:w-96">
          {/* Phase Tag & Percentage Status */}
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="flex items-center gap-1.5 font-bold text-[#7fb3ff]">
              <span className="h-2 w-2 rounded-full bg-[#7fb3ff] animate-pulse" />
              <span>{currentPhase.tag}</span>
            </span>
            <span className="font-bold text-white tracking-wider">{progress}%</span>
          </div>

          {/* Futuristic High-Precision Progress Bar */}
          <div className="relative h-2.5 w-full overflow-hidden rounded-full border border-white/20 bg-black/70 p-0.5 shadow-inner">
            <div
              className="relative h-full rounded-full transition-all duration-150 ease-out"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #2767b9 0%, #7fb3ff 50%, #b5004f 100%)",
                boxShadow: "0 0 14px rgba(39, 103, 185, 0.9)",
              }}
            >
              {/* Scanline beam traversing the progress bar */}
              <div className="animate-quantum-scanline absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent" />
            </div>
          </div>

          {/* Dynamic Technical Readout */}
          <div className="flex items-center justify-between font-mono text-[11px] text-slate-300">
            <span className="truncate max-w-[260px] text-left">{currentPhase.text}</span>
            <span className="text-slate-400 font-semibold text-[10px]">99.8% FIDELITY</span>
          </div>
        </div>
      </div>

      {/* Footer System Telemetry */}
      <div className="absolute bottom-4 z-10 flex flex-wrap items-center justify-center gap-3 px-4 text-center font-mono text-[10px] text-slate-400">
        <span>SYS: OMEGA V0.1</span>
        <span>•</span>
        <span>CRYOGENICS: 15 mK</span>
        <span>•</span>
        <span>ENGINE: COHERENT</span>
      </div>
    </div>
  );
}
