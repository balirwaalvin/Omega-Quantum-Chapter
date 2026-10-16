import type { Metadata } from "next";
import Link from "next/link";
import { saveProject } from "@/lib/actions/community";
import { requireUser } from "@/lib/auth";
import { getRepository } from "@/lib/data";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Projects" };

export default async function ProjectsPage() {
  await requireUser();
  const projects = await getRepository().listProjects();

  return (
    <div>
      <PageHeader
        eyebrow="Collaboration"
        title="Projects"
        description="Shared notes with a simple status: idea, active, or done."
      />
      <ul className="grid gap-3 md:grid-cols-2">
        {projects.map((project) => (
          <li key={project.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-forest">{project.status}</p>
            <h2 className="mt-1 text-lg font-semibold text-ucu-blue">
              <Link href={`/projects/${project.id}`} className="hover:underline">
                {project.title}
              </Link>
            </h2>
            <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm text-muted">{project.body}</p>
          </li>
        ))}
      </ul>
      <form action={saveProject} className="mt-8 grid max-w-xl gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <h2 className="font-semibold text-ucu-blue">New note</h2>
        <label className="grid gap-1 text-sm font-medium">
          Title
          <input name="title" required className="field" />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Notes
          <textarea name="body" rows={4} className="field" />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Status
          <select name="status" className="field" defaultValue="idea">
            <option value="idea">Idea</option>
            <option value="active">Active</option>
            <option value="done">Done</option>
          </select>
        </label>
        <button type="submit" className="btn w-fit">
          Create
        </button>
      </form>
    </div>
  );
}
