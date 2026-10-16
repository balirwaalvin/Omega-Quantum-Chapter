import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/brand/Footer";
import { Logo } from "@/components/brand/Logo";
import { Motto } from "@/components/brand/Motto";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b-4 border-gold bg-ucu-blue text-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-3">
            <Logo className="h-9 w-9" />
            <span className="text-lg font-semibold">Omega</span>
          </Link>
          <Link href="/login" className="text-sm text-gold">
            Sign in
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-forest">About the chapter</p>
        <h1 className="mt-2 text-3xl font-semibold text-ucu-blue">Omega</h1>
        <p className="mt-4 text-lg text-ink">
          <Motto className="font-medium text-forest" />
        </p>
        <div className="mt-6 space-y-4 text-sm leading-7 text-ink">
          <p>
            Omega is the app for the Quantum Computing Chapter at Uganda Christian University. The name sits inside the university motto: Alpha and Omega, God the beginning and the end. The chapter treats that “end” as the edge of classical limits, and the work ahead as the beginning of quantum possibilities.
          </p>
          <p>
            Members coordinate workshops, talks, and study notes here. The circuit playground and Bloch sphere run in the browser, so a lab session still works when the network does not. Officers publish events, announcements, resources, and quizzes. Admins assign those roles.
          </p>
          <p>
            Accounts are limited to <span className="font-medium">@students.ucu.ac.ug</span>. The placeholder mark on this page can be replaced with the official UCU logo at <code>public/logo.svg</code> and in the header component.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
