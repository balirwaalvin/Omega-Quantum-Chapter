import type { Role } from "@/types";

export const UCU_EMAIL_DOMAIN = "@students.ucu.ac.ug";

/**
 * Email sign-up and sign-in must use a UCU student address.
 * GitHub and LinkedIn may use whatever email is on that social account.
 * Set ALLOW_CLERK_TEST_EMAILS=true only for local Clerk test inboxes
 * (`name+clerk_test@example.com`, verification code 424242).
 */
export function isAllowedEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  if (normalized.endsWith(UCU_EMAIL_DOMAIN)) return true;
  if (
    process.env.ALLOW_CLERK_TEST_EMAILS === "true" &&
    normalized.endsWith("+clerk_test@example.com")
  ) {
    return true;
  }
  return false;
}

export function isOpenSocialProvider(provider: string): boolean {
  const value = provider.toLowerCase();
  return value.includes("github") || value.includes("linkedin");
}

/** Email must be a UCU student address, unless the user signed in with GitHub or LinkedIn. */
export function canAccessChapter(input: {
  email?: string | null;
  providers?: string[];
}): boolean {
  if (input.providers?.some(isOpenSocialProvider)) return true;
  return isAllowedEmail(input.email);
}

export function parseRole(value: unknown): Role {
  if (value === "officer" || value === "admin" || value === "member") {
    return value;
  }
  return "member";
}

export function isStaffRole(role: Role): boolean {
  return role === "officer" || role === "admin";
}
