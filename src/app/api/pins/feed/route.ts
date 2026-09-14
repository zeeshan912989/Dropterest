import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { posts, profiles, user } from "@/db/schema";
import { eq, desc, and, or, ilike, lt, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

interface CursorPayload {
  createdAt: string;
  id: string;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "30", 10), 1), 60);
    const cursor = searchParams.get("cursor");
    const category = searchParams.get("category");
    const postType = searchParams.get("postType"); // "all", "free", "sell"
    const creatorId = searchParams.get("creatorId");
    const search = searchParams.get("search");

    const conditions = [eq(posts.status, "published")];

    // Category filter
    if (category && category !== "All") {
      conditions.push(eq(posts.category, category));
    }

    // Post Type filter (free vs marketplace sell)
    if (postType && (postType === "free" || postType === "sell")) {
      conditions.push(eq(posts.postType, postType));
    }

    // Creator filter
    if (creatorId) {
      conditions.push(eq(posts.creatorId, creatorId));
    }

    // Search query filter
    if (search && search.trim()) {
      const q = `%${search.trim()}%`;
      conditions.push(
        or(
          ilike(posts.title, q),
          ilike(posts.description, q),
          ilike(posts.category, q)
        )!
      );
    }

    // Decode compound cursor if present
    if (cursor) {
      try {
        const decodedStr = Buffer.from(cursor, "base64url").toString("utf-8");
        const parsed: CursorPayload = JSON.parse(decodedStr);
        if (parsed.createdAt && parsed.id) {
          const cursorDate = new Date(parsed.createdAt);
          conditions.push(
            or(
              lt(posts.createdAt, cursorDate),
              and(
                eq(posts.createdAt, cursorDate),
                lt(posts.id, parsed.id)
              )
            )!
          );
        }
      } catch (err) {
        console.warn("Invalid cursor passed:", cursor, err);
      }
    }

    const whereClause = and(...conditions);

    // Fetch limit + 1 items to determine if next page exists without extra count queries
    const rows = await db
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
        creatorAvatar: profiles.avatarUrl,
        creatorUsername: profiles.username,
      })
      .from(posts)
      .leftJoin(user, eq(posts.creatorId, user.id))
      .leftJoin(profiles, eq(posts.creatorId, profiles.userId))
      .where(whereClause)
      .orderBy(desc(posts.createdAt), desc(posts.id))
      .limit(limit + 1);

    const hasMore = rows.length > limit;
    const items = hasMore ? rows.slice(0, limit) : rows;

    let nextCursor: string | null = null;
    if (hasMore && items.length > 0) {
      const lastItem = items[items.length - 1];
      const payload: CursorPayload = {
        createdAt: new Date(lastItem.createdAt).toISOString(),
        id: lastItem.id,
      };
      nextCursor = Buffer.from(JSON.stringify(payload)).toString("base64url");
    }

    const response = NextResponse.json({
      success: true,
      items,
      nextCursor,
      hasMore,
    });

    // Add HTTP Caching Header for fast edge response
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=15, stale-while-revalidate=60"
    );

    return response;
  } catch (error: any) {
    console.error("Error fetching feed pins:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch feed" },
      { status: 500 }
    );
  }
}
