import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user, profiles, posts, follows } from "@/db/schema";
import { eq, desc, sql, and, or } from "drizzle-orm";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username: rawUsername } = await params;
    const cleanUsername = decodeURIComponent(rawUsername).replace(/^@/, "").toLowerCase();

    // Find profile by username, or user by name/id
    const [foundProfile] = await db
      .select({
        userId: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: profiles.avatarUrl,
        username: profiles.username,
        displayName: profiles.displayName,
        bio: profiles.bio,
        role: profiles.role,
        status: profiles.status,
        createdAt: user.createdAt,
      })
      .from(user)
      .leftJoin(profiles, eq(user.id, profiles.userId))
      .where(
        or(
          eq(profiles.username, cleanUsername),
          eq(user.name, cleanUsername),
          eq(user.id, cleanUsername)
        )
      )
      .limit(1);

    if (!foundProfile) {
      return NextResponse.json(
        { success: false, error: "Creator not found" },
        { status: 404 }
      );
    }

    const creatorId = foundProfile.userId;

    // Follower counts
    const [followersCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(follows)
      .where(eq(follows.followingId, creatorId));

    const [followingCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(follows)
      .where(eq(follows.followerId, creatorId));

    // Session check for follow status
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const currentUserId = session?.user?.id;

    let isFollowing = false;
    if (currentUserId && currentUserId !== creatorId) {
      const [existingFollow] = await db
        .select()
        .from(follows)
        .where(
          and(
            eq(follows.followerId, currentUserId),
            eq(follows.followingId, creatorId)
          )
        )
        .limit(1);
      isFollowing = Boolean(existingFollow);
    }

    // Fetch creator's published drops
    const creatorDrops = await db
      .select()
      .from(posts)
      .where(eq(posts.creatorId, creatorId))
      .orderBy(desc(posts.createdAt));

    // Calculate total stats
    const totalViews = creatorDrops.reduce((acc, p) => acc + (p.viewsCount || 0), 0);
    const totalDownloads = creatorDrops.reduce((acc, p) => acc + (p.downloadsCount || 0), 0);
    const totalLikes = creatorDrops.reduce((acc, p) => acc + (p.likesCount || 0), 0);

    return NextResponse.json({
      success: true,
      creator: {
        id: creatorId,
        name: foundProfile.name || foundProfile.displayName || "Creator",
        username: foundProfile.username || cleanUsername,
        avatarUrl: foundProfile.avatarUrl,
        bio: foundProfile.bio || "Digital creator sharing downloadable visual designs and marketplace assets.",
        role: foundProfile.role || "creator",
        followersCount: followersCount?.count || 0,
        followingCount: followingCount?.count || 0,
        isFollowing,
        isOwnProfile: currentUserId === creatorId,
        stats: {
          totalDrops: creatorDrops.length,
          totalViews,
          totalDownloads,
          totalLikes,
        },
      },
      drops: creatorDrops,
    });
  } catch (error: any) {
    console.error("Creator profile API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch creator profile" },
      { status: 500 }
    );
  }
}
