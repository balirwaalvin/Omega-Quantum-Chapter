import type { Metadata } from "next";
import Link from "next/link";
import { ResourceCard } from "@/components/learn/ResourceCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { requireUser } from "@/lib/auth";
import { getRepository } from "@/lib/data";
import type { ResourceTopic } from "@/types";

export const metadata: Metadata = { title: "Learn" };

const topics: ResourceTopic[] = [
  "Fundamentals",
  "Algorithms",
  "Hardware",
  "Applications",
];

export default async function LearnPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  await requireUser();
  const { topic } = await searchParams;
  const selected = topics.find((item) => item === topic);
  const repo = getRepository();
  const [resources, quizzes] = await Promise.all([
    repo.listResources({ publishedOnly: true, topic: selected }),
    repo.listQuizzes(true),
  ]);

  return (
    <div>
      <PageHeader
        eyebrow="Learning"
        title="Resource library"
        description="Articles, videos, links, and notes grouped by topic."
      />
      <div className="mb-5 flex flex-wrap gap-2" role="navigation" aria-label="Topics">
        <Link key="all" href="/learn" className={!selected ? "btn" : "btn-secondary"} aria-current={!selected ? "page" : undefined}>
          All
        </Link>
        {topics.map((item) => {
          const active = item === selected;
          const href = `/learn?topic=${item}`;
          return (
            <Link
              key={item}
              href={href}
              className={active ? "btn" : "btn-secondary"}
              aria-current={active ? "page" : undefined}
            >
              {item}
            </Link>
          );
        })}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {resources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-ucu-blue">Quizzes</h2>
        <ul className="mt-3 grid gap-3 md:grid-cols-2">
          {quizzes.map((quiz) => (
            <li key={quiz.id} className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-forest">{quiz.topic}</p>
              <h3 className="mt-1 font-semibold text-ucu-blue">{quiz.title}</h3>
              <p className="mt-1 text-sm text-muted">{quiz.description}</p>
              <Link href={`/learn/quiz/${quiz.id}`} className="btn mt-3">
                Start quiz
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
