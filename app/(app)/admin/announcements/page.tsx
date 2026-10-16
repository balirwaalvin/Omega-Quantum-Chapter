import type { Metadata } from "next";
import Link from "next/link";
import { deleteAnnouncement, saveAnnouncement } from "@/lib/actions/content";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminTable } from "@/components/admin/AdminTable";
import { PageHeader } from "@/components/ui/PageHeader";
import { requireStaff } from "@/lib/auth";
import { getRepository } from "@/lib/data";

export const metadata: Metadata = { title: "Manage announcements" };

export default async function AdminAnnouncementsPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  await requireStaff();
  const { edit } = await searchParams;
  const items = await getRepository().listAnnouncements(false);
  const current = items.find((item) => item.id === edit);

  return (
    <div>
      <PageHeader eyebrow="Admin" title="Announcements" description="Post updates and flag priority." />
      <AdminNav />
      <form action={saveAnnouncement} className="mb-8 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        {current ? <input type="hidden" name="id" value={current.id} /> : null}
        <label className="grid gap-1 text-sm font-medium">
          Title
          <input name="title" required defaultValue={current?.title ?? ""} className="field" />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Body
          <textarea name="body" rows={4} defaultValue={current?.body ?? ""} className="field" />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Priority
          <select name="priority" defaultValue={current?.priority ?? "normal"} className="field">
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked={current?.published ?? true} />
          Published
        </label>
        <button type="submit" className="btn w-fit">Save announcement</button>
      </form>
      <AdminTable headers={["Title", "Priority", "Status", "Actions"]}>
        {items.map((item) => (
          <tr key={item.id}>
            <td className="px-3 py-2">{item.title}</td>
            <td className="px-3 py-2">{item.priority}</td>
            <td className="px-3 py-2">{item.published ? "Published" : "Draft"}</td>
            <td className="px-3 py-2">
              <div className="flex gap-2">
                <Link className="btn-secondary" href={`/admin/announcements?edit=${item.id}`}>Edit</Link>
                <form action={deleteAnnouncement}>
                  <input type="hidden" name="id" value={item.id} />
                  <button className="btn-danger" type="submit">Delete</button>
                </form>
              </div>
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
