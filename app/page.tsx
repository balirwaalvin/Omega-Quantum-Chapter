import { AuthFrame } from "@/components/brand/AuthFrame";
import { OmegaSignIn } from "@/components/auth/clerk-ui";

export default function HomePage() {
  return (
    <AuthFrame>
      <OmegaSignIn />
    </AuthFrame>
  );
}


