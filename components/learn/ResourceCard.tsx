import Link from "next/link";
import type { Resource } from "@/types";

export function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-forest">
        {resource.topic} · {resource.kind}
      </p>
      <h2 className="mt-2 text-lg font-semibold text-ucu-blue">
        <Link href={`/learn/${resource.slug}`} className="hover:underline">
          {resource.title}
        </Link>
      </h2>
      <p className="mt-2 flex-1 text-sm text-muted">{resource.summary}</p>
      <p className="mt-3 text-xs text-muted">{resource.views} views</p>
    </article>
  );
}
