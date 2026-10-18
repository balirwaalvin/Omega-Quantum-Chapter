"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Role } from "@/types";

const navSections = [
  {
    heading: "Portal",
    links: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/events", label: "Events" },
      { href: "/announcements", label: "Announcements" },
      { href: "/projects", label: "Projects" },
      { href: "/directory", label: "Directory" },
    ],
  },
  {
    heading: "Quantum Lab",
    links: [
      { href: "/learn", label: "Learn & Quizzes" },
      { href: "/playground", label: "Circuit Lab" },
      { href: "/bloch", label: "Bloch Sphere" },
      { href: "/algorithms/deutsch-jozsa", label: "Deutsch-Jozsa" },
      { href: "/algorithms/grover", label: "Grover Search" },
    ],
  },
  {
    heading: "Account",
    links: [
      { href: "/profile", label: "Profile" },
      { href: "/about", label: "About" },
    ],
  },
];

const staffLinks = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/members", label: "Members" },
  { href: "/admin/activity", label: "Activity Logs" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/announcements", label: "Announcements" },
  { href: "/admin/resources", label: "Resources" },
  { href: "/admin/quizzes", label: "Quizzes" },
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
    <div className="flex h-full flex-col justify-between p-3">
      <nav aria-label="Primary" className="flex flex-col gap-3.5">
        {navSections.map((section) => (
          <div key={section.heading} className="flex flex-col gap-0.5">
            <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#7fb3ff]">
              {section.heading}
            </p>
            {section.links.map((link) => {
              const active =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all sm:text-[13px] ${
                    active
                      ? "bg-[#2767b9] text-white shadow-sm"
                      : "text-slate-200 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        ))}

        {staff ? (
          <div className="flex flex-col gap-0.5 border-t border-white/15 pt-3">
            <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-gold">
              {role === "admin" ? "Admin" : "Officer"}
            </p>
            {staffLinks
              .filter(
                (link) => role === "admin" || link.href !== "/admin/members",
              )
              .map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all sm:text-[13px] ${
                      active
                        ? "alpha-gradient-pill text-white shadow-sm"
                        : "text-slate-200 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
          </div>
        ) : null}
      </nav>

      <div className="mt-4 rounded-lg bg-[#f8f8f8] px-3 py-2.5">
        <div className="flex items-center justify-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/ucu.png"
            alt="Uganda Christian University"
            className="h-6 w-auto object-contain select-none"
          />
          <span className="h-5 w-px bg-slate-300" aria-hidden />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/department.png"
            alt="Department of Computing and Technology"
            className="h-8 w-auto object-contain select-none"
          />
          <span className="h-5 w-px bg-slate-300" aria-hidden />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/chapter.png"
            alt="Quantum Computing Chapter"
            className="h-8 w-auto object-contain select-none"
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="alpha-sidenav-bg sticky top-[3.75rem] hidden h-[calc(100vh-3.75rem)] w-60 shrink-0 overflow-y-auto border-r border-white/10 md:block">
        {nav}
      </aside>
      {open ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            aria-label="Close menu"
            onClick={onClose}
          />
          <aside className="alpha-sidenav-bg relative h-full w-64 overflow-y-auto shadow-2xl">
            {nav}
          </aside>
        </div>
      ) : null}
    </>
  );
}

