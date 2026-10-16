import type { Metadata } from "next";
import { setMemberActive, setMemberRole } from "@/lib/actions/members";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminTable } from "@/components/admin/AdminTable";
import { PageHeader } from "@/components/ui/PageHeader";
import { requireAdmin } from "@/lib/auth";
import { getRepository } from "@/lib/data";

export const metadata: Metadata = { title: "Members" };

export default async function AdminMembersPage() {
  await requireAdmin();
  const users = await getRepository().listUsers();

  return (
    <div>
      <PageHeader
        eyebrow="Admin"
        title="Members"
        description="Promote officers, or deactivate a Clerk account. Sample profiles are read-only."
      />
      <AdminNav />
      <AdminTable headers={["Name", "Email", "Role", "Access"]}>
        {users.map((user) => (
          <tr key={user.id}>
            <td className="px-3 py-2">
              {user.name}
              {user.sample ? <span className="ml-2 text-xs text-muted">Sample</span> : null}
            </td>
            <td className="px-3 py-2">{user.email}</td>
            <td className="px-3 py-2">
              {user.sample ? (
                user.role
              ) : (
                <form action={setMemberRole} className="flex gap-2">
                  <input type="hidden" name="userId" value={user.id} />
                  <select name="role" defaultValue={user.role} className="field" aria-label={`Role for ${user.name}`}>
                    <option value="member">Member</option>
                    <option value="officer">Officer</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button type="submit" className="btn-secondary">Save</button>
                </form>
              )}
            </td>
            <td className="px-3 py-2">
              {user.sample ? (
                user.deactivated ? "Inactive" : "Active"
              ) : (
                <form action={setMemberActive}>
                  <input type="hidden" name="userId" value={user.id} />
                  <input type="hidden" name="deactivated" value={user.deactivated ? "false" : "true"} />
                  <button type="submit" className="btn-danger">
                    {user.deactivated ? "Reactivate" : "Deactivate"}
                  </button>
                </form>
              )}
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
