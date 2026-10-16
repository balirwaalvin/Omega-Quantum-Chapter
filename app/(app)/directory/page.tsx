import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { requireUser } from "@/lib/auth";
import { getRepository } from "@/lib/data";

export const metadata: Metadata = { title: "Directory" };

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requireUser();
  const { q } = await searchParams;
  const query = (q ?? "").trim().toLowerCase();
  const users = (await getRepository().listUsers())
    .filter((user) => !user.deactivated)
    .filter((user) => {
      if (!query) return true;
      const haystack = [user.name, user.email, user.program, user.bio, ...user.interests]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });

  return (
    <div>
      <PageHeader
        eyebrow="People"
        title="Member directory"
        description="Search by name, program, or interest. Sample profiles are marked."
      />
      <form className="mb-5 flex gap-2" action="/directory">
        <label className="sr-only" htmlFor="q">
          Search members
        </label>
        <input id="q" name="q" defaultValue={q ?? ""} placeholder="Search members" className="field" />
        <button type="submit" className="btn">
          Search
        </button>
      </form>
      <ul className="grid gap-3 md:grid-cols-2">
        {users.map((user) => (
          <li key={user.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-3">
              {user.imageUrl ? (
                // Clerk image hosts vary; a plain image keeps the directory free of remote config.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.imageUrl} alt="" className="h-12 w-12 rounded-full object-cover" />
              ) : (
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ucu-blue text-sm font-semibold text-white">
                  {user.name.slice(0, 1)}
                </span>
              )}
              <div>
                <p className="font-semibold text-ucu-blue">{user.name}</p>
                <p className="text-xs uppercase tracking-wide text-forest">{user.role}</p>
              </div>
            </div>
            <p className="mt-3 text-sm">{user.program || "Program not set"} · Year {user.yearOfStudy}</p>
            <p className="mt-1 text-sm text-muted">{user.bio || "No bio yet."}</p>
            {user.interests.length > 0 ? (
              <p className="mt-2 text-xs text-ink">{user.interests.join(" · ")}</p>
            ) : null}
            {user.sample ? <p className="mt-2 text-xs text-muted">Sample profile</p> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
