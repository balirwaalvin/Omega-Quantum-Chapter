import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CommentThread } from "@/components/community/CommentThread";
import { rsvp } from "@/lib/actions/community";
import { requireUser, staffOnly } from "@/lib/auth";
import { formatWhen } from "@/lib/format";
import { getRepository } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const event = await getRepository().getEvent(id);
  return { title: event?.title ?? "Event" };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireUser();
  const { id } = await params;
  const repo = getRepository();
  const event = await repo.getEvent(id);
  if (!event || (!event.published && !staffOnly(session.role))) notFound();

  const [rsvps, comments, users] = await Promise.all([
    repo.listRsvps(id),
    repo.listComments({ targetType: "event", targetId: id }),
    repo.listUsers(),
  ]);
  const mine = rsvps.find((entry) => entry.userId === session.userId);

  return (
    <article>
      <p className="text-xs font-semibold uppercase tracking-wide text-forest">{event.kind}</p>
      <h1 className="mt-1 text-3xl font-semibold text-ucu-blue">{event.title}</h1>
      <p className="mt-3 text-sm text-ink">
        {formatWhen(event.startsAt)} – {formatWhen(event.endsAt)}
      </p>
      <p className="text-sm text-muted">{event.location}</p>
      <p className="mt-4 whitespace-pre-wrap text-sm leading-7">{event.description}</p>
      <p className="mt-4 text-sm font-medium text-forest">{rsvps.length} RSVPs</p>
      {mine ? <p className="text-sm text-muted">You replied: {mine.status}.</p> : null}
      <form action={rsvp} className="mt-4 flex flex-wrap gap-2">
        <input type="hidden" name="eventId" value={event.id} />
        <button className="btn" type="submit" name="status" value="going">
          RSVP going
        </button>
        <button className="btn-secondary" type="submit" name="status" value="maybe">
          Maybe
        </button>
      </form>
      <CommentThread
        comments={comments}
        users={users}
        targetType="event"
        targetId={event.id}
        currentUserId={session.userId}
        staff={staffOnly(session.role)}
      />
    </article>
  );
}
