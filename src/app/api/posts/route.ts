import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { posts, profiles, user } from "@/db/schema";
import { eq, desc, and, or, ilike, sql } from "drizzle-orm";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

// GET /api/posts - Fetch curated & marketplace posts
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const postType = searchParams.get("postType"); // "all", "free", "sell"
    const creatorId = searchParams.get("creatorId");

    const conditions = [];

    if (category && category !== "All") {
      conditions.push(eq(posts.category, category));
    }

    if (postType && (postType === "free" || postType === "sell")) {
      conditions.push(eq(posts.postType, postType));
    }

    if (creatorId) {
      conditions.push(eq(posts.creatorId, creatorId));
    }

    if (search && search.trim()) {
      const q = `%${search.trim()}%`;
      conditions.push(
        or(
          ilike(posts.title, q),
          ilike(posts.description, q),
          ilike(posts.category, q)
        )
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const results = await db
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
      .where(whereClause)
      .orderBy(desc(posts.createdAt))
      .limit(60);

    return NextResponse.json({
      success: true,
      posts: results,
    });
  } catch (error: any) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create a new free or paid design / post
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in to upload designs." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      title,
      description,
      category,
      tags,
      previewUrl,
      postType,
      price,
      currency,
      assetFileName,
      assetFileType,
      assetFileSize,
      assetStorageKey,
      licenseType,
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 }
      );
    }

    if (!previewUrl) {
      return NextResponse.json(
        { success: false, error: "Preview visual is required" },
        { status: 400 }
      );
    }

    const isSell = postType === "sell";
    const numericPrice = isSell ? Number(price) || 0 : 0;

    if (isSell && numericPrice <= 0) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid price for paid design" },
        { status: 400 }
      );
    }

    const [newPost] = await db
      .insert(posts)
      .values({
        creatorId: session.user.id,
        title: title.trim(),
        description: description?.trim() || null,
        category: category || "Architecture",
        tags: Array.isArray(tags) ? tags : [],
        previewUrl: previewUrl,
        postType: isSell ? "sell" : "free",
        price: numericPrice,
        currency: currency || "PKR",
        assetFileName: assetFileName || (isSell ? `${title.toLowerCase().replace(/\s+/g, "-")}.zip` : null),
        assetFileType: assetFileType || (isSell ? "zip" : "image"),
        assetFileSize: assetFileSize || (isSell ? "24.5 MB" : "4.2 MB"),
        assetStorageKey: assetStorageKey || `assets/${session.user.id}/${Date.now()}`,
        licenseType: licenseType || "personal",
      })
      .returning();

    return NextResponse.json({
      success: true,
      post: newPost,
      message: isSell
        ? "Paid design published to Zelivo Marketplace ✦"
        : "Design published for Free Download ✦",
    });
  } catch (error: any) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create design" },
      { status: 500 }
    );
  }
}
