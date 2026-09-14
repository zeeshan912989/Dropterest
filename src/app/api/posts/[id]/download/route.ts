import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { posts, postPurchases, postDownloads } from "@/db/schema";
import { eq, sql, and } from "drizzle-orm";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

// GET & POST /api/posts/[id]/download - Secure Asset Download Dispatcher
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return handleDownload(req, context);
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return handleDownload(req, context);
}

async function handleDownload(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await context.params;
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    const session = await auth.api.getSession({
      headers: await headers(),
    });

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

    // Check permissions
    if (post.postType === "sell") {
      // Must have valid token or purchase
      let authorized = false;

      if (token) {
        const [purchase] = await db
          .select()
          .from(postPurchases)
          .where(
            and(
              eq(postPurchases.postId, post.id),
              eq(postPurchases.secureDownloadToken, token)
            )
          )
          .limit(1);

        if (purchase) {
          authorized = true;
        }
      }

      // Or if logged in user is the creator
      if (session?.user?.id && session.user.id === post.creatorId) {
        authorized = true;
      }

      // Or if user previously bought it
      if (!authorized && session?.user?.id) {
        const [userPurchase] = await db
          .select()
          .from(postPurchases)
          .where(
            and(
              eq(postPurchases.postId, post.id),
              eq(postPurchases.userId, session.user.id)
            )
          )
          .limit(1);

        if (userPurchase) {
          authorized = true;
        }
      }

      if (!authorized) {
        return NextResponse.json(
          {
            success: false,
            error: "This is a premium design asset. Please purchase to download.",
          },
          { status: 403 }
        );
      }
    }

    // Increment downloads count on post atomically
    await db
      .update(posts)
      .set({
        downloadsCount: sql`${posts.downloadsCount} + 1`,
      })
      .where(eq(posts.id, post.id));

    // Record download event
    await db.insert(postDownloads).values({
      postId: post.id,
      userId: session?.user?.id || null,
      downloadType: post.postType === "sell" ? "paid" : "free",
    });

    // Return the download asset info & URL
    return NextResponse.json({
      success: true,
      message: "Download granted",
      asset: {
        fileName: post.assetFileName || `${post.title.toLowerCase().replace(/\s+/g, "-")}.${post.assetFileType || "zip"}`,
        fileType: post.assetFileType,
        fileSize: post.assetFileSize,
        downloadUrl: post.previewUrl, // Or signed private storage URL
        isPremium: post.postType === "sell",
      },
    });
  } catch (error: any) {
    console.error("Error processing download:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Download failed" },
      { status: 500 }
    );
  }
}
