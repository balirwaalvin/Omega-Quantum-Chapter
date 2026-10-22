# Omega

Omega is the Progressive Web App for the Quantum Computing Chapter at Uganda Christian University. The name follows the university motto, **Alpha and Omega: God the Beginning and the End**: the chapter works at the end of classical limits and the beginning of quantum possibilities.

## Stack

- Next.js App Router, TypeScript, Tailwind CSS
- Clerk for sign-in, sign-up, and email verification
- JSON seed data in development, with a Supabase-shaped adapter stub
- `quantum-circuit` for the playground and algorithm explainers
- Three.js (`@react-three/fiber`) for the Bloch sphere
- Serwist for the service worker
- JSON seed data in development, with a Supabase-shaped adapter stud
- Clerk for sign-in, sign-up, and email verification

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3001](http://localhost:3001).

### Clerk

1. Create a Clerk application.
2. Put the publishable key and secret key in `.env.local`.
3. In **User & authentication → Restrictions**, allow only the email domain `students.ucu.ac.ug`.
4. Keep **email verification** required. Clerk sends that message. The app does not implement its own verification tokens.
5. In **Sessions → Customize session token**, set the claims to:

```json
{
  "metadata": "{{user.public_metadata}}",
  "email": "{{user.primary_email_address}}"
}
```

The email claim lets middleware enforce the domain without an extra user lookup. If the claim is missing, middleware falls back to the Clerk Backend API.

6. Add a webhook endpoint `https://<your-domain>/api/webhooks/clerk` for `user.created` and `user.updated`. Copy the signing secret to `CLERK_WEBHOOK_SECRET`. For local development, use the Clerk CLI or ngrok. The app also upserts a chapter profile on each signed-in request, so the directory works before the webhook is reachable.
7. Set `CLERK_BOOTSTRAP_ADMIN_EMAIL` to the student address that should become the first admin when that account is created.

### Local test inboxes

Clerk development instances accept addresses shaped like `you+clerk_test@example.com` and the code `424242`. Those addresses are not UCU emails. Set `ALLOW_CLERK_TEST_EMAILS=true` only on your machine. Leave it unset in production.

### Domain restriction

The check lives in two places:

- Clerk Dashboard restrictions, which block other domains at sign-up.
- `isAllowedEmail` in `lib/auth-shared.ts`, used by `middleware.ts` and `lib/auth.ts`.

A session whose email is outside `@students.ucu.ac.ug` is revoked and sent back to `/login`. To add Google or Microsoft later, enable the provider in the Clerk dashboard. The same domain check still applies, so a social account must use a UCU student address.

### Roles

`publicMetadata.role` is `member` (default), `officer`, or `admin`.

- Members use the dashboard, events, learning, playground, directory, and projects.
- Officers and admins also manage events, announcements, resources, quizzes, moderation, and the analytics view.
- Admins promote, demote, and deactivate accounts from `/admin/members`. Deactivation bans the Clerk user and sets `publicMetadata.deactivated`.

Sample people in the directory are fixtures. Role changes apply only to real Clerk users.

## Environment variables

| Name | Purpose |
| --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk frontend key |
| `CLERK_SECRET_KEY` | Clerk server key |
| `CLERK_WEBHOOK_SECRET` | Svix signing secret |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/login` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/signup` |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` | `/dashboard` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` | `/dashboard` |
| `CLERK_BOOTSTRAP_ADMIN_EMAIL` | First admin address |
| `ALLOW_CLERK_TEST_EMAILS` | Local Clerk test emails only |
| `DATA_PROVIDER` | `json` (default) or `supabase` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `IBM_QUANTUM_TOKEN` | Optional future hardware jobs |
| `IBM_QUANTUM_CRN` | Optional Qiskit Runtime instance |
| `RESEND_API_KEY` | Optional future event reminders |

## Data

`lib/data/repository.ts` is the storage interface. The default adapter (`lib/data/json-store.ts`) loads `data/seed` and writes `.data/db.json` when the disk is writable.

Vercel’s filesystem does not keep those writes. For production, implement the same interface with the client sketched in `lib/supabase.ts` and set `DATA_PROVIDER=supabase`.

## PWA and caching

Production builds use webpack (`npm run build`) so Serwist can emit the service worker. `next dev` can stay on Turbopack because the service worker is disabled in development.

- **Precache:** the compiled app shell, icons, and `/offline`.
- **NetworkFirst:** document navigations, with a 3 second timeout, then the offline page.
- **StaleWhileRevalidate:** `/events`, `/learn`, and files under `/resources` (including the sensing PDF).
- **NetworkOnly:** Clerk hosts, `/login`, `/signup`, and the webhook route.

Authenticated pages are not precached. Sign-in always needs the network.

Icons are the placeholder qubit mark at `public/icons/icon-192.png` and `icon-512.png`. Replace `public/logo.svg` and those PNGs with the official UCU logo when you have it. Regenerate the PNGs with `node scripts/generate-icons.mjs` if you only need the placeholder again.

The manifest name is **Omega — UCU Quantum Computing Chapter**. The short name is **Omega**.

## Quantum features

- `/playground` places H, X, Y, Z, CNOT, and measure, then runs `quantum-circuit` locally.
- `/bloch` updates a single-qubit state vector and draws it with Three.js. Gate math is in `lib/quantum/state.ts`.
- `/algorithms/deutsch-jozsa` and `/algorithms/grover` pair a short explanation with a simulated circuit.

`lib/ibm-quantum.ts` shows where a later server action could submit a job to IBM Quantum or Qiskit Runtime. The playground does not call it.

## Notifications and later work

`lib/notifications.ts` is the hook for event reminders via Resend or a Supabase Edge Function. Clerk already sends verification mail.

Other extension points:

- Realtime chat can subscribe to a Supabase channel keyed by event or project id.
- Project notes can grow into a fuller board without changing the `Project` type’s status field.
- Extra Clerk social providers stay behind the same email-domain check.
- University SSO can be another Clerk enterprise connection, still checked by `isAllowedEmail`.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

Deploy on Vercel with the environment variables above. Set the Clerk webhook URL to the production `/api/webhooks/clerk` route after the first deploy.
