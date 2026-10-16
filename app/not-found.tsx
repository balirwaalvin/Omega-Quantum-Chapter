import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-forest">Omega</p>
      <h1 className="mt-2 text-3xl font-semibold text-ucu-blue">Page not found</h1>
      <Link href="/dashboard" className="btn mt-6 w-fit">
        Back to dashboard
      </Link>
    </main>
  );
}
