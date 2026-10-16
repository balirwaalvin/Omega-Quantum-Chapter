import campusBg from "@/public/brand/ucu-campus-bg.jpg";

export function AlphaBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#011c2e]" aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={campusBg.src}
        alt=""
        className="h-full w-full object-cover object-center select-none"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0, 0, 0, 0.12) 0%, rgba(0, 0, 0, 0.2) 70%, rgba(0, 0, 0, 0.48) 100%)",
        }}
      />
    </div>
  );
}
