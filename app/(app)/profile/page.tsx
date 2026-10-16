import type { Metadata } from "next";
import { UserButton } from "@clerk/nextjs";
import { updateChapterProfile } from "@/lib/actions/community";
import { requireUser } from "@/lib/auth";
import { getRepository } from "@/lib/data";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const session = await requireUser();
  const profile = await getRepository().getUser(session.userId);

  return (
    <div>
      <PageHeader
        eyebrow="Account"
        title="Your profile"
        description="Name and photo are managed by Clerk. Program, year, interests, and bio stay with the chapter."
      />
      <div className="mb-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <UserButton />
        <div>
          <p className="font-semibold text-ucu-blue">{session.name}</p>
          <p className="text-sm text-muted">{session.email}</p>
          <p className="text-xs uppercase tracking-wide text-forest">{session.role}</p>
        </div>
      </div>
      <form action={updateChapterProfile} className="grid max-w-xl gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <label className="grid gap-1 text-sm font-medium">
          Program
          <input name="program" defaultValue={profile?.program ?? ""} className="field" />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Year of study
          <input name="yearOfStudy" type="number" min={1} max={6} defaultValue={profile?.yearOfStudy ?? 1} className="field" />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Interests
          <input name="interests" defaultValue={profile?.interests.join(", ") ?? ""} className="field" placeholder="qubits, algorithms" />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Short bio
          <textarea name="bio" rows={4} defaultValue={profile?.bio ?? ""} className="field" />
        </label>
        <button type="submit" className="btn w-fit">
          Save profile
        </button>
      </form>
    </div>
  );
}
