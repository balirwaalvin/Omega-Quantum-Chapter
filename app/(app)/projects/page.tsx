import type { Metadata } from "next";
import Link from "next/link";
import { saveProject, toggleProjectMembership } from "@/lib/actions/community";
import { requireUser } from "@/lib/auth";
import { getRepository } from "@/lib/data";
import { circuitPresets } from "@/lib/quantum/examples";
import { PageHeader } from "@/components/ui/PageHeader";
import type { ProjectStatus } from "@/types";

export const metadata: Metadata = { title: "Projects & Research Hub" };

const statusStyles: Record<
  ProjectStatus,
  { label: string; badge: string }
> = {
  idea: {
    label: "Proposal / Idea",
    badge: "bg-amber-50 text-amber-800 border-amber-200",
  },
  active: {
    label: "Active Research",
    badge: "bg-blue-50 text-alpha-blue border-blue-200",
  },
  done: {
    label: "Completed Showcase",
    badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
  },
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await requireUser();
  const { status: rawFilter } = await searchParams;
  const repo = getRepository();
  const [allProjects, users] = await Promise.all([
    repo.listProjects(),
    repo.listUsers(),
  ]);

  const userById = new Map(users.map((u) => [u.id, u.name]));
  const statusFilter =
    rawFilter === "idea" || rawFilter === "active" || rawFilter === "done"
      ? rawFilter
      : "all";

  const projects =
    statusFilter === "all"
      ? allProjects
      : allProjects.filter((p) => p.status === statusFilter);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Quantum Research & Showcase Hub"
        title="Chapter Projects"
        description="Collaborate on quantum algorithms, circuit experiments, and faculty demonstrations. Launch any project's linked quantum circuit directly in the Circuit Lab."
      />

      {/* Status Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { id: "all", label: `All (${allProjects.length})` },
              {
                id: "active",
                label: `Active (${allProjects.filter((p) => p.status === "active").length})`,
              },
              {
                id: "idea",
                label: `Proposals (${allProjects.filter((p) => p.status === "idea").length})`,
              },
              {
                id: "done",
                label: `Completed (${allProjects.filter((p) => p.status === "done").length})`,
              },
            ] as const
          ).map((tab) => {
            const active = statusFilter === tab.id;
            return (
              <Link
                key={tab.id}
                href={
                  tab.id === "all" ? "/projects" : `/projects?status=${tab.id}`
                }
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  active
                    ? "bg-ucu-blue text-white shadow-xs"
                    : "bg-slate-50 text-ink hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
        <a
          href="#new-project"
          className="btn-gold text-xs"
        >
          + Propose Project
        </a>
      </div>

      {/* Project Showcase Grid */}
      <ul className="grid gap-4 lg:grid-cols-2">
        {projects.map((project) => {
          const style = statusStyles[project.status];
          const preset = project.circuitPreset
            ? circuitPresets[project.circuitPreset]
            : null;
          const isMember = project.memberIds.includes(session.userId);
          const teamNames = project.memberIds
            .map((id) => userById.get(id) ?? "Chapter Member")
            .slice(0, 4);

          return (
            <li
              key={project.id}
              className="alpha-card-frame flex flex-col justify-between"
            >
              <div className="flex h-full flex-col justify-between rounded-[8px] bg-white p-5">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${style.badge}`}
                    >
                      {style.label}
                    </span>

                    {preset ? (
                      <Link
                        href={`/playground?preset=${preset.id}`}
                        className="inline-flex items-center gap-1.5 rounded-md bg-ucu-blue/8 px-2.5 py-1 text-[11px] font-bold text-alpha-blue transition hover:bg-ucu-blue hover:text-white"
                      >
                        <span>⚡ {preset.label}</span>
                      </Link>
                    ) : null}
                  </div>

                  <h2 className="mt-3 text-lg font-bold text-ucu-blue">
                    <Link
                      href={`/projects/${project.id}`}
                      className="hover:text-alpha-blue hover:underline"
                    >
                      {project.title}
                    </Link>
                  </h2>

                  {project.summary ? (
                    <p className="mt-1 text-xs font-medium text-ink">
                      {project.summary}
                    </p>
                  ) : null}

                  <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-xs leading-relaxed text-muted">
                    {project.body}
                  </p>

                  {project.tags && project.tags.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="mt-4 border-t border-slate-100 pt-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-[11px] text-muted">
                      <span className="font-semibold text-ink">Team: </span>
                      {teamNames.length > 0
                        ? teamNames.join(", ")
                        : "Open for collaborators"}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {project.repoUrl ? (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-md border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-ink transition hover:border-alpha-blue hover:text-alpha-blue"
                        >
                          GitHub Repo ↗
                        </a>
                      ) : null}

                      <form action={toggleProjectMembership}>
                        <input
                          type="hidden"
                          name="projectId"
                          value={project.id}
                        />
                        <button
                          type="submit"
                          className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition ${
                            isMember
                              ? "border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
                              : "bg-ucu-blue text-white hover:bg-alpha-blue"
                          }`}
                        >
                          {isMember ? "Joined ✓" : "Join Team"}
                        </button>
                      </form>

                      <Link
                        href={`/projects/${project.id}`}
                        className="rounded-md border border-ucu-blue/25 bg-ucu-blue/5 px-2.5 py-1 text-[11px] font-semibold text-ucu-blue transition hover:bg-ucu-blue hover:text-white"
                      >
                        Workspace →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Propose New Quantum Research Project */}
      <form
        id="new-project"
        action={saveProject}
        className="alpha-card-frame max-w-2xl"
      >
        <div className="grid gap-3.5 rounded-[8px] bg-white p-5 sm:p-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-alpha-blue">
              New Collaboration
            </p>
            <h2 className="text-lg font-bold text-ucu-blue">
              Propose a Quantum Research Project or Demo
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-xs font-semibold text-ink">
              Project Title
              <input
                name="title"
                required
                placeholder="e.g., Quantum Teleportation Protocol Demo"
                className="field"
              />
            </label>
            <label className="grid gap-1 text-xs font-semibold text-ink">
              Status
              <select name="status" className="field" defaultValue="active">
                <option value="idea">Proposal / Idea</option>
                <option value="active">Active Research</option>
                <option value="done">Completed Showcase</option>
              </select>
            </label>
          </div>

          <label className="grid gap-1 text-xs font-semibold text-ink">
            One-line Summary
            <input
              name="summary"
              placeholder="Short abstract shown on the project showcase card"
              className="field"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-3">
            <label className="grid gap-1 text-xs font-semibold text-ink">
              Linked Circuit Lab Preset
              <select name="circuitPreset" className="field" defaultValue="bell">
                <option value="">None</option>
                <option value="bell">Bell State |Φ⁺⟩</option>
                <option value="ghz">3-Qubit GHZ State</option>
                <option value="superposition">Uniform Superposition</option>
                <option value="deutsch-jozsa">Deutsch-Jozsa Oracle</option>
                <option value="grover">Grover 2-Qubit Search</option>
              </select>
            </label>

            <label className="grid gap-1 text-xs font-semibold text-ink">
              Tags (comma-separated)
              <input
                name="tags"
                placeholder="Qiskit, Entanglement, QML"
                className="field"
              />
            </label>

            <label className="grid gap-1 text-xs font-semibold text-ink">
              GitHub Repository URL
              <input
                name="repoUrl"
                type="url"
                placeholder="https://github.com/..."
                className="field"
              />
            </label>
          </div>

          <label className="grid gap-1 text-xs font-semibold text-ink">
            Research Notes &amp; Objectives
            <textarea
              name="body"
              rows={4}
              placeholder="Document circuit architecture, math notes, or weekly milestones..."
              className="field"
            />
          </label>

          <button type="submit" className="btn w-fit">
            Launch Project Workspace
          </button>
        </div>
      </form>
    </div>
  );
}
