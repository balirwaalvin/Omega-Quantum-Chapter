export function Logo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="Omega placeholder logo"
    >
      <rect width="64" height="64" rx="14" fill="#003087" />
      <circle cx="32" cy="32" r="16" fill="none" stroke="#F1C40F" strokeWidth="3" />
      <path
        d="M22 38c0-8 4-14 10-14s10 6 10 14"
        fill="none"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M32 18v10" stroke="#C2185B" strokeWidth="2" strokeLinecap="round" />
      <circle cx="32" cy="32" r="2.2" fill="#228B22" />
    </svg>
  );
}
