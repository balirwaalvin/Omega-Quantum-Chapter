import type { Metadata } from "next";
import { AnnouncementCard } from "@/components/announcements/AnnouncementCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { requireUser } from "@/lib/auth";
import { getRepository } from "@/lib/data";

export const metadata: Metadata = { title: "Announcements" };

export default async function AnnouncementsPage() {
  await requireUser();
  const items = await getRepository().listAnnouncements(true);

  return (
    <div>
      <PageHeader
        eyebrow="Coordination"
        title="Announcements"
        description="Officer posts, with priority flags for anything time-sensitive."
      />
      <div className="grid gap-3">
        {items.map((item) => (
          <AnnouncementCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
