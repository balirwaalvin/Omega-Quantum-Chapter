import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CommentThread } from "@/components/community/CommentThread";
import { saveProject } from "@/lib/actions/community";
import { requireUser, staffOnly } from "@/lib/auth";
import { getRepository } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = await getRepository().getProject(id);
  return { title: project?.title ?? "Project" };
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

  return (
    <article>
      <form action={saveProject} className="grid gap-3">
        <input type="hidden" name="id" value={project.id} />
        <label className="grid gap-1 text-sm font-medium">
          Title
          <input name="title" defaultValue={project.title} className="field" required />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Status
          <select name="status" defaultValue={project.status} className="field">
            <option value="idea">Idea</option>
            <option value="active">Active</option>
            <option value="done">Done</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Shared notes
          <textarea name="body" rows={10} defaultValue={project.body} className="field" />
        </label>
        <button type="submit" className="btn w-fit">
          Save notes
        </button>
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
