export function PartnerMark({
  src,
  alt,
  className = "h-14",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <span className="inline-flex shrink-0 items-center justify-center rounded-2xl bg-white px-2.5 py-1.5 shadow-md ring-1 ring-black/10">
      <img src={src} alt={alt} className={`${className} w-auto object-contain`} />
    </span>
  );
}
