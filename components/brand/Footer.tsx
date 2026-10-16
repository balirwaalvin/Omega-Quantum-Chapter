import Link from "next/link";

export function Footer({ light = false }: { light?: boolean }) {
  const year = new Date().getFullYear();

  return (
    <footer
      className={`mt-auto w-full py-4 text-xs ${
        light
          ? "text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]"
          : "border-t border-slate-200/80 bg-white/70 text-muted"
      }`}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 sm:flex-row sm:px-6">
        <p className="font-medium">
          &copy; {year}{" "}
          <span className={light ? "font-semibold text-white" : "font-semibold text-ucu-blue"}>
            Uganda Christian University
          </span>{" "}
          &middot; Quantum Computing Chapter
        </p>

        <nav
          aria-label="Footer"
          className="flex flex-wrap items-center justify-center gap-4 font-medium"
        >
          <Link
            href="/"
            className={light ? "hover:text-white" : "hover:text-ucu-blue"}
          >
            Portal
          </Link>
          <Link
            href="/about"
            className={light ? "hover:text-white" : "hover:text-ucu-blue"}
          >
            About
          </Link>
          <a
            href="https://alpha.ucu.ac.ug"
            target="_blank"
            rel="noreferrer"
            className={light ? "hover:text-white" : "hover:text-ucu-blue"}
          >
            Alpha MIS
          </a>
          <Link
            href="/login"
            className={light ? "hover:text-white" : "hover:text-ucu-blue"}
          >
            Sign In
          </Link>
        </nav>
      </div>
    </footer>
  );
}

