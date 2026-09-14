import { pgTable, text, timestamp, uuid, integer, jsonb } from "drizzle-orm/pg-core";
import { user } from "./auth";

// Posts / Designs Table
export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  creatorId: text("creator_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull().default("All"),
  tags: jsonb("tags").$type<string[]>().default([]),
  previewUrl: text("preview_url").notNull(), // Public, optimized preview image
  postType: text("post_type", { enum: ["free", "sell"] })
    .notNull()
    .default("free"),
  price: integer("price").default(0), // Price in PKR (e.g. 499)
  currency: text("currency").notNull().default("PKR"),
  // Private / Downloadable Asset Meta
  assetFileName: text("asset_file_name"), // e.g. "modern-branding-kit.zip"
  assetFileType: text("asset_file_type", {
    enum: ["zip", "psd", "ai", "figma", "pdf", "image", "other"],
  }).default("image"),
  assetFileSize: text("asset_file_size"), // e.g. "48.5 MB"
  assetStorageKey: text("asset_storage_key"), // Private storage path / token
  licenseType: text("license_type", {
    enum: ["personal", "commercial"],
  }).default("personal"),
  // Performance Analytics & Social Counts
  viewsCount: integer("views_count").notNull().default(0),
  downloadsCount: integer("downloads_count").notNull().default(0),
  likesCount: integer("likes_count").notNull().default(0),
  savesCount: integer("saves_count").notNull().default(0),
  status: text("status", { enum: ["published", "draft", "archived"] })
    .notNull()
    .default("published"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Purchases Table
export const postPurchases = pgTable("post_purchases", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  postId: uuid("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull().default("PKR"),
  licenseType: text("license_type").notNull().default("personal"),
  secureDownloadToken: text("secure_download_token").notNull(),
  status: text("status", { enum: ["completed", "refunded", "pending"] })
    .notNull()
    .default("completed"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Downloads Metrics Table
export const postDownloads = pgTable("post_downloads", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
  downloadType: text("download_type", { enum: ["free", "paid"] })
    .notNull()
    .default("free"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Follows Table (Creator Follow System)
export const follows = pgTable("follows", {
  id: uuid("id").primaryKey().defaultRandom(),
  followerId: text("follower_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  followingId: text("following_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Likes Table (Real Database Post Likes)
export const postLikes = pgTable("post_likes", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Comments Table (Real Database Post Comments)
export const postComments = pgTable("post_comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  text: text("text").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type PostPurchase = typeof postPurchases.$inferSelect;
export type PostDownload = typeof postDownloads.$inferSelect;
export type Follow = typeof follows.$inferSelect;
export type NewFollow = typeof follows.$inferInsert;
export type PostLike = typeof postLikes.$inferSelect;
export type PostComment = typeof postComments.$inferSelect;
