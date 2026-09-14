import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { db } from "@/db";
import { profiles } from "@/db/schema/profile";
import { user } from "@/db/schema/auth";
import { eq, and, ne } from "drizzle-orm";
import { usernameSchema } from "@/lib/validation/auth-schemas";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { displayName, username, bio, avatarUrl } = body;

    if (!displayName || displayName.trim().length < 2) {
      return NextResponse.json(
        { error: "Display name must be at least 2 characters." },
        { status: 400 }
      );
    }

    // Validate username if provided
    let cleanUsername: string | undefined;
    if (username) {
      const parsed = usernameSchema.safeParse(username);
      if (!parsed.success) {
        return NextResponse.json(
          { error: parsed.error.issues[0]?.message || "Invalid username." },
          { status: 400 }
        );
      }
      cleanUsername = parsed.data;

      // Check if username taken by another user
      const duplicate = await db
        .select()
        .from(profiles)
        .where(
          and(
            eq(profiles.username, cleanUsername),
            ne(profiles.userId, session.user.id)
          )
        )
        .limit(1);

      if (duplicate.length > 0) {
        return NextResponse.json(
          { error: "This username is already taken. Please choose another." },
          { status: 409 }
        );
      }
    }

    // Update profiles table
    await db
      .update(profiles)
      .set({
        displayName: displayName.trim(),
        ...(cleanUsername ? { username: cleanUsername } : {}),
        bio: bio !== undefined ? bio.trim() : undefined,
        avatarUrl: avatarUrl !== undefined ? avatarUrl : undefined,
        updatedAt: new Date(),
      })
      .where(eq(profiles.userId, session.user.id));

    // Also update name in Better Auth user table
    await db
      .update(user)
      .set({
        name: displayName.trim(),
        image: avatarUrl !== undefined ? avatarUrl : undefined,
        updatedAt: new Date(),
      })
      .where(eq(user.id, session.user.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PROFILE UPDATE ERROR]:", error);
    return NextResponse.json(
      { error: "Internal server error updating profile." },
      { status: 500 }
    );
  }
}
