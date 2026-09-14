import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id || id.startsWith("pin-")) {
      return NextResponse.json({ success: true, viewsCount: 1 });
    }

    const [updatedPost] = await db
      .update(posts)
      .set({
        viewsCount: sql`${posts.viewsCount} + 1`,
      })
      .where(eq(posts.id, id))
      .returning({ viewsCount: posts.viewsCount });

    return NextResponse.json({
      success: true,
      viewsCount: updatedPost?.viewsCount || 1,
    });
  } catch (error: any) {
    console.error("View increment error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update views" },
      { status: 500 }
    );
  }
}
