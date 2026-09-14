import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { posts, profiles, user } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

// GET /api/posts/[id] - Fetch single post
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [post] = await db
      .select({
        id: posts.id,
        creatorId: posts.creatorId,
        title: posts.title,
        description: posts.description,
        category: posts.category,
        tags: posts.tags,
        previewUrl: posts.previewUrl,
        postType: posts.postType,
        price: posts.price,
        currency: posts.currency,
        assetFileName: posts.assetFileName,
        assetFileType: posts.assetFileType,
        assetFileSize: posts.assetFileSize,
        licenseType: posts.licenseType,
        viewsCount: posts.viewsCount,
        downloadsCount: posts.downloadsCount,
        likesCount: posts.likesCount,
        savesCount: posts.savesCount,
        createdAt: posts.createdAt,
        creatorName: user.name,
        creatorEmail: user.email,
        creatorAvatar: profiles.avatarUrl,
        creatorUsername: profiles.username,
      })
      .from(posts)
      .leftJoin(user, eq(posts.creatorId, user.id))
      .leftJoin(profiles, eq(posts.creatorId, profiles.userId))
      .where(eq(posts.id, id))
      .limit(1);

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, post });
  } catch (error: any) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch post" },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[id] - Delete creator's own drop
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in to delete your drop." },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Check if post exists
    const [existingPost] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, id))
      .limit(1);

    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: "Drop not found." },
        { status: 404 }
      );
    }

    // Authorization check: User must be creator of the post
    if (existingPost.creatorId !== userId) {
      return NextResponse.json(
        { success: false, error: "You can only delete drops that you have created." },
        { status: 403 }
      );
    }

    // Delete post
    await db.delete(posts).where(eq(posts.id, id));

    return NextResponse.json({
      success: true,
      message: "Drop deleted successfully ✦",
    });
  } catch (error: any) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete drop" },
      { status: 500 }
    );
  }
}
