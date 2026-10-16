import Link from "next/link";

const links = [
  ["/admin", "Overview"],
  ["/admin/events", "Events"],
  ["/admin/announcements", "Announcements"],
  ["/admin/resources", "Resources"],
  ["/admin/quizzes", "Quizzes"],
  ["/admin/members", "Members"],
  ["/admin/moderation", "Moderation"],
];

export function AdminNav() {
  return (
    <nav aria-label="Admin sections" className="mb-6 flex flex-wrap gap-2">
      {links.map(([href, label]) => (
        <Link key={href} href={href} className="btn-secondary">
          {label}
        </Link>
      ))}
    </nav>
  );
}
