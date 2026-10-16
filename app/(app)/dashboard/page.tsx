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
  const progress =
    quizzes.length === 0 ? 0 : Math.round((started.size / quizzes.length) * 100);

  return (
    <div>
      <PageHeader
        eyebrow="Omega Portal"
        title={`Welcome, ${session.name.split(" ")[0] || "Student"}`}
      />
      {notice === "forbidden" ? (
        <p
          className="mb-4 rounded-lg border border-magenta/30 bg-white px-3 py-2 text-xs font-medium text-magenta"
          role="alert"
        >
          Restricted to officers and admins.
        </p>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-3">
        <article className="alpha-sidenav-bg rounded-xl p-4 text-white shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#7fb3ff]">
            Progress
          </p>
          <p className="mt-1.5 text-2xl font-bold">{progress}%</p>
          <p className="mt-0.5 text-xs text-slate-300">
            {started.size} / {quizzes.length} quizzes
          </p>
        </article>
        <article className="rounded-xl bg-[#2767b9] p-4 text-white shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-blue-100">
            Library
          </p>
          <p className="mt-1.5 text-2xl font-bold">{resources.length}</p>
          <p className="mt-0.5 text-xs text-blue-100">Active modules</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-alpha-blue">
            Quick Launch
          </p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold">
            <Link href="/playground" className="btn-secondary py-1.5 px-2.5 text-xs">
              Circuit Lab
            </Link>
            <Link href="/bloch" className="btn-secondary py-1.5 px-2.5 text-xs">
              Bloch 3D
            </Link>
            <Link href="/learn" className="btn-secondary py-1.5 px-2.5 text-xs">
              Learn
            </Link>
          </div>
        </article>
      </section>

      {spotlight ? (
        <section className="alpha-card-frame mt-5">
          <div className=" flex flex-col justify-between gap-4 rounded-[8px] bg-white p-4 sm:flex-row sm:items-center sm:p-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-magenta">
                Quantum Spotlight
              </p>
              <h2 className="mt-0.5 text-base font-bold text-ucu-blue sm:text-lg">
                {spotlight.title}
              </h2>
              <p className="mt-1 text-xs text-muted sm:text-sm">
                {spotlight.summary}
              </p>
            </div>
            <Link href={spotlight.href} className="btn shrink-0">
              Open Demo
            </Link>
          </div>
        </section>
      ) : null}

      <RoleGate role={session.role} allow={["officer", "admin"]}>
        {stats ? (
          <section className="mt-6" aria-labelledby="officer-heading">
            <div className="flex items-center justify-between">
              <h2 id="officer-heading" className="text-sm font-bold uppercase tracking-wider text-ucu-blue">
                Admin Snapshot
              </h2>
              <Link href="/admin" className="text-xs font-semibold text-alpha-blue hover:underline">
                Manage &rarr;
              </Link>
            </div>
            <div className="mt-2.5 grid gap-3 sm:grid-cols-4">
              <Stat label="Members" value={String(stats.totalMembers)} />
              <Stat label="Active" value={String(stats.activeMembers)} />
              <Stat label="RSVPs" value={String(stats.rsvpCount)} />
              <Stat
                label="Top Module"
                value={stats.popularResources[0]?.title ?? "—"}
              />
            </div>
          </section>
        ) : null}
      </RoleGate>

      <section className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-ucu-blue">
            Upcoming Events
          </h2>
          <Link href="/events" className="text-xs font-semibold text-alpha-blue hover:underline">
            All events &rarr;
          </Link>
        </div>
        <div className="mt-2.5 grid gap-3 md:grid-cols-3">
          {shownEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      <section className="mt-6 grid gap-2.5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-ucu-blue">
          Announcements
        </h2>
        {announcements.slice(0, 3).map((item) => (
          <AnnouncementCard key={item.id} item={item} />
        ))}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
        {label}
      </p>
      <p className="mt-1 line-clamp-1 text-base font-bold text-ucu-blue">
        {value}
      </p>
    </article>
  );
}

