import type { Metadata } from "next";
import Link from "next/link";
import { saveSpotlight } from "@/lib/actions/content";
import { AdminNav } from "@/components/admin/AdminNav";
import { PageHeader } from "@/components/ui/PageHeader";
import { requireStaff } from "@/lib/auth";
import { getRepository } from "@/lib/data";

export const metadata: Metadata = { title: "Admin Portal | OMEGA Quantum Chapter" };

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  const session = await requireStaff();
  const { notice } = await searchParams;
  const repo = getRepository();

  const [stats, spotlight, logs, users] = await Promise.all([
    repo.stats(),
    repo.getActiveSpotlight(),
    repo.listActivityLogs(),
    repo.listUsers(),
  ]);

  const recentLogs = logs.slice(0, 6);
  const recentUsers = users.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Page Header with Admin Identity Badge */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          eyebrow="Executive Administration"
          title="Chapter Control Center"
          description="Global membership oversight, live activity audit logs, and chapter engagement analytics."
        />
        <div className="flex items-center gap-2 self-start rounded-xl border border-blue-500/20 bg-blue-500/10 px-3.5 py-1.5 text-xs font-semibold text-[#003087]">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Root Admin: {session.email || "admin@omega.ug"}</span>
        </div>
      </div>

      <AdminNav />

      {notice === "admins-only" && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700" role="alert">
          Only administrators have authority to alter chapter member privileges.
        </div>
      )}

      {/* KPI Stats Ribbon */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Members */}
        <article className="rounded-2xl bg-[#003087] p-5 text-white shadow-xs">
          <div className="flex items-center justify-between text-blue-200">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Members</span>
            <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-bold">Accounts</span>
          </div>
          <p className="mt-2 text-3xl font-extrabold">{stats.totalMembers}</p>
          <div className="mt-2 flex items-center justify-between text-xs text-blue-100">
            <span>{stats.activeMembers} active status</span>
            <Link href="/admin/members" className="font-semibold underline hover:text-white">
              Manage &rarr;
            </Link>
          </div>
        </article>

        {/* Event RSVPs */}
        <article className="rounded-2xl bg-[#1B5E20] p-5 text-white shadow-xs">
          <div className="flex items-center justify-between text-emerald-200">
            <span className="text-[11px] font-bold uppercase tracking-wider">Event RSVPs</span>
            <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-bold">Attendance</span>
          </div>
          <p className="mt-2 text-3xl font-extrabold">{stats.rsvpCount}</p>
          <div className="mt-2 flex items-center justify-between text-xs text-emerald-100">
            <span>Commitments logged</span>
            <Link href="/admin/events" className="font-semibold underline hover:text-white">
              Events &rarr;
            </Link>
          </div>
        </article>

        {/* Circuit Simulations */}
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Circuit Simulations</span>
            <span className="rounded bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700">Lab</span>
          </div>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">{stats.circuitSimulations}</p>
          <p className="mt-2 text-xs text-slate-500">Playground &amp; Bloch executions</p>
        </article>

        {/* Announcements & Moderation */}
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Platform Health</span>
            <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">Online</span>
          </div>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">{stats.totalAnnouncements}</p>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
            <span>Broadcasts posted</span>
            <span className="font-semibold text-rose-600">{stats.pendingComments} to review</span>
          </div>
        </article>
      </section>

      {/* Analytics: Academic Programs & Module Engagement */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Program Demographics */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#003087]">
            Membership Demographics by Program
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">Distribution of registered chapter members across degree tracks.</p>

          <div className="mt-4 space-y-3">
            {stats.departmentBreakdown.map((item) => (
              <div key={item.department} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span className="truncate">{item.department}</span>
                  <span className="shrink-0 text-slate-500">{item.count} members ({item.percentage}%)</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-[#003087]"
                    style={{ width: `${Math.max(item.percentage, 8)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Module Engagement & Quiz Completion */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#003087]">
              Resource &amp; Quiz Analytics
            </h2>
            <Link href="/admin/resources" className="text-xs font-semibold text-[#003087] hover:underline">
              Library &rarr;
            </Link>
          </div>
          <p className="mt-0.5 text-xs text-slate-500">Student readership and assessment completion rates.</p>

          <div className="mt-4 space-y-3">
            {stats.popularResources.slice(0, 3).map((res) => (
              <div key={res.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 text-xs">
                <span className="font-semibold text-slate-800 truncate pr-2">{res.title}</span>
                <span className="shrink-0 rounded-md bg-white border border-slate-200 px-2 py-0.5 font-bold text-slate-600">
                  {res.views} reads
                </span>
              </div>
            ))}
            {stats.quizCompletion.slice(0, 2).map((quiz) => (
              <div key={quiz.quizId} className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 text-xs">
                <span className="font-semibold text-slate-800 truncate pr-2">{quiz.title}</span>
                <span className="shrink-0 rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 font-bold text-emerald-700">
                  {Math.round(quiz.rate * 100)}% pass rate
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chapter Members Table Preview */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#003087]">
              Chapter Members in App
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Showing recent member accounts ({users.length} total registered).
            </p>
          </div>
          <Link
            href="/admin/members"
            className="rounded-lg bg-[#003087] px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#002466]"
          >
            Manage All Members &rarr;
          </Link>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-600">
              <tr>
                <th className="px-3 py-2.5">Member Name</th>
                <th className="px-3 py-2.5">Email</th>
                <th className="px-3 py-2.5">Academic Program</th>
                <th className="px-3 py-2.5">Role</th>
                <th className="px-3 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-3 py-2.5 font-semibold text-slate-900">
                    {user.name}
                    {user.sample && (
                      <span className="ml-1.5 rounded bg-slate-100 px-1.5 py-0.2 text-[10px] text-slate-500">
                        Seed
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-slate-600">{user.email}</td>
                  <td className="px-3 py-2.5 text-slate-600">{user.program || "Computing & Tech"}</td>
                  <td className="px-3 py-2.5">
                    <span
                      className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                        user.role === "admin"
                          ? "bg-rose-100 text-rose-700"
                          : user.role === "officer"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                        user.deactivated ? "text-rose-600" : "text-emerald-600"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${user.deactivated ? "bg-rose-500" : "bg-emerald-500"}`} />
                      {user.deactivated ? "Deactivated" : "Active"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Real-time Activity Logs Stream */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#003087]">
              Live Activity Stream
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Chronological log of platform authentications, RSVP confirmations, and administrative events.
            </p>
          </div>
          <Link
            href="/admin/activity"
            className="text-xs font-semibold text-[#003087] hover:underline"
          >
            Full Activity Audit &rarr;
          </Link>
        </div>

        <div className="mt-4 divide-y divide-slate-100">
          {recentLogs.map((log) => (
            <div key={log.id} className="flex flex-col gap-1 py-3 text-xs sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2.5">
                <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700">
                  {log.category}
                </span>
                <span className="font-bold text-slate-900">{log.action}</span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-600">{log.details}</span>
              </div>
              <span className="text-[11px] font-medium text-slate-400 shrink-0">
                {new Date(log.timestamp).toLocaleString("en-UG", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Admin Privileges: Quantum of the Week Spotlight Publisher */}
      <section className="rounded-2xl border border-amber-300/80 bg-amber-50/40 p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
              Executive Privilege
            </span>
            <h2 className="text-base font-bold text-[#003087]">
              Quantum Spotlight Publisher
            </h2>
            <p className="mt-0.5 text-xs text-slate-600">
              Feature an interactive quantum circuit, research paper, or module directly on all student member dashboards.
            </p>
          </div>
        </div>

        <form action={saveSpotlight} className="mt-4 grid gap-3 sm:grid-cols-3">
          <label className="grid gap-1 text-xs font-bold text-slate-700 sm:col-span-1">
            Spotlight Title
            <input
              name="title"
              required
              defaultValue={spotlight?.title ?? "Variational Quantum Eigensolver (VQE)"}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900"
              placeholder="e.g. Bloch Sphere Visualizer"
            />
          </label>

          <label className="grid gap-1 text-xs font-bold text-slate-700 sm:col-span-1">
            Target Route / Link
            <input
              name="href"
              defaultValue={spotlight?.href ?? "/playground"}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900"
              placeholder="/playground or /bloch"
            />
          </label>

          <div className="flex items-end sm:col-span-1">
            <button
              type="submit"
              className="w-full rounded-lg bg-[#003087] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#002466] transition"
            >
              Publish to Student Dashboards
            </button>
          </div>

          <label className="grid gap-1 text-xs font-bold text-slate-700 sm:col-span-3">
            Summary Description
            <textarea
              name="summary"
              rows={2}
              defaultValue={spotlight?.summary ?? "Explore molecular ground state calculations using interactive parameterized circuits."}
              className="rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900"
              placeholder="Brief summary displayed to members on the dashboard..."
            />
          </label>
        </form>
      </section>

      {/* Admin Quick Action Shortcuts */}
      <section className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
        <Link
          href="/admin/events"
          className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-[#003087] transition"
        >
          <span className="text-xs font-bold text-[#003087]">Schedule Event &rarr;</span>
          <span className="mt-1 text-[11px] text-slate-500">Create workshop, talk, or study circle</span>
        </Link>
        <Link
          href="/admin/announcements"
          className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-[#003087] transition"
        >
          <span className="text-xs font-bold text-[#003087]">Broadcast Announcement &rarr;</span>
          <span className="mt-1 text-[11px] text-slate-500">Post high-priority notices to all members</span>
        </Link>
        <Link
          href="/admin/resources"
          className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-[#003087] transition"
        >
          <span className="text-xs font-bold text-[#003087]">Library Modules &rarr;</span>
          <span className="mt-1 text-[11px] text-slate-500">Publish articles, videos, and PDFs</span>
        </Link>
        <Link
          href="/admin/moderation"
          className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-[#003087] transition"
        >
          <span className="text-xs font-bold text-[#003087]">Discussion Moderation &rarr;</span>
          <span className="mt-1 text-[11px] text-slate-500">Approve or flag student discussions</span>
        </Link>
      </section>
    </div>
  );
}
