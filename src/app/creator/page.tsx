import { requireRole } from "@/lib/security/auth-guards";
import Link from "next/link";
import { ArrowLeft, Sparkles, ShieldAlert } from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";

export const dynamic = "force-dynamic";

export default async function CreatorPortalPage() {
  // Enforces that only creator, admin, or super_admin can enter
  let authData;
  let accessDenied = false;

  try {
    authData = await requireRole(["creator", "admin", "super_admin"]);
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
          <h1 className="text-xl font-bold text-foreground">Creator Access Restricted</h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your current account role does not have permission to view the Creator Portal. This endpoint requires the &quot;creator&quot;, &quot;admin&quot;, or &quot;super_admin&quot; role.
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
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Creator Sandbox Area
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Creator Space (@{profile?.username})</h1>
          <p className="text-xs text-muted-foreground max-w-xl">
            You have satisfied the RBAC condition for creator-level capabilities. Feature modules (assets, drops, monetization) will attach cleanly to this authenticated foundation.
          </p>
        </div>
      </main>
    </div>
  );
}
