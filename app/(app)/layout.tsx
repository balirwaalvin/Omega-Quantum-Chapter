import type { ReactNode } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { ensureProfile, requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireUser();
  await ensureProfile(session);

  return (
    <AppShell role={session.role} name={session.name}>
      {children}
    </AppShell>
  );
}
