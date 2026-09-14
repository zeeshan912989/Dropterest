import { requireRole } from "@/lib/security/auth-guards";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, ShieldAlert, Users, Settings, Database } from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";

export const dynamic = "force-dynamic";

export default async function AdminConsolePage() {
  let authData;
  let accessDenied = false;

  try {
    authData = await requireRole(["admin", "super_admin"]);
  } catch {
    accessDenied = true;
  }

  if (accessDenied || !authData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-md w-full rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Access Denied</h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            This administration console is strictly reserved for administrative accounts (&quot;admin&quot; or &quot;super_admin&quot;). Your current profile does not possess the requisite RBAC authorization.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { profile } = authData;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive">
            <ShieldCheck className="h-3.5 w-3.5" />
            Supervised Administration Area
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Console</h1>
          <p className="text-xs text-muted-foreground max-w-xl">
            Authenticated administrator: <span className="font-semibold text-foreground">@{profile?.username}</span> (Role: {profile?.role}). Server authorization checks verified successfully.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Users className="h-5 w-5" />
            </div>
            <h2 className="text-base font-bold">User Management</h2>
            <p className="text-xs text-muted-foreground">Admin RBAC operations and role assignments.</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Database className="h-5 w-5" />
            </div>
            <h2 className="text-base font-bold">Neon Database</h2>
            <p className="text-xs text-muted-foreground">Live connection with Drizzle ORM schemas.</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Settings className="h-5 w-5" />
            </div>
            <h2 className="text-base font-bold">Security Auditing</h2>
            <p className="text-xs text-muted-foreground">Rate limit triggers and session tracking.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
