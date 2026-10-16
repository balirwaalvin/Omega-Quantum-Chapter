import { formatWhen } from "@/lib/format";
import type { Announcement } from "@/types";

const border = {
  urgent: "border-l-magenta",
  high: "border-l-gold",
  normal: "border-l-ucu-blue",
};

const badge = {
  urgent: "bg-pink-50 text-magenta",
  high: "bg-amber-50 text-amber-800",
  normal: "bg-blue-50 text-ucu-blue",
};

export function AnnouncementCard({ item }: { item: Announcement }) {
  return (
    <article
      className={`rounded-2xl border border-slate-200 border-l-4 bg-white p-4 shadow-xs ${border[item.priority]}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${badge[item.priority]}`}
        >
          {item.priority}
        </span>
        <time className="text-xs text-muted" dateTime={item.createdAt}>
          {formatWhen(item.createdAt)}
        </time>
      </div>
      <h2 className="mt-2 text-lg font-semibold text-ucu-blue">{item.title}</h2>
      <p className="mt-1.5 whitespace-pre-wrap text-sm leading-6 text-ink">
        {item.body}
      </p>
    </article>
  );
}
