import type { Metadata } from "next";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AuthFrame } from "@/components/brand/AuthFrame";
import { OmegaSignIn } from "@/components/auth/clerk-ui";
import { canAccessChapter } from "@/lib/auth-shared";

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

  // If user is already authenticated and didn't arrive via a failure reason
  if (!reason) {
    const session = await auth();
    if (session.userId) {
      const user = await currentUser();
      const email = user?.primaryEmailAddress?.emailAddress;
      const providers = user?.externalAccounts.map((a) => a.provider) ?? [];
      const deactivated = user?.publicMetadata?.deactivated === true || user?.banned === true;

      if (!deactivated && canAccessChapter({ email, providers })) {
        const isAdmin =
          email?.toLowerCase() === "admin@omega.ug" ||
          user?.publicMetadata?.role === "admin";
        redirect(isAdmin ? "/admin" : "/dashboard");
      }
    }
  }

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
