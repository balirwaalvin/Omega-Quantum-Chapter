import Link from "next/link";
import { OmegaLockup } from "@/components/brand/Logo";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6">
      <OmegaLockup size="md" theme="light" />
      <h1 className="mt-6 text-3xl font-semibold text-ucu-blue">
        Page not found
      </h1>
      <p className="mt-2 text-sm text-muted">
        The page you requested could not be found.
      </p>
      <Link href="/dashboard" className="btn mt-6 w-fit">
        Back to dashboard
      </Link>
    </main>
  );
}
