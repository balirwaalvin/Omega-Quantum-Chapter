export const MOTTO = "Alpha and Omega: God the Beginning and the End";

export function Motto({ className = "" }: { className?: string }) {
  return <p className={className}>{MOTTO}</p>;
}
