import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CommentThread } from "@/components/community/CommentThread";
import { CircuitPlayground } from "@/components/quantum/CircuitPlayground";
import { saveProject, toggleProjectMembership } from "@/lib/actions/community";
import { requireUser, staffOnly } from "@/lib/auth";
import { getRepository } from "@/lib/data";
import { circuitPresets } from "@/lib/quantum/examples";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = await getRepository().getProject(id);
  return { title: project?.title ?? "Project Workspace" };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireUser();
  const { id } = await params;
  const repo = getRepository();
  const project = await repo.getProject(id);
  if (!project) notFound();

  const [comments, users] = await Promise.all([
    repo.listComments({ targetType: "project", targetId: id }),
    repo.listUsers(),
  ]);

  const userById = new Map(users.map((u) => [u.id, u]));
  const isMember = project.memberIds.includes(session.userId);
  const preset = project.circuitPreset
    ? circuitPresets[project.circuitPreset]
    : null;

  return (
    <article className="space-y-6">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/projects"
          className="text-xs font-semibold text-alpha-blue hover:underline"
        >
          ← Back to Projects &amp; Research Hub
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          {project.repoUrl ? (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary text-xs"
            >
              GitHub Repository ↗
            </a>
          ) : null}

          {preset ? (
            <Link
              href={`/playground?preset=${preset.id}`}
              className="btn-gold text-xs"
            >
              ⚡ Open in Full Circuit Lab
            </Link>
          ) : null}

          <form action={toggleProjectMembership}>
            <input type="hidden" name="projectId" value={project.id} />
            <button
              type="submit"
              className={isMember ? "btn-secondary text-xs" : "btn text-xs"}
            >
              {isMember ? "Joined Team ✓ (Leave)" : "+ Join Project Team"}
            </button>
          </form>
        </div>
      </div>

      {/* Project Overview Card */}
      <div className="alpha-card-frame">
        <div className="rounded-[8px] bg-white p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-ucu-blue/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-alpha-blue">
              {project.status}
            </span>
            {project.tags?.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700"
              >
                #{tag}
              </span>
            ))}
          </div>

          <h1 className="mt-2 text-2xl font-bold text-ucu-blue">
            {project.title}
          </h1>
          {project.summary ? (
            <p className="mt-1 text-sm text-muted">{project.summary}</p>
          ) : null}

          {/* Team Roster */}
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
            <span className="text-xs font-bold uppercase tracking-wider text-alpha-blue">
              Collaborators ({project.memberIds.length}):
            </span>
            {project.memberIds.map((memberId) => {
              const member = userById.get(memberId);
              return (
                <span
                  key={memberId}
                  className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-ink"
                >
                  {member?.name ?? "Chapter Member"}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Embedded Interactive Quantum Circuit Preview */}
      {preset ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-ucu-blue">
              Embedded Project Circuit — {preset.label}
            </h2>
            <Link
              href={`/playground?preset=${preset.id}`}
              className="text-xs font-semibold text-alpha-blue hover:underline"
            >
              Expand in Circuit Lab →
            </Link>
          </div>
          <CircuitPlayground
            key={preset.id}
            initial={preset.grid}
            columns={preset.columns}
            qubits={preset.qubits}
            title={preset.description}
          />
        </div>
      ) : null}

      {/* Editable Research Notebook Form */}
      <form action={saveProject} className="alpha-card-frame">
        <div className="grid gap-3.5 rounded-[8px] bg-white p-5 sm:p-6">
          <h2 className="text-base font-bold text-ucu-blue">
            Research Notebook &amp; Configuration
          </h2>
          <input type="hidden" name="id" value={project.id} />

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-xs font-semibold text-ink">
              Title
              <input
                name="title"
                defaultValue={project.title}
                className="field"
                required
              />
            </label>
            <label className="grid gap-1 text-xs font-semibold text-ink">
              Status
              <select
                name="status"
                defaultValue={project.status}
                className="field"
              >
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
              defaultValue={project.summary ?? ""}
              placeholder="Short abstract for the project card"
              className="field"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-3">
            <label className="grid gap-1 text-xs font-semibold text-ink">
              Linked Circuit Preset
              <select
                name="circuitPreset"
                defaultValue={project.circuitPreset ?? ""}
                className="field"
              >
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
                defaultValue={project.tags?.join(", ") ?? ""}
                placeholder="Entanglement, Qiskit, Algorithms"
                className="field"
              />
            </label>

            <label className="grid gap-1 text-xs font-semibold text-ink">
              GitHub Repository URL
              <input
                name="repoUrl"
                type="url"
                defaultValue={project.repoUrl ?? ""}
                placeholder="https://github.com/..."
                className="field"
              />
            </label>
          </div>

          <label className="grid gap-1 text-xs font-semibold text-ink">
            Shared Research Notes &amp; Findings
            <textarea
              name="body"
              rows={8}
              defaultValue={project.body}
              className="field"
            />
          </label>

          <button type="submit" className="btn w-fit">
            Save Research Notes
          </button>
        </div>
      </form>

      <CommentThread
        comments={comments}
        users={users}
        targetType="project"
        targetId={project.id}
        currentUserId={session.userId}
        staff={staffOnly(session.role)}
      />
    </article>
  );
}
