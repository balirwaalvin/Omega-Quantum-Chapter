import type { Metadata } from "next";
import { AuthFrame } from "@/components/brand/AuthFrame";
import { OmegaSignIn } from "@/components/auth/clerk-ui";

export const metadata: Metadata = { title: "Sign in" };

const reasons: Record<string, string> = {
  domain: "Use a @students.ucu.ac.ug email, GitHub, or LinkedIn.",
  deactivated: "Account deactivated. Contact a chapter admin.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const { reason } = await searchParams;
  const message = reason ? reasons[reason] : undefined;

  return (
    <AuthFrame>
      {message ? (
        <p
          className="mb-3 w-full rounded-[5px] border border-magenta/50 bg-magenta/20 px-3 py-1.5 text-center text-xs font-medium text-pink-100"
          role="alert"
        >
          {message}
        </p>
      ) : null}
      <OmegaSignIn />
    </AuthFrame>
  );
}


