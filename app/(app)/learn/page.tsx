import type { Metadata } from "next";
import Link from "next/link";
import { ResourceCard } from "@/components/learn/ResourceCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { requireUser } from "@/lib/auth";
import { getRepository } from "@/lib/data";
import type { ResourceTopic } from "@/types";

export const metadata: Metadata = { title: "Learn & Quizzes" };

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
  const session = await requireUser();
  const { topic } = await searchParams;
  const selected = topics.find((item) => item === topic);
  const repo = getRepository();
  const [resources, quizzes, allAttempts, users] = await Promise.all([
    repo.listResources({ publishedOnly: true, topic: selected }),
    repo.listQuizzes(true),
    repo.listAttempts(),
    repo.listUsers(),
  ]);

  // Calculate best score per (userId, quizId)
  const bestByUserQuiz = new Map<string, Map<string, { score: number; total: number }>>();
  for (const attempt of allAttempts) {
    let userMap = bestByUserQuiz.get(attempt.userId);
    if (!userMap) {
      userMap = new Map();
      bestByUserQuiz.set(attempt.userId, userMap);
    }
    const prev = userMap.get(attempt.quizId);
    if (!prev || attempt.score > prev.score) {
      userMap.set(attempt.quizId, { score: attempt.score, total: attempt.total });
    }
  }

  const myBest = bestByUserQuiz.get(session.userId) ?? new Map();
  const myModulesCompleted = myBest.size;

  // Build Chapter Leaderboard
  const userById = new Map(users.map((u) => [u.id, u]));
  const leaderboard = Array.from(bestByUserQuiz.entries())
    .map(([userId, quizMap]) => {
      let totalScore = 0;
      let totalQuestions = 0;
      for (const entry of quizMap.values()) {
        totalScore += entry.score;
        totalQuestions += entry.total;
      }
      const profile = userById.get(userId);
      return {
        userId,
        name:
          userId === session.userId
            ? session.name
            : (profile?.name ?? "Chapter Member"),
        program: profile?.program || "Computing & Technology",
        modules: quizMap.size,
        xp: totalScore * 100,
        accuracy:
          totalQuestions > 0
            ? Math.round((totalScore / totalQuestions) * 100)
            : 0,
      };
    })
    .sort((a, b) => b.xp - a.xp || b.accuracy - a.accuracy)
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Learning & Certification"
        title="Quantum Resource Library"
        description="Study notes, videos, and interactive checkpoint quizzes across Fundamentals, Algorithms, Hardware, and Applications."
      />

      {/* Chapter Achievement Certificate Banner */}
      <div className="alpha-card-frame">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[8px] bg-white p-4 sm:p-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-alpha-blue">
              Chapter Credential
            </p>
            <h2 className="mt-0.5 text-base font-bold text-ucu-blue sm:text-lg">
              UCU Quantum Computing Chapter Certificate of Achievement
            </h2>
            <p className="mt-1 text-xs text-muted">
              You have completed{" "}
              <strong className="text-ink">
                {myModulesCompleted} of {quizzes.length}
              </strong>{" "}
              checkpoint quiz modules. Generate your printable UCU Quantum
              Chapter certificate at any time.
            </p>
          </div>
          <Link href="/learn/certificate" className="btn-gold text-xs">
            🎓 View &amp; Print Certificate →
          </Link>
        </div>
      </div>

      {/* Topic Filter Pills */}
      <div
        className="flex flex-wrap gap-2"
        role="navigation"
        aria-label="Topics"
      >
        <Link
          key="all"
          href="/learn"
          className={!selected ? "btn" : "btn-secondary"}
          aria-current={!selected ? "page" : undefined}
        >
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

      {/* Resource Cards */}
      <div className="grid gap-3 md:grid-cols-2">
        {resources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>

      {/* Checkpoint Quizzes & Chapter Leaderboard */}
      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <section>
          <h2 className="text-lg font-bold text-ucu-blue">
            Checkpoint Quizzes
          </h2>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {quizzes.map((quiz) => {
              const best = myBest.get(quiz.id);
              return (
                <li
                  key={quiz.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-forest">
                        {quiz.topic}
                      </p>
                      {best ? (
                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                          Best: {best.score}/{best.total}
                        </span>
                      ) : null}
                    </div>
                    <h3 className="mt-1 font-bold text-ucu-blue">
                      {quiz.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted">
                      {quiz.description}
                    </p>
                  </div>
                  <Link
                    href={`/learn/quiz/${quiz.id}`}
                    className="btn mt-4 w-fit text-xs"
                  >
                    {best ? "Retake Quiz" : "Start Quiz"}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Chapter Quantum Leaderboard */}
        <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-ucu-blue">
              Chapter Leaderboard
            </h2>
            <span className="rounded-md bg-gold/25 px-2 py-0.5 text-[10px] font-bold text-ucu-blue">
              Quantum XP
            </span>
          </div>
          <p className="mt-1 text-xs text-muted">
            Top quiz performers across the UCU Quantum Chapter.
          </p>

          <ol className="mt-3 divide-y divide-slate-100">
            {leaderboard.map((entry, idx) => (
              <li
                key={entry.userId}
                className="flex items-center justify-between py-2.5 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                      idx === 0
                        ? "bg-gold text-ucu-blue"
                        : idx === 1
                          ? "bg-slate-200 text-ink"
                          : "bg-slate-100 text-muted"
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-ink">{entry.name}</p>
                    <p className="text-[10px] text-muted">
                      {entry.modules} module{entry.modules === 1 ? "" : "s"} &middot;{" "}
                      {entry.accuracy}% accuracy
                    </p>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-alpha-blue">
                  {entry.xp} XP
                </span>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </div>
  );
}
