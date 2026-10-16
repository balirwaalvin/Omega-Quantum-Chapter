import { OmegaLockup } from "@/components/brand/Logo";

export function PartnerMark({
  src,
  alt,
  className = "h-12",
  framed = false,
}: {
  src: string;
  alt: string;
  className?: string;
  framed?: boolean;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center ${
        framed
          ? "rounded-xl bg-white px-3 py-2 shadow-xs ring-1 ring-slate-200/80"
          : ""
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={`${className} w-auto object-contain select-none`}
      />
    </span>
  );
}

/**
 * Top card header modeled directly after https://alpha.ucu.ac.ug:
 * A crisp #f8f8f8 top surface displaying the official Uganda Christian University
 * logo alone, followed by Alpha's signature #2767b9 -> #b5004f gradient accent bar.
 */
export function AlphaCardLogoBanner() {
  return (
    <div className="w-full overflow-hidden">
      <div className="bg-[#f8f8f8] px-4 py-2.5 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/ucu.png"
          alt="Uganda Christian University"
          className="mx-auto max-h-[84px] w-auto object-contain select-none"
        />
      </div>
      <div
        className="h-2.5 w-full"
        style={{
          background: "linear-gradient(to right, #2767b9 80%, #b5004f 100%)",
        }}
      />
    </div>
  );
}

/**
 * Full official brand & institutional lockup card on a crisp white surface
 * framed with Alpha's signature #2767b9 -> #b5004f gradient border.
 */
export function InstitutionalLockupCard({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={`alpha-card-frame ${className}`}>
      <div className="overflow-hidden rounded-[8px] bg-white text-ink">
        <div className="bg-[#f8f8f8] px-6 py-5">
          <div className="flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/ucu.png"
              alt="Uganda Christian University — A Centre of Excellence in the Heart of Africa"
              className="h-12 w-auto object-contain sm:h-14"
            />
          </div>
        </div>
        <div className="alpha-accent-bar h-1.5 w-full" />
        <div className="p-5 sm:p-6">
          <div className="flex justify-center pb-4">
            <OmegaLockup size="md" theme="light" showEyebrow />
          </div>
          <div className="flex items-center justify-center gap-6 border-t border-slate-200/90 pt-4 sm:gap-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/department.png"
              alt="Department of Computing and Technology"
              className="h-16 w-auto object-contain sm:h-18"
            />
            <div className="h-12 w-px bg-slate-200" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/chapter.png"
              alt="Quantum Computing — UCU Chapter"
              className="h-16 w-auto object-contain sm:h-18"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Balanced horizontal strip of the three official institutional marks
 * for footers and compact affiliation bars on light surfaces.
 */
export function PartnerLogosRow({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md";
  className?: string;
}) {
  const ucuHeight = size === "sm" ? "h-7 sm:h-8" : "h-9 sm:h-10";
  const badgeHeight = size === "sm" ? "h-10 sm:h-11" : "h-13 sm:h-14";
  const dividerHeight = size === "sm" ? "h-6" : "h-8";

  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-3.5 sm:gap-5 ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/ucu.png"
        alt="Uganda Christian University"
        className={`${ucuHeight} w-auto object-contain`}
      />
      <span className={`${dividerHeight} w-px bg-slate-200`} aria-hidden />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/department.png"
        alt="Department of Computing and Technology"
        className={`${badgeHeight} w-auto object-contain`}
      />
      <span className={`${dividerHeight} w-px bg-slate-200`} aria-hidden />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/chapter.png"
        alt="Quantum Computing — UCU Chapter"
        className={`${badgeHeight} w-auto object-contain`}
      />
    </div>
  );
}

