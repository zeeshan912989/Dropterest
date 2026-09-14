"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Compass,
  Bookmark,
  Plus,
  Bell,
  MessageSquare,
  Settings,
  Search,
  Check,
  Download,
  ShoppingBag,
  MoreHorizontal,
  Link2,
  Share2,
  ArrowLeft,
  UserCheck,
  UserPlus,
  Loader2,
  Sparkles,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { authClient, signOut } from "@/lib/auth/auth-client";
import PostDetailModal from "@/components/dashboard/PostDetailModal";
import NotificationsDrawer from "@/components/dashboard/NotificationsDrawer";
import MessagesDrawer from "@/components/dashboard/MessagesDrawer";
import SettingsSupportDrawer from "@/components/dashboard/SettingsSupportDrawer";

export default function CreatorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = params?.username as string;

  const { data: session } = authClient.useSession();
  const currentUser = session?.user;

  const [loading, setLoading] = useState(true);
  const [creatorData, setCreatorData] = useState<any>(null);
  const [drops, setDrops] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "free" | "sell">("all");
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [isLoadingFollow, setIsLoadingFollow] = useState(false);
  const [activeMenuPinId, setActiveMenuPinId] = useState<string | null>(null);
  const [savedPosts, setSavedPosts] = useState<Record<string, boolean>>({});

  // Drawers & Nav state
  const [activeDrawer, setActiveDrawer] = useState<"notifications" | "messages" | "settings" | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    if (!username) return;
    setLoading(true);

    fetch(`/api/creators/${encodeURIComponent(username)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.creator) {
          setCreatorData(data.creator);
          setDrops(data.drops || []);
          setIsFollowing(data.creator.isFollowing);
          setFollowersCount(data.creator.followersCount);
        } else {
          toast.error(data.error || "Creator not found");
        }
      })
      .catch(() => {
        toast.error("Failed to load creator profile");
      })
      .finally(() => setLoading(false));

    const handleClickOutside = () => setActiveMenuPinId(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [username]);

  // Real Database Follow Toggle
  const handleToggleFollow = async () => {
    if (!creatorData?.id) return;
    setIsLoadingFollow(true);
    try {
      const res = await fetch(`/api/users/${creatorData.id}/follow`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        setIsFollowing(data.isFollowing);
        setFollowersCount(data.followersCount);
        toast.success(data.message || (data.isFollowing ? "Following creator ✦" : "Unfollowed creator"));
      } else {
        toast.error(data.error || "Please log in to follow creators");
      }
    } catch {
      toast.error("Network error updating follow");
    } finally {
      setIsLoadingFollow(false);
    }
  };

  // Direct 1-Click Free Download
  const handleDirectDownload = async (pin: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuPinId(null);
    const targetUrl = pin.previewUrl || pin.image;
    if (!targetUrl) {
      toast.error("No asset available for download");
      return;
    }

    toast.info("Preparing download... 📥");
    try {
      const res = await fetch(targetUrl);
      const blob = await res.blob();
      let ext = "jpg";
      const mime = blob.type?.toLowerCase() || "";
      if (mime.includes("png")) ext = "png";
      else if (mime.includes("webp")) ext = "webp";
      else if (mime.includes("jpeg") || mime.includes("jpg")) ext = "jpg";
      else if (mime.includes("zip")) ext = "zip";
      else if (mime.includes("pdf")) ext = "pdf";

      const cleanTitle = (pin.title || "design-asset").toLowerCase().replace(/[^a-z0-9_-]/g, "-").replace(/-+/g, "-");
      const fileName = `${cleanTitle}.${ext}`;

      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      setDrops((prev) =>
        prev.map((p) =>
          p.id === pin.id ? { ...p, downloadsCount: (p.downloadsCount || 0) + 1 } : p
        )
      );

      if (pin.id && !pin.id.startsWith("pin-")) {
        fetch(`/api/posts/${pin.id}/download`, { method: "POST" }).catch(() => {});
      }

      toast.success(`Downloaded ${fileName} ✦`);
    } catch {
      const a = document.createElement("a");
      a.href = targetUrl;
      a.download = `${(pin.title || "design").toLowerCase().replace(/[^a-z0-9_-]/g, "-")}.jpg`;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success("Download started ✦");
    }
  };

  const handleDeleteDrop = async (dropId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuPinId(null);
    if (!window.confirm("Are you sure you want to delete this drop? This action cannot be undone.")) {
      return;
    }
    try {
      const res = await fetch(`/api/posts/${dropId}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        setDrops((prev) => prev.filter((d) => d.id !== dropId));
        toast.success("Drop deleted successfully ✦");
      } else {
        toast.error(data.error || "Failed to delete drop");
      }
    } catch {
      toast.error("Network error deleting drop");
    }
  };

  const filteredDrops = drops.filter((d) => {
    if (activeTab === "free") return d.postType !== "sell";
    if (activeTab === "sell") return d.postType === "sell";
    return true;
  });

  const isDrawerOpen = Boolean(activeDrawer);

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans antialiased text-[#18181B] flex relative overflow-x-hidden selection:bg-[#4DE3A5] selection:text-[#064E3B]">
      {/* ================= LEFT SLIDER RAIL ================= */}
      <aside className="w-16 sm:w-20 bg-[#FAF8F5] border-r border-black/[0.06] flex flex-col items-center justify-between py-6 fixed left-0 top-0 bottom-0 z-40">
        <div className="flex flex-col items-center gap-6 w-full">
          <Link
            href="/ideas"
            className="w-11 h-11 rounded-xl bg-[#E60023] hover:bg-[#CC001F] text-white flex items-center justify-center font-bold text-xl hover:scale-105 active:scale-95 transition-all shadow-md"
            title="Dropterest Home"
          >
            <span>✦</span>
          </Link>

          <nav className="flex flex-col items-center gap-2 w-full px-2">
            <Link
              href="/ideas"
              className="w-11 h-11 rounded-2xl hover:bg-[#EFEAE1]/70 flex items-center justify-center text-[#71717A] hover:text-[#18181B] transition-colors"
              title="Explore Feed"
            >
              <Compass className="w-5 h-5" />
            </Link>

            <Link
              href="/ideas?tab=saved"
              className="w-11 h-11 rounded-2xl hover:bg-[#EFEAE1]/70 flex items-center justify-center text-[#71717A] hover:text-[#18181B] transition-colors"
              title="Your Saved Drops"
            >
              <Bookmark className="w-5 h-5" />
            </Link>

            <Link
              href="/ideas?tab=create"
              className="w-11 h-11 rounded-2xl hover:bg-[#EFEAE1]/70 flex items-center justify-center text-[#71717A] hover:text-[#18181B] transition-colors"
              title="Create Drops"
            >
              <Plus className="w-5 h-5" />
            </Link>
          </nav>
        </div>

        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveDrawer(activeDrawer === "notifications" ? null : "notifications")}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-colors cursor-pointer relative ${
              activeDrawer === "notifications" ? "bg-[#EFEAE1] text-[#18181B]" : "text-[#71717A] hover:bg-[#EFEAE1]/70 hover:text-[#18181B]"
            }`}
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#EF4444]" />
          </button>

          <button
            type="button"
            onClick={() => setActiveDrawer(activeDrawer === "messages" ? null : "messages")}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-colors cursor-pointer ${
              activeDrawer === "messages" ? "bg-[#EFEAE1] text-[#18181B]" : "text-[#71717A] hover:bg-[#EFEAE1]/70 hover:text-[#18181B]"
            }`}
            title="Messages"
          >
            <MessageSquare className="w-5 h-5" />
          </button>

          <Link
            href="/settings"
            className="w-11 h-11 rounded-2xl hover:bg-[#EFEAE1]/70 flex items-center justify-center text-[#71717A] hover:text-[#18181B] transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </Link>
        </div>
      </aside>

      {/* ================= DRAWERS ================= */}
      <NotificationsDrawer
        isOpen={activeDrawer === "notifications"}
        onClose={() => setActiveDrawer(null)}
        onExploreFeed={() => router.push("/ideas")}
        onOpenPin={(pin: any) => setSelectedPost(pin)}
      />
      <MessagesDrawer
        isOpen={activeDrawer === "messages"}
        onClose={() => setActiveDrawer(null)}
        onOpenNewMessage={() => toast.info("New message dialog")}
        onOpenInviteFriends={() => toast.info("Invite friends dialog")}
        chats={[]}
        onSelectChat={() => {}}
      />
      <SettingsSupportDrawer
        isOpen={activeDrawer === "settings"}
        onClose={() => setActiveDrawer(null)}
        onOpenSettingsModal={() => router.push("/settings")}
        showToast={(msg: string) => toast(msg)}
      />

      {/* ================= MAIN CONTENT ================= */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out pl-16 sm:pl-20 ${
          isDrawerOpen ? "lg:pl-[460px]" : ""
        }`}
      >
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-black/[0.05] px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-9 h-9 rounded-full hover:bg-[#EFEAE1] flex items-center justify-center text-[#71717A] hover:text-[#18181B] transition-colors cursor-pointer"
              title="Go Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="font-editorial text-xl font-bold text-[#18181B] tracking-tight">
              Creator Profile
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowProfileMenu((prev) => !prev)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-[#FAF8F5] transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[#6366F1] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {currentUser?.name ? currentUser.name[0].toUpperCase() : "A"}
                </div>
              </button>

              {showProfileMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                  <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-xl border border-black/10 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-black/5">
                      <p className="font-semibold text-xs text-[#18181B]">{currentUser?.name || "User"}</p>
                      <p className="text-[11px] text-[#71717A] truncate">{currentUser?.email || ""}</p>
                    </div>
                    <Link
                      href="/settings"
                      onClick={() => setShowProfileMenu(false)}
                      className="w-full text-left py-2 px-4 hover:bg-[#F4EFE6] text-xs font-medium text-[#18181B] block"
                    >
                      Account Settings
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        signOut();
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left py-2 px-4 hover:bg-red-50 text-xs font-semibold text-red-600 block"
                    >
                      Log out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-[#18181B] animate-spin mb-3" />
            <p className="text-xs text-[#71717A] font-mono">Loading creator portfolio...</p>
          </div>
        ) : !creatorData ? (
          <div className="flex-1 flex flex-col items-center justify-center py-24 text-center px-4">
            <h2 className="font-editorial text-2xl font-bold text-[#18181B] mb-2">Creator not found</h2>
            <p className="text-xs text-[#71717A] mb-6">The creator profile you are looking for does not exist.</p>
            <Link
              href="/ideas"
              className="px-6 py-2.5 rounded-full bg-[#18181B] text-white text-xs font-semibold"
            >
              Return to Ideas Feed
            </Link>
          </div>
        ) : (
          <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
            {/* Creator Hero Header Card */}
            <div className="rounded-3xl bg-white border border-black/[0.06] p-6 sm:p-10 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start sm:items-center gap-5">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-[#6366F1] text-white flex items-center justify-center font-bold text-2xl shrink-0 border-2 border-white shadow-md">
                  {creatorData.avatarUrl ? (
                    <Image src={creatorData.avatarUrl} alt={creatorData.name} fill className="object-cover" />
                  ) : (
                    creatorData.name[0].toUpperCase()
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#18181B]">
                      {creatorData.name}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#064E3B] text-[10px] font-bold tracking-wide border border-[#10B981]/20 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified Creator</span>
                    </span>
                  </div>

                  <p className="text-xs font-mono text-[#71717A]">@{creatorData.username}</p>
                  <p className="text-xs sm:text-sm text-[#52525B] max-w-lg leading-relaxed pt-1">
                    {creatorData.bio}
                  </p>

                  {/* Followers & Drops Stats */}
                  <div className="flex items-center gap-6 pt-2 text-xs font-mono text-[#71717A]">
                    <div>
                      <strong className="text-[#18181B] font-bold">{followersCount}</strong> followers
                    </div>
                    <div>
                      <strong className="text-[#18181B] font-bold">{creatorData.followingCount || 0}</strong> following
                    </div>
                    <div>
                      <strong className="text-[#18181B] font-bold">{drops.length}</strong> drops
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 shrink-0 self-stretch sm:self-auto justify-end">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    toast.success("Profile link copied to clipboard ✦");
                  }}
                  className="px-4 py-2.5 rounded-full bg-[#FAF8F5] hover:bg-[#EFEAE1] border border-black/10 text-xs font-semibold text-[#18181B] transition-all cursor-pointer"
                >
                  Share
                </button>

                {!creatorData.isOwnProfile && (
                  <button
                    type="button"
                    onClick={handleToggleFollow}
                    disabled={isLoadingFollow}
                    className={`px-6 py-2.5 rounded-full text-xs font-semibold shadow-md transition-all flex items-center gap-2 cursor-pointer ${
                      isFollowing
                        ? "bg-[#18181B] hover:bg-black text-white"
                        : "bg-[#4DE3A5] hover:bg-[#60ebb0] text-[#064E3B] hover:scale-105"
                    }`}
                  >
                    {isLoadingFollow ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isFollowing ? (
                      <>
                        <UserCheck className="w-4 h-4" />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Filter Tabs (All / Free / Paid Marketplace) */}
            <div className="flex items-center justify-between border-b border-black/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === "all" ? "bg-[#18181B] text-white shadow-xs" : "bg-[#FAF8F5] text-[#71717A] hover:text-[#18181B]"
                  }`}
                >
                  All Drops ({drops.length})
                </button>
                <button
                  onClick={() => setActiveTab("free")}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === "free" ? "bg-[#064E3B] text-white shadow-xs" : "bg-[#FAF8F5] text-[#71717A] hover:text-[#18181B]"
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Free Downloads ({drops.filter((d) => d.postType !== "sell").length})</span>
                </button>
                <button
                  onClick={() => setActiveTab("sell")}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === "sell" ? "bg-[#E60023] text-white shadow-xs" : "bg-[#FAF8F5] text-[#71717A] hover:text-[#18181B]"
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Marketplace Paid ({drops.filter((d) => d.postType === "sell").length})</span>
                </button>
              </div>
            </div>

            {/* Drops Grid */}
            {filteredDrops.length === 0 ? (
              <div className="py-20 text-center max-w-md mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-[#FAF8F5] flex items-center justify-center mx-auto mb-3 text-[#A1A1AA]">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-editorial text-2xl font-bold text-[#18181B] mb-1">No drops in this category</h3>
                <p className="text-xs text-[#71717A]">This creator hasn&apos;t published any drops under this filter yet.</p>
              </div>
            ) : (
              <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 space-y-4">
                {filteredDrops.map((drop) => {
                  const isSell = drop.postType === "sell";
                  const isSaved = Boolean(savedPosts[drop.id]);

                  return (
                    <div
                      key={drop.id}
                      onClick={() => router.push(`/drop/${drop.id}`)}
                      className="break-inside-avoid group relative rounded-[5px] overflow-hidden bg-white border border-black/[0.06] shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer"
                    >
                      <div className="relative w-full aspect-[3/4.2] rounded-[5px] overflow-hidden bg-[#FAF8F5]">
                        <Image
                          src={drop.previewUrl || "/architecture-pavilion.jpeg"}
                          alt={drop.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        />

                        {/* Corner Badge */}
                        <div className="absolute top-2.5 left-2.5 z-10">
                          {isSell ? (
                            <span className="text-[10px] font-mono font-bold text-white bg-[#18181B]/90 backdrop-blur-md px-2 py-0.5 rounded-[5px] shadow-md border border-white/20">
                              PKR {drop.price?.toLocaleString() || 299}
                            </span>
                          ) : (
                            <span className="text-[9px] font-mono font-bold text-[#064E3B] bg-[#4DE3A5]/90 backdrop-blur-md px-2 py-0.5 rounded-[5px] shadow-xs">
                              FREE ASSET
                            </span>
                          )}
                        </div>

                        {/* Hover Overlay with 3-Dots */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3 pointer-events-none" />

                        <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSavedPosts((prev) => ({ ...prev, [drop.id]: !prev[drop.id] }));
                              toast.success(isSaved ? "Removed from collection" : "Saved to collection ✦");
                            }}
                            className={`px-3 py-1.5 rounded-[5px] text-xs font-semibold shadow-md transition-all cursor-pointer flex items-center gap-1 ${
                              isSaved ? "bg-[#18181B] text-white" : "bg-[#4DE3A5] text-[#064E3B] hover:bg-[#60ebb0]"
                            }`}
                          >
                            {isSaved ? "Saved" : "Save"}
                          </button>

                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuPinId(activeMenuPinId === drop.id ? null : drop.id);
                              }}
                              className="w-8 h-8 rounded-[5px] bg-white/90 hover:bg-white text-[#18181B] shadow-md backdrop-blur-md flex items-center justify-center transition-all cursor-pointer"
                              title="Options"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>

                            {activeMenuPinId === drop.id && (
                              <div
                                onClick={(e) => e.stopPropagation()}
                                className="absolute right-0 top-10 w-48 bg-white rounded-[5px] shadow-2xl border border-black/10 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150 text-left"
                              >
                                <button
                                  onClick={(e) => handleDirectDownload(drop, e)}
                                  className="w-full px-3.5 py-2 text-xs font-semibold text-[#064E3B] hover:bg-[#ECFDF5] flex items-center gap-2.5 transition-colors cursor-pointer"
                                >
                                  <Download className="w-3.5 h-3.5 text-[#064E3B]" />
                                  <span>Download Free</span>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigator.clipboard?.writeText(`${window.location.origin}/ideas?pin=${drop.id}`);
                                    toast.success("Link copied to clipboard ✦");
                                    setActiveMenuPinId(null);
                                  }}
                                  className="w-full px-3.5 py-2 text-xs font-medium text-[#18181B] hover:bg-[#F4EFE6] flex items-center gap-2.5 transition-colors cursor-pointer"
                                >
                                  <Link2 className="w-3.5 h-3.5 text-[#71717A]" />
                                  <span>Copy link</span>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toast.success("Share dialog ready ✦");
                                    setActiveMenuPinId(null);
                                  }}
                                  className="w-full px-3.5 py-2 text-xs font-medium text-[#18181B] hover:bg-[#F4EFE6] flex items-center gap-2.5 transition-colors cursor-pointer"
                                >
                                  <Share2 className="w-3.5 h-3.5 text-[#71717A]" />
                                  <span>Share drop</span>
                                </button>

                                {(currentUser?.id === drop.creatorId || currentUser?.id === creatorData?.id) && (
                                  <>
                                    <div className="h-px bg-black/[0.06] my-1" />
                                    <button
                                      onClick={(e) => handleDeleteDrop(drop.id, e)}
                                      className="w-full px-3.5 py-2 text-xs font-semibold text-[#DC2626] hover:bg-[#FEF2F2] flex items-center gap-2.5 transition-colors cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5 text-[#DC2626]" />
                                      <span>Delete drop</span>
                                    </button>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Hover Bottom Bar */}
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-auto">
                          <div className="min-w-0 pr-2">
                            <span className="text-[11px] font-semibold text-white truncate block">{drop.title}</span>
                            <span className="text-[10px] text-white/80 flex items-center gap-1.5 mt-0.5">
                              <span>📥 {drop.downloadsCount || 0} dl</span>
                              <span>&middot;</span>
                              <span className="font-mono">❤️ {drop.likesCount || 0}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Upgraded Post Detail Modal with in-place direct checkout & delete */}
      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          isOpen={Boolean(selectedPost)}
          onClose={() => setSelectedPost(null)}
          onSaveToggle={(id: string) => {
            setSavedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
          }}
          isSaved={Boolean(savedPosts[selectedPost?.id])}
          onSelectRelatedPost={(item: any) => setSelectedPost(item)}
          onDeletePost={(dropId: string) => {
            setDrops((prev) => prev.filter((d) => d.id !== dropId));
          }}
        />
      )}
    </div>
  );
}
