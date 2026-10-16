export function Logo({
  className = "h-10 w-10",
  onDark = false,
}: {
  className?: string;
  /** Adds a subtle crisp border when rendered over a dark blue surface. */
  onDark?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={`shrink-0 ${onDark ? "rounded-[22%] ring-1 ring-white/25 shadow-sm" : "drop-shadow-xs"} ${className}`}
      role="img"
      aria-label="Omega"
    >
      <defs>
        <linearGradient id="omega-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#012E4A" />
          <stop offset="100%" stopColor="#2767B9" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="url(#omega-bg)" />
      <g
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16.5 49.5 H24.2 V43.2 A14.4 14.4 0 1 1 39.8 43.2 V49.5 H47.5" />
      </g>
      <g transform="rotate(-22 32 30)">
        <ellipse
          cx="32"
          cy="30"
          rx="8.4"
          ry="3.6"
          fill="none"
          stroke="#F1C40F"
          strokeWidth="1.6"
        />
      </g>
      <circle cx="32" cy="30" r="2.7" fill="#F1C40F" />
      <circle cx="39.3" cy="27.1" r="1.85" fill="#B5004F" />
    </svg>
  );
}

export function OmegaLockup({
  size = "md",
  theme = "light",
  showEyebrow = false,
}: {
  size?: "sm" | "md" | "lg";
  theme?: "light" | "dark";
  showEyebrow?: boolean;
}) {
  const isDark = theme === "dark";
  const iconSize =
    size === "lg"
      ? "h-12 w-12 sm:h-14 sm:w-14"
      : size === "sm"
        ? "h-9 w-9"
        : "h-10 w-10";
  const titleSize =
    size === "lg"
      ? "text-xl sm:text-2xl tracking-[0.14em]"
      : size === "sm"
        ? "text-sm sm:text-base tracking-[0.12em]"
        : "text-base sm:text-lg tracking-[0.14em]";

  return (
    <div className="inline-flex items-center gap-2.5">
      <Logo className={iconSize} onDark={isDark} />
      <div className="min-w-0 leading-tight">
        {showEyebrow ? (
          <p
            className={`text-[10px] font-bold uppercase tracking-[0.18em] ${
              isDark ? "text-gold" : "text-alpha-blue"
            }`}
          >
            UCU Quantum System
          </p>
        ) : null}
        <div className="flex flex-wrap items-baseline gap-x-1.5">
          <span
            className={`font-extrabold uppercase ${titleSize} ${
              isDark ? "text-white" : "text-ucu-blue"
            }`}
          >
            OMEGA
          </span>
          <span
            className={`text-xs font-medium ${
              isDark ? "text-slate-200" : "text-muted"
            }`}
          >
            Quantum Computing Chapter
          </span>
        </div>
      </div>
    </div>
  );
}

