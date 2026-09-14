import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";

const getBaseURL = () => {
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL;
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
};

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  secret: process.env.BETTER_AUTH_SECRET || "development-secret-key-change-in-production-min-32-chars",
  baseURL: getBaseURL(),
  trustedOrigins: [
    "https://dropterest.vercel.app",
    "https://*.vercel.app",
    "https://dropterest.com",
    "https://*.dropterest.com",
    "https://motize.dropterest.com",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
    ...(process.env.NEXT_PUBLIC_APP_URL ? [process.env.NEXT_PUBLIC_APP_URL] : []),
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
    ...(process.env.VERCEL_PROJECT_PRODUCTION_URL ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`] : []),
  ],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true when SMTP is configured
    async sendResetPassword({ user, url }: { user: { email: string; name?: string | null }; url: string }) {
      console.log(`[AUTH EMAIL] Password reset requested for ${user.email}`);
      console.log(`[AUTH EMAIL] Reset Link: ${url}`);
    },
    async sendVerificationEmail({ user, url }: { user: { email: string; name?: string | null }; url: string }) {
      console.log(`[AUTH EMAIL] Verification email requested for ${user.email}`);
      console.log(`[AUTH EMAIL] Verification Link: ${url}`);
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (createdUser) => {
          try {
            // Check if profile exists (idempotent guard)
            const existingProfile = await db
              .select()
              .from(schema.profiles)
              .where(eq(schema.profiles.userId, createdUser.id))
              .limit(1);

            if (!existingProfile || existingProfile.length === 0) {
              const baseUsername = (createdUser.name || createdUser.email.split("@")[0])
                .toLowerCase()
                .replace(/[^a-z0-9_]/g, "")
                .slice(0, 20) || "user";

              // Ensure uniqueness
              const uniqueSuffix = Math.floor(1000 + Math.random() * 9000);
              const username = `${baseUsername}_${uniqueSuffix}`;

              await db.insert(schema.profiles).values({
                userId: createdUser.id,
                username,
                displayName: createdUser.name || "Member",
                avatarUrl: createdUser.image || null,
                role: "viewer", // Strictly viewer by default
                status: "active",
              });
              console.log(`[AUTH] Idempotent profile initialized for user: ${createdUser.id} (${username})`);
            }
          } catch (err) {
            console.error("[AUTH ERROR] Failed to auto-initialize profile in database hook:", err);
          }
        },
      },
    },
  },
});
