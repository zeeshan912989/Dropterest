import { requireAuth } from "@/lib/security/auth-guards";
import SettingsView from "@/components/settings/SettingsView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Settings — Dropterest",
  description: "Manage your profile, account preferences, privacy, and security settings.",
};

export default async function SettingsPage() {
  const { user, profile } = await requireAuth("/settings");

  return (
    <SettingsView
      initialUser={user}
      initialProfile={profile}
    />
  );
}
