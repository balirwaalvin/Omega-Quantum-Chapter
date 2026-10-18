import { NextResponse } from "next/server";
import { createClerkClient } from "@clerk/backend";

const ADMIN_EMAIL = "admin@omega.ug";
const ADMIN_PASSWORD = "Admin@411";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: "This endpoint is dedicated to chapter admin authentication." },
        { status: 400 },
      );
    }

    if (password !== ADMIN_PASSWORD && password !== "Admin@411_OmegaUG2026#") {
      return NextResponse.json(
        { error: "Invalid password for administrator account." },
        { status: 401 },
      );
    }

    const clerkSecret = process.env.CLERK_SECRET_KEY;
    if (!clerkSecret) {
      return NextResponse.json(
        { error: "Server authentication configuration error." },
        { status: 500 },
      );
    }

    const client = createClerkClient({ secretKey: clerkSecret });

    // Look up or find the admin user
    const users = await client.users.getUserList({ emailAddress: [ADMIN_EMAIL] });
    let adminUser = users.data[0];

    if (!adminUser) {
      // Create admin user in Clerk if not already present
      adminUser = await client.users.createUser({
        emailAddress: [ADMIN_EMAIL],
        password: "Admin@411_OmegaUG2026#",
        firstName: "Omega",
        lastName: "Admin",
        publicMetadata: { role: "admin" },
      });
    } else if (adminUser.publicMetadata?.role !== "admin") {
      // Ensure role is admin
      adminUser = await client.users.updateUser(adminUser.id, {
        publicMetadata: { ...adminUser.publicMetadata, role: "admin" },
      });
    }

    // Create a sign-in token for seamless client sign-in
    const signInToken = await client.signInTokens.createSignInToken({
      userId: adminUser.id,
      expiresInSeconds: 300,
    });

    return NextResponse.json({
      success: true,
      token: signInToken.token,
      redirectUrl: "/admin",
    });
  } catch (error) {
    console.error("[Admin Login Error]:", error);
    return NextResponse.json(
      { error: "Failed to authenticate administrator account." },
      { status: 500 },
    );
  }
}
