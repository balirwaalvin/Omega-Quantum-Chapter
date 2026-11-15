import type { Metadata } from "next";
import Link from "next/link";
import { OmegaLockup } from "@/components/brand/Logo";
import { PrintCertificateButton } from "@/components/learn/PrintCertificateButton";
import { requireUser } from "@/lib/auth";
import { getRepository } from "@/lib/data";

export const metadata: Metadata = {
  title: "Chapter Certificate of Achievement",
};

export default async function CertificatePage() {
  const session = await requireUser();
  const repo = getRepository();
  const [profile, quizzes, attempts] = await Promise.all([
    repo.getUser(session.userId),
    repo.listQuizzes(true),
    repo.listAttempts(session.userId),
  ]);

  const bestByQuiz = new Map<string, { score: number; total: number }>();
  for (const att of attempts) {
    const prev = bestByQuiz.get(att.quizId);
    if (!prev || att.score > prev.score) {
      bestByQuiz.set(att.quizId, { score: att.score, total: att.total });
    }
  }

  let totalScore = 0;
  for (const v of bestByQuiz.values()) totalScore += v.score;
  const xp = totalScore * 100 + 250; // Includes Circuit & Bloch Lab practicum XP
  const credentialId = `UCU-QCC-${session.userId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 6).toUpperCase()}-2026`;
  const issueDate = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      {/* Top Action Bar (hidden when printing) */}
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          href="/learn"
          className="text-xs font-semibold text-alpha-blue hover:underline"
        >
          ← Back to Learning &amp; Quizzes
        </Link>
        <PrintCertificateButton />
      </div>

      {/* Printable Official Certificate */}
      <div className="alpha-card-frame shadow-xl">
        <div className="rounded-[8px] bg-white p-6 sm:p-10">
          <div className="rounded-lg border-2 border-[#f1c40f]/60 p-6 sm:p-10">
            {/* Top Brand & Institutional Crest Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/ucu.png"
                alt="Uganda Christian University"
                className="h-11 w-auto object-contain sm:h-13"
              />
              <OmegaLockup size="md" theme="light" showSubtitle={false} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/qcc-logo-transparent.png"
                alt="Quantum Computing Chapter"
                className="h-12 w-auto object-contain sm:h-14"
              />
            </div>

            {/* Certificate Body */}
            <div className="mt-8 text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-alpha-blue">
                Department of Computing &amp; Technology &middot; Mukono, Uganda
              </p>
              <h1 className="mt-2 text-2xl font-extrabold uppercase tracking-wider text-ucu-blue sm:text-3xl">
                Certificate of Quantum Computing Proficiency
              </h1>
              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted">
                This is proudly presented to
              </p>

              <p className="mt-2 font-serif text-3xl font-bold text-ink underline decoration-[#f1c40f] decoration-2 underline-offset-8 sm:text-4xl">
                {session.name}
              </p>

              <p className="mt-2 text-xs font-semibold text-alpha-blue">
                {profile?.program || "BSc Computing & Technology"} &middot;{" "}
                {session.email}
              </p>

              <p className="mx-auto mt-5 max-w-2xl text-xs leading-relaxed text-slate-600 sm:text-sm">
                For active participation and demonstrated competency in{" "}
                <strong className="text-ink">
                  Single-Qubit Bloch Sphere Dynamics
                </strong>
                ,{" "}
                <strong className="text-ink">
                  Multi-Qubit Entanglement &amp; Quantum Circuits
                </strong>
                ,{" "}
                <strong className="text-ink">
                  Quantum Algorithms (Deutsch-Jozsa &amp; Grover Search)
                </strong>
                , and{" "}
                <strong className="text-ink">
                  BB84 Quantum Key Distribution
                </strong>{" "}
                within the Uganda Christian University Quantum Computing
                Chapter.
              </p>
            </div>

            {/* Completed Modules & Telemetry Strip */}
            <div className="mt-7 grid gap-3 rounded-xl bg-slate-50 p-4 text-center sm:grid-cols-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
                  Modules &amp; Practicum
                </p>
                <p className="mt-0.5 text-sm font-bold text-ucu-blue">
                  {bestByQuiz.size} / {quizzes.length} Quizzes + 3 Labs
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
                  Quantum Standing
                </p>
                <p className="mt-0.5 text-sm font-bold text-alpha-blue">
                  {xp} Quantum XP
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
                  Credential ID
                </p>
                <p className="mt-0.5 font-mono text-xs font-bold text-ink">
                  {credentialId}
                </p>
              </div>
            </div>

            {/* Signatures & Motto Footer */}
            <div className="mt-8 grid items-end gap-6 border-t border-slate-200 pt-6 sm:grid-cols-3">
              <div className="text-center">
                <p className="font-serif text-sm font-bold italic text-ucu-blue">
                  Ogenrrwoth Samuel
                </p>
                <div className="mx-auto mt-1 h-px w-40 bg-slate-300" />
                <p className="mt-1 text-[11px] font-bold text-ink">
                  Chapter President
                </p>
                <p className="text-[10px] text-muted">
                  UCU Quantum Computing Chapter
                </p>
              </div>

              <div className="text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#b5004f]">
                  Alpha &amp; Omega
                </p>
                <p className="mt-0.5 text-[11px] font-medium text-muted">
                  Issued: {issueDate}
                </p>
              </div>

              <div className="text-center">
                <p className="font-serif text-sm font-bold italic text-ucu-blue">
                  Balirwa Alvin Daniel
                </p>
                <div className="mx-auto mt-1 h-px w-40 bg-slate-300" />
                <p className="mt-1 text-[11px] font-bold text-ink">
                  Technical Lead
                </p>
                <p className="text-[10px] text-muted">
                  OMEGA Quantum Systems
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
