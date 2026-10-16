"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getRepository } from "@/lib/data";
import { scheduleEventReminder } from "@/lib/notifications";
import type { CommentTarget, Project, ProjectStatus } from "@/types";

function newId(prefix: string) {
  return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
}

export async function rsvp(formData: FormData) {
  const session = await requireUser();
  const eventId = String(formData.get("eventId") || "");
  const status = formData.get("status") === "maybe" ? "maybe" : "going";
  const repo = getRepository();
  const event = await repo.getEvent(eventId);
  if (!event || !event.published) throw new Error("That event is not open.");
  await repo.setRsvp({
    eventId,
    userId: session.userId,
    status,
    createdAt: new Date().toISOString(),
  });
  await scheduleEventReminder({
    email: session.email,
    eventTitle: event.title,
    startsAt: event.startsAt,
  });
  revalidatePath(`/events/${eventId}`);
  revalidatePath("/events");
  revalidatePath("/dashboard");
}

export async function addComment(formData: FormData) {
  const session = await requireUser();
  const targetType = String(formData.get("targetType") || "") as CommentTarget;
  const targetId = String(formData.get("targetId") || "");
  const body = String(formData.get("body") || "").trim();
  if (!body) return;
  if (targetType !== "event" && targetType !== "resource" && targetType !== "project") {
    return;
  }
  await getRepository().saveComment({
    id: newId("comment"),
    targetType,
    targetId,
    userId: session.userId,
    body,
    status: "pending",
    createdAt: new Date().toISOString(),
  });
  revalidatePath("/admin/moderation");
  if (targetType === "event") revalidatePath(`/events/${targetId}`);
  if (targetType === "resource") revalidatePath("/learn");
  if (targetType === "project") revalidatePath(`/projects/${targetId}`);
}

export async function saveProject(formData: FormData) {
  const session = await requireUser();
  const repo = getRepository();
  const existingId = String(formData.get("id") || "");
  const previous = existingId ? await repo.getProject(existingId) : null;
  const status = String(formData.get("status") || "idea") as ProjectStatus;
  const memberIds = new Set(previous?.memberIds ?? []);
  memberIds.add(session.userId);
  const project: Project = {
    id: existingId || newId("proj"),
    title: String(formData.get("title") || "").trim(),
    body: String(formData.get("body") || "").trim(),
    status: status === "active" || status === "done" ? status : "idea",
    memberIds: [...memberIds],
    updatedAt: new Date().toISOString(),
  };
  if (!project.title) throw new Error("Title is required");
  await repo.saveProject(project);
  revalidatePath("/projects");
  revalidatePath(`/projects/${project.id}`);
  if (!existingId) redirect(`/projects/${project.id}`);
}

export async function updateChapterProfile(formData: FormData) {
  const session = await requireUser();
  const year = Number(formData.get("yearOfStudy") || 1);
  const interests = String(formData.get("interests") || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  await getRepository().updateUser(session.userId, {
    program: String(formData.get("program") || "").trim(),
    yearOfStudy: Number.isFinite(year) ? Math.min(6, Math.max(1, Math.round(year))) : 1,
    interests,
    bio: String(formData.get("bio") || "").trim(),
  });
  revalidatePath("/profile");
  revalidatePath("/directory");
}
