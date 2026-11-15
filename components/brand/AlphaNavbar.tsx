"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { OmegaLockup } from "@/components/brand/Logo";

interface NavItem {
  name: string;
  href: string;
  external?: boolean;
  icon: ReactNode;
}

const navItems: NavItem[] = [
  {
    name: "Home",
    href: "/",
    external: false,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 opacity-90 transition-opacity group-hover:opacity-100"
        aria-hidden="true"
      >
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    ),
  },
  {
    name: "Leaders",
    href: "/leaders",
    external: false,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 opacity-90 transition-opacity group-hover:opacity-100"
        aria-hidden="true"
      >
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    ),
  },
];

export function AlphaNavbar({
  position = "bottom",
}: {
  position?: "top" | "bottom";
} = {}) {
  const isBottom = position === "bottom";

  return (
    <footer className="relative w-full">
      <div
        className={`mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 ${
          isBottom ? "py-4 pb-6 sm:py-5" : "pt-5 pb-3 sm:pt-6"
        }`}
      >
        {/* Menu bar brand cluster: Omega text wordmark + UCU logo + Chapter logo */}
        <div className="flex flex-wrap items-center gap-2.5 pr-2 sm:gap-3.5">
          <Link
            href="/"
            className="group inline-flex items-center transition-opacity hover:opacity-95"
          >
            <OmegaLockup size="sm" theme="dark" showSubtitle={false} />
          </Link>

          <span className="h-5 w-px bg-white/25 sm:h-6" aria-hidden />

          <span className="inline-flex items-center rounded-md bg-white/95 px-2 py-1 shadow-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/ucu.png"
              alt="Uganda Christian University"
              className="h-5 w-auto object-contain select-none sm:h-6"
            />
          </span>

          <span className="h-5 w-px bg-white/25 sm:h-6" aria-hidden />

          <span className="inline-flex items-center rounded-md bg-white/95 px-2 py-0.5 shadow-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/qcc-logo-transparent.png"
              alt="Quantum Computing Chapter"
              className="h-6 w-auto object-contain select-none sm:h-7"
            />
          </span>
        </div>

        {/* Navigation with icons */}
        <nav
          aria-label="Main navigation"
          className="flex items-center gap-1.5 sm:gap-3"
        >
          {navItems.map((item) => {
            const linkClasses =
              "group inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-white/90 transition-all hover:bg-white/15 hover:text-white sm:px-3 sm:py-1.5 sm:text-sm";

            return item.external ? (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className={linkClasses}
              >
                {item.icon}
                <span>{item.name}</span>
              </a>
            ) : (
              <Link key={item.name} href={item.href} className={linkClasses}>
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </footer>
  );
}
