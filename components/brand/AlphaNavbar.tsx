"use client";

import Link from "next/link";

import type { ReactNode } from "react";

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
        className={`mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 ${
          isBottom ? "py-4 pb-6 sm:py-5" : "pt-5 pb-3 sm:pt-6"
        }`}
      >
        {/* Brand title: text only, no logo graphic, reference https://alpha.ucu.ac.ug */}
        <div className="flex flex-col items-start pr-2">
          <Link
            href="/"
            className="group inline-flex flex-wrap items-baseline text-white transition-opacity hover:opacity-95"
          >
            <span className="text-sm font-bold uppercase tracking-wider text-white sm:text-base">
              OMEGA
            </span>
            <span className="ml-1.5 text-xs font-normal text-white/90 sm:text-sm">
              Quantum Computing Chapter
            </span>
          </Link>
          <p className="mt-0.5 text-[11px] text-white/70">
            Department Of Computing &amp; Technology
          </p>
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
