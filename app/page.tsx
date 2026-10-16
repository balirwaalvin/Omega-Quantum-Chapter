import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Motto } from "@/components/brand/Motto";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-ucu-blue text-white">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-5">
        <div className="flex items-center gap-3">
          <Logo />
          <p className="text-2xl font-semibold">Omega</p>
        </div>
        <Link href="/about" className="text-sm text-blue-100 hover:text-white">
          About
        </Link>
      </header>
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-5 py-12">
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
      <footer className="border-t border-white/15 px-5 py-6 text-center text-sm text-gold">
        <Motto />
      </footer>
    </div>
  );
}
