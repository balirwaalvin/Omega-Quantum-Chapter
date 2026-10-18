import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getRepository } from "@/lib/data";
import { canAccessChapter, isStaffRole, parseRole } from "@/lib/auth-shared";
import { displayName } from "@/lib/format";
import type { AppSession, Role } from "@/types";

export async function getAppSession(): Promise<AppSession | null> {
  const { userId } = await auth();
  if (!userId) return null;
  const user = await currentUser();
  if (!user) return null;

  const email = user.primaryEmailAddress?.emailAddress ?? "";
  const providers = user.externalAccounts.map((account) => account.provider);
  return {
    userId,
    email,
    name: displayName(
      [user.firstName, user.lastName].filter(Boolean).join(" "),
      email,
    ),
    imageUrl: user.imageUrl ?? "",
    role: parseRole(user.publicMetadata?.role, email),
    deactivated: user.publicMetadata?.deactivated === true || user.banned === true,
    providers,
  };
}

export async function requireUser(): Promise<AppSession> {
  const session = await getAppSession();
  if (!session) redirect("/login");
  if (!canAccessChapter({ email: session.email, providers: session.providers })) {
    redirect("/login?reason=domain");
  }
  if (session.deactivated) redirect("/login?reason=deactivated");
  return session;
}

export async function requireStaff(): Promise<AppSession> {
  const session = await requireUser();
  if (!isStaffRole(session.role)) redirect("/dashboard?notice=forbidden");
  return session;
}

export async function requireAdmin(): Promise<AppSession> {
  const session = await requireUser();
  if (session.role !== "admin") redirect("/admin?notice=admins-only");
  return session;
}

/** Keep the chapter directory aligned with Clerk even if the webhook is offline. */
export async function ensureProfile(session: AppSession) {
  const repo = getRepository();
  const existing = await repo.getUser(session.userId);
  if (!existing) {
    await repo.upsertUser({
      id: session.userId,
      email: session.email,
      name: session.name,
      imageUrl: session.imageUrl,
      program: "",
      yearOfStudy: 1,
      interests: [],
      bio: "",
      role: session.role,
      deactivated: session.deactivated,
      sample: false,
      createdAt: new Date().toISOString(),
    });
    return;
  }

  await repo.updateUser(session.userId, {
    email: session.email,
    name: session.name,
    imageUrl: session.imageUrl,
    role: session.role,
    deactivated: session.deactivated,
  });
}

export function staffOnly(role: Role) {
  return isStaffRole(role);
}
