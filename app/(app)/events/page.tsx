import type { Metadata } from "next";
import { EventCard } from "@/components/events/EventCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { requireUser } from "@/lib/auth";
import { getRepository } from "@/lib/data";

export const metadata: Metadata = { title: "Events" };

export default async function EventsPage() {
  await requireUser();
  const repo = getRepository();
  const [events, rsvps] = await Promise.all([
    repo.listEvents(true),
    repo.listRsvps(),
  ]);

  return (
    <div>
      <PageHeader
        eyebrow="Coordination"
        title="Events"
        description="Workshops, talks, and chapter meetings."
      />
      <div className="grid gap-3 md:grid-cols-2">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            rsvpCount={rsvps.filter((rsvp) => rsvp.eventId === event.id).length}
          />
        ))}
      </div>
    </div>
  );
}
