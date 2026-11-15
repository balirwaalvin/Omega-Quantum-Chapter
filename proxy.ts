import { clerkClient, clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  canAccessChapter,
  isAllowedEmail,
  isStaffRole,
  parseRole,
} from "@/lib/auth-shared";

const PUBLIC_EXACT_PATHS = new Set([
  "/",
  "/about",
  "/offline",
  "/api/auth/admin-login",
  "/api/webhooks/clerk",
]);

const PUBLIC_PREFIX_PATHS = [
  "/login",
  "/signup",
  "/sso-callback",
  "/leaders",
];

function isPublicPathname(pathname: string): boolean {
  if (PUBLIC_EXACT_PATHS.has(pathname)) return true;
  return PUBLIC_PREFIX_PATHS.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function isAdminPathname(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

export default clerkMiddleware(
  async (auth, request) => {
    const { pathname } = request.nextUrl;
    if (isPublicPathname(pathname)) return;

    const session = await auth.protect();
    let email =
      typeof session.sessionClaims?.email === "string"
        ? session.sessionClaims.email
        : undefined;
    let providers: string[] = [];
    let role = parseRole(session.sessionClaims?.metadata?.role, email);
    let deactivated = session.sessionClaims?.metadata?.deactivated === true;
    const needsUser =
      !email || !session.sessionClaims?.metadata || !isAllowedEmail(email);

    if (needsUser) {
      const client = await clerkClient();
      const user = await client.users.getUser(session.userId);
      email = email ?? user.primaryEmailAddress?.emailAddress ?? undefined;
      providers = user.externalAccounts.map((account) => account.provider);
      if (!session.sessionClaims?.metadata) {
        role = parseRole(user.publicMetadata?.role, email);
        deactivated =
          user.publicMetadata?.deactivated === true || user.banned === true;
      }
    }

    if (!canAccessChapter({ email, providers }) || deactivated) {
      if (session.sessionId) {
        const client = await clerkClient();
        await client.sessions.revokeSession(session.sessionId);
      }
      const reason = deactivated ? "deactivated" : "domain";
      return NextResponse.redirect(
        new URL(`/login?reason=${reason}`, request.url),
      );
    }

    if (isAdminPathname(pathname) && !isStaffRole(role)) {
      return NextResponse.redirect(
        new URL("/dashboard?notice=forbidden", request.url),
      );
    }
  },
  {
    signInUrl: "/login",
    signUpUrl: "/signup",
  },
);

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
