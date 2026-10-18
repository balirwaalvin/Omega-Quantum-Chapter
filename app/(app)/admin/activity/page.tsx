import type { Metadata } from "next";
import { AdminNav } from "@/components/admin/AdminNav";
import { ActivityLogViewer } from "@/components/admin/ActivityLogViewer";
import { PageHeader } from "@/components/ui/PageHeader";
import { requireStaff } from "@/lib/auth";
import { getRepository } from "@/lib/data";

export const metadata: Metadata = { title: "Activity Logs | Admin" };

export default async function AdminActivityPage() {
  await requireStaff();
  const repo = getRepository();
  const logs = await repo.listActivityLogs();

  return (
    <div>
      <PageHeader
        eyebrow="Admin Portal"
        title="Activity Logs"
        description="Audit trail of platform authentications, RSVP confirmations, quiz attempts, and administrative events."
      />
      <AdminNav />
      <ActivityLogViewer logs={logs} />
    </div>
  );
}
