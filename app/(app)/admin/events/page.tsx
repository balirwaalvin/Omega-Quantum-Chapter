import type { Metadata } from "next";
import Link from "next/link";
import { deleteEvent, saveEvent } from "@/lib/actions/content";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminTable } from "@/components/admin/AdminTable";
import { PageHeader } from "@/components/ui/PageHeader";
import { requireStaff } from "@/lib/auth";
import { getRepository } from "@/lib/data";
import { formatWhen, toDateTimeLocal } from "@/lib/format";

export const metadata: Metadata = { title: "Manage events" };

export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  await requireStaff();
  const { edit } = await searchParams;
  const repo = getRepository();
  const events = await repo.listEvents(false);
  const current = edit ? await repo.getEvent(edit) : null;

  return (
    <div>
      <PageHeader eyebrow="Admin" title="Events" description="Create, edit, publish, or remove chapter events." />
      <AdminNav />
      <form action={saveEvent} className="mb-8 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        {current ? <input type="hidden" name="id" value={current.id} /> : null}
        <h2 className="font-semibold text-ucu-blue">{current ? "Edit event" : "New event"}</h2>
        <label className="grid gap-1 text-sm font-medium">
          Title
          <input name="title" required defaultValue={current?.title ?? ""} className="field" />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Description
          <textarea name="description" rows={4} defaultValue={current?.description ?? ""} className="field" />
        </label>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="grid gap-1 text-sm font-medium">
            Kind
            <select name="kind" defaultValue={current?.kind ?? "workshop"} className="field">
              <option value="workshop">Workshop</option>
              <option value="talk">Talk</option>
              <option value="meeting">Meeting</option>
            </select>
          </label>
          <label className="grid gap-1 text-sm font-medium">
            Location
            <input name="location" defaultValue={current?.location ?? ""} className="field" />
          </label>
          <label className="grid gap-1 text-sm font-medium">
            Starts
            <input type="datetime-local" name="startsAt" required defaultValue={current ? toDateTimeLocal(current.startsAt) : ""} className="field" />
          </label>
          <label className="grid gap-1 text-sm font-medium">
            Ends
            <input type="datetime-local" name="endsAt" required defaultValue={current ? toDateTimeLocal(current.endsAt) : ""} className="field" />
          </label>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked={current?.published ?? true} />
          Published
        </label>
        <button type="submit" className="btn w-fit">
          Save event
        </button>
      </form>
      <AdminTable headers={["Event", "When", "Status", "Actions"]}>
        {events.map((event) => (
          <tr key={event.id}>
            <td className="px-3 py-2 font-medium">{event.title}</td>
            <td className="px-3 py-2">{formatWhen(event.startsAt)}</td>
            <td className="px-3 py-2">{event.published ? "Published" : "Draft"}</td>
            <td className="px-3 py-2">
              <div className="flex gap-2">
                <Link href={`/admin/events?edit=${event.id}`} className="btn-secondary">
                  Edit
                </Link>
                <form action={deleteEvent}>
                  <input type="hidden" name="id" value={event.id} />
                  <button type="submit" className="btn-danger">
                    Delete
                  </button>
                </form>
              </div>
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
