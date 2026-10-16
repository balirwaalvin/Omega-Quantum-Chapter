import { jsonRepository } from "@/lib/data/json-store";
import type { Repository } from "@/lib/data/repository";

/**
 * DATA_PROVIDER=json (default) uses the seed file plus .data/db.json.
 * DATA_PROVIDER=supabase is reserved for the adapter sketched in lib/supabase.ts.
 */
export function getRepository(): Repository {
  if (process.env.DATA_PROVIDER === "supabase") {
    throw new Error(
      "Supabase persistence is not wired yet. Implement the Repository methods in lib/supabase.ts, then return that adapter here.",
    );
  }
  return jsonRepository;
}
