import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { posts, postLikes } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

// GET /api/posts/[id]/like - Get like status and count
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await context.params;
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const [post] = await db
      .select({ likesCount: posts.likesCount })
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (!post) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    let isLiked = false;
    if (session?.user?.id) {
      const [existingLike] = await db
        .select()
        .from(postLikes)
        .where(
          and(
            eq(postLikes.postId, postId),
            eq(postLikes.userId, session.user.id)
          )
        )
        .limit(1);
      isLiked = Boolean(existingLike);
    }

    return NextResponse.json({
      success: true,
      likesCount: post.likesCount || 0,
      isLiked,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/posts/[id]/like - Toggle real database like
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
        { success: false, error: "Please log in to like drops" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Check if like exists
    const [existingLike] = await db
      .select()
      .from(postLikes)
      .where(
        and(
          eq(postLikes.postId, postId),
          eq(postLikes.userId, userId)
        )
      )
      .limit(1);

    let isLiked = false;

    if (existingLike) {
      // Unlike
      await db.delete(postLikes).where(eq(postLikes.id, existingLike.id));
      await db
        .update(posts)
        .set({
          likesCount: sql`GREATEST(0, ${posts.likesCount} - 1)`,
        })
        .where(eq(posts.id, postId));
      isLiked = false;
    } else {
      // Like
      await db.insert(postLikes).values({
        postId,
        userId,
      });
      await db
        .update(posts)
        .set({
          likesCount: sql`${posts.likesCount} + 1`,
        })
        .where(eq(posts.id, postId));
      isLiked = true;
    }

    // Fetch updated count
    const [updatedPost] = await db
      .select({ likesCount: posts.likesCount })
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    return NextResponse.json({
      success: true,
      isLiked,
      likesCount: updatedPost?.likesCount || 0,
      message: isLiked ? "Liked drop ❤️" : "Unliked drop",
    });
  } catch (error: any) {
    console.error("Error toggling like:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
