import type { Metadata } from "next";
import Link from "next/link";
import { deleteResource, saveResource } from "@/lib/actions/content";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminTable } from "@/components/admin/AdminTable";
import { PageHeader } from "@/components/ui/PageHeader";
import { requireStaff } from "@/lib/auth";
import { getRepository } from "@/lib/data";

export const metadata: Metadata = { title: "Manage resources" };

export default async function AdminResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  await requireStaff();
  const { edit } = await searchParams;
  const repo = getRepository();
  const resources = await repo.listResources();
  const current = edit ? await repo.getResource(edit) : null;

  return (
    <div>
      <PageHeader eyebrow="Admin" title="Resources" description="Library items by topic and format." />
      <AdminNav />
      <form action={saveResource} className="mb-8 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        {current ? <input type="hidden" name="id" value={current.id} /> : null}
        <label className="grid gap-1 text-sm font-medium">
          Title
          <input name="title" required defaultValue={current?.title ?? ""} className="field" />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Summary
          <input name="summary" defaultValue={current?.summary ?? ""} className="field" />
        </label>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="grid gap-1 text-sm font-medium">
            Topic
            <select name="topic" defaultValue={current?.topic ?? "Fundamentals"} className="field">
              <option>Fundamentals</option>
              <option>Algorithms</option>
              <option>Hardware</option>
              <option>Applications</option>
            </select>
          </label>
          <label className="grid gap-1 text-sm font-medium">
            Kind
            <select name="kind" defaultValue={current?.kind ?? "article"} className="field">
              <option value="article">Article</option>
              <option value="video">Video</option>
              <option value="link">Link</option>
              <option value="pdf">PDF</option>
            </select>
          </label>
        </div>
        <label className="grid gap-1 text-sm font-medium">
          URL
          <input name="url" defaultValue={current?.url ?? ""} className="field" placeholder="https:// or /resources/file.pdf" />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Body
          <textarea name="body" rows={6} defaultValue={current?.body ?? ""} className="field" />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked={current?.published ?? true} />
          Published
        </label>
        <button type="submit" className="btn w-fit">Save resource</button>
      </form>
      <AdminTable headers={["Title", "Topic", "Views", "Actions"]}>
        {resources.map((resource) => (
          <tr key={resource.id}>
            <td className="px-3 py-2">{resource.title}</td>
            <td className="px-3 py-2">{resource.topic}</td>
            <td className="px-3 py-2">{resource.views}</td>
            <td className="px-3 py-2">
              <div className="flex gap-2">
                <Link className="btn-secondary" href={`/admin/resources?edit=${resource.id}`}>Edit</Link>
                <form action={deleteResource}>
                  <input type="hidden" name="id" value={resource.id} />
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
