export type UserRole =
  | "viewer"
  | "creator"
  | "business"
  | "moderator"
  | "finance"
  | "admin"
  | "super_admin";

export type Permission =
  | "read:public"
  | "manage:profile"
  | "create:content"
  | "access:creator_dashboard"
  | "access:business_dashboard"
  | "moderate:content"
  | "access:finance"
  | "access:admin"
  | "manage:users"
  | "manage:platform";

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  viewer: ["read:public", "manage:profile"],
  creator: ["read:public", "manage:profile", "create:content", "access:creator_dashboard"],
  business: ["read:public", "manage:profile", "access:business_dashboard"],
  moderator: ["read:public", "manage:profile", "moderate:content"],
  finance: ["read:public", "manage:profile", "access:finance"],
  admin: [
    "read:public",
    "manage:profile",
    "create:content",
    "access:creator_dashboard",
    "access:business_dashboard",
    "moderate:content",
    "access:finance",
    "access:admin",
    "manage:users",
  ],
  super_admin: [
    "read:public",
    "manage:profile",
    "create:content",
    "access:creator_dashboard",
    "access:business_dashboard",
    "moderate:content",
    "access:finance",
    "access:admin",
    "manage:users",
    "manage:platform",
  ],
};

/**
 * Check if a role possesses a specific permission.
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  if (role === "super_admin") return true;
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}

/**
 * Check if a role is within a list of authorized roles.
 */
export function isAuthorizedRole(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  if (userRole === "super_admin") return true;
  return allowedRoles.includes(userRole);
}
