import Link from "next/link";
import { formatWhen } from "@/lib/format";
import type { ChapterEvent } from "@/types";

const kindLabel = {
  workshop: "Workshop",
  talk: "Talk",
  meeting: "Meeting",
};

export function EventCard({
  event,
  rsvpCount,
}: {
  event: ChapterEvent;
  rsvpCount?: number;
}) {
  return (
    <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-forest">
          {kindLabel[event.kind]}
        </span>
        {!event.published ? (
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-muted">
            Draft
          </span>
        ) : null}
      </div>
      <h2 className="mt-3 text-lg font-semibold text-ucu-blue">
        <Link href={`/events/${event.id}`} className="hover:underline">
          {event.title}
        </Link>
      </h2>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-muted">
        {event.description}
      </p>
      <div className="mt-4 border-t border-slate-100 pt-3 text-xs">
        <p className="font-medium text-ink">{formatWhen(event.startsAt)}</p>
        <div className="mt-1 flex items-center justify-between gap-2 text-muted">
          <span>{event.location}</span>
          {typeof rsvpCount === "number" ? (
            <span className="font-semibold text-forest">{rsvpCount} RSVPs</span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
