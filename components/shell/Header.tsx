"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { OmegaLockup } from "@/components/brand/Logo";
import type { Role } from "@/types";

export function Header({
  name,
  role = "member",
  onMenu,
}: {
  name: string;
  role?: Role;
  onMenu: () => void;
}) {
  return (
    <header className="alpha-glass-nav sticky top-0 z-30 border-b border-slate-200/80 text-ink shadow-2xs">
      <div className="alpha-accent-bar h-1 w-full" />
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-ucu-blue hover:bg-slate-50 md:hidden"
            onClick={onMenu}
            aria-label="Open navigation"
          >
            Menu
          </button>
          <Link href="/dashboard" className="inline-flex items-center">
            <OmegaLockup size="sm" theme="light" />
          </Link>
          <div className="hidden items-center gap-3 lg:flex">
            <span className="h-6 w-px bg-slate-200" aria-hidden />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/ucu.png"
              alt="Uganda Christian University"
              className="h-7 w-auto object-contain select-none"
            />
            <span className="h-6 w-px bg-slate-200" aria-hidden />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/chapter.png"
              alt="Quantum Computing UCU Chapter"
              className="h-9 w-auto object-contain select-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="hidden rounded-md bg-ucu-blue/8 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-alpha-blue sm:inline-block">
            {role}
          </span>
          <span className="hidden text-xs font-semibold text-ink sm:inline">
            {name}
          </span>
          <UserButton />
        </div>
      </div>
    </header>
  );
}

