import type { Metadata } from "next";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AuthFrame } from "@/components/brand/AuthFrame";
import { OmegaSignUp } from "@/components/auth/clerk-ui";
import { canAccessChapter } from "@/lib/auth-shared";

export const metadata: Metadata = { title: "Create account" };

export default async function SignupPage() {
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

  return (
    <AuthFrame>
      <OmegaSignUp />
    </AuthFrame>
  );
}
