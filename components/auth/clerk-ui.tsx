"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignIn, useSignUp } from "@clerk/nextjs/legacy";
import { useUser, useClerk } from "@clerk/nextjs";

export const omegaAppearance = {
  variables: {
    colorPrimary: "#2767b9",
    colorText: "#0f172a",
    colorBackground: "#ffffff",
    colorInputBackground: "#f7fbfc",
    colorDanger: "#b5004f",
    colorSuccess: "#1B5E20",
    borderRadius: "0.375rem",
    fontFamily: "Inter, Roboto, sans-serif",
  },
};

function getClerkErrorMessage(err: unknown, fallback: string): string {
  if (
    typeof err === "object" &&
    err !== null &&
    "errors" in err &&
    Array.isArray((err as { errors?: unknown[] }).errors)
  ) {
    const first = (
      err as { errors: Array<{ longMessage?: string; message?: string }> }
    ).errors[0];
    if (first?.longMessage) return first.longMessage;
    if (first?.message) return first.message;
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

export function OmegaSignIn() {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const { isLoaded: isUserLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  const [signingOut, setSigningOut] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"credentials" | "code">("credentials");
  const [factorType, setFactorType] = useState<"first" | "second">("first");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"github" | "linkedin" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function handleOAuth(strategy: "oauth_github" | "oauth_linkedin_oidc" | "oauth_linkedin") {
    if (!isLoaded || !signIn) return;
    const provider = strategy === "oauth_github" ? "github" : "linkedin";
    setOauthLoading(provider);
    setError(null);
    try {
      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (err: unknown) {
      const errObj = err as { errors?: Array<{ code?: string; message?: string }> } | null;
      const isAlreadySignedIn =
        errObj?.errors?.some(
          (e) =>
            e.code === "session_exists" ||
            e.message?.toLowerCase().includes("already signed in"),
        ) || (err instanceof Error && err.message.toLowerCase().includes("already signed in"));

      if (isAlreadySignedIn) {
        try {
          await signOut();
          await signIn.authenticateWithRedirect({
            strategy,
            redirectUrl: "/sso-callback",
            redirectUrlComplete: "/dashboard",
          });
          return;
        } catch {
          // fallback to error display
        }
      }

      if (strategy === "oauth_linkedin_oidc") {
        try {
          await signIn.authenticateWithRedirect({
            strategy: "oauth_linkedin",
            redirectUrl: "/sso-callback",
            redirectUrlComplete: "/dashboard",
          });
          return;
        } catch (innerErr) {
          setOauthLoading(null);
          setError(getClerkErrorMessage(innerErr, "Social sign-in failed."));
          return;
        }
      }
      setOauthLoading(null);
      setError(getClerkErrorMessage(err, "Social sign-in failed."));
    }
  }

  async function handleSendEmailCode() {
    if (!isLoaded || !signIn) return;
    const trimmed = email.trim();
    if (!trimmed) {
      setError("Please enter your UCU email address first.");
      return;
    }
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      const attempt = await signIn.create({ identifier: trimmed });
      const emailCodeFactor = attempt.supportedFirstFactors?.find(
        (factor) => factor.strategy === "email_code",
      );
      if (emailCodeFactor && "emailAddressId" in emailCodeFactor) {
        await signIn.prepareFirstFactor({
          strategy: "email_code",
          emailAddressId: emailCodeFactor.emailAddressId,
        });
        setFactorType("first");
        setStep("code");
        setInfo(`Verification code sent to ${trimmed}`);
      } else {
        setError("Email code sign-in is not available for this account. Enter your password.");
      }
    } catch (err) {
      setError(getClerkErrorMessage(err, "Unable to send verification code."));
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitCredentials(event: FormEvent) {
    event.preventDefault();
    if (!isLoaded || !signIn) return;

    const trimmed = email.trim();
    if (!trimmed) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      await handleSendEmailCode();
      return;
    }

    setLoading(true);
    setError(null);
    setInfo(null);

    try {
      // Direct Administrator authentication for admin@omega.ug & Admin@411
      if (trimmed.toLowerCase() === "admin@omega.ug") {
        const adminRes = await fetch("/api/auth/admin-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: trimmed, password }),
        });
        const adminData = await adminRes.json();
        if (!adminRes.ok) {
          setError(adminData.error || "Invalid administrator credentials.");
          setLoading(false);
          return;
        }

        try {
          const ticketResult = await signIn.create({
            strategy: "ticket",
            ticket: adminData.token,
          });

          if (ticketResult.status === "complete") {
            await setActive({ session: ticketResult.createdSessionId });
            router.push("/admin");
            return;
          }
        } catch (ticketErr: unknown) {
          const errObj = ticketErr as { errors?: Array<{ code?: string; message?: string }> } | null;
          const isSessionExists =
            errObj?.errors?.some(
              (e) =>
                e.code === "session_exists" ||
                e.message?.toLowerCase().includes("already signed in"),
            ) ||
            (ticketErr instanceof Error &&
              ticketErr.message.toLowerCase().includes("already signed in"));

          if (isSessionExists) {
            await signOut();
            const retryRes = await fetch("/api/auth/admin-login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: trimmed, password }),
            });
            const retryData = await retryRes.json();
            if (retryRes.ok && retryData.token) {
              const retryTicket = await signIn.create({
                strategy: "ticket",
                ticket: retryData.token,
              });
              if (retryTicket.status === "complete") {
                await setActive({ session: retryTicket.createdSessionId });
                router.push("/admin");
                return;
              }
            }
          }
          throw ticketErr;
        }
      }

      const result = await signIn.create({
        identifier: trimmed,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        const target = trimmed.toLowerCase() === "admin@omega.ug" ? "/admin" : "/dashboard";
        router.push(target);
        return;
      }

      if (result.status === "needs_first_factor") {
        const emailCodeFactor = result.supportedFirstFactors?.find(
          (factor) => factor.strategy === "email_code",
        );
        if (emailCodeFactor && "emailAddressId" in emailCodeFactor) {
          await signIn.prepareFirstFactor({
            strategy: "email_code",
            emailAddressId: emailCodeFactor.emailAddressId,
          });
          setFactorType("first");
          setStep("code");
          setInfo(`Verification code sent to ${trimmed}`);
          return;
        }
      }

      if (result.status === "needs_second_factor") {
        const emailSecond = result.supportedSecondFactors?.find(
          (factor) => factor.strategy === "email_code",
        );
        if (emailSecond) {
          await signIn.prepareSecondFactor({ strategy: "email_code" });
        }
        setFactorType("second");
        setStep("code");
        setInfo("Enter your two-factor authentication code.");
        return;
      }

      setError("Additional verification is required to complete sign-in.");
    } catch (err: unknown) {
      const errObj = err as { errors?: Array<{ code?: string; message?: string }> } | null;
      const isAlreadySignedIn =
        errObj?.errors?.some(
          (e) =>
            e.code === "session_exists" ||
            e.message?.toLowerCase().includes("already signed in"),
        ) ||
        (err instanceof Error &&
          err.message.toLowerCase().includes("already signed in"));

      if (isAlreadySignedIn) {
        try {
          await signOut();
          const retryResult = await signIn.create({
            identifier: trimmed,
            password,
          });
          if (retryResult.status === "complete") {
            await setActive({ session: retryResult.createdSessionId });
            const target =
              trimmed.toLowerCase() === "admin@omega.ug"
                ? "/admin"
                : "/dashboard";
            router.push(target);
            return;
          }
        } catch {
          setError("You're already signed in with an active session.");
          return;
        }
      }

      setError(getClerkErrorMessage(err, "Invalid email or password."));
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyCode(event: FormEvent) {
    event.preventDefault();
    if (!isLoaded || !signIn) return;
    const trimmedCode = code.trim();
    if (!trimmedCode) {
      setError("Enter the verification code.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result =
        factorType === "first"
          ? await signIn.attemptFirstFactor({
              strategy: "email_code",
              code: trimmedCode,
            })
          : await signIn.attemptSecondFactor({
              strategy: "email_code",
              code: trimmedCode,
            });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        const target = email.trim().toLowerCase() === "admin@omega.ug" ? "/admin" : "/dashboard";
        router.push(target);
        return;
      }

      setError("Verification incomplete. Please check your code.");
    } catch (err) {
      setError(getClerkErrorMessage(err, "Invalid or expired verification code."));
    } finally {
      setLoading(false);
    }
  }

  if (isUserLoaded && isSignedIn && user) {
    const userEmail =
      user.primaryEmailAddress?.emailAddress ??
      user.username ??
      "your account";
    const isAdmin =
      userEmail.toLowerCase() === "admin@omega.ug" ||
      user.publicMetadata?.role === "admin";

    return (
      <div className="w-full text-center space-y-4">
        <div className="rounded-[6px] border border-[#2767b9]/40 bg-[#001738]/80 p-4 text-left shadow-inner">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-300">
            Currently Signed In
          </p>
          <p className="mt-1 font-bold text-white text-sm truncate">{userEmail}</p>
          {user.fullName && (
            <p className="text-xs text-slate-300 mt-0.5">{user.fullName}</p>
          )}
        </div>

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => router.push(isAdmin ? "/admin" : "/dashboard")}
            className="w-full rounded-[6px] bg-[#2767b9] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-[#1f569d]"
          >
            Continue to {isAdmin ? "Admin Panel" : "Dashboard"} &rarr;
          </button>

          <button
            type="button"
            disabled={signingOut}
            onClick={async () => {
              setSigningOut(true);
              try {
                await signOut();
                router.refresh();
              } finally {
                setSigningOut(false);
              }
            }}
            className="w-full rounded-[6px] border border-slate-400/40 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            {signingOut ? "Signing out..." : "Sign out & Switch Account"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full text-left">
      {error ? (
        <div
          role="alert"
          className="mb-3 rounded-[5px] border border-[#b5004f]/60 bg-[#b5004f]/20 px-3 py-2 text-center text-xs font-medium text-pink-100"
        >
          <p>{error}</p>
          {error.toLowerCase().includes("already signed in") && (
            <div className="mt-2.5 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="rounded-[4px] bg-[#2767b9] px-2.5 py-1 text-[11px] font-bold text-white transition hover:bg-[#1f569d]"
              >
                Go to Dashboard
              </button>
              <button
                type="button"
                onClick={async () => {
                  await signOut();
                  setError(null);
                  router.refresh();
                }}
                className="rounded-[4px] border border-pink-300/40 bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white transition hover:bg-white/20"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      ) : null}

      {info ? (
        <div className="mb-3 rounded-[5px] border border-[#2767b9]/60 bg-[#2767b9]/20 px-3 py-2 text-center text-xs font-medium text-blue-100">
          {info}
        </div>
      ) : null}

      {step === "credentials" ? (
        <>
          <form onSubmit={handleSubmitCredentials} className="space-y-3">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
            </div>
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="Username or UCU email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-[6px] bg-[#f7fbfc] py-2.5 pr-3 pl-9.5 text-xs font-medium text-slate-900 placeholder:text-slate-500 focus:bg-white focus:outline-2 focus:outline-[#2767b9]"
            />
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
              </svg>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-[6px] bg-[#f7fbfc] py-2.5 pr-14 pl-9.5 text-xs font-medium text-slate-900 placeholder:text-slate-500 focus:bg-white focus:outline-2 focus:outline-[#2767b9]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-2 my-auto h-fit px-1.5 py-0.5 text-[10px] font-bold uppercase text-[#2767b9] hover:text-[#012e4a]"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handleSendEmailCode}
              disabled={loading}
              className="text-[11px] font-medium text-[#7fb3ff] hover:text-white hover:underline"
            >
              Sign in with email code
            </button>
            <button
              type="submit"
              disabled={loading || !isLoaded}
              className="rounded-[6px] bg-[#2767b9] px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-[#1f569d] disabled:opacity-50"
            >
              {loading ? "Wait..." : "Sign In"}
            </button>
          </div>
        </form>

        <div className="my-3.5 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/15" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">or</span>
          <div className="h-px flex-1 bg-white/15" />
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => handleOAuth("oauth_github")}
            disabled={!isLoaded || loading || oauthLoading !== null}
            className="group relative inline-flex cursor-pointer items-center justify-center gap-2 rounded-[6px] border border-slate-300/80 bg-[#f7fbfc] px-3 py-2.5 text-xs font-semibold text-slate-900 shadow-sm transition-all duration-150 hover:scale-[1.02] hover:border-slate-400 hover:bg-white hover:shadow-md active:scale-[0.96] active:bg-slate-200 active:shadow-inner disabled:cursor-not-allowed disabled:opacity-50"
          >
            {oauthLoading === "github" ? (
              <>
                <svg
                  className="h-3.5 w-3.5 animate-spin text-slate-800 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                <span className="font-bold text-slate-800">Connecting...</span>
              </>
            ) : (
              <>
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 fill-current shrink-0 transition-transform group-hover:scale-110"
                  aria-hidden="true"
                >
                  <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.92.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.38-3.88-1.38-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
                </svg>
                <span>GitHub</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => handleOAuth("oauth_linkedin_oidc")}
            disabled={!isLoaded || loading || oauthLoading !== null}
            className="group relative inline-flex cursor-pointer items-center justify-center gap-2 rounded-[6px] border border-slate-300/80 bg-[#f7fbfc] px-3 py-2.5 text-xs font-semibold text-slate-900 shadow-sm transition-all duration-150 hover:scale-[1.02] hover:border-slate-400 hover:bg-white hover:shadow-md active:scale-[0.96] active:bg-slate-200 active:shadow-inner disabled:cursor-not-allowed disabled:opacity-50"
          >
            {oauthLoading === "linkedin" ? (
              <>
                <svg
                  className="h-3.5 w-3.5 animate-spin text-[#0A66C2] shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                <span className="font-bold text-[#0A66C2]">Connecting...</span>
              </>
            ) : (
              <>
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 fill-[#0A66C2] shrink-0 transition-transform group-hover:scale-110"
                  aria-hidden="true"
                >
                  <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
                </svg>
                <span>LinkedIn</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-3.5 text-center text-xs text-slate-300">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-[#7fb3ff] hover:text-white hover:underline"
          >
            Create account
          </Link>
        </div>
      </>
    ) : (
        <form onSubmit={handleVerifyCode} className="space-y-2.5">
          <input
            type="text"
            inputMode="numeric"
            required
            placeholder="6-digit verification code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full rounded-[5px] bg-[#f7fbfc] px-3 py-2 text-center font-mono text-sm font-bold tracking-[0.25em] text-slate-900 placeholder:font-sans placeholder:text-xs placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-500 focus:outline-2 focus:outline-[#2767b9]"
          />
          <div className="flex items-center justify-between pt-0.5">
            <button
              type="button"
              onClick={() => {
                setStep("credentials");
                setCode("");
                setError(null);
                setInfo(null);
              }}
              className="text-[11px] font-medium text-slate-300 hover:text-white"
            >
              &larr; Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-[5px] bg-[#2767b9] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-[#1f569d] disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export function OmegaSignUp() {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const { isLoaded: isUserLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  const [signingOut, setSigningOut] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"register" | "verify">("register");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"github" | "linkedin" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleOAuth(strategy: "oauth_github" | "oauth_linkedin_oidc" | "oauth_linkedin") {
    if (!isLoaded || !signUp) return;
    const provider = strategy === "oauth_github" ? "github" : "linkedin";
    setOauthLoading(provider);
    setError(null);
    try {
      await signUp.authenticateWithRedirect({
        strategy,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (err: unknown) {
      const errObj = err as { errors?: Array<{ code?: string; message?: string }> } | null;
      const isAlreadySignedIn =
        errObj?.errors?.some(
          (e) =>
            e.code === "session_exists" ||
            e.message?.toLowerCase().includes("already signed in"),
        ) || (err instanceof Error && err.message.toLowerCase().includes("already signed in"));

      if (isAlreadySignedIn) {
        try {
          await signOut();
          await signUp.authenticateWithRedirect({
            strategy,
            redirectUrl: "/sso-callback",
            redirectUrlComplete: "/dashboard",
          });
          return;
        } catch {
          // fallback
        }
      }

      if (strategy === "oauth_linkedin_oidc") {
        try {
          await signUp.authenticateWithRedirect({
            strategy: "oauth_linkedin",
            redirectUrl: "/sso-callback",
            redirectUrlComplete: "/dashboard",
          });
          return;
        } catch (innerErr) {
          setOauthLoading(null);
          setError(getClerkErrorMessage(innerErr, "Social sign-up failed."));
          return;
        }
      }
      setOauthLoading(null);
      setError(getClerkErrorMessage(err, "Social sign-up failed."));
    }
  }

  async function handleRegister(event: FormEvent) {
    event.preventDefault();
    if (!isLoaded || !signUp) return;

    setLoading(true);
    setError(null);

    try {
      const result = await signUp.create({
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
        emailAddress: email.trim(),
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
        return;
      }

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setStep("verify");
    } catch (err: unknown) {
      const errObj = err as { errors?: Array<{ code?: string; message?: string }> } | null;
      const isAlreadySignedIn =
        errObj?.errors?.some(
          (e) =>
            e.code === "session_exists" ||
            e.message?.toLowerCase().includes("already signed in"),
        ) ||
        (err instanceof Error &&
          err.message.toLowerCase().includes("already signed in"));

      if (isAlreadySignedIn) {
        try {
          await signOut();
          const retryResult = await signUp.create({
            firstName: firstName.trim() || undefined,
            lastName: lastName.trim() || undefined,
            emailAddress: email.trim(),
            password,
          });
          if (retryResult.status === "complete") {
            await setActive({ session: retryResult.createdSessionId });
            router.push("/dashboard");
            return;
          }
          await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
          setStep("verify");
          return;
        } catch {
          setError("You're already signed in with an active session.");
          return;
        }
      }

      setError(getClerkErrorMessage(err, "Unable to create account."));
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(event: FormEvent) {
    event.preventDefault();
    if (!isLoaded || !signUp) return;

    setLoading(true);
    setError(null);

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: code.trim(),
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
        return;
      }

      setError("Verification incomplete. Check the code sent to your email.");
    } catch (err) {
      setError(getClerkErrorMessage(err, "Invalid verification code."));
    } finally {
      setLoading(false);
    }
  }

  if (isUserLoaded && isSignedIn && user) {
    const userEmail =
      user.primaryEmailAddress?.emailAddress ??
      user.username ??
      "your account";
    const isAdmin =
      userEmail.toLowerCase() === "admin@omega.ug" ||
      user.publicMetadata?.role === "admin";

    return (
      <div className="w-full text-center space-y-4">
        <div className="rounded-[6px] border border-[#2767b9]/40 bg-[#001738]/80 p-4 text-left shadow-inner">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-300">
            Currently Signed In
          </p>
          <p className="mt-1 font-bold text-white text-sm truncate">{userEmail}</p>
          {user.fullName && (
            <p className="text-xs text-slate-300 mt-0.5">{user.fullName}</p>
          )}
        </div>

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => router.push(isAdmin ? "/admin" : "/dashboard")}
            className="w-full rounded-[6px] bg-[#2767b9] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-[#1f569d]"
          >
            Continue to {isAdmin ? "Admin Panel" : "Dashboard"} &rarr;
          </button>

          <button
            type="button"
            disabled={signingOut}
            onClick={async () => {
              setSigningOut(true);
              try {
                await signOut();
                router.refresh();
              } finally {
                setSigningOut(false);
              }
            }}
            className="w-full rounded-[6px] border border-slate-400/40 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            {signingOut ? "Signing out..." : "Sign out & Create New Account"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full text-left">
      {error ? (
        <div
          role="alert"
          className="mb-3 rounded-[5px] border border-[#b5004f]/60 bg-[#b5004f]/20 px-3 py-2 text-center text-xs font-medium text-pink-100"
        >
          <p>{error}</p>
          {error.toLowerCase().includes("already signed in") && (
            <div className="mt-2.5 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="rounded-[4px] bg-[#2767b9] px-2.5 py-1 text-[11px] font-bold text-white transition hover:bg-[#1f569d]"
              >
                Go to Dashboard
              </button>
              <button
                type="button"
                onClick={async () => {
                  await signOut();
                  setError(null);
                  router.refresh();
                }}
                className="rounded-[4px] border border-pink-300/40 bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white transition hover:bg-white/20"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      ) : null}

      {step === "register" ? (
        <form onSubmit={handleRegister} className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-[5px] bg-[#f7fbfc] px-2.5 py-2 text-xs font-medium text-slate-900 placeholder:text-slate-500 focus:outline-2 focus:outline-[#2767b9]"
            />
            <input
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-[5px] bg-[#f7fbfc] px-2.5 py-2 text-xs font-medium text-slate-900 placeholder:text-slate-500 focus:outline-2 focus:outline-[#2767b9]"
            />
          </div>

          <input
            type="email"
            required
            autoComplete="email"
            placeholder="Student Email (@students.ucu.ac.ug)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-[5px] bg-[#f7fbfc] px-3 py-2 text-xs font-medium text-slate-900 placeholder:text-slate-500 focus:outline-2 focus:outline-[#2767b9]"
          />

          <input
            type="password"
            required
            autoComplete="new-password"
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-[5px] bg-[#f7fbfc] px-3 py-2 text-xs font-medium text-slate-900 placeholder:text-slate-500 focus:outline-2 focus:outline-[#2767b9]"
          />

          <div id="clerk-captcha" />

          <div className="flex justify-end pt-0.5">
            <button
              type="submit"
              disabled={loading || !isLoaded}
              className="w-full rounded-[5px] bg-[#2767b9] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-[#1f569d] disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="space-y-2.5">
          <p className="text-center text-xs text-slate-200">
            Enter the code sent to <strong className="text-white">{email}</strong>
          </p>
          <input
            type="text"
            inputMode="numeric"
            required
            placeholder="6-digit verification code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full rounded-[5px] bg-[#f7fbfc] px-3 py-2 text-center font-mono text-sm font-bold tracking-[0.25em] text-slate-900 placeholder:font-sans placeholder:text-xs placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-500 focus:outline-2 focus:outline-[#2767b9]"
          />
          <div className="flex items-center justify-between pt-0.5">
            <button
              type="button"
              onClick={() => setStep("register")}
              className="text-[11px] font-medium text-slate-300 hover:text-white"
            >
              &larr; Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-[5px] bg-[#2767b9] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-[#1f569d] disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify Email"}
            </button>
          </div>
        </form>
      )}

      <div className="mt-3 grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => handleOAuth("oauth_github")}
          disabled={!isLoaded || loading || oauthLoading !== null}
          className="group relative inline-flex cursor-pointer items-center justify-center gap-2 rounded-[6px] border border-slate-300/80 bg-[#f7fbfc] px-3 py-2.5 text-xs font-semibold text-slate-900 shadow-sm transition-all duration-150 hover:scale-[1.02] hover:border-slate-400 hover:bg-white hover:shadow-md active:scale-[0.96] active:bg-slate-200 active:shadow-inner disabled:cursor-not-allowed disabled:opacity-50"
        >
          {oauthLoading === "github" ? (
            <>
              <svg
                className="h-3.5 w-3.5 animate-spin text-slate-800 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              <span className="font-bold text-slate-800">Connecting...</span>
            </>
          ) : (
            <>
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 fill-current shrink-0 transition-transform group-hover:scale-110"
                aria-hidden="true"
              >
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.92.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.38-3.88-1.38-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
              </svg>
              <span>GitHub</span>
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => handleOAuth("oauth_linkedin_oidc")}
          disabled={!isLoaded || loading || oauthLoading !== null}
          className="group relative inline-flex cursor-pointer items-center justify-center gap-2 rounded-[6px] border border-slate-300/80 bg-[#f7fbfc] px-3 py-2.5 text-xs font-semibold text-slate-900 shadow-sm transition-all duration-150 hover:scale-[1.02] hover:border-slate-400 hover:bg-white hover:shadow-md active:scale-[0.96] active:bg-slate-200 active:shadow-inner disabled:cursor-not-allowed disabled:opacity-50"
        >
          {oauthLoading === "linkedin" ? (
            <>
              <svg
                className="h-3.5 w-3.5 animate-spin text-[#0A66C2] shrink-0"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              <span className="font-bold text-[#0A66C2]">Connecting...</span>
            </>
          ) : (
            <>
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 fill-[#0A66C2] shrink-0 transition-transform group-hover:scale-110"
                aria-hidden="true"
              >
                <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
              </svg>
              <span>LinkedIn</span>
            </>
          )}
        </button>
      </div>

      <div
        className="mt-3.5 border-b-2 pb-2 text-center text-[11px] text-slate-300"
        style={{
          borderImageSlice: 1,
          borderImageSource: "linear-gradient(to right, #000 0%, #b5004f 100%)",
        }}
      >
        Already registered?{" "}
        <Link href="/login" className="font-semibold text-[#7fb3ff] hover:text-white">
          Sign in
        </Link>
      </div>
    </div>
  );
}
