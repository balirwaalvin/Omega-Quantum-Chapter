import type { Metadata } from "next";
import { AuthFrame } from "@/components/brand/AuthFrame";
import { OmegaSignUp } from "@/components/auth/clerk-ui";

export const metadata: Metadata = { title: "Create account" };

export default function SignupPage() {
  return (
    <AuthFrame title="Join the chapter">
      <p className="mb-4 text-sm text-muted">
        Email sign-up must use @students.ucu.ac.ug. GitHub and LinkedIn can use any email on that account.
      </p>
      <OmegaSignUp />
    </AuthFrame>
  );
}
