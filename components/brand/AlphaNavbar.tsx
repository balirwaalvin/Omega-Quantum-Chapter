"use client";

import { useState } from "react";
import Link from "next/link";

const navItems = [
  {
    name: "Home",
    href: "/",
    external: false,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-4 w-4 shrink-0"
        aria-hidden="true"
      >
        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
      </svg>
    ),
  },
  {
    name: "Profiles",
    href: "https://alpha.ucu.ac.ug/mis/profiles/",
    external: true,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-4 w-4 shrink-0"
        aria-hidden="true"
      >
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    ),
  },
  {
    name: "Careers",
    href: "https://alpha.ucu.ac.ug/careers",
    external: true,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-4 w-4 shrink-0"
        aria-hidden="true"
      >
        <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.1 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
      </svg>
    ),
  },
  {
    name: "Staff Email",
    href: "https://mailx.ucu.ac.ug/",
    external: true,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-4 w-4 shrink-0"
        aria-hidden="true"
      >
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
      </svg>
    ),
  },
  {
    name: "Student Email",
    href: "https://students.ucu.ac.ug/",
    external: true,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-4 w-4 shrink-0"
        aria-hidden="true"
      >
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z" />
      </svg>
    ),
  },
];

export function AlphaNavbar({
  position = "bottom",
}: {
  position?: "top" | "bottom";
} = {}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const isBottom = position === "bottom";

  return (
    <footer className="relative w-full">
      {/* Mobile Dropdown Menu (renders above bottom bar if at bottom) */}
      {mobileOpen && (
        <div
          className={`mx-4 rounded-xl border border-white/15 bg-black/85 p-3 shadow-2xl backdrop-blur-xl md:hidden ${
            isBottom ? "mb-2" : "mt-1 mb-3"
          }`}
        >
          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const linkClasses =
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-white/90 hover:bg-white/15 hover:text-white transition-colors";

              return item.external ? (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className={linkClasses}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </a>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={linkClasses}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}

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

        {/* Desktop Navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 md:flex lg:gap-2"
        >
          {navItems.map((item) => {
            const linkClasses =
              "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-white/90 transition-all hover:bg-white/10 hover:text-white sm:text-[13px]";

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

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-lg p-2 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40 md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>
    </footer>
  );
}
