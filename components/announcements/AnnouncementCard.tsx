import type { Announcement } from "@/types";

const border = {
  urgent: "border-l-magenta",
  high: "border-l-gold",
  normal: "border-l-ucu-blue",
};

export function AnnouncementCard({ item }: { item: Announcement }) {
  return (
    <article className={`rounded-2xl border border-slate-200 border-l-4 bg-white p-4 shadow-sm ${border[item.priority]}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-magenta">{item.priority}</p>
      <h2 className="mt-1 text-lg font-semibold text-ucu-blue">{item.title}</h2>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-ink">{item.body}</p>
    </article>
  );
}
