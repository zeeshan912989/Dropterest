import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { postComments, user, profiles } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

// GET /api/posts/[id]/comments - Fetch real comments with user profiles
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await context.params;

    const comments = await db
      .select({
        id: postComments.id,
        postId: postComments.postId,
        userId: postComments.userId,
        text: postComments.text,
        createdAt: postComments.createdAt,
        author: user.name,
        userImage: user.image,
        avatar: profiles.avatarUrl,
        username: profiles.username,
      })
      .from(postComments)
      .leftJoin(user, eq(postComments.userId, user.id))
      .leftJoin(profiles, eq(postComments.userId, profiles.userId))
      .where(eq(postComments.postId, postId))
      .orderBy(desc(postComments.createdAt));

    return NextResponse.json({
      success: true,
      comments: comments.map((c) => ({
        ...c,
        author: c.author || "Creator",
        avatar: c.avatar || c.userImage || null,
        time: formatRelativeTime(c.createdAt),
      })),
      total: comments.length,
    });
  } catch (error: any) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/posts/[id]/comments - Post real comment to database
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await context.params;
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Please sign in to add comments." },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const text = body.text?.trim();

    if (!text) {
      return NextResponse.json(
        { success: false, error: "Comment text cannot be empty." },
        { status: 400 }
      );
    }

    const [comment] = await db
      .insert(postComments)
      .values({
        postId,
        userId: session.user.id,
        text,
      })
      .returning();

    // Fetch user profile info
    const [profile] = await db
      .select({
        avatarUrl: profiles.avatarUrl,
        username: profiles.username,
      })
      .from(profiles)
      .where(eq(profiles.userId, session.user.id))
      .limit(1);

    return NextResponse.json({
      success: true,
      message: "Comment posted ✦",
      comment: {
        id: comment.id,
        postId: comment.postId,
        userId: comment.userId,
        text: comment.text,
        createdAt: comment.createdAt,
        author: session.user.name || "You",
        avatar: profile?.avatarUrl || session.user.image || null,
        username: profile?.username || "",
        time: "Just now",
      },
    });
  } catch (error: any) {
    console.error("Error posting comment:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

function userAvatarFallback(name?: string | null) {
  return "/ceramics.jpeg";
}

function formatRelativeTime(date: Date | null) {
  if (!date) return "Just now";
  const diffMs = Date.now() - new Date(date).getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
