import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { follows, user, profiles } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

// GET /api/users/[id]/follow - Check follow status & follower count
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: targetUserId } = await params;
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const currentUserId = session?.user?.id;

    // Count followers
    const [followersCountResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(follows)
      .where(eq(follows.followingId, targetUserId));

    // Count following
    const [followingCountResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(follows)
      .where(eq(follows.followerId, targetUserId));

    let isFollowing = false;
    if (currentUserId && currentUserId !== targetUserId) {
      const [existingFollow] = await db
        .select()
        .from(follows)
        .where(
          and(
            eq(follows.followerId, currentUserId),
            eq(follows.followingId, targetUserId)
          )
        )
        .limit(1);
      isFollowing = Boolean(existingFollow);
    }

    return NextResponse.json({
      success: true,
      isFollowing,
      followersCount: followersCountResult?.count || 0,
      followingCount: followingCountResult?.count || 0,
    });
  } catch (error: any) {
    console.error("Follow status error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to check follow status" },
      { status: 500 }
    );
  }
}

// POST /api/users/[id]/follow - Toggle follow / unfollow
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: targetUserId } = await params;
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Please log in to follow creators." },
        { status: 401 }
      );
    }

    const currentUserId = session.user.id;

    if (currentUserId === targetUserId) {
      return NextResponse.json(
        { success: false, error: "You cannot follow yourself." },
        { status: 400 }
      );
    }

    // Check if already following
    const [existingFollow] = await db
      .select()
      .from(follows)
      .where(
        and(
          eq(follows.followerId, currentUserId),
          eq(follows.followingId, targetUserId)
        )
      )
      .limit(1);

    let isFollowing = false;

    if (existingFollow) {
      // Unfollow
      await db
        .delete(follows)
        .where(eq(follows.id, existingFollow.id));
      isFollowing = false;
    } else {
      // Follow
      await db.insert(follows).values({
        followerId: currentUserId,
        followingId: targetUserId,
      });
      isFollowing = true;
    }

    // Recalculate followers count
    const [countResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(follows)
      .where(eq(follows.followingId, targetUserId));

    return NextResponse.json({
      success: true,
      isFollowing,
      followersCount: countResult?.count || 0,
      message: isFollowing ? "Following creator ✦" : "Unfollowed creator",
    });
  } catch (error: any) {
    console.error("Follow toggle error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update follow status" },
      { status: 500 }
    );
  }
}
