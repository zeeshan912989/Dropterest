import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { posts, profiles, user } from "@/db/schema";
import { eq, ne, desc, and, notInArray } from "drizzle-orm";

export const dynamic = "force-dynamic";

// GET /api/posts/[id]/related - Enhanced Smart Recommendation Engine
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await context.params;

    const [currentPost] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (!currentPost) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    // 1. More from this creator
    const creatorPosts = await db
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
        assetFileType: posts.assetFileType,
        downloadsCount: posts.downloadsCount,
        likesCount: posts.likesCount,
        savesCount: posts.savesCount,
        creatorName: user.name,
        creatorAvatar: profiles.avatarUrl,
        creatorUsername: profiles.username,
      })
      .from(posts)
      .leftJoin(user, eq(posts.creatorId, user.id))
      .leftJoin(profiles, eq(posts.creatorId, profiles.userId))
      .where(
        and(
          eq(posts.creatorId, currentPost.creatorId),
          ne(posts.id, currentPost.id)
        )
      )
      .orderBy(desc(posts.createdAt))
      .limit(8);

    // 2. Similar designs in same category / tags
    const similarPosts = await db
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
        assetFileType: posts.assetFileType,
        downloadsCount: posts.downloadsCount,
        likesCount: posts.likesCount,
        savesCount: posts.savesCount,
        creatorName: user.name,
        creatorAvatar: profiles.avatarUrl,
        creatorUsername: profiles.username,
      })
      .from(posts)
      .leftJoin(user, eq(posts.creatorId, user.id))
      .leftJoin(profiles, eq(posts.creatorId, profiles.userId))
      .where(
        and(
          eq(posts.category, currentPost.category),
          ne(posts.id, currentPost.id)
        )
      )
      .orderBy(desc(posts.likesCount), desc(posts.downloadsCount), desc(posts.createdAt))
      .limit(12);

    // 3. General trending backfill so the stream is never empty
    const collectedIds = [currentPost.id, ...creatorPosts.map((p) => p.id), ...similarPosts.map((p) => p.id)];
    
    let backfillPosts: any[] = [];
    if (collectedIds.length < 12) {
      backfillPosts = await db
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
          assetFileType: posts.assetFileType,
          downloadsCount: posts.downloadsCount,
          likesCount: posts.likesCount,
          savesCount: posts.savesCount,
          creatorName: user.name,
          creatorAvatar: profiles.avatarUrl,
          creatorUsername: profiles.username,
        })
        .from(posts)
        .leftJoin(user, eq(posts.creatorId, user.id))
        .leftJoin(profiles, eq(posts.creatorId, profiles.userId))
        .where(ne(posts.id, currentPost.id))
        .orderBy(desc(posts.downloadsCount), desc(posts.createdAt))
        .limit(16);
    }

    // Merge unique items
    const mergedMap = new Map();
    [...creatorPosts, ...similarPosts, ...backfillPosts].forEach((p) => {
      if (p.id !== currentPost.id && !mergedMap.has(p.id)) {
        mergedMap.set(p.id, p);
      }
    });

    return NextResponse.json({
      success: true,
      creatorPosts,
      similarPosts,
      related: Array.from(mergedMap.values()),
    });
  } catch (error: any) {
    console.error("Error fetching related posts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load related posts" },
      { status: 500 }
    );
  }
}
