import type { Metadata } from "next";
import { AuthFrame } from "@/components/brand/AuthFrame";
import { OmegaSignUp } from "@/components/auth/clerk-ui";

export const metadata: Metadata = { title: "Create account" };

export default function SignupPage() {
  return (
    <AuthFrame>
      <OmegaSignUp />
    </AuthFrame>
  );
}


