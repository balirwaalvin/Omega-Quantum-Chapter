import { headers } from "next/headers";
import { Webhook } from "svix";
import { clerkClient } from "@clerk/nextjs/server";
import { getRepository } from "@/lib/data";
import { canAccessChapter, parseRole } from "@/lib/auth-shared";
import { displayName } from "@/lib/format";
import type { Role } from "@/types";

type ClerkEmail = { id: string; email_address: string };

type ClerkUserPayload = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  image_url: string;
  email_addresses: ClerkEmail[];
  primary_email_address_id: string | null;
  public_metadata: { role?: Role; deactivated?: boolean } | null;
  external_accounts?: { provider: string }[] | null;
};

export async function POST(request: Request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    return Response.json({ error: "CLERK_WEBHOOK_SECRET is not set" }, { status: 500 });
  }

  const payload = await request.text();
  const headerList = await headers();
  const svixId = headerList.get("svix-id");
  const svixTimestamp = headerList.get("svix-timestamp");
  const svixSignature = headerList.get("svix-signature");
  if (!svixId || !svixTimestamp || !svixSignature) {
    return Response.json({ error: "Missing Svix headers" }, { status: 400 });
  }

  let event: { type: string; data: ClerkUserPayload };
  try {
    event = new Webhook(secret).verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as { type: string; data: ClerkUserPayload };
  } catch {
    return Response.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  if (event.type !== "user.created" && event.type !== "user.updated") {
    return Response.json({ ok: true, ignored: event.type });
  }

  const data = event.data;
  const email =
    data.email_addresses.find((item) => item.id === data.primary_email_address_id)
      ?.email_address ?? data.email_addresses[0]?.email_address ?? "";
  const providers = data.external_accounts?.map((account) => account.provider) ?? [];
  if (
    event.type === "user.created" &&
    Array.isArray(data.external_accounts) &&
    !canAccessChapter({ email, providers })
  ) {
    const client = await clerkClient();
    await client.users.deleteUser(data.id);
    return Response.json({ ok: true, removed: "email-domain" });
  }

  const bootstrap = process.env.CLERK_BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
  const existingRole = data.public_metadata?.role;
  const role: Role =
    event.type === "user.created"
      ? email.toLowerCase() === bootstrap
        ? "admin"
        : "member"
      : parseRole(existingRole);

  if (event.type === "user.created") {
    const client = await clerkClient();
    await client.users.updateUserMetadata(data.id, {
      publicMetadata: { role, deactivated: false },
    });
  }

  const repo = getRepository();
  const existing = await repo.getUser(data.id);
  const profile = {
    id: data.id,
    email,
    name: displayName(
      [data.first_name, data.last_name].filter(Boolean).join(" "),
      email,
    ),
    imageUrl: data.image_url ?? "",
    program: existing?.program ?? "",
    yearOfStudy: existing?.yearOfStudy ?? 1,
    interests: existing?.interests ?? [],
    bio: existing?.bio ?? "",
    role,
    deactivated: data.public_metadata?.deactivated === true,
    sample: false,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  };
  await repo.upsertUser(profile);

  return Response.json({ ok: true });
}
