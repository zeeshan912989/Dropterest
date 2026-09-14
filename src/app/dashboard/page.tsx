import { requireAuth } from "@/lib/security/auth-guards";
import { ROLE_PERMISSIONS } from "@/lib/security/rbac";
import { User, Shield, Key } from "lucide-react";
import Link from "next/link";
import { LogoutButton } from "@/components/auth/logout-button";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { user, profile } = await requireAuth();

  const userRole = profile?.role || "viewer";
  const permissions = ROLE_PERMISSIONS[userRole] || [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-black">
                D
              </span>
              <span className="tracking-tight">Dropterest</span>
            </Link>
            <span className="hidden sm:inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              Auth Dashboard
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-semibold">{profile?.displayName || user.name}</span>
              <span className="text-[10px] text-muted-foreground capitalize">Role: {userRole}</span>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-primary/10 via-secondary/10 to-background p-6 sm:p-8">
          <div className="relative z-10 max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-background/60 px-3 py-1 text-xs font-semibold text-primary backdrop-blur-sm">
              <Shield className="h-3.5 w-3.5" />
              Verified Session Active
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome, {profile?.displayName || user.name}!
            </h1>
            <p className="text-sm text-muted-foreground">
              Your account is successfully authenticated via Better Auth and backed by Neon PostgreSQL.
            </p>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-border/60 pb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold">Profile Identity</h2>
                <p className="text-xs text-muted-foreground">Database record overview</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-muted-foreground">Username:</span>
                <p className="font-semibold text-foreground mt-0.5">@{profile?.username || "unassigned"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Display Name:</span>
                <p className="font-semibold text-foreground mt-0.5">{profile?.displayName || "N/A"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Email:</span>
                <p className="font-semibold text-foreground mt-0.5">{user.email}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Email Verified:</span>
                <p className="font-semibold mt-0.5">
                  {user.emailVerified ? (
                    <span className="inline-flex items-center text-green-600 dark:text-green-400">Yes (Verified)</span>
                  ) : (
                    <span className="inline-flex items-center text-amber-600 dark:text-amber-400">Pending Verification</span>
                  )}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <p className="font-semibold text-foreground capitalize mt-0.5">{profile?.status || "active"}</p>
              </div>
            </div>
          </div>

          {/* RBAC Role & Permissions Card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-border/60 pb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold">Role & Permissions</h2>
                <p className="text-xs text-muted-foreground">Server-enforced access</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-muted-foreground">Assigned Role:</span>
                <div className="mt-1">
                  <span className="inline-flex items-center rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary capitalize">
                    {userRole}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-muted-foreground">Granted Capabilities:</span>
                <div className="mt-2 flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
                  {permissions.map((perm) => (
                    <span
                      key={perm}
                      className="rounded-md border border-border bg-muted/60 px-2 py-0.5 text-[11px] font-mono text-muted-foreground"
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Nav / Protected Endpoints */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-border/60 pb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Key className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold">Guarded Portals</h2>
                <p className="text-xs text-muted-foreground">Test RBAC boundaries</p>
              </div>
            </div>

            <div className="space-y-2">
              <Link
                href="/creator"
                className="flex items-center justify-between rounded-xl border border-border/60 p-3 text-xs font-semibold hover:border-primary hover:bg-primary/5 transition-all"
              >
                <span>Creator Portal</span>
                <span className="text-[10px] text-muted-foreground font-normal">Requires &apos;creator&apos;+</span>
              </Link>
              <Link
                href="/admin"
                className="flex items-center justify-between rounded-xl border border-border/60 p-3 text-xs font-semibold hover:border-destructive hover:bg-destructive/5 transition-all"
              >
                <span>Admin Console</span>
                <span className="text-[10px] text-muted-foreground font-normal">Requires &apos;admin&apos;+</span>
              </Link>
              <Link
                href="/settings"
                className="flex items-center justify-between rounded-xl border border-border/60 p-3 text-xs font-semibold hover:border-border hover:bg-muted/40 transition-all"
              >
                <span>Account Settings</span>
                <span className="text-[10px] text-muted-foreground font-normal">All Authenticated</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
