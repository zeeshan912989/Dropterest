"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { authClient, signOut } from "@/lib/auth/auth-client";
import {
  ChevronDown,
  ArrowLeft,
  Check,
  Search,
  Home,
  Bell,
  MessageSquare,
  Settings,
  Sparkles,
  Layers,
  Heart,
  ShieldCheck,
  Lock,
  Loader2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import NotificationsDrawer from "@/components/dashboard/NotificationsDrawer";
import MessagesDrawer from "@/components/dashboard/MessagesDrawer";
import SettingsSupportDrawer from "@/components/dashboard/SettingsSupportDrawer";
import NewMessageModal from "@/components/dashboard/NewMessageModal";
import InviteFriendsModal from "@/components/dashboard/InviteFriendsModal";

interface SettingsViewProps {
  initialProfile?: {
    username?: string;
    displayName?: string;
    avatarUrl?: string | null;
    bio?: string | null;
    role?: string;
  };
  initialUser?: {
    id?: string;
    name?: string;
    email?: string;
    image?: string | null;
  };
}

const SETTINGS_TABS = [
  { id: "edit-profile", label: "Edit profile" },
  { id: "account-management", label: "Account management" },
  { id: "profile-visibility", label: "Profile visibility" },
  { id: "refine-recommendations", label: "Refine your recommendations" },
  { id: "link-pinterest", label: "Link to Dropterest" },
  { id: "social-permissions", label: "Social permissions" },
  { id: "notifications", label: "Notifications" },
  { id: "privacy-data", label: "Privacy and data" },
  { id: "security", label: "Security" },
  { id: "branded-content", label: "Branded Content" },
  { id: "labs", label: "Labs" },
];

const PRONOUN_OPTIONS = [
  "Add your pronouns",
  "they / them",
  "she / her",
  "he / him",
  "she / they",
  "he / they",
  "other / ask me",
];

export default function SettingsView({
  initialProfile,
  initialUser,
}: SettingsViewProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const currentUser = session?.user || initialUser;

  const [activeTab, setActiveTab] = useState("edit-profile");
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null); // "notifications", "messages", "settings"
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [showInviteFriendsModal, setShowInviteFriendsModal] = useState(false);
  const [chats, setChats] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: initialProfile?.displayName || currentUser?.name || "Ali shah",
    about: initialProfile?.bio || "",
    pronouns: "Add your pronouns",
    website: "https://",
    username: initialProfile?.username || "as8759111",
    avatarUrl: initialProfile?.avatarUrl || currentUser?.image || "",
  });

  const [initialFormData, setInitialFormData] = useState({ ...formData });
  const [showPronounDropdown, setShowPronounDropdown] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Account management state
  const [accountEmail, setAccountEmail] = useState(currentUser?.email || "as8759111@gmail.com");
  const [passwordResetSent, setPasswordResetSent] = useState(false);
  const [isPrivateProfile, setIsPrivateProfile] = useState(false);
  const [searchEngineIndexing, setSearchEngineIndexing] = useState(true);

  useEffect(() => {
    if (session?.user) {
      const updated = {
        name: initialProfile?.displayName || session.user.name || "Ali shah",
        about: initialProfile?.bio || "",
        pronouns: "Add your pronouns",
        website: "https://",
        username: initialProfile?.username || session.user.email.split("@")[0] || "as8759111",
        avatarUrl: initialProfile?.avatarUrl || session.user.image || "",
      };
      setFormData(updated);
      setInitialFormData(updated);
      setAccountEmail(session.user.email);
    }
  }, [session, initialProfile]);

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialFormData);

  const handleReset = () => {
    setFormData({ ...initialFormData });
    toast.info("Changes reset to original details.");
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Name is required.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: formData.name,
          username: formData.username,
          bio: formData.about,
          avatarUrl: formData.avatarUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to update profile.");
        setIsSaving(false);
        return;
      }

      setInitialFormData({ ...formData });
      toast.success("Profile updated successfully ✦");
      router.refresh();
    } catch {
      toast.error("Network error saving profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, avatarUrl: url }));
      toast.success("Avatar preview updated. Click Save to apply.");
    }
  };

  const showToast = (msg: string) => {
    toast.info(msg);
  };

  const handleSendMessage = (newChat: any) => {
    setChats((prev) => [newChat, ...prev]);
    toast.success(`Message sent to ${newChat.name} ✦`);
    setActiveDrawer("messages");
  };

  const userInitial = formData.name ? formData.name[0].toUpperCase() : "A";

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#18181B] flex selection:bg-[#4DE3A5]/40 selection:text-[#064E3B]">
      {/* ================= 1. LEFT MINI SIDEBAR RAIL (Ideas Match) ================= */}
      <aside className="fixed left-0 top-0 bottom-0 w-16 sm:w-20 bg-white border-r border-black/[0.06] z-40 flex flex-col items-center justify-between py-5 select-none">
        {/* Top: Red Dropterest Logo */}
        <div className="flex flex-col items-center gap-6">
          <Link
            href="/ideas"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#E60023] hover:bg-[#CC001F] text-white flex items-center justify-center shadow-sm hover:scale-105 transition-transform cursor-pointer relative group"
            title="Dropterest"
          >
            <span className="font-editorial text-2xl font-bold tracking-tight leading-none select-none pl-0.5">
              D
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#4DE3A5] absolute bottom-2.5 right-2 group-hover:scale-110 transition-transform shadow-xs" />
          </Link>

          {/* Rail Navigation Icons */}
          <nav className="flex flex-col items-center gap-3">
            {/* 1. Home / Feed */}
            <Link
              href="/ideas"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer text-[#18181B] hover:bg-[#F3EFE6]"
              title="Home Feed"
            >
              <Home className="w-5 h-5 stroke-[2.2]" />
            </Link>

            {/* 2. Saved Ideas */}
            <Link
              href="/ideas"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer text-[#18181B] hover:bg-[#F3EFE6]"
              title="Saved Boards & Pins"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="4" />
                <path d="M12 3v18" />
              </svg>
            </Link>

            {/* 3. Create Drops */}
            <Link
              href="/ideas"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer text-[#18181B] hover:bg-[#F3EFE6]"
              title="Create Drops"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="4" />
                <path d="M12 8v8" />
                <path d="M8 12h8" />
              </svg>
            </Link>

            {/* 4. Notifications */}
            <button
              onClick={() => setActiveDrawer(activeDrawer === "notifications" ? null : "notifications")}
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center transition-all relative cursor-pointer ${
                activeDrawer === "notifications"
                  ? "bg-[#18181B] text-white shadow-sm"
                  : "text-[#18181B] hover:bg-[#F3EFE6]"
              }`}
              title="Notifications"
            >
              <Bell className={`w-5 h-5 stroke-[2.2] ${activeDrawer === "notifications" ? "fill-current" : ""}`} />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-[#4DE3A5]" />
            </button>

            {/* 5. Messages */}
            <button
              onClick={() => setActiveDrawer(activeDrawer === "messages" ? null : "messages")}
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center transition-all relative cursor-pointer ${
                activeDrawer === "messages"
                  ? "bg-[#18181B] text-white shadow-sm"
                  : "text-[#18181B] hover:bg-[#F3EFE6]"
              }`}
              title="Messages"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
          </nav>
        </div>

        {/* Bottom: Active Settings Icon */}
        <div className="flex flex-col items-center gap-3 relative">
          <button
            onClick={() => setActiveDrawer(activeDrawer === "settings" ? null : "settings")}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer bg-[#18181B] text-white shadow-md ring-2 ring-[#4DE3A5]"
            title="Settings & Support"
          >
            <Settings className="w-5 h-5 stroke-[2] rotate-45 transition-transform duration-300" />
          </button>
        </div>
      </aside>

      {/* ================= 2. MAIN APP CANVAS WITH TOP NAVBAR ================= */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          activeDrawer === "notifications" || activeDrawer === "messages" || activeDrawer === "settings"
            ? "pl-16 sm:pl-20 lg:pl-[460px]"
            : "pl-16 sm:pl-20"
        }`}
      >
        {/* Top Header Row with Pinterest Search Bar & User Avatar */}
        <header className="sticky top-0 z-20 bg-[#FAF8F5]/90 backdrop-blur-md px-4 sm:px-12 lg:px-16 py-3.5 border-b border-black/[0.04] flex items-center justify-between gap-4">
          {/* Search Bar Input */}
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim()) {
                  router.push(`/ideas?search=${encodeURIComponent(searchQuery)}`);
                }
              }}
              placeholder="Search across ideas, architecture, objects..."
              className="w-full h-11 pl-11 pr-4 rounded-full bg-[#EFEAE1]/70 hover:bg-[#EFEAE1] focus:bg-white border border-transparent focus:border-black/[0.1] text-xs sm:text-sm text-[#18181B] placeholder:text-[#71717A] outline-none transition-all"
            />
          </div>

          {/* Right Header Icons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setActiveDrawer(activeDrawer === "notifications" ? null : "notifications")}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors relative cursor-pointer ${
                activeDrawer === "notifications" ? "bg-[#18181B] text-white" : "hover:bg-[#EFEAE1] text-[#71717A] hover:text-[#18181B]"
              }`}
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-[#4DE3A5]" />
            </button>

            <button
              onClick={() => setActiveDrawer(activeDrawer === "messages" ? null : "messages")}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors relative cursor-pointer ${
                activeDrawer === "messages" ? "bg-[#18181B] text-white" : "hover:bg-[#EFEAE1] text-[#71717A] hover:text-[#18181B]"
              }`}
              title="Messages"
            >
              <MessageSquare className="w-4 h-4" />
            </button>

            {/* User Avatar with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#6366F1] text-white flex items-center justify-center font-bold text-sm shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
                title="Account Menu"
              >
                {userInitial}
              </button>

              {/* Exact Popup Menu Matching User Screenshot */}
              {showProfileMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <div className="absolute right-0 top-11 w-72 bg-white rounded-2xl p-4 shadow-2xl border border-black/[0.08] z-50 text-left animate-in fade-in zoom-in-95 duration-150">
                    <p className="text-[11px] text-[#71717A] mb-2 font-medium">Currently in</p>
                    
                    {/* Active User Card */}
                    <div className="flex items-start gap-3 p-2.5 rounded-xl bg-[#FAF8F5] border border-black/[0.04] mb-3">
                      <div className="w-11 h-11 rounded-full bg-[#6366F1] text-white flex items-center justify-center font-bold text-lg shrink-0">
                        {userInitial}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm text-[#18181B] truncate">{formData.name || "User"}</p>
                        <p className="text-xs text-[#71717A]">Personal</p>
                        <p className="text-xs text-[#71717A] truncate mt-0.5">{accountEmail}</p>
                      </div>
                      <Check className="w-4 h-4 text-[#18181B] shrink-0 mt-1" />
                    </div>

                    {/* Convert to business */}
                    <button
                      onClick={() => {
                        toast.info("Convert to business feature coming soon ✦");
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left py-2 px-2.5 rounded-lg hover:bg-[#F4EFE6] text-sm font-semibold text-[#18181B] transition-colors cursor-pointer block mb-2"
                    >
                      Convert to business
                    </button>

                    {/* Section: Your accounts */}
                    <div className="pt-2 border-t border-black/[0.06] space-y-1">
                      <p className="text-[11px] text-[#71717A] px-2.5 py-1 font-medium">Your accounts</p>
                      
                      <button
                        onClick={() => {
                          router.push("/signup");
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left py-2 px-2.5 rounded-lg hover:bg-[#F4EFE6] text-sm font-semibold text-[#18181B] transition-colors cursor-pointer block"
                      >
                        Add Dropterest account
                      </button>

                      <button
                        onClick={async () => {
                          setShowProfileMenu(false);
                          await signOut();
                          window.location.href = "/login";
                        }}
                        className="w-full text-left py-2 px-2.5 rounded-lg hover:bg-red-50 text-sm font-semibold text-[#18181B] hover:text-red-600 transition-colors cursor-pointer block"
                      >
                        Log out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* ================= 3. SETTINGS MAIN SPLIT BODY ================= */}
        <div className="flex-1 flex flex-col md:flex-row max-w-5xl w-full px-4 sm:px-10 lg:px-14 py-8 sm:py-10 gap-8 lg:gap-14">
          {/* Left Settings Tabs */}
          <aside className="w-full md:w-56 shrink-0">
            <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-none">
              {SETTINGS_TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`text-left py-2 px-3 rounded-xl text-sm transition-all cursor-pointer whitespace-nowrap md:whitespace-normal font-semibold ${
                      isActive
                        ? "text-[#18181B] underline underline-offset-8 decoration-2 decoration-[#18181B] font-bold"
                        : "text-[#71717A] hover:text-[#18181B] hover:bg-black/[0.03]"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Right Settings Content Form */}
          <main className="flex-1 max-w-lg pb-24">
            <AnimatePresence mode="wait">
              {/* TAB 1: EDIT PROFILE (Exact Screenshot Match) */}
              {activeTab === "edit-profile" && (
                <motion.div
                  key="edit-profile"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-5"
                >
                  {/* Header */}
                  <div>
                    <h1 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-[#18181B]">
                      Edit profile
                    </h1>
                    <p className="text-xs text-[#71717A] mt-1 leading-relaxed">
                      Keep your personal details private. Information you add here is visible to anyone who can view your profile.
                    </p>
                  </div>

                  {/* Photo Section */}
                  <div className="space-y-1.5 pt-1">
                    <label className="block text-xs font-semibold text-[#18181B]">
                      Photo
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-[#7C3AED] text-white flex items-center justify-center font-bold text-2xl shadow-sm select-none overflow-hidden">
                        {formData.avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={formData.avatarUrl}
                            alt={formData.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          userInitial
                        )}
                      </div>

                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handlePhotoUpload}
                        accept="image/*"
                        className="hidden"
                      />

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 rounded-full bg-[#E5E5E5] hover:bg-[#D4D4D4] text-xs font-semibold text-[#18181B] transition-colors cursor-pointer"
                      >
                        Change
                      </button>
                    </div>
                  </div>

                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#18181B]">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ali shah"
                      className="w-full h-11 px-4 rounded-2xl border border-black/15 bg-white focus:border-black focus:ring-1 focus:ring-black text-sm text-[#18181B] placeholder:text-[#A1A1AA] outline-none transition-all"
                    />
                  </div>

                  {/* About Textarea */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#18181B]">
                      About
                    </label>
                    <textarea
                      rows={3}
                      value={formData.about}
                      onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                      placeholder="Tell your story"
                      className="w-full p-4 rounded-2xl border border-black/15 bg-white focus:border-black focus:ring-1 focus:ring-black text-sm text-[#18181B] placeholder:text-[#A1A1AA] outline-none resize-none transition-all"
                    />
                  </div>

                  {/* Pronouns Dropdown */}
                  <div className="space-y-1.5 relative">
                    <label className="block text-xs font-semibold text-[#18181B]">
                      Pronouns
                    </label>
                    <p className="text-[11px] text-[#71717A]">
                      Choose up to 2 sets of pronouns to appear on your profile so others know how to refer to you. You can edit or remove these any time.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowPronounDropdown(!showPronounDropdown)}
                      className="w-full h-11 px-4 rounded-2xl border border-black/15 bg-white flex items-center justify-between text-sm text-[#18181B] cursor-pointer hover:border-black/30 transition-all text-left"
                    >
                      <span className={formData.pronouns === "Add your pronouns" ? "text-[#71717A]" : "text-[#18181B]"}>
                        {formData.pronouns}
                      </span>
                      <ChevronDown className="w-4 h-4 text-[#71717A]" />
                    </button>

                    {showPronounDropdown && (
                      <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-black/10 rounded-2xl shadow-xl z-20 py-1 overflow-hidden animate-in fade-in zoom-in-95">
                        {PRONOUN_OPTIONS.map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, pronouns: p });
                              setShowPronounDropdown(false);
                            }}
                            className="w-full px-4 py-2.5 text-left text-xs font-medium text-[#18181B] hover:bg-[#FAF8F5] cursor-pointer flex items-center justify-between"
                          >
                            <span>{p}</span>
                            {formData.pronouns === p && <Check className="w-3.5 h-3.5 text-[#18181B]" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Website Input */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#18181B]">
                      Website
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://"
                      className="w-full h-11 px-4 rounded-2xl border border-black/15 bg-white focus:border-black focus:ring-1 focus:ring-black text-sm text-[#18181B] placeholder:text-[#A1A1AA] outline-none transition-all"
                    />
                  </div>

                  {/* Username Input */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#18181B]">
                      User name
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s+/g, "") })}
                      placeholder="username"
                      className="w-full h-11 px-4 rounded-2xl border border-black/15 bg-white focus:border-black focus:ring-1 focus:ring-black text-sm text-[#18181B] placeholder:text-[#A1A1AA] outline-none transition-all font-mono"
                    />
                    <p className="text-[11px] text-[#71717A] font-mono">
                      www.dropterest.com/{formData.username || "username"}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: ACCOUNT MANAGEMENT */}
              {activeTab === "account-management" && (
                <motion.div
                  key="account-management"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-6"
                >
                  <div>
                    <h1 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-[#18181B]">
                      Account management
                    </h1>
                    <p className="text-xs text-[#71717A] mt-1 leading-relaxed">
                      Make changes to your personal details or account type.
                    </p>
                  </div>

                  {/* Email Section */}
                  <div className="space-y-1.5 pt-2">
                    <label className="block text-xs font-semibold text-[#18181B]">
                      Email address
                    </label>
                    <input
                      type="email"
                      value={accountEmail}
                      disabled
                      className="w-full h-11 px-4 rounded-2xl border border-black/10 bg-[#F4EFE6]/50 text-sm text-[#71717A] outline-none cursor-not-allowed"
                    />
                    <p className="text-[11px] text-[#71717A]">
                      Your email address is managed via your secure Better Auth identity.
                    </p>
                  </div>

                  {/* Password Section */}
                  <div className="pt-4 border-t border-black/[0.06] flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-[#18181B]">Password</h4>
                      <p className="text-xs text-[#71717A]">
                        {passwordResetSent ? "Reset link sent to your email" : "Change your password anytime"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await authClient.requestPasswordReset({
                            email: accountEmail,
                            redirectTo: "/reset-password",
                          });
                          setPasswordResetSent(true);
                          toast.success("Password reset link dispatched ✦");
                        } catch {
                          toast.error("Failed to trigger reset email.");
                        }
                      }}
                      className="px-4 py-2 rounded-full bg-[#E5E5E5] hover:bg-[#D4D4D4] text-xs font-semibold text-[#18181B] transition-colors cursor-pointer"
                    >
                      Change
                    </button>
                  </div>
                </motion.div>
              )}

              {/* TAB 3-11 */}
              {activeTab !== "edit-profile" && activeTab !== "account-management" && (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-5"
                >
                  <div>
                    <h1 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-[#18181B] capitalize">
                      {SETTINGS_TABS.find((t) => t.id === activeTab)?.label}
                    </h1>
                    <p className="text-xs text-[#71717A] mt-1">
                      Configure your preferences and platform configurations.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-black/10 bg-white p-6 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-[#FAF8F5] text-[#18181B] flex items-center justify-center mx-auto">
                      <Sparkles className="w-6 h-6 text-[#4DE3A5]" />
                    </div>
                    <h3 className="text-sm font-semibold text-[#18181B]">Preferences active</h3>
                    <p className="text-xs text-[#71717A] max-w-sm mx-auto">
                      Your platform settings for {SETTINGS_TABS.find((t) => t.id === activeTab)?.label} are active and synced.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* ================= FIXED BOTTOM ACTION BAR (Screenshot Match) ================= */}
      <div
        className={`fixed bottom-0 right-0 bg-white border-t border-black/[0.08] px-6 sm:px-12 py-3.5 z-30 flex items-center justify-center sm:justify-end gap-3 shadow-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          activeDrawer === "notifications" || activeDrawer === "messages" || activeDrawer === "settings"
            ? "left-16 sm:left-20 lg:left-[460px]"
            : "left-16 sm:left-20"
        }`}
      >
        <button
          type="button"
          onClick={handleReset}
          disabled={!hasChanges || isSaving}
          className="px-5 py-2.5 rounded-full bg-[#E5E5E5] hover:bg-[#D4D4D4] disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold text-[#18181B] transition-colors cursor-pointer"
        >
          Reset
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className={`px-6 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
            hasChanges
              ? "bg-[#E60023] hover:bg-[#CC001F] text-white shadow-sm"
              : "bg-[#E5E5E5] text-[#A1A1AA] cursor-not-allowed"
          }`}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <span>Save</span>
          )}
        </button>
      </div>

      {/* ================= DRAWERS & MODALS ================= */}
      <NotificationsDrawer
        isOpen={activeDrawer === "notifications"}
        onClose={() => setActiveDrawer(null)}
        onExploreFeed={() => {
          setActiveDrawer(null);
          router.push("/ideas");
        }}
        onOpenPin={() => {
          setActiveDrawer(null);
          router.push("/ideas");
        }}
      />

      <MessagesDrawer
        isOpen={activeDrawer === "messages"}
        onClose={() => setActiveDrawer(null)}
        onOpenNewMessage={() => setShowNewMessageModal(true)}
        onOpenInviteFriends={() => setShowInviteFriendsModal(true)}
        chats={chats as any}
        onSelectChat={(chat: any) => {
          toast.info(`Opened conversation with ${chat.name}`);
        }}
      />

      <SettingsSupportDrawer
        isOpen={activeDrawer === "settings"}
        onClose={() => setActiveDrawer(null)}
        onOpenSettingsModal={() => setActiveDrawer(null)}
        showToast={showToast}
      />

      <NewMessageModal
        isOpen={showNewMessageModal}
        onClose={() => setShowNewMessageModal(false)}
        onSendMessage={handleSendMessage}
      />

      <InviteFriendsModal
        isOpen={showInviteFriendsModal}
        onClose={() => setShowInviteFriendsModal(false)}
        showToast={showToast}
      />
    </div>
  );
}
