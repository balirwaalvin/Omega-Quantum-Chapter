"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { requireAdmin, requireStaff } from "@/lib/auth";
import { getRepository } from "@/lib/data";
import { parseRole } from "@/lib/auth-shared";
import type { CommentStatus } from "@/types";

export async function setMemberRole(formData: FormData) {
  await requireAdmin();
  const userId = String(formData.get("userId") || "");
  const role = parseRole(formData.get("role"));
  const repo = getRepository();
  const profile = await repo.getUser(userId);
  if (!profile || profile.sample) {
    throw new Error("Sample profiles are directory fixtures. Change roles on a Clerk user.");
  }

  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    publicMetadata: { role, deactivated: profile.deactivated },
  });
  await repo.updateUser(userId, { role });
  revalidatePath("/admin/members");
  revalidatePath("/directory");
}

export async function setMemberActive(formData: FormData) {
  const session = await requireAdmin();
  const userId = String(formData.get("userId") || "");
  const deactivated = formData.get("deactivated") === "true";
  if (userId === session.userId) {
    throw new Error("Use another admin account to change your own access.");
  }
  const repo = getRepository();
  const profile = await repo.getUser(userId);
  if (!profile || profile.sample) {
    throw new Error("Sample profiles cannot be deactivated.");
  }

  const client = await clerkClient();
  if (deactivated) await client.users.banUser(userId);
  else await client.users.unbanUser(userId);
  await client.users.updateUserMetadata(userId, {
    publicMetadata: { role: profile.role, deactivated },
  });
  await repo.updateUser(userId, { deactivated });
  revalidatePath("/admin/members");
  revalidatePath("/directory");
}

export async function moderateComment(formData: FormData) {
  await requireStaff();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  const repo = getRepository();
  if (status === "delete") await repo.deleteComment(id);
  else if (status === "approved" || status === "flagged" || status === "pending") {
    await repo.setCommentStatus(id, status as CommentStatus);
  }
  revalidatePath("/admin/moderation");
  revalidatePath("/events");
  revalidatePath("/learn");
  revalidatePath("/projects");
}
