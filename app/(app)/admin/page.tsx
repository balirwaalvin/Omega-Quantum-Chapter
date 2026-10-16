import type { Metadata } from "next";
import Link from "next/link";
import { saveSpotlight } from "@/lib/actions/content";
import { AdminNav } from "@/components/admin/AdminNav";
import { PageHeader } from "@/components/ui/PageHeader";
import { requireStaff } from "@/lib/auth";
import { getRepository } from "@/lib/data";

export const metadata: Metadata = { title: "Admin" };

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  const session = await requireStaff();
  const { notice } = await searchParams;
  const repo = getRepository();
  const [stats, spotlight] = await Promise.all([repo.stats(), repo.getActiveSpotlight()]);

  return (
    <div>
      <PageHeader
        eyebrow={session.role === "admin" ? "Admin" : "Officer"}
        title="Chapter dashboard"
        description="Membership, RSVPs, popular resources, and quiz completion."
      />
      <AdminNav />
      {notice === "admins-only" ? (
        <p className="mb-4 text-sm text-magenta" role="alert">
          Only admins can change member roles.
        </p>
      ) : null}
      <section className="grid gap-3 sm:grid-cols-3">
        <article className="rounded-2xl bg-ucu-blue p-4 text-white">
          <p className="text-xs uppercase tracking-wide text-blue-100">Members</p>
          <p className="mt-2 text-3xl font-semibold">{stats.totalMembers}</p>
          <p className="text-sm text-blue-100">{stats.activeMembers} active</p>
        </article>
        <article className="rounded-2xl bg-forest p-4 text-white">
          <p className="text-xs uppercase tracking-wide text-green-100">Event RSVPs</p>
          <p className="mt-2 text-3xl font-semibold">{stats.rsvpCount}</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Shortcuts</p>
          <div className="mt-2 flex flex-col gap-1 text-sm font-semibold text-ucu-blue">
            <Link href="/admin/events">Events</Link>
            <Link href="/admin/resources">Resources</Link>
            <Link href="/admin/quizzes">Quizzes</Link>
            <Link href="/admin/moderation">Moderation</Link>
          </div>
        </article>
      </section>
      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <h2 className="font-semibold text-ucu-blue">Popular resources</h2>
          <ul className="mt-2 space-y-2 text-sm">
            {stats.popularResources.map((resource) => (
              <li key={resource.id} className="flex justify-between rounded-xl bg-white px-3 py-2">
                <span>{resource.title}</span>
                <span className="text-muted">{resource.views}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-semibold text-ucu-blue">Quiz completion</h2>
          <ul className="mt-2 space-y-2 text-sm">
            {stats.quizCompletion.map((quiz) => (
              <li key={quiz.quizId} className="rounded-xl bg-white px-3 py-2">
                <p>{quiz.title}</p>
                <p className="text-muted">
                  {quiz.completions} attempts · {Math.round(quiz.rate * 100)}% of active members
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <form action={saveSpotlight} className="mt-8 grid max-w-xl gap-3 rounded-2xl border border-gold bg-white p-4">
        <h2 className="font-semibold text-ucu-blue">Quantum of the Week</h2>
        <label className="grid gap-1 text-sm font-medium">
          Title
          <input name="title" required defaultValue={spotlight?.title ?? ""} className="field" />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Summary
          <textarea name="summary" rows={3} defaultValue={spotlight?.summary ?? ""} className="field" />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Link
          <input name="href" defaultValue={spotlight?.href ?? "/playground"} className="field" />
        </label>
        <button type="submit" className="btn w-fit">
          Publish spotlight
        </button>
      </form>
    </div>
  );
}
