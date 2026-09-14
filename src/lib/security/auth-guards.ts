import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { db } from "@/db";
import { profiles, type Profile } from "@/db/schema/profile";
import { eq } from "drizzle-orm";
import { UserRole, Permission, isAuthorizedRole, hasPermission } from "./rbac";

export interface AuthenticatedUserContext {
  user: {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
    image?: string | null;
  };
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
  };
  profile: Profile;
}

/**
 * Retrieves the current session and user profile without throwing.
 */
export async function getServerSession(): Promise<AuthenticatedUserContext | null> {
  try {
    const sessionData = await auth.api.getSession({
      headers: await headers(),
    });

    if (!sessionData || !sessionData.user) {
      return null;
    }

    // Fetch user profile from database
    const profileRows = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, sessionData.user.id))
      .limit(1);

    const profile = profileRows[0];
    if (!profile) {
      // Create fallback profile in case hook was delayed
      const baseUsername = (sessionData.user.name || sessionData.user.email.split("@")[0])
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "")
        .slice(0, 20) || "user";
      
      const newProfileRows = await db
        .insert(profiles)
        .values({
          userId: sessionData.user.id,
          username: `${baseUsername}_${Math.floor(1000 + Math.random() * 9000)}`,
          displayName: sessionData.user.name || "Member",
          role: "viewer",
          status: "active",
        })
        .returning();

      return {
        user: sessionData.user,
        session: sessionData.session,
        profile: newProfileRows[0],
      };
    }

    return {
      user: sessionData.user,
      session: sessionData.session,
      profile,
    };
  } catch (error) {
    console.error("[AUTH GUARD ERROR] Failed to fetch server session:", error);
    return null;
  }
}

/**
 * Enforces that a user is authenticated.
 * If not authenticated, redirects to /login?redirect=<current_path>
 */
export async function requireAuth(redirectTo?: string): Promise<AuthenticatedUserContext> {
  const context = await getServerSession();
  if (!context) {
    const loginUrl = redirectTo ? `/login?redirect=${encodeURIComponent(redirectTo)}` : "/login";
    redirect(loginUrl);
  }
  return context;
}

/**
 * Enforces that the authenticated user possesses an authorized role.
 */
export async function requireRole(
  allowedRoles: UserRole[],
  redirectTo: string = "/dashboard"
): Promise<AuthenticatedUserContext> {
  const context = await requireAuth();

  if (!isAuthorizedRole(context.profile.role as UserRole, allowedRoles)) {
    redirect(`${redirectTo}?error=unauthorized`);
  }

  return context;
}

/**
 * Enforces that the authenticated user possesses a specific permission.
 */
export async function requirePermission(
  permission: Permission,
  redirectTo: string = "/dashboard"
): Promise<AuthenticatedUserContext> {
  const context = await requireAuth();

  if (!hasPermission(context.profile.role as UserRole, permission)) {
    redirect(`${redirectTo}?error=unauthorized`);
  }

  return context;
}
