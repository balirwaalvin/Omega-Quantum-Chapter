/**
 * Supabase Cloud Persistence Adapter (PostgREST / JSONB state + table sync).
 *
 * Uses zero-dependency native `fetch` against Supabase's REST API so it works
 * seamlessly in both Node and Serverless/Edge runtimes without extra bundle bloat.
 *
 * Configuration:
 *   - DATA_PROVIDER=supabase
 *   - NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
 *   - SUPABASE_SERVICE_ROLE_KEY=<service-role-key> (or NEXT_PUBLIC_SUPABASE_ANON_KEY)
 *
 * If Supabase credentials are not yet configured or unreachable, operations
 * transparently fall back to `jsonRepository` so the portal never crashes.
 */

import { jsonRepository } from "@/lib/data/json-store";
import type { Repository } from "@/lib/data/repository";
import type {
  CommentStatus,
  Database,
} from "@/types";

interface SupabaseConfig {
  url: string;
  key: string;
}

export function getSupabaseConfig(): SupabaseConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )?.trim();
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ""), key };
}

/**
 * Reads the persisted chapter state snapshot from Supabase `omega_state` table
 * (`id = 'primary'`, `payload: jsonb`), falling back to `jsonRepository` when
 * offline or unconfigured.
 */
async function pullRemoteSnapshot(): Promise<Database | null> {
  const cfg = getSupabaseConfig();
  if (!cfg) return null;

  try {
    const res = await fetch(
      `${cfg.url}/rest/v1/omega_state?id=eq.primary&select=payload`,
      {
        headers: {
          apikey: cfg.key,
          Authorization: `Bearer ${cfg.key}`,
          Accept: "application/json",
        },
        cache: "no-store",
      },
    );
    if (!res.ok) return null;
    const rows = (await res.json()) as Array<{ payload?: Database }>;
    return rows[0]?.payload ?? null;
  } catch {
    return null;
  }
}

/**
 * Upserts a mutated chapter item or state to Supabase table rows when configured.
 */
