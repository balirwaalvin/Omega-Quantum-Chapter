import type { Metadata } from "next";
import Link from "next/link";
import { deleteQuiz } from "@/lib/actions/learning";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminTable } from "@/components/admin/AdminTable";
import { QuizEditor } from "@/components/admin/QuizEditor";
import { PageHeader } from "@/components/ui/PageHeader";
import { requireStaff } from "@/lib/auth";
import { getRepository } from "@/lib/data";

export const metadata: Metadata = { title: "Manage quizzes" };

export default async function AdminQuizzesPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  await requireStaff();
  const { edit } = await searchParams;
  const repo = getRepository();
  const quizzes = await repo.listQuizzes(false);
  const current = edit ? await repo.getQuiz(edit) : null;

  return (
    <div>
      <PageHeader eyebrow="Admin" title="Quizzes" description="Add questions and mark the correct choice." />
      <AdminNav />
      <QuizEditor quiz={current} />
      <div className="mt-8">
        <AdminTable headers={["Quiz", "Topic", "Questions", "Actions"]}>
          {quizzes.map((quiz) => (
            <tr key={quiz.id}>
              <td className="px-3 py-2">{quiz.title}</td>
              <td className="px-3 py-2">{quiz.topic}</td>
              <td className="px-3 py-2">{quiz.questions.length}</td>
              <td className="px-3 py-2">
                <div className="flex gap-2">
                  <Link className="btn-secondary" href={`/admin/quizzes?edit=${quiz.id}`}>Edit</Link>
                  <form action={deleteQuiz}>
                    <input type="hidden" name="id" value={quiz.id} />
                    <button className="btn-danger" type="submit">Delete</button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>
      </div>
    </div>
  );
}
