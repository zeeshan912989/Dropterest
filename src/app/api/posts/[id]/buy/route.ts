import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { posts, postPurchases } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import crypto from "crypto";

export const dynamic = "force-dynamic";

// POST /api/posts/[id]/buy - Purchase a marketplace design
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Please sign in to complete purchase." },
        { status: 401 }
      );
    }

    const { id: postId } = await context.params;

    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Design not found" },
        { status: 404 }
      );
    }

    if (post.postType !== "sell") {
      return NextResponse.json(
        { success: false, error: "This design is already free to download." },
        { status: 400 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const licenseType = body.licenseType || post.licenseType || "personal";

    // Generate cryptographic secure download token
    const secureToken = crypto.randomUUID();

    const [purchase] = await db
      .insert(postPurchases)
      .values({
        userId: session.user.id,
        postId: post.id,
        amount: post.price || 0,
        currency: post.currency || "PKR",
        licenseType: licenseType,
        secureDownloadToken: secureToken,
        status: "completed",
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: `Successfully purchased "${post.title}" for ${post.currency} ${post.price} ✦`,
      purchase: {
        id: purchase.id,
        postId: purchase.postId,
        licenseType: purchase.licenseType,
        downloadToken: secureToken,
        downloadUrl: `/api/posts/${post.id}/download?token=${secureToken}`,
      },
    });
  } catch (error: any) {
    console.error("Error processing purchase:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Purchase failed" },
      { status: 500 }
    );
  }
}
