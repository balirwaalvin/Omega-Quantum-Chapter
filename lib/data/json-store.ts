import fs from "node:fs";
import path from "node:path";
import { seedDatabase } from "@/data/seed";
import type { Repository } from "@/lib/data/repository";
import type { Analytics, CommentStatus, Database } from "@/types";

const dataDir = path.join(process.cwd(), ".data");
const dbPath = path.join(dataDir, "db.json");

type StoreGlobal = typeof globalThis & { __omegaDb?: Database };

function cloneSeed(): Database {
  return JSON.parse(JSON.stringify(seedDatabase)) as Database;
}

function load(): Database {
  const g = globalThis as StoreGlobal;
  if (g.__omegaDb) return g.__omegaDb;

  let db = cloneSeed();
  try {
    if (fs.existsSync(dbPath)) {
      db = JSON.parse(fs.readFileSync(dbPath, "utf8")) as Database;
    }
  } catch {
    db = cloneSeed();
  }
  g.__omegaDb = db;
  return db;
}

function save(db: Database) {
  (globalThis as StoreGlobal).__omegaDb = db;
  try {
    fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  } catch {
    // Serverless filesystems (Vercel) are read-only. The in-memory copy
    // still serves this instance. Switch DATA_PROVIDER to supabase for
    // durable writes. See lib/supabase.ts.
  }
}

function replace<T extends { id: string }>(list: T[], item: T) {
  const index = list.findIndex((entry) => entry.id === item.id);
  if (index === -1) list.push(item);
  else list[index] = item;
}

