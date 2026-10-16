import type { Metadata } from "next";
import { moderateComment } from "@/lib/actions/members";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminTable } from "@/components/admin/AdminTable";
import { PageHeader } from "@/components/ui/PageHeader";
import { requireStaff } from "@/lib/auth";
import { getRepository } from "@/lib/data";

export const metadata: Metadata = { title: "Moderation" };

export default async function ModerationPage() {
  await requireStaff();
  const repo = getRepository();
  const [comments, users] = await Promise.all([repo.listComments(), repo.listUsers()]);
  const names = new Map(users.map((user) => [user.id, user.name]));

  return (
    <div>
      <PageHeader
        eyebrow="Admin"
        title="Moderation"
        description="Approve or flag discussion comments. Pending comments stay hidden from other members."
      />
      <AdminNav />
      <AdminTable headers={["Author", "Comment", "Status", "Actions"]}>
        {comments.map((comment) => (
          <tr key={comment.id}>
            <td className="px-3 py-2">{names.get(comment.userId) ?? "Member"}</td>
            <td className="max-w-sm px-3 py-2">
              <p>{comment.body}</p>
              <p className="text-xs text-muted">{comment.targetType}</p>
            </td>
            <td className="px-3 py-2">{comment.status}</td>
            <td className="px-3 py-2">
              <div className="flex flex-wrap gap-2">
                <form action={moderateComment}>
                  <input type="hidden" name="id" value={comment.id} />
                  <input type="hidden" name="status" value="approved" />
                  <button className="btn-secondary" type="submit">Approve</button>
                </form>
                <form action={moderateComment}>
                  <input type="hidden" name="id" value={comment.id} />
                  <input type="hidden" name="status" value="flagged" />
                  <button className="btn-secondary" type="submit">Flag</button>
                </form>
                <form action={moderateComment}>
                  <input type="hidden" name="id" value={comment.id} />
                  <input type="hidden" name="status" value="delete" />
                  <button className="btn-danger" type="submit">Remove</button>
                </form>
              </div>
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
