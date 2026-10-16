"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/auth";
import { getRepository } from "@/lib/data";
import { slugify } from "@/lib/format";
import type {
  AnnouncementPriority,
  EventKind,
  ResourceKind,
  ResourceTopic,
} from "@/types";

function newId(prefix: string) {
  return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
}

function requiredText(formData: FormData, key: string) {
  const value = String(formData.get(key) || "").trim();
  if (!value) throw new Error(`${key} is required`);
  return value;
}

export async function saveEvent(formData: FormData) {
  const session = await requireStaff();
  const repo = getRepository();
  const existingId = String(formData.get("id") || "");
  const startsAt = new Date(String(formData.get("startsAt") || ""));
  const endsAt = new Date(String(formData.get("endsAt") || ""));
  if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime())) {
    throw new Error("Enter a valid start and end.");
  }

  const previous = existingId ? await repo.getEvent(existingId) : null;
  await repo.saveEvent({
    id: existingId || newId("evt"),
    title: requiredText(formData, "title"),
    description: String(formData.get("description") || "").trim(),
    kind: (String(formData.get("kind") || "meeting") as EventKind) || "meeting",
    startsAt: startsAt.toISOString(),
    endsAt: endsAt.toISOString(),
    location: String(formData.get("location") || "").trim(),
    published: formData.get("published") === "on",
    createdBy: previous?.createdBy ?? session.userId,
  });
  revalidatePath("/events");
  revalidatePath("/dashboard");
  revalidatePath("/admin/events");
  redirect("/admin/events");
}

export async function deleteEvent(formData: FormData) {
  await requireStaff();
  await getRepository().deleteEvent(String(formData.get("id") || ""));
  revalidatePath("/events");
  revalidatePath("/admin/events");
  revalidatePath("/dashboard");
}

export async function saveAnnouncement(formData: FormData) {
  const session = await requireStaff();
  const repo = getRepository();
  const existingId = String(formData.get("id") || "");
  const previous = existingId ? (await repo.listAnnouncements(false)).find((item) => item.id === existingId) : null;
  const priority = String(formData.get("priority") || "normal") as AnnouncementPriority;
  await repo.saveAnnouncement({
    id: existingId || newId("ann"),
    title: requiredText(formData, "title"),
    body: String(formData.get("body") || "").trim(),
    priority: priority === "high" || priority === "urgent" ? priority : "normal",
    published: formData.get("published") === "on",
    authorId: previous?.authorId ?? session.userId,
    createdAt: previous?.createdAt ?? new Date().toISOString(),
  });
  revalidatePath("/announcements");
  revalidatePath("/dashboard");
  revalidatePath("/admin/announcements");
  redirect("/admin/announcements");
}

export async function deleteAnnouncement(formData: FormData) {
  await requireStaff();
  await getRepository().deleteAnnouncement(String(formData.get("id") || ""));
  revalidatePath("/announcements");
  revalidatePath("/admin/announcements");
  revalidatePath("/dashboard");
}

export async function saveResource(formData: FormData) {
  await requireStaff();
  const repo = getRepository();
  const existingId = String(formData.get("id") || "");
  const previous = existingId ? await repo.getResource(existingId) : null;
  const title = requiredText(formData, "title");
  const topic = String(formData.get("topic") || "Fundamentals") as ResourceTopic;
  const kind = String(formData.get("kind") || "article") as ResourceKind;
  await repo.saveResource({
    id: existingId || newId("res"),
    slug: previous?.slug || slugify(title) || newId("note"),
    title,
    summary: String(formData.get("summary") || "").trim(),
    topic,
    kind,
    url: String(formData.get("url") || "").trim(),
    body: String(formData.get("body") || "").trim(),
    published: formData.get("published") === "on",
    views: previous?.views ?? 0,
  });
  revalidatePath("/learn");
  revalidatePath("/admin/resources");
  redirect("/admin/resources");
}

export async function deleteResource(formData: FormData) {
  await requireStaff();
  await getRepository().deleteResource(String(formData.get("id") || ""));
  revalidatePath("/learn");
  revalidatePath("/admin/resources");
}

export async function saveSpotlight(formData: FormData) {
  await requireStaff();
  const repo = getRepository();
  const existing = (await repo.listSpotlights())[0];
  await repo.saveSpotlight({
    id: existing?.id ?? newId("spot"),
    title: requiredText(formData, "title"),
    summary: String(formData.get("summary") || "").trim(),
    href: String(formData.get("href") || "/playground").trim() || "/playground",
    active: true,
  });
  revalidatePath("/dashboard");
  revalidatePath("/admin");
}
