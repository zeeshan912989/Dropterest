import { neon } from "@neondatabase/serverless";
import fs from "fs";
import path from "path";

const DATABASE_URL = "postgresql://neondb_owner:npg_V6Z2IafYHvGA@ep-square-snow-zaxh2xtk-pooler.c-2.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function testNeon() {
  console.log("Connecting to Neon PostgreSQL...");
  const sql = neon(DATABASE_URL);

  try {
    const result = await sql`SELECT 1 as connected, current_database() as database, version(), now() as server_time`;
    console.log("✅ Connection Successful!");
    console.log("Database:", result[0].database);
    console.log("Server Time:", result[0].server_time);
    console.log("PostgreSQL Version:", result[0].version.split(",")[0]);

    // Check existing tables
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log("Existing Tables:", tables.map(t => t.table_name));

    // Initialize Schema
    console.log("\nInitializing database tables from schema...");
    
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        username TEXT UNIQUE,
        avatar_url TEXT,
        bio TEXT,
        website TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS boards (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        description TEXT,
        is_private BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS pins (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        board_id UUID REFERENCES boards(id) ON DELETE SET NULL,
        title TEXT NOT NULL,
        description TEXT,
        image_url TEXT NOT NULL,
        destination_link TEXT,
        category TEXT DEFAULT 'Architecture',
        tag TEXT DEFAULT 'Curated',
        aspect_ratio TEXT DEFAULT 'aspect-[3/4.2]',
        likes_count INT DEFAULT 0,
        saves_count INT DEFAULT 0,
        allow_comments BOOLEAN DEFAULT TRUE,
        is_ai_modified BOOLEAN DEFAULT FALSE,
        alt_text TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS saved_pins (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        pin_id UUID REFERENCES pins(id) ON DELETE CASCADE,
        board_id UUID REFERENCES boards(id) ON DELETE SET NULL,
        saved_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE (user_id, pin_id)
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
        recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        pin_attachment_id UUID REFERENCES pins(id) ON DELETE SET NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        actor_id UUID REFERENCES users(id) ON DELETE CASCADE,
        type TEXT NOT NULL,
        pin_id UUID REFERENCES pins(id) ON DELETE SET NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    const updatedTables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log("✅ Tables Active in Database:", updatedTables.map(t => t.table_name).join(", "));
  } catch (err) {
    console.error("❌ Connection failed:", err);
  }
}

testNeon();
