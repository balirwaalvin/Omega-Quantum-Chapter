"use client";

import Link from "next/link";

interface NavItem {
  name: string;
  href: string;
  external?: boolean;
}

const navItems: NavItem[] = [
  {
    name: "Home",
    href: "/",
    external: false,
  },
  {
    name: "Leaders",
    href: "/leaders",
    external: false,
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

        {/* Navigation: text-only, no icons */}
        <nav
          aria-label="Main navigation"
          className="flex items-center gap-1.5 sm:gap-3"
        >
          {navItems.map((item) => {
            const linkClasses =
              "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium text-white/90 transition-all hover:bg-white/15 hover:text-white sm:px-3 sm:py-1.5 sm:text-sm";

            return item.external ? (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className={linkClasses}
              >
                <span>{item.name}</span>
              </a>
            ) : (
              <Link key={item.name} href={item.href} className={linkClasses}>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </footer>
  );
}
