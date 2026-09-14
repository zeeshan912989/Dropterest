import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

// GET /api/pins - Fetch pins from Neon database (or fallback if not connected)
export async function GET(request) {
  try {
    if (!sql) {
      return NextResponse.json({
        success: true,
        source: "local",
        pins: [],
        message: "Connect DATABASE_URL in .env.local to persist pins to Neon PostgreSQL.",
      });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let rows;
    if (category && category !== "All") {
      rows = await sql`SELECT * FROM pins WHERE category = ${category} ORDER BY created_at DESC LIMIT 50`;
    } else {
      rows = await sql`SELECT * FROM pins ORDER BY created_at DESC LIMIT 50`;
    }

    return NextResponse.json({ success: true, source: "neon", pins: rows });
  } catch (error) {
    console.error("Error fetching pins:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/pins - Create a new Pin in Neon database
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, imageUrl, destinationLink, category, tag } = body;

    if (!title || !imageUrl) {
      return NextResponse.json(
        { success: false, error: "Title and Image URL are required" },
        { status: 400 }
      );
    }

    if (!sql) {
      return NextResponse.json({
        success: true,
        source: "local",
        pin: {
          id: `pin-${Date.now()}`,
          title,
          description,
          image_url: imageUrl,
          destination_link: destinationLink,
          category: category || "Architecture",
          tag: tag || "Curated",
          created_at: new Date().toISOString(),
        },
      });
    }

    const result = await sql`
      INSERT INTO pins (title, description, image_url, destination_link, category, tag)
      VALUES (${title}, ${description || ""}, ${imageUrl}, ${destinationLink || ""}, ${category || "Architecture"}, ${tag || "Curated"})
      RETURNING *
    `;

    return NextResponse.json({ success: true, source: "neon", pin: result[0] });
  } catch (error) {
    console.error("Error creating pin:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
