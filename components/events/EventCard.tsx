import Link from "next/link";
import { formatWhen } from "@/lib/format";
import type { ChapterEvent } from "@/types";

const kindLabel = {
  workshop: "Workshop",
  talk: "Talk",
  meeting: "Meeting",
};

export function EventCard({ event, rsvpCount }: { event: ChapterEvent; rsvpCount?: number }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-forest">{kindLabel[event.kind]}</p>
        {!event.published ? (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-muted">Draft</span>
        ) : null}
      </div>
      <h2 className="mt-2 text-lg font-semibold text-ucu-blue">
        <Link href={`/events/${event.id}`} className="hover:underline">
          {event.title}
        </Link>
      </h2>
      <p className="mt-2 line-clamp-3 text-sm text-muted">{event.description}</p>
      <p className="mt-3 text-sm text-ink">{formatWhen(event.startsAt)}</p>
      <p className="text-sm text-muted">{event.location}</p>
      {typeof rsvpCount === "number" ? (
        <p className="mt-2 text-xs font-medium text-forest">{rsvpCount} RSVPs</p>
      ) : null}
    </article>
  );
}
