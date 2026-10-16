import type { Metadata } from "next";
import Link from "next/link";
import { AnnouncementCard } from "@/components/announcements/AnnouncementCard";
import { EventCard } from "@/components/events/EventCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { RoleGate } from "@/components/RoleGate";
import { requireUser, staffOnly } from "@/lib/auth";
import { upcomingOrRecent } from "@/lib/format";
import { getRepository } from "@/lib/data";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  const session = await requireUser();
  const { notice } = await searchParams;
  const repo = getRepository();
  const [events, announcements, quizzes, attempts, spotlight, stats, resources] =
    await Promise.all([
      repo.listEvents(true),
      repo.listAnnouncements(true),
      repo.listQuizzes(true),
      repo.listAttempts(session.userId),
      repo.getActiveSpotlight(),
      staffOnly(session.role) ? repo.stats() : Promise.resolve(null),
      repo.listResources({ publishedOnly: true }),
    ]);

  const shownEvents = upcomingOrRecent(events);
  const started = new Set(attempts.map((attempt) => attempt.quizId));
  const progress = quizzes.length === 0 ? 0 : Math.round((started.size / quizzes.length) * 100);

  return (
    <div>
      <PageHeader
        eyebrow="Chapter home"
        title={`Hello, ${session.name.split(" ")[0] || "there"}`}
        description="Upcoming sessions, announcements, and your learning progress."
      />
      {notice === "forbidden" ? (
        <p className="mb-4 rounded-lg border border-magenta/30 bg-white px-3 py-2 text-sm text-magenta" role="alert">
          That area is for officers and admins.
        </p>
      ) : null}
      <section className="grid gap-3 sm:grid-cols-3">
        <article className="rounded-2xl bg-ucu-blue p-4 text-white">
          <p className="text-xs uppercase tracking-wide text-blue-100">Learning</p>
          <p className="mt-2 text-3xl font-semibold">{progress}%</p>
          <p className="text-sm text-blue-100">{started.size} of {quizzes.length} quizzes started</p>
        </article>
        <article className="rounded-2xl bg-forest p-4 text-white">
          <p className="text-xs uppercase tracking-wide text-green-100">Library</p>
          <p className="mt-2 text-3xl font-semibold">{resources.length}</p>
          <p className="text-sm text-green-100">Published resources</p>
        </article>
        <article className="rounded-2xl border border-gold bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-forest">Quick actions</p>
          <div className="mt-3 flex flex-col gap-2 text-sm font-semibold text-ucu-blue">
            <Link href="/events">Browse events</Link>
            <Link href="/playground">Open the playground</Link>
            <Link href="/learn">Continue learning</Link>
          </div>
        </article>
      </section>

      {spotlight ? (
        <section className="mt-6 rounded-2xl border border-gold bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-forest">Quantum of the Week</p>
          <h2 className="mt-1 text-xl font-semibold text-ucu-blue">{spotlight.title}</h2>
          <p className="mt-2 text-sm text-muted">{spotlight.summary}</p>
          <Link href={spotlight.href} className="btn mt-4">
            Open the demo
          </Link>
        </section>
      ) : null}

      <RoleGate role={session.role} allow={["officer", "admin"]}>
        {stats ? (
          <section className="mt-6" aria-labelledby="officer-heading">
          <h2 id="officer-heading" className="text-lg font-semibold text-ucu-blue">Officer snapshot</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-4">
            <Stat label="Members" value={String(stats.totalMembers)} />
            <Stat label="Active" value={String(stats.activeMembers)} />
            <Stat label="RSVPs" value={String(stats.rsvpCount)} />
            <Stat
              label="Top resource"
              value={stats.popularResources[0]?.title ?? "—"}
            />
          </div>
          <Link href="/admin" className="btn mt-4">
            Open admin dashboard
          </Link>
          </section>
        ) : null}
      </RoleGate>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-ucu-blue">Upcoming events</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {shownEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-3">
        <h2 className="text-lg font-semibold text-ucu-blue">Announcements</h2>
        {announcements.slice(0, 3).map((item) => (
          <AnnouncementCard key={item.id} item={item} />
        ))}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-3">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 line-clamp-2 text-lg font-semibold text-ucu-blue">{value}</p>
    </article>
  );
}
