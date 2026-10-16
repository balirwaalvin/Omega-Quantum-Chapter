import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Motto } from "@/components/brand/Motto";
import { PartnerMark } from "@/components/brand/PartnerMark";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-ucu-blue text-white">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <PartnerMark
            src="/brand/ucu.png"
            alt="Uganda Christian University"
            className="h-8 sm:h-14"
          />
          <Logo className="h-14 w-14 sm:h-16 sm:w-16" />
          <p className="hidden text-xl font-semibold sm:block sm:text-2xl">Omega</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <PartnerMark
            src="/brand/chapter.png"
            alt="UCU Quantum Computing Chapter"
            className="h-16 sm:h-24"
          />
          <Link href="/about" className="text-sm text-blue-100 hover:text-white">
            About
          </Link>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-5 py-12">
        <div className="mb-6 flex items-center gap-3">
          <PartnerMark
            src="/brand/ucu.png"
            alt=""
            className="h-12 sm:h-16"
          />
          <Logo className="h-16 w-16 sm:h-20 sm:w-20" />
        </div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
          Uganda Christian University
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
          Omega
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-blue-100">
          Quantum Computing Chapter. The end of classical limits, and the beginning of quantum possibilities.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/login" className="btn bg-gold text-ucu-blue hover:bg-gold-bright">
            Sign in
          </Link>
          <Link href="/signup" className="btn-secondary border-white/30 bg-transparent text-white">
            Create account
          </Link>
        </div>
      </main>
      <footer className="border-t border-white/15 px-4 py-6 sm:px-6">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-5 rounded-2xl bg-white px-4 py-5 text-ink sm:px-6 md:flex-row md:flex-wrap md:justify-between">
          <div className="flex items-center gap-3">
            <PartnerMark
              src="/brand/ucu.png"
              alt="Uganda Christian University"
              className="h-12"
            />
            <Logo className="h-14 w-14" />
            <p className="text-lg font-semibold text-ucu-blue">Omega</p>
          </div>
          <PartnerMark
            src="/brand/department.png"
            alt="Department of Computing and Technology"
            className="h-24"
          />
          <Motto className="text-center text-sm text-forest md:text-right" />
        </div>
      </footer>
    </div>
  );
}