async function syncTableRow(
  table: string,
  row: Record<string, unknown>,
): Promise<void> {
  const cfg = getSupabaseConfig();
  if (!cfg) return;

  try {
    await fetch(`${cfg.url}/rest/v1/${table}`, {
      method: "POST",
      headers: {
        apikey: cfg.key,
        Authorization: `Bearer ${cfg.key}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify(row),
    });
  } catch {
    // Non-fatal: local/in-memory state remains authoritative for this request.
  }
}

async function deleteTableRow(
  table: string,
  idColumn: string,
  idValue: string,
): Promise<void> {
  const cfg = getSupabaseConfig();
  if (!cfg) return;

  try {
    await fetch(
      `${cfg.url}/rest/v1/${table}?${encodeURIComponent(idColumn)}=eq.${encodeURIComponent(idValue)}`,
      {
        method: "DELETE",
        headers: {
          apikey: cfg.key,
          Authorization: `Bearer ${cfg.key}`,
        },
      },
    );
  } catch {
    // Non-fatal fallback
  }
}

export const supabaseRepository: Repository = {
  async listUsers() {
    const snap = await pullRemoteSnapshot();
    return snap ? snap.users : jsonRepository.listUsers();
  },
  async getUser(id) {
    const users = await this.listUsers();
    return users.find((u) => u.id === id) ?? null;
  },
  async upsertUser(user) {
    const saved = await jsonRepository.upsertUser(user);
    await syncTableRow("users", user as unknown as Record<string, unknown>);
    return saved;
  },
  async updateUser(id, patch) {
    const updated = await jsonRepository.updateUser(id, patch);
    if (updated) {
      await syncTableRow("users", updated as unknown as Record<string, unknown>);
    }
    return updated;
  },

  async listEvents(publishedOnly) {
    return jsonRepository.listEvents(publishedOnly);
  },
  async getEvent(id) {
    return jsonRepository.getEvent(id);
  },
  async saveEvent(event) {
    const saved = await jsonRepository.saveEvent(event);
    await syncTableRow("events", event as unknown as Record<string, unknown>);
    return saved;
  },
  async deleteEvent(id) {
    await jsonRepository.deleteEvent(id);
    await deleteTableRow("events", "id", id);
  },

  async listRsvps(eventId) {
    return jsonRepository.listRsvps(eventId);
  },
  async setRsvp(rsvp) {
    await jsonRepository.setRsvp(rsvp);
    await syncTableRow("rsvps", rsvp as unknown as Record<string, unknown>);
  },

  async listAnnouncements(publishedOnly) {
    return jsonRepository.listAnnouncements(publishedOnly);
  },
  async saveAnnouncement(item) {
    const saved = await jsonRepository.saveAnnouncement(item);
    await syncTableRow(
      "announcements",
      item as unknown as Record<string, unknown>,
    );
    return saved;
  },
  async deleteAnnouncement(id) {
    await jsonRepository.deleteAnnouncement(id);
    await deleteTableRow("announcements", "id", id);
  },

  async listResources(opts) {
    return jsonRepository.listResources(opts);
  },
  async getResourceBySlug(slug) {
    return jsonRepository.getResourceBySlug(slug);
  },
  async getResource(id) {
    return jsonRepository.getResource(id);
  },
  async saveResource(item) {
    const saved = await jsonRepository.saveResource(item);
    await syncTableRow("resources", item as unknown as Record<string, unknown>);
    return saved;
  },
  async deleteResource(id) {
    await jsonRepository.deleteResource(id);
    await deleteTableRow("resources", "id", id);
  },
  async incrementResourceViews(id) {
    await jsonRepository.incrementResourceViews(id);
  },

  async listQuizzes(publishedOnly) {
    return jsonRepository.listQuizzes(publishedOnly);
  },
  async getQuiz(id) {
    return jsonRepository.getQuiz(id);
  },
  async saveQuiz(quiz) {
    const saved = await jsonRepository.saveQuiz(quiz);
    await syncTableRow("quizzes", quiz as unknown as Record<string, unknown>);
    return saved;
  },
  async deleteQuiz(id) {
    await jsonRepository.deleteQuiz(id);
    await deleteTableRow("quizzes", "id", id);
  },

  async listAttempts(userId) {
    return jsonRepository.listAttempts(userId);
  },
  async saveAttempt(attempt) {
    const saved = await jsonRepository.saveAttempt(attempt);
    await syncTableRow(
      "attempts",
      attempt as unknown as Record<string, unknown>,
    );
    return saved;
  },

  async listComments(filter) {
    return jsonRepository.listComments(filter);
  },
  async saveComment(comment) {
    const saved = await jsonRepository.saveComment(comment);
    await syncTableRow(
      "comments",
      comment as unknown as Record<string, unknown>,
    );
    return saved;
  },
  async setCommentStatus(id, status: CommentStatus) {
    await jsonRepository.setCommentStatus(id, status);
  },
  async deleteComment(id) {
    await jsonRepository.deleteComment(id);
    await deleteTableRow("comments", "id", id);
  },

  async listProjects() {
    return jsonRepository.listProjects();
  },
  async getProject(id) {
    return jsonRepository.getProject(id);
  },
  async saveProject(project) {
    const saved = await jsonRepository.saveProject(project);
    await syncTableRow(
      "projects",
      project as unknown as Record<string, unknown>,
    );
    return saved;
  },
  async deleteProject(id) {
    await jsonRepository.deleteProject(id);
    await deleteTableRow("projects", "id", id);
  },

  async listSpotlights() {
    return jsonRepository.listSpotlights();
  },
  async getActiveSpotlight() {
    return jsonRepository.getActiveSpotlight();
  },
  async saveSpotlight(item) {
    const saved = await jsonRepository.saveSpotlight(item);
    await syncTableRow(
      "spotlights",
      item as unknown as Record<string, unknown>,
    );
    return saved;
  },

  async stats() {
    return jsonRepository.stats();
  },
  async listActivityLogs() {
    return jsonRepository.listActivityLogs();
  },
};
