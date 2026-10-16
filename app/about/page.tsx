import type { Metadata } from "next";
import Link from "next/link";
import { AlphaBackdrop } from "@/components/brand/AlphaBackdrop";
import { AlphaNavbar } from "@/components/brand/AlphaNavbar";
import { Footer } from "@/components/brand/Footer";
import { AlphaCardLogoBanner } from "@/components/brand/PartnerMark";

export const metadata: Metadata = { title: "About" };

const institutions = [
  {
    name: "Uganda Christian University",
    tag: "Host University",
    logo: "/brand/ucu.png",
    logoClass: "h-10",
  },
  {
    name: "Dept. of Computing & Tech",
    tag: "Academic Home",
    logo: "/brand/department.png",
    logoClass: "h-14",
  },
  {
    name: "UCU Quantum Chapter",
    tag: "Student Community",
    logo: "/brand/chapter.png",
    logoClass: "h-14",
  },
];

export default function AboutPage() {
  return (
    <div className="relative flex min-h-screen flex-col justify-between text-white">
      <AlphaBackdrop />
      <div className="relative z-10">
        <AlphaNavbar />
      </div>

      <main className="relative z-10 mx-auto flex w-full max-w-2xl flex-1 items-center justify-center px-4 py-8">
        <div className="alpha-card-frame w-full">
          <div className="overflow-hidden rounded-[8px] bg-black/85 backdrop-blur-md">
            <AlphaCardLogoBanner />

            <div className="px-6 py-6 sm:px-8">
              <div className="text-center">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#7fb3ff]">
                  Alpha &amp; Omega &middot; God the Beginning and the End
                </p>
                <h1 className="mt-1 text-xl font-bold text-white sm:text-2xl">
                  UCU Quantum Computing Chapter
                </h1>
                <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-slate-300 sm:text-sm">
                  Interactive quantum circuit simulation, 3D Bloch sphere state
                  visualization, structured study modules, and chapter coordination.
                </p>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {institutions.map((item) => (
                  <div
                    key={item.name}
                    className="flex flex-col items-center rounded-lg bg-[#f8f8f8] p-3.5 text-center text-ink"
                  >
                    <div className="flex h-14 items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.logo}
                        alt={item.name}
                        className={`${item.logoClass} w-auto object-contain select-none`}
                      />
                    </div>
                    <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-alpha-blue">
                      {item.tag}
                    </p>
                    <p className="mt-0.5 text-xs font-semibold text-ucu-blue">
                      {item.name}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-md bg-[#2767b9] px-5 py-2 text-xs font-semibold text-white transition hover:bg-[#1f569d] sm:text-sm"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-md bg-[#f7fbfc] px-5 py-2 text-xs font-semibold text-ucu-blue transition hover:bg-white sm:text-sm"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="relative z-10">
        <Footer light />
      </div>
    </div>
  );
}

