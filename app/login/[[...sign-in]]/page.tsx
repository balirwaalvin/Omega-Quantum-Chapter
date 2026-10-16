import type { Metadata } from "next";
import { AuthFrame } from "@/components/brand/AuthFrame";
import { OmegaSignIn } from "@/components/auth/clerk-ui";

export const metadata: Metadata = { title: "Sign in" };

const reasons: Record<string, string> = {
  domain: "Email sign-in must use a @students.ucu.ac.ug address. GitHub and LinkedIn can use any email on that account.",
  deactivated: "This account has been deactivated. Contact a chapter admin.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const { reason } = await searchParams;
  const message = reason ? reasons[reason] : undefined;

  return (
    <AuthFrame title="Sign in to Omega">
      {message ? (
        <p className="mb-4 rounded-lg border border-magenta/30 bg-white px-3 py-2 text-sm text-magenta" role="alert">
          {message}
        </p>
      ) : (
        <p className="mb-4 text-sm text-muted">
          Use a @students.ucu.ac.ug email, or continue with GitHub or LinkedIn. Social accounts can use any email they are registered with.
        </p>
      )}
      <OmegaSignIn />
    </AuthFrame>
  );
}
