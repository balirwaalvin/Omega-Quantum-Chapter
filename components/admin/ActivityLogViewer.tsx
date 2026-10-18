"use client";

import { useState } from "react";
import type { ActivityLog } from "@/types";

interface Props {
  logs: ActivityLog[];
}

export function ActivityLogViewer({ logs }: Props) {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filteredLogs = logs.filter((log) => {
    const matchesFilter = filter === "all" || log.category === filter;
    const matchesSearch =
      search.trim() === "" ||
      log.actorName.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      (log.actorEmail && log.actorEmail.toLowerCase().includes(search.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const categoryBadges: Record<string, { bg: string; text: string; border: string }> = {
    auth: { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", border: "border-blue-500/20" },
    event: { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/20" },
    quiz: { bg: "bg-purple-500/10", text: "text-purple-600 dark:text-purple-400", border: "border-purple-500/20" },
    member: { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", border: "border-amber-500/20" },
    moderation: { bg: "bg-rose-500/10", text: "text-rose-600 dark:text-rose-400", border: "border-rose-500/20" },
    system: { bg: "bg-slate-500/10", text: "text-slate-600 dark:text-slate-400", border: "border-slate-500/20" },
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-1.5">
          {["all", "auth", "member", "event", "quiz", "system"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold capitalize transition ${
                filter === cat
                  ? "bg-[#003087] text-white shadow-xs"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {cat === "all" ? "All Activities" : cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="search"
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-56 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-[#003087] focus:outline-none focus:ring-1 focus:ring-[#003087]"
          />
        </div>
      </div>

      {/* Logs Table / List */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="divide-y divide-slate-100">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No activity logs match the selected filter or search term.
            </div>
          ) : (
            filteredLogs.map((log) => {
              const badge = categoryBadges[log.category] || categoryBadges.system;
              const dateStr = new Date(log.timestamp).toLocaleString("en-UG", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={log.id}
                  className="flex flex-col gap-2 p-3.5 transition hover:bg-slate-50/70 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badge.bg} ${badge.text} ${badge.border}`}
                    >
                      {log.category}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {log.action}
                        </span>
                        <span className="text-[11px] text-slate-400">·</span>
                        <span className="text-xs font-semibold text-[#003087]">
                          {log.actorName}
                        </span>
                        {log.actorRole === "admin" && (
                          <span className="rounded bg-rose-100 px-1.5 py-0.2 text-[9px] font-bold uppercase text-rose-700">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-slate-600">
                        {log.details}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-medium text-slate-400">
                      {dateStr}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
