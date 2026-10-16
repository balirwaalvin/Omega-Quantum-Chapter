export function formatWhen(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en-UG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function toDateTimeLocal(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export function upcomingOrRecent<T extends { startsAt: string }>(events: T[], limit = 3): T[] {
  const now = Date.now();
  const upcoming = events.filter((event) => new Date(event.startsAt).getTime() >= now);
  return (upcoming.length > 0 ? upcoming : events).slice(0, limit);
}

export function displayName(name: string, email: string): string {
  return name.trim() || email.split("@")[0] || "Member";
}
