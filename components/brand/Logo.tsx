import { useId } from "react";

/**
 * Graphically rich, purely typographic OMEGA wordmark.
 * Combines bespoke geometric letterforms, an integrated Greek Ω quantum glyph,
 * and a multi-stop UCU Alpha spectrum rule (#2767b9 -> #f1c40f -> #b5004f).
 */
export function Logo({
  className = "h-7 w-auto",
  onDark = false,
}: {
  className?: string;
  /** Optimizes palette contrast when rendered over a dark blue/glass surface. */
  onDark?: boolean;
}) {
  const uid = useId().replace(/:/g, "");
  const textGradId = `omega-word-grad-${uid}`;
  const accentGradId = `omega-rule-grad-${uid}`;

  return (
    <svg
      viewBox="0 0 218 44"
      fill="none"
      className={`shrink-0 select-none ${className}`}
      role="img"
      aria-label="OMEGA"
    >
      <defs>
        {onDark ? (
          <linearGradient id={textGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="58%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#93C5FD" />
          </linearGradient>
        ) : (
          <linearGradient id={textGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#012E4A" />
            <stop offset="52%" stopColor="#2767B9" />
            <stop offset="100%" stopColor="#8A0E45" />
          </linearGradient>
        )}
        <linearGradient id={accentGradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={onDark ? "#60A5FA" : "#2767B9"} />
          <stop offset="55%" stopColor="#F1C40F" />
          <stop offset="100%" stopColor="#B5004F" />
        </linearGradient>
      </defs>

      {/* Stylized initial Quantum 'O' / 'Ω' typographic letterform */}
      <g transform="translate(2, 3)">
        <circle
          cx="15"
          cy="14.5"
          r="11.2"
          stroke={`url(#${textGradId})`}
          strokeWidth="3.6"
        />
        <ellipse
          cx="15"
          cy="14.5"
          rx="14.2"
          ry="5.2"
          transform="rotate(-24 15 14.5)"
          stroke={`url(#${accentGradId})`}
          strokeWidth="1.45"
          strokeDasharray="2.5 1.5"
        />
        <circle cx="15" cy="14.5" r="2.2" fill="#F1C40F" />
        <circle cx="25.8" cy="10.2" r="1.8" fill="#B5004F" />
      </g>

      {/* Precision geometric 'MEGA' wordmark */}
      <text
        x="34"
        y="27.5"
        fill={`url(#${textGradId})`}
        fontFamily="ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        fontWeight="900"
        fontSize="26.5"
        letterSpacing="0.16em"
      >
        MEGA
      </text>

      {/* Superscript Ω signature badge */}
      <text
        x="196"
        y="13.5"
        fill={onDark ? "#F1C40F" : "#B5004F"}
        fontFamily="ui-sans-serif, system-ui, -apple-system, sans-serif"
        fontWeight="800"
        fontSize="11.5"
      >
        Ω
      </text>

      {/* Graphic spectrum underline rule with quantum node */}
      <rect
        x="3"
        y="35.5"
        width="188"
        height="2.6"
        rx="1.3"
        fill={`url(#${accentGradId})`}
      />
      <circle
        cx="198"
        cy="36.8"
        r="2.4"
        fill={onDark ? "#F1C40F" : "#B5004F"}
      />
    </svg>
  );
}

export function OmegaLockup({
  size = "md",
  theme = "light",
  showEyebrow = false,
  showSubtitle = true,
}: {
  size?: "sm" | "md" | "lg";
  theme?: "light" | "dark";
  showEyebrow?: boolean;
  showSubtitle?: boolean;
}) {
  const isDark = theme === "dark";
  const wordmarkHeight =
    size === "lg"
      ? "h-9 sm:h-10"
      : size === "sm"
        ? "h-6 sm:h-7"
        : "h-7 sm:h-8";

  return (
    <div className="inline-flex flex-col justify-center leading-none">
      {showEyebrow ? (
        <p
          className={`mb-1 text-[9px] font-bold uppercase tracking-[0.22em] ${
            isDark ? "text-gold" : "text-alpha-blue"
          }`}
        >
          UCU Quantum System
        </p>
      ) : null}
      <div className="inline-flex flex-wrap items-center gap-x-2.5 gap-y-0.5">
        <Logo className={wordmarkHeight} onDark={isDark} />
        {showSubtitle ? (
          <span
            className={`text-[10px] font-semibold uppercase tracking-[0.14em] sm:text-[11px] ${
              isDark ? "text-white/85" : "text-slate-600"
            }`}
          >
            Quantum Computing Chapter
          </span>
        ) : null}
      </div>
    </div>
  );
}


