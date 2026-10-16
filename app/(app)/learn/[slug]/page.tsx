import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CommentThread } from "@/components/community/CommentThread";
import { requireUser, staffOnly } from "@/lib/auth";
import { getRepository } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resource = await getRepository().getResourceBySlug(slug);
  return { title: resource?.title ?? "Resource" };
}

export default async function ResourcePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await requireUser();
  const { slug } = await params;
  const repo = getRepository();
  const resource = await repo.getResourceBySlug(slug);
  if (!resource || (!resource.published && !staffOnly(session.role))) notFound();
  await repo.incrementResourceViews(resource.id);

  const [comments, users] = await Promise.all([
    repo.listComments({ targetType: "resource", targetId: resource.id }),
    repo.listUsers(),
  ]);

  return (
    <article>
      <p className="text-xs font-semibold uppercase tracking-wide text-forest">
        {resource.topic} · {resource.kind}
      </p>
      <h1 className="mt-1 text-3xl font-semibold text-ucu-blue">{resource.title}</h1>
      <p className="mt-3 text-sm text-muted">{resource.summary}</p>
      <div className="mt-4 whitespace-pre-wrap text-sm leading-7">{resource.body}</div>
      {resource.url ? (
        <p className="mt-4">
          <a className="btn" href={resource.url} target={resource.url.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
            {resource.kind === "pdf" ? "Download" : "Open link"}
          </a>
        </p>
      ) : null}
      <CommentThread
        comments={comments}
        users={users}
        targetType="resource"
        targetId={resource.id}
        currentUserId={session.userId}
        staff={staffOnly(session.role)}
      />
    </article>
  );
}
