import { SignIn, SignUp } from "@clerk/nextjs";

export const omegaAppearance = {
  variables: {
    colorPrimary: "#003087",
    colorText: "#0f172a",
    colorBackground: "#ffffff",
    colorInputBackground: "#f4f6f8",
    colorDanger: "#c2185b",
    colorSuccess: "#1B5E20",
    borderRadius: "0.75rem",
    fontFamily: "Inter, sans-serif",
  },
  elements: {
    card: "shadow-md border border-slate-200",
    headerTitle: "text-ucu-blue",
    formButtonPrimary: "bg-[#003087] hover:bg-[#1E3A8A]",
  },
};

export function OmegaSignIn() {
  return (
    <SignIn
      routing="path"
      path="/login"
      signUpUrl="/signup"
      fallbackRedirectUrl="/dashboard"
      appearance={omegaAppearance}
    />
  );
}

export function OmegaSignUp() {
  return (
    <SignUp
      routing="path"
      path="/signup"
      signInUrl="/login"
      fallbackRedirectUrl="/dashboard"
      appearance={omegaAppearance}
    />
  );
}
