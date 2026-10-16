/**
 * Supabase adapter placeholder.
 *
 * Production on Vercel should persist chapter data here. The local JSON store
 * in lib/data/json-store.ts cannot keep writes on a read-only serverless disk.
 *
 * 1. Create a Supabase project and tables matching types/index.ts
 *    (users, events, rsvps, announcements, resources, quizzes, attempts,
 *    comments, projects, spotlights).
 * 2. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
 * 3. Implement Repository from lib/data/repository.ts with the client below.
 * 4. Set DATA_PROVIDER=supabase. getRepository() in lib/data/index.ts is the switch.
 *
 * Use the service role key only on the server. Do not expose it to the browser.
 * Clerk remains the source of identity; store clerk user ids in the users table.
 */

import type { Repository } from "@/lib/data/repository";

export function createSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY before using Supabase.",
    );
  }

  // Example, after `npm install @supabase/supabase-js`:
  //
  // import { createClient } from "@supabase/supabase-js";
  // return createClient(url, anonKey);
  //
  // const { data, error } = await supabase.from("events").select("*").eq("published", true);
  // const { error: insertError } = await supabase.from("events").insert(event);
  return { url, anonKey };
}

export const supabaseRepository: Partial<Repository> = {
  // Fill each Repository method with a Supabase query, then return this
  // object from getRepository() when DATA_PROVIDER=supabase.
};
