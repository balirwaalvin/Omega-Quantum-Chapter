/**
 * Event reminders are intentionally not sent yet.
 * Clerk already delivers signup and verification email.
 *
 * Later options:
 * - Supabase Edge Function on a cron, reading upcoming RSVPs
 * - Resend (RESEND_API_KEY) from a server action or scheduled route
 *
 * Call scheduleEventReminder when an RSVP is saved once a provider is configured.
 * Do not block RSVP on this function.
 */
export async function scheduleEventReminder(input: {
  email: string;
  eventTitle: string;
  startsAt: string;
}): Promise<{ queued: false; reason: string }> {
  void input;
  return {
    queued: false,
    reason:
      "Reminders are not configured. Wire Resend or a Supabase Edge Function in lib/notifications.ts.",
  };
}
