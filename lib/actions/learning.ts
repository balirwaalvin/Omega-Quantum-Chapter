"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireStaff, requireUser } from "@/lib/auth";
import { getRepository } from "@/lib/data";
import type { Quiz, QuizQuestion, ResourceTopic } from "@/types";

function newId(prefix: string) {
  return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
}

export async function submitQuiz(quizId: string, answers: Record<string, number>) {
  const session = await requireUser();
  const repo = getRepository();
  const quiz = await repo.getQuiz(quizId);
  if (!quiz || !quiz.published) throw new Error("Quiz not found");

  let score = 0;
  const review = quiz.questions.map((question) => {
    const chosen = answers[question.id];
    const correct = chosen === question.correctIndex;
    if (correct) score += 1;
    return {
      id: question.id,
      prompt: question.prompt,
      correct,
      chosen: Number.isInteger(chosen) ? chosen : -1,
      correctIndex: question.correctIndex,
      explanation: question.explanation,
      choices: question.choices,
    };
  });

  await repo.saveAttempt({
    id: newId("attempt"),
    quizId,
    userId: session.userId,
    score,
    total: quiz.questions.length,
    completedAt: new Date().toISOString(),
  });
  revalidatePath("/dashboard");
  revalidatePath(`/learn/quiz/${quizId}`);
  revalidatePath("/admin");
  return { score, total: quiz.questions.length, review };
}

export async function saveQuiz(formData: FormData) {
  await requireStaff();
  const repo = getRepository();
  const existingId = String(formData.get("id") || "");
  const previous = existingId ? await repo.getQuiz(existingId) : null;
  let questions: QuizQuestion[] = [];
  try {
    const parsed = JSON.parse(String(formData.get("questions") || "[]")) as QuizQuestion[];
    questions = parsed
      .filter((question) => question.prompt?.trim() && question.choices?.length >= 2)
      .map((question) => ({
        id: question.id || newId("q"),
        prompt: question.prompt.trim(),
        choices: question.choices.map((choice) => choice.trim()).filter(Boolean),
        correctIndex: Number(question.correctIndex) || 0,
        explanation: question.explanation?.trim() || "",
      }));
  } catch {
    throw new Error("Questions could not be read.");
  }
  if (questions.length === 0) throw new Error("Add at least one question.");

  const topic = String(formData.get("topic") || "Fundamentals") as ResourceTopic;
  const quiz: Quiz = {
    id: existingId || newId("quiz"),
    title: String(formData.get("title") || "").trim(),
    topic,
    description: String(formData.get("description") || "").trim(),
    questions,
    published: formData.get("published") === "on",
  };
  if (!quiz.title) throw new Error("Title is required");
  if (previous) quiz.id = previous.id;
  await repo.saveQuiz(quiz);
  revalidatePath("/learn");
  revalidatePath("/admin/quizzes");
  redirect("/admin/quizzes");
}

export async function deleteQuiz(formData: FormData) {
  await requireStaff();
  await getRepository().deleteQuiz(String(formData.get("id") || ""));
  revalidatePath("/learn");
  revalidatePath("/admin/quizzes");
}
