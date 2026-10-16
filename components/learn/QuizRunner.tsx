"use client";

import { useState, type FormEvent } from "react";
import { submitQuiz } from "@/lib/actions/learning";
import type { PublicQuiz } from "@/types";

type Review = {
  id: string;
  prompt: string;
  correct: boolean;
  chosen: number;
  correctIndex: number;
  explanation: string;
  choices: string[];
};

export function QuizRunner({ quiz }: { quiz: PublicQuiz }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{ score: number; total: number; review: Review[] } | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const response = await submitQuiz(quiz.id, answers);
      setResult(response);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not submit the quiz.");
    } finally {
      setPending(false);
    }
  }

  if (result) {
    return (
      <section aria-live="polite">
        <p className="text-2xl font-semibold text-ucu-blue">
          {result.score} / {result.total}
        </p>
        <ul className="mt-4 space-y-3">
          {result.review.map((item) => (
            <li key={item.id} className="rounded-xl border border-slate-200 bg-white p-3 text-sm">
              <p className="font-medium">{item.prompt}</p>
              <p className={item.correct ? "text-forest" : "text-magenta"}>
                {item.correct ? "Correct" : `Answer: ${item.choices[item.correctIndex]}`}
              </p>
              <p className="mt-1 text-muted">{item.explanation}</p>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      {quiz.questions.map((question, index) => (
        <fieldset key={question.id} className="rounded-2xl border border-slate-200 bg-white p-4">
          <legend className="text-sm font-semibold text-ucu-blue">
            {index + 1}. {question.prompt}
          </legend>
          <div className="mt-3 grid gap-2">
            {question.choices.map((choice, choiceIndex) => (
              <label key={choice} className="flex items-start gap-2 text-sm">
                <input
                  type="radio"
                  name={question.id}
                  required
                  checked={answers[question.id] === choiceIndex}
                  onChange={() =>
                    setAnswers((current) => ({ ...current, [question.id]: choiceIndex }))
                  }
                />
                <span>{choice}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ))}
      {error ? <p className="text-sm text-magenta">{error}</p> : null}
      <button type="submit" className="btn w-fit" disabled={pending}>
        {pending ? "Scoring…" : "Submit answers"}
      </button>
    </form>
  );
}
