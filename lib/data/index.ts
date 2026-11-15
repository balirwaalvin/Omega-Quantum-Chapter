import { jsonRepository } from "@/lib/data/json-store";
import type { Repository } from "@/lib/data/repository";
import { supabaseRepository } from "@/lib/supabase";

/**
 * DATA_PROVIDER=json (default) uses the seed file plus .data/db.json.
 * DATA_PROVIDER=supabase uses the cloud PostgREST adapter in lib/supabase.ts
 * with automatic local fallback.
 */
export function getRepository(): Repository {
  if (process.env.DATA_PROVIDER === "supabase") {
    return supabaseRepository;
  }
  return jsonRepository;
}