export const jsonRepository: Repository = {
  async listUsers() {
    return load().users;
  },
  async getUser(id) {
    return load().users.find((user) => user.id === id) ?? null;
  },
  async upsertUser(user) {
    const db = load();
    replace(db.users, user);
    save(db);
    return user;
  },
  async updateUser(id, patch) {
    const db = load();
    const current = db.users.find((user) => user.id === id);
    if (!current) return null;
    Object.assign(current, patch);
    save(db);
    return current;
  },

  async listEvents(publishedOnly) {
    return load()
      .events.filter((event) => (publishedOnly ? event.published : true))
      .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  },
  async getEvent(id) {
    return load().events.find((event) => event.id === id) ?? null;
  },
  async saveEvent(event) {
    const db = load();
    replace(db.events, event);
    save(db);
    return event;
  },
  async deleteEvent(id) {
    const db = load();
    db.events = db.events.filter((event) => event.id !== id);
    db.rsvps = db.rsvps.filter((rsvp) => rsvp.eventId !== id);
    db.comments = db.comments.filter(
      (comment) => !(comment.targetType === "event" && comment.targetId === id),
    );
    save(db);
  },

  async listRsvps(eventId) {
    return load().rsvps.filter((rsvp) =>
      eventId ? rsvp.eventId === eventId : true,
    );
  },
  async setRsvp(rsvp) {
    const db = load();
    const index = db.rsvps.findIndex(
      (entry) => entry.eventId === rsvp.eventId && entry.userId === rsvp.userId,
    );
    if (index === -1) db.rsvps.push(rsvp);
    else db.rsvps[index] = rsvp;
    save(db);
  },

  async listAnnouncements(publishedOnly) {
    return load()
      .announcements.filter((item) => (publishedOnly ? item.published : true))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
  async saveAnnouncement(item) {
    const db = load();
    replace(db.announcements, item);
    save(db);
    return item;
  },
  async deleteAnnouncement(id) {
    const db = load();
    db.announcements = db.announcements.filter((item) => item.id !== id);
    save(db);
  },

  async listResources(opts) {
    return load()
      .resources.filter((item) => {
        if (opts?.publishedOnly && !item.published) return false;
        if (opts?.topic && item.topic !== opts.topic) return false;
        return true;
      })
      .sort((a, b) => b.views - a.views);
  },
  async getResourceBySlug(slug) {
    return load().resources.find((item) => item.slug === slug) ?? null;
  },
  async getResource(id) {
    return load().resources.find((item) => item.id === id) ?? null;
  },
  async saveResource(item) {
    const db = load();
    replace(db.resources, item);
    save(db);
    return item;
  },
  async deleteResource(id) {
    const db = load();
    db.resources = db.resources.filter((item) => item.id !== id);
    save(db);
  },
  async incrementResourceViews(id) {
    const db = load();
    const resource = db.resources.find((item) => item.id === id);
    if (!resource) return;
    resource.views += 1;
    save(db);
  },

  async listQuizzes(publishedOnly) {
    return load().quizzes.filter((quiz) =>
      publishedOnly ? quiz.published : true,
    );
  },
  async getQuiz(id) {
    return load().quizzes.find((quiz) => quiz.id === id) ?? null;
  },
  async saveQuiz(quiz) {
    const db = load();
    replace(db.quizzes, quiz);
    save(db);
    return quiz;
  },
  async deleteQuiz(id) {
    const db = load();
    db.quizzes = db.quizzes.filter((quiz) => quiz.id !== id);
    save(db);
  },

  async listAttempts(userId) {
    return load().attempts.filter((attempt) =>
      userId ? attempt.userId === userId : true,
    );
  },
  async saveAttempt(attempt) {
    const db = load();
    replace(db.attempts, attempt);
    save(db);
    return attempt;
  },

  async listComments(filter) {
    return load()
      .comments.filter((comment) => {
        if (filter?.targetType && comment.targetType !== filter.targetType) {
          return false;
        }
        if (filter?.targetId && comment.targetId !== filter.targetId) return false;
        if (filter?.status && comment.status !== filter.status) return false;
        return true;
      })
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  },
  async saveComment(comment) {
    const db = load();
    replace(db.comments, comment);
    save(db);
    return comment;
  },
  async setCommentStatus(id, status: CommentStatus) {
    const db = load();
    const comment = db.comments.find((entry) => entry.id === id);
    if (!comment) return;
    comment.status = status;
    save(db);
  },
  async deleteComment(id) {
    const db = load();
    db.comments = db.comments.filter((comment) => comment.id !== id);
    save(db);
  },

  async listProjects() {
    return load().projects.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  },
  async getProject(id) {
    return load().projects.find((project) => project.id === id) ?? null;
  },
  async saveProject(project) {
    const db = load();
    replace(db.projects, project);
    save(db);
    return project;
  },
  async deleteProject(id) {
    const db = load();
    db.projects = db.projects.filter((project) => project.id !== id);
    save(db);
  },

  async listSpotlights() {
    return load().spotlights;
  },
  async getActiveSpotlight() {
    return load().spotlights.find((item) => item.active) ?? null;
  },
  async saveSpotlight(item) {
    const db = load();
    if (item.active) {
      for (const spotlight of db.spotlights) spotlight.active = false;
    }
    replace(db.spotlights, item);
    save(db);
    return item;
  },

  async stats() {
    const db = load();
    const members = db.users.filter((user) => !user.deactivated);
    const activeMembers = members.length || 1;
    const byQuiz = new Map<string, number>();
    for (const attempt of db.attempts) {
      byQuiz.set(attempt.quizId, (byQuiz.get(attempt.quizId) ?? 0) + 1);
    }
    const analytics: Analytics = {
      totalMembers: db.users.length,
      activeMembers: members.length,
      rsvpCount: db.rsvps.length,
      popularResources: [...db.resources]
        .sort((a, b) => b.views - a.views)
        .slice(0, 5)
        .map((resource) => ({
          id: resource.id,
          title: resource.title,
          views: resource.views,
        })),
      quizCompletion: db.quizzes.map((quiz) => {
        const completions = byQuiz.get(quiz.id) ?? 0;
        return {
          quizId: quiz.id,
          title: quiz.title,
          completions,
          rate: completions / activeMembers,
        };
      }),
    };
    return analytics;
  },
};
