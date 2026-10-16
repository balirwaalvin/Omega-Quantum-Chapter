"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Role } from "@/types";

const memberLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/events", label: "Events" },
  { href: "/announcements", label: "Announcements" },
  { href: "/learn", label: "Learn" },
  { href: "/playground", label: "Circuit playground" },
  { href: "/bloch", label: "Bloch sphere" },
  { href: "/algorithms/deutsch-jozsa", label: "Deutsch-Jozsa" },
  { href: "/algorithms/grover", label: "Grover" },
  { href: "/projects", label: "Projects" },
  { href: "/directory", label: "Directory" },
  { href: "/profile", label: "Profile" },
  { href: "/about", label: "About" },
];

const staffLinks = [
  { href: "/admin", label: "Admin overview" },
  { href: "/admin/events", label: "Manage events" },
  { href: "/admin/announcements", label: "Manage announcements" },
  { href: "/admin/resources", label: "Manage resources" },
  { href: "/admin/quizzes", label: "Manage quizzes" },
  { href: "/admin/members", label: "Members" },
  { href: "/admin/moderation", label: "Moderation" },
];

export function Sidebar({
  role,
  open,
  onClose,
}: {
  role: Role;
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const staff = role === "officer" || role === "admin";

  const nav = (
    <nav aria-label="Primary" className="flex flex-col gap-1 p-3">
      <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-blue-100/80">
        Chapter
      </p>
      {memberLinks.map((link) => {
        const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            aria-current={active ? "page" : undefined}
            className={`rounded-lg px-3 py-2 text-sm ${active ? "bg-white text-ucu-blue" : "text-white hover:bg-white/10"}`}
          >
            {link.label}
          </Link>
        );
      })}
      {staff ? (
        <>
          <p className="mt-4 px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-gold">
            {role === "admin" ? "Admin" : "Officer"}
          </p>
          {staffLinks
            .filter((link) => role === "admin" || link.href !== "/admin/members")
            .map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                className={`rounded-lg px-3 py-2 text-sm ${active ? "bg-gold text-ucu-blue" : "text-white hover:bg-white/10"}`}
              >
                {link.label}
              </Link>
            );
          })}
        </>
      ) : null}
    </nav>
  );

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 overflow-y-auto bg-ucu-blue md:block">
        {nav}
      </aside>
      {open ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/50"
            aria-label="Close menu"
            onClick={onClose}
          />
          <aside className="relative h-full w-72 overflow-y-auto bg-ucu-blue shadow-xl">
            {nav}
          </aside>
        </div>
      ) : null}
    </>
  );
}
