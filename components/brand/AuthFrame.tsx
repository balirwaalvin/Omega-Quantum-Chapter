import type { ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";
import { Motto } from "@/components/brand/Motto";

export function AuthFrame({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
      <section className="relative hidden overflow-hidden bg-ucu-blue text-white lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #F1C40F 0 1px, transparent 1.5px), radial-gradient(circle at 70% 60%, #ffffff 0 1px, transparent 1.5px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative flex items-center gap-3">
          <Logo />
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-gold">UCU</p>
            <p className="text-2xl font-semibold">Omega</p>
          </div>
        </div>
        <div className="relative max-w-md">
          <h1 className="text-4xl font-semibold leading-tight">
            The end of classical limits. The beginning of quantum possibilities.
          </h1>
          <p className="mt-4 text-blue-100">
            The Quantum Computing Chapter at Uganda Christian University.
          </p>
        </div>
        <Motto className="relative text-sm text-gold" />
      </section>
      <section className="flex flex-col bg-background">
        <div className="flex items-center gap-3 border-b border-gold/70 bg-ucu-blue px-5 py-4 text-white lg:hidden">
          <Logo className="h-9 w-9" />
          <div>
            <p className="text-lg font-semibold">Omega</p>
            <p className="text-xs text-blue-100">UCU Quantum Computing Chapter</p>
          </div>
        </div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-10">
          <h2 className="mb-4 text-2xl font-semibold text-ucu-blue">{title}</h2>
          {children}
          <Motto className="mt-8 text-center text-xs text-muted lg:hidden" />
        </div>
      </section>
    </div>
  );
}
