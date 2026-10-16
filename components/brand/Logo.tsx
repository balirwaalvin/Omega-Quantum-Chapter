export function Logo({ className = "h-14 w-14" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={`shrink-0 drop-shadow-md ${className}`}
      role="img"
      aria-label="Omega"
    >
      <rect width="64" height="64" rx="16" fill="#F1C40F" />
      <rect x="2.5" y="2.5" width="59" height="59" rx="14" fill="#ffffff" />
      <g transform="translate(32 32) scale(0.82) translate(-32 -32)">
        <rect width="64" height="64" rx="14" fill="#003087" />
        <g
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M23.6 44.2 A14.2 14.2 0 1 1 40.4 44.2" />
          <path d="M23.6 44.2 V50.2 H17.2" />
          <path d="M40.4 44.2 V50.2 H46.8" />
        </g>
        <g transform="rotate(-22 32 30.6)">
          <ellipse
            cx="32"
            cy="30.6"
            rx="7.4"
            ry="3.15"
            fill="none"
            stroke="#F1C40F"
            strokeWidth="1.25"
          />
        </g>
        <circle cx="32" cy="30.6" r="2.55" fill="#F1C40F" />
        <circle cx="38.5" cy="28.2" r="1.45" fill="#C2185B" />
      </g>
    </svg>
  );
}
