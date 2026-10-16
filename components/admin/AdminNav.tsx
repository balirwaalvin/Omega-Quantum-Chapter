"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  ["/admin", "Overview"],
  ["/admin/events", "Events"],
  ["/admin/announcements", "Announcements"],
  ["/admin/resources", "Resources"],
  ["/admin/quizzes", "Quizzes"],
  ["/admin/members", "Members"],
  ["/admin/moderation", "Moderation"],
] as const;

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin sections" className="mb-6 flex flex-wrap gap-2">
      {links.map(([href, label]) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={active ? "btn" : "btn-secondary"}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
