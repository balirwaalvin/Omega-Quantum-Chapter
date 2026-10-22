import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AuthFrame } from "@/components/brand/AuthFrame";
import { OmegaSignIn } from "@/components/auth/clerk-ui";
import { canAccessChapter } from "@/lib/auth-shared";

export default async function HomePage() {
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
      <OmegaSignIn />
    </AuthFrame>
  );
}
