"use client";

import { useState } from "react";
import { saveQuiz } from "@/lib/actions/learning";
import type { Quiz, QuizQuestion, ResourceTopic } from "@/types";

const emptyQuestion = (): QuizQuestion => ({
  id: "",
  prompt: "",
  choices: ["", ""],
  correctIndex: 0,
  explanation: "",
});

export function QuizEditor({ quiz }: { quiz: Quiz | null }) {
  const [questions, setQuestions] = useState<QuizQuestion[]>(
    quiz?.questions.length ? quiz.questions : [emptyQuestion()],
  );

  function update(index: number, patch: Partial<QuizQuestion>) {
    setQuestions((current) =>
      current.map((question, questionIndex) =>
        questionIndex === index ? { ...question, ...patch } : question,
      ),
    );
  }

  return (
    <form action={saveQuiz} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4">
      {quiz ? <input type="hidden" name="id" value={quiz.id} /> : null}
      <input type="hidden" name="questions" value={JSON.stringify(questions)} />
      <label className="grid gap-1 text-sm font-medium">
        Title
        <input name="title" required defaultValue={quiz?.title ?? ""} className="field" />
      </label>
      <label className="grid gap-1 text-sm font-medium">
        Description
        <input name="description" defaultValue={quiz?.description ?? ""} className="field" />
      </label>
      <label className="grid gap-1 text-sm font-medium">
        Topic
        <select name="topic" defaultValue={quiz?.topic ?? "Fundamentals"} className="field">
          {(["Fundamentals", "Algorithms", "Hardware", "Applications"] as ResourceTopic[]).map((topic) => (
            <option key={topic}>{topic}</option>
          ))}
        </select>
      </label>
      {questions.map((question, index) => (
        <fieldset key={question.id || index} className="grid gap-2 rounded-xl border border-slate-200 p-3">
          <legend className="px-1 text-sm font-semibold text-ucu-blue">Question {index + 1}</legend>
          <input
            className="field"
            value={question.prompt}
            onChange={(event) => update(index, { prompt: event.target.value })}
            placeholder="Prompt"
            aria-label={`Question ${index + 1} prompt`}
          />
          {question.choices.map((choice, choiceIndex) => (
            <input
              key={choiceIndex}
              className="field"
              value={choice}
              onChange={(event) => {
                const choices = [...question.choices];
                choices[choiceIndex] = event.target.value;
                update(index, { choices });
              }}
              placeholder={`Choice ${choiceIndex + 1}`}
              aria-label={`Question ${index + 1} choice ${choiceIndex + 1}`}
            />
          ))}
          <button
            type="button"
            className="btn-secondary w-fit"
            onClick={() => update(index, { choices: [...question.choices, ""] })}
          >
            Add choice
          </button>
          <label className="grid gap-1 text-sm">
            Correct choice index
            <input
              type="number"
              min={0}
              className="field"
              value={question.correctIndex}
              onChange={(event) => update(index, { correctIndex: Number(event.target.value) })}
            />
          </label>
          <input
            className="field"
            value={question.explanation}
            onChange={(event) => update(index, { explanation: event.target.value })}
            placeholder="Explanation"
            aria-label={`Question ${index + 1} explanation`}
          />
        </fieldset>
      ))}
      <button type="button" className="btn-secondary w-fit" onClick={() => setQuestions((current) => [...current, emptyQuestion()])}>
        Add question
      </button>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="published" defaultChecked={quiz?.published ?? true} />
        Published
      </label>
      <button type="submit" className="btn w-fit">Save quiz</button>
    </form>
  );
}
