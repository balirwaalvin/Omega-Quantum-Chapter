import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuizRunner } from "@/components/learn/QuizRunner";
import { PageHeader } from "@/components/ui/PageHeader";
import { requireUser } from "@/lib/auth";
import { getRepository } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const quiz = await getRepository().getQuiz(id);
  return { title: quiz?.title ?? "Quiz" };
}

export default async function QuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireUser();
  const { id } = await params;
  const repo = getRepository();
  const quiz = await repo.getQuiz(id);
  if (!quiz || !quiz.published) notFound();
  const attempts = (await repo.listAttempts(session.userId)).filter(
    (attempt) => attempt.quizId === id,
  );
  const best = attempts.reduce((max, attempt) => Math.max(max, attempt.score), 0);

  return (
    <div>
      <PageHeader eyebrow={quiz.topic} title={quiz.title} description={quiz.description} />
      {attempts.length > 0 ? (
        <p className="mb-4 text-sm text-forest">Best score so far: {best} / {quiz.questions.length}</p>
      ) : null}
      <QuizRunner
        quiz={{
          ...quiz,
          questions: quiz.questions.map(({ id: questionId, prompt, choices }) => ({
            id: questionId,
            prompt,
            choices,
          })),
        }}
      />
    </div>
  );
}
