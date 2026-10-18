import type { Metadata } from "next";
import Link from "next/link";
import { AlphaBackdrop } from "@/components/brand/AlphaBackdrop";
import { AlphaNavbar } from "@/components/brand/AlphaNavbar";
import { AlphaCardLogoBanner } from "@/components/brand/PartnerMark";

export const metadata: Metadata = {
  title: "Chapter Leadership | OMEGA Quantum Computing Chapter",
  description:
    "Meet the student executive board and academic advisors leading the Uganda Christian University Quantum Computing Chapter, Department of Computing & Technology.",
};

interface Leader {
  name: string;
  role: string;
  affiliation: string;
  program?: string;
  bio: string;
  specialties: string[];
  initials: string;
}

const leaders: Leader[] = [
  {
    name: "Ogenrrwoth Samuel",
    role: "Chapter President",
    affiliation: "Department Of Computing & Technology",
    program: "BSc Computer Science · Year 3",
    bio: "Leads the chapter's executive board, strategic vision, institutional outreach, and coordinates overall student initiatives across Uganda Christian University.",
    specialties: ["Executive Leadership", "Quantum Strategy", "Community Growth"],
    initials: "OS",
  },
  {
    name: "Kamwikara Sarah",
    role: "Vice President",
    affiliation: "Department Of Computing & Technology",
    program: "BSc Electronics & Communications Engineering · Year 3",
    bio: "Oversees chapter operations, student engagement, and inter-departmental collaborations with engineering for quantum hardware and communications.",
    specialties: ["Quantum Communications", "Hardware Systems", "Operations"],
    initials: "KS",
  },
  {
    name: "Balirwa Alvin Daniel",
    role: "Technical Lead",
    affiliation: "Department Of Computing & Technology",
    program: "BSc Information Technology · Year 3",
    bio: "Directs technical architecture, quantum simulation platforms, hands-on Qiskit bootcamps, and software engineering across chapter projects.",
    specialties: ["Quantum Simulation", "Technical Architecture", "Qiskit Labs"],
    initials: "BA",
  },
  {
    name: "Grace Wanja",
    role: "General Secretary",
    affiliation: "Department Of Computing & Technology",
    program: "BSc Data Science · Year 3",
    bio: "Coordinates official chapter documentation, executive communications, correspondence, and data-driven student membership tracking.",
    specialties: ["Data Science", "Chapter Governance", "Communications"],
    initials: "GW",
  },
  {
    name: "Robert Wanyama",
    role: "Assistant Technical Lead",
    affiliation: "Department Of Computing & Technology",
    program: "BSc Computer Science · Year 3",
    bio: "Assists in technical workshop delivery, circuit simulation playground sessions, peer code review, and developer mentorship in weekly study circles.",
    specialties: ["Circuit Simulation", "Algorithms", "Developer Mentorship"],
    initials: "RW",
  },
  {
    name: "Faculty Advisory Board",
    role: "Academic Patrons & Mentors",
    affiliation: "Department Of Computing & Technology, UCU",
    bio: "Guiding the chapter under the academic stewardship of the Department of Computing & Technology to connect student research with quantum innovation.",
    specialties: ["Institutional Liaison", "Research Ethics", "Curriculum"],
    initials: "UCU",
  },
];

export default function LeadersPage() {
  return (
    <div className="relative flex min-h-screen flex-col justify-between text-white">
      <AlphaBackdrop />

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 py-8 sm:py-12">
        <div className="alpha-card-frame w-full">
          <div className="overflow-hidden rounded-[8px] bg-black/85 shadow-2xl backdrop-blur-md">
            <AlphaCardLogoBanner />

            <div className="px-5 py-6 sm:px-8 sm:py-8">
              {/* Header */}
              <div className="text-center">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#7fb3ff]">
                  Department Of Computing &amp; Technology
                </p>
                <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Chapter Leadership
                </h1>
                <p className="mx-auto mt-2 max-w-2xl text-xs leading-relaxed text-slate-300 sm:text-sm">
                  The executive board and faculty advisors advancing quantum
                  information science, circuit simulation, and algorithmic research
                  at Uganda Christian University.
                </p>
              </div>

              {/* Leadership Grid */}
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {leaders.map((leader) => (
                  <div
                    key={leader.name}
                    className="flex flex-col justify-between rounded-xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm transition-all duration-200 hover:border-[#7fb3ff]/40 hover:bg-white/[0.07]"
                  >
                    <div>
                      <div className="flex items-start gap-3.5">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-[#7fb3ff]/30 bg-[#2767b9]/25 text-base font-bold text-[#7fb3ff]">
                          {leader.initials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h2 className="truncate text-base font-semibold text-white">
                            {leader.name}
                          </h2>
                          <p className="text-xs font-medium text-[#7fb3ff]">
                            {leader.role}
                          </p>
                          {leader.program && (
                            <p className="text-[11px] text-slate-400">
                              {leader.program}
                            </p>
                          )}
                        </div>
                      </div>

                      <p className="mt-3.5 text-xs leading-relaxed text-slate-300">
                        {leader.bio}
                      </p>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                      {leader.specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-0.5 text-[10px] font-medium text-slate-200"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Call to Action Bar */}
              <div className="mt-8 rounded-xl border border-white/10 bg-[#2767b9]/15 p-5 text-center sm:flex sm:items-center sm:justify-between sm:text-left">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Interested in joining the Chapter?
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-300">
                    Open to all UCU students passionate about quantum computing and technology.
                  </p>
                </div>
                <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2.5 sm:mt-0">
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center rounded-md bg-[#2767b9] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#1f569d]"
                  >
                    Join Chapter
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center rounded-md border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="relative z-10 w-full">
        <AlphaNavbar position="bottom" />
      </div>
    </div>
  );
}
