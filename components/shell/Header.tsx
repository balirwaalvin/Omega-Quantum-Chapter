"use client";

import { UserButton } from "@clerk/nextjs";
import { Logo } from "@/components/brand/Logo";

export function Header({
  name,
  onMenu,
}: {
  name: string;
  onMenu: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 border-b-4 border-gold bg-ucu-blue text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-lg border border-white/20 px-3 py-1 text-sm md:hidden"
            onClick={onMenu}
            aria-label="Open navigation"
          >
            Menu
          </button>
          <Logo className="h-9 w-9" />
          <div>
            <p className="text-lg font-semibold leading-none">Omega</p>
            <p className="text-xs text-blue-100">UCU Quantum Computing Chapter</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-blue-100 sm:inline">{name}</span>
          <UserButton />
        </div>
      </div>
    </header>
  );
}
