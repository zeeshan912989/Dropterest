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
  ArrowLeft,
  UserCheck,
  UserPlus,
  Loader2,
  Sparkles,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Maximize2,
  Smile,
  ImageIcon,
  Send,
  Link2,
  Trash2,
  Camera,
  Mic,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { authClient, signOut } from "@/lib/auth/auth-client";
import NotificationsDrawer from "@/components/dashboard/NotificationsDrawer";
import MessagesDrawer from "@/components/dashboard/MessagesDrawer";
import SettingsSupportDrawer from "@/components/dashboard/SettingsSupportDrawer";

export default function DedicatedDropPage() {
  const params = useParams();
  const router = useRouter();
  const dropId = params?.id as string;

  const { data: session } = authClient.useSession();
  const currentUser = session?.user;
  const currentUserId = currentUser?.id;

  // Post & Creator State
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<any>(null);
  
  // Real Database Likes
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiking, setIsLiking] = useState(false);

  // Real Database Comments
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isPostingComment, setIsPostingComment] = useState(false);

  // Saves & Follows
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [isLoadingFollow, setIsLoadingFollow] = useState(false);

  // Options & Downloads
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Quick In-Window Payment
  const [showQuickPayment, setShowQuickPayment] = useState(false);
  const [accountNumber, setAccountNumber] = useState("0300-1234567");
  const [isProcessingQuickPay, setIsProcessingQuickPay] = useState(false);

  // Related & Recommendation Stream
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);

  // Drawers & Nav
  const [activeDrawer, setActiveDrawer] = useState<"notifications" | "messages" | "settings" | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch Post, Real Likes, Real Comments & Recommendations in parallel
  useEffect(() => {
    if (!dropId) return;
    setLoading(true);

    const loadAllData = async () => {
      try {
        const [postRes, likeRes, commentsRes, relatedRes] = await Promise.allSettled([
          fetch(`/api/posts/${dropId}`).then((res) => res.json()),
          fetch(`/api/posts/${dropId}/like`).then((res) => res.json()),
          fetch(`/api/posts/${dropId}/comments`).then((res) => res.json()),
          fetch(`/api/posts/${dropId}/related`).then((res) => res.json()),
        ]);

        if (postRes.status === "fulfilled" && postRes.value?.success && postRes.value.post) {
          const postData = postRes.value.post;
          setPost(postData);
          setLikesCount(postData.likesCount || 0);

          if (typeof document !== "undefined" && postData.title) {
            document.title = `${postData.title} — Dropterest`;
          }

          fetch(`/api/posts/${dropId}/view`, { method: "POST" }).catch(() => {});

          if (postData.creatorId) {
            fetch(`/api/users/${postData.creatorId}/follow`)
              .then((fRes) => fRes.json())
              .then((fData) => {
                if (fData.success) {
                  setIsFollowing(fData.isFollowing);
                  setFollowersCount(fData.followersCount);
                }
              })
              .catch(() => {});
          }
        } else if (postRes.status === "fulfilled" && !postRes.value?.success) {
          toast.error(postRes.value?.error || "Drop not found");
        }

        if (likeRes.status === "fulfilled" && likeRes.value?.success) {
          setIsLiked(likeRes.value.isLiked);
          if (likeRes.value.likesCount !== undefined) {
            setLikesCount(likeRes.value.likesCount);
          }
        }

        if (commentsRes.status === "fulfilled" && commentsRes.value?.success) {
          setComments(commentsRes.value.comments || []);
        }

        if (relatedRes.status === "fulfilled" && relatedRes.value?.success && relatedRes.value.related?.length > 0) {
          setRelatedPosts(relatedRes.value.related);
        } else {
          fetch(`/api/posts`)
            .then((pRes) => pRes.json())
            .then((pData) => {
              if (pData.success && pData.posts) {
                setRelatedPosts(pData.posts.filter((p: any) => p.id !== dropId));
              }
            })
            .catch(() => {});
        }
      } catch {
        toast.error("Failed to load drop details");
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, [dropId]);

  const isOwnPost = Boolean(currentUserId && post?.creatorId === currentUserId);
  const isSell = post?.postType === "sell";
  const basePrice = Number(post?.price) || 299;

  // Real Database Like Toggle
  const handleToggleLike = async () => {
    if (!dropId) return;
    if (!currentUser) {
      toast.error("Please sign in to like drops");
      return;
    }

    // Optimistic UI Update
    const prevLiked = isLiked;
    const prevCount = likesCount;
    setIsLiked(!prevLiked);
    setLikesCount(prevLiked ? Math.max(0, prevCount - 1) : prevCount + 1);

    try {
      setIsLiking(true);
      const res = await fetch(`/api/posts/${dropId}/like`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setIsLiked(data.isLiked);
        setLikesCount(data.likesCount);
        toast.success(data.message || (data.isLiked ? "Liked drop ❤️" : "Unliked drop"));
      } else {
        // Revert on error
        setIsLiked(prevLiked);
        setLikesCount(prevCount);
        toast.error(data.error || "Failed to update like");
      }
    } catch {
      setIsLiked(prevLiked);
      setLikesCount(prevCount);
      toast.error("Network error updating like");
    } finally {
      setIsLiking(false);
    }
  };

  // Toggle Creator Follow
  const handleToggleFollow = async () => {
    if (!post?.creatorId) return;
    setIsLoadingFollow(true);
    try {
      const res = await fetch(`/api/users/${post.creatorId}/follow`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setIsFollowing(data.isFollowing);
        setFollowersCount(data.followersCount);
        toast.success(data.message || (data.isFollowing ? "Following creator ✦" : "Unfollowed creator"));
      } else {
        toast.error(data.error || "Please log in to follow");
      }
    } catch {
      toast.error("Network error updating follow");
    } finally {
      setIsLoadingFollow(false);
    }
  };

  // Real Database Comment Submission
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!currentUser) {
      toast.error("Please sign in to add comments");
      return;
    }

    setIsPostingComment(true);
    try {
      const res = await fetch(`/api/posts/${dropId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newComment.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.comment) {
        setComments((prev) => [data.comment, ...prev]);
        setNewComment("");
        toast.success("Comment posted ✦");
      } else {
        toast.error(data.error || "Failed to post comment");
      }
    } catch {
      toast.error("Network error posting comment");
    } finally {
      setIsPostingComment(false);
    }
  };

  // Free Download
  const handleFreeDownload = async () => {
    setIsDownloading(true);
    try {
      const res = await fetch(`/api/posts/${post.id}/download`, { method: "POST" });
      const data = await res.json();
      const downloadUrl = data.asset?.downloadUrl || post.previewUrl || post.image;
      
      const bRes = await fetch(downloadUrl);
      const blob = await bRes.blob();
      let ext = "jpg";
      const mime = blob.type?.toLowerCase() || "";
      if (mime.includes("png")) ext = "png";
      else if (mime.includes("webp")) ext = "webp";
      else if (mime.includes("jpeg") || mime.includes("jpg")) ext = "jpg";
      else if (mime.includes("svg")) ext = "svg";
      else if (mime.includes("zip")) ext = "zip";
      else if (mime.includes("pdf")) ext = "pdf";

      const cleanTitle = (post.title || "design-asset").toLowerCase().replace(/[^a-z0-9_-]/g, "-").replace(/-+/g, "-");
      const fileName = `${cleanTitle}.${ext}`;

      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      toast.success(`Downloaded ${fileName} ✦`);
    } catch {
      toast.error("Error initiating download.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Quick In-Window Buy
  const handleQuickBuy = async () => {
    setIsProcessingQuickPay(true);
    try {
      const res = await fetch(`/api/posts/${post.id}/buy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          licenseType: "commercial",
          paymentMethod: "easypaisa",
          accountNumber,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Payment verified! Downloading source asset... ✦");
        if (data.purchase?.downloadToken) {
          const downloadRes = await fetch(`/api/posts/${post.id}/download?token=${data.purchase.downloadToken}`);
          const downloadData = await downloadRes.json();
          if (downloadData.success) {
            const a = document.createElement("a");
            a.href = downloadData.asset.downloadUrl || post.previewUrl;
            a.download = downloadData.asset.fileName || `${post.title}.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }
        }
      } else {
        toast.error(data.error || "Payment failed");
      }
    } catch {
      toast.error("Payment network error");
    } finally {
      setIsProcessingQuickPay(false);
    }
  };

  // Delete Drop
  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this drop?")) return;
    try {
      const res = await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Drop deleted successfully ✦");
        router.push("/ideas");
      } else {
        toast.error(data.error || "Failed to delete drop");
      }
    } catch {
      toast.error("Network error deleting drop");
    }
  };

  const isDrawerOpen = Boolean(activeDrawer);
  const shareableUrl = typeof window !== "undefined" ? `${window.location.origin}/drop/${post?.id || dropId}` : "";

  return (
    <div className="min-h-screen bg-[#FAF9F5] font-sans antialiased text-[#18181B] flex relative overflow-x-hidden selection:bg-[#4DE3A5] selection:text-[#064E3B]">
      {/* ================= LEFT SLIDER RAIL ================= */}
      <aside className="w-16 sm:w-20 bg-[#F4EFE6] border-r border-black/[0.08] flex flex-col items-center justify-between py-6 fixed left-0 top-0 bottom-0 z-40">
        <div className="flex flex-col items-center gap-6 w-full">
          <Link
            href="/ideas"
            className="w-11 h-11 rounded-[5px] bg-[#E60023] text-white flex items-center justify-center font-bold text-xl hover:scale-105 active:scale-95 transition-all shadow-md"
            title="Dropterest Home"
          >
            <span>✦</span>
          </Link>

          <nav className="flex flex-col items-center gap-2 w-full px-2">
            <Link
              href="/ideas"
              className="w-11 h-11 rounded-[5px] hover:bg-black/5 flex items-center justify-center text-[#71717A] hover:text-[#18181B] transition-colors"
              title="Explore Feed"
            >
              <Compass className="w-5 h-5" />
            </Link>

            <Link
              href="/ideas?tab=saved"
              className="w-11 h-11 rounded-[5px] hover:bg-black/5 flex items-center justify-center text-[#71717A] hover:text-[#18181B] transition-colors"
              title="Your Saved Drops"
            >
              <Bookmark className="w-5 h-5" />
            </Link>

            <Link
              href="/ideas?tab=create"
              className="w-11 h-11 rounded-[5px] hover:bg-black/5 flex items-center justify-center text-[#71717A] hover:text-[#18181B] transition-colors"
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
            className={`w-11 h-11 rounded-[5px] flex items-center justify-center transition-colors cursor-pointer relative ${
              activeDrawer === "notifications" ? "bg-black/10 text-[#18181B]" : "text-[#71717A] hover:bg-black/5 hover:text-[#18181B]"
            }`}
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#EF4444]" />
          </button>

          <button
            type="button"
            onClick={() => setActiveDrawer(activeDrawer === "messages" ? null : "messages")}
            className={`w-11 h-11 rounded-[5px] flex items-center justify-center transition-colors cursor-pointer ${
              activeDrawer === "messages" ? "bg-black/10 text-[#18181B]" : "text-[#71717A] hover:bg-black/5 hover:text-[#18181B]"
            }`}
            title="Messages"
          >
            <MessageSquare className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => setActiveDrawer(activeDrawer === "settings" ? null : "settings")}
            className={`w-11 h-11 rounded-[5px] flex items-center justify-center transition-colors cursor-pointer ${
              activeDrawer === "settings" ? "bg-black/10 text-[#18181B]" : "text-[#71717A] hover:bg-black/5 hover:text-[#18181B]"
            }`}
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* ================= DRAWERS ================= */}
      <NotificationsDrawer
        isOpen={activeDrawer === "notifications"}
        onClose={() => setActiveDrawer(null)}
        onExploreFeed={() => router.push("/ideas")}
        onOpenPin={(p: any) => router.push(`/drop/${p.id}`)}
      />
      <MessagesDrawer
        isOpen={activeDrawer === "messages"}
        onClose={() => setActiveDrawer(null)}
        onOpenNewMessage={() => toast.info("New message")}
        onOpenInviteFriends={() => toast.info("Invite friends")}
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
        className={`flex-1 flex flex-col min-h-screen pl-16 sm:pl-20 transition-all duration-300 ease-in-out ${
          isDrawerOpen ? "lg:mr-[380px]" : ""
        }`}
      >
        {/* ================= TOP NAVBAR ================= */}
        <header className="sticky top-0 z-30 bg-[#FAF9F5]/95 backdrop-blur-xl border-b border-black/[0.06] px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/ideas"
              className="w-9 h-9 rounded-[5px] bg-white hover:bg-[#EFEAE1] border border-black/10 flex items-center justify-center text-[#18181B] transition-colors shadow-xs"
              title="Back to Feed"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl relative">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-4 h-4 text-[#71717A]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    router.push(`/ideas?search=${encodeURIComponent(searchQuery)}`);
                  }
                }}
                placeholder="Search ideas, aesthetics, and drops..."
                className="w-full pl-11 pr-20 py-2.5 rounded-[5px] bg-[#EFEAE1]/70 hover:bg-[#EFEAE1] focus:bg-white border border-transparent focus:border-black/15 text-xs text-[#18181B] transition-all outline-none placeholder:text-[#71717A]"
              />
              <div className="absolute right-3 flex items-center gap-2 text-[#71717A]">
                <button type="button" className="hover:text-[#18181B] p-1" title="Visual Search">
                  <Camera className="w-4 h-4" />
                </button>
                <button type="button" className="hover:text-[#18181B] p-1" title="Voice Search">
                  <Mic className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentUser ? (
              <div className="w-8 h-8 rounded-[5px] bg-[#6366F1] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {(currentUser.name || "A")[0].toUpperCase()}
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 rounded-[5px] bg-[#E60023] text-white text-xs font-bold hover:bg-[#CC001F] transition-colors shadow-xs"
              >
                Sign In
              </Link>
            )}
          </div>
        </header>

        {/* ================= PINTEREST BODY WITH 5px RADIUS & REAL DATABASE DATA ================= */}
        <main className="flex-1 max-w-[1700px] w-full mx-auto p-3 sm:p-6 lg:p-8">
          {loading ? (
            <div className="min-h-[500px] flex flex-col items-center justify-center gap-3 text-[#71717A]">
              <Loader2 className="w-8 h-8 animate-spin text-[#18181B]" />
              <p className="text-sm font-medium">Loading drop canvas...</p>
            </div>
          ) : !post ? (
            <div className="min-h-[400px] flex flex-col items-center justify-center text-center gap-4">
              <p className="text-lg font-bold text-[#18181B]">Drop Not Found</p>
              <Link href="/ideas" className="px-6 py-2.5 rounded-[5px] bg-[#18181B] text-white text-xs font-semibold">
                Explore Feed
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
              {/* ================= LEFT SIDE: MAIN DROP CARD (ONLY 5px RADIUS) ================= */}
              <div className="w-full lg:w-[58%] xl:w-[62%] shrink-0">
                <div className="bg-white rounded-[5px] overflow-hidden border border-black/15 shadow-xl grid grid-cols-1 md:grid-cols-12 sticky top-20">
                  {/* Left Side: Dark High-Res Visual Canvas (5px radius) */}
                  <div className="md:col-span-6 bg-black flex items-center justify-center relative min-h-[400px] md:min-h-[560px] p-4 select-none">
                    {/* Top-Left Back Circle Button */}
                    <Link
                      href="/ideas"
                      className="absolute top-4 left-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md flex items-center justify-center shadow-lg transition-all cursor-pointer hover:scale-105 active:scale-95 border border-white/10"
                      title="Back to Feed"
                    >
                      <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
                    </Link>

                    {/* Main Image (5px radius) */}
                    <div className="relative w-full h-full max-h-[500px] aspect-[3/4.2] rounded-[5px] overflow-hidden shadow-2xl bg-neutral-900 flex items-center justify-center">
                      <Image
                        src={post.previewUrl || post.image || "/architecture-pavilion.jpeg"}
                        alt={post.title || "Design Asset"}
                        fill
                        priority
                        className="object-contain"
                      />

                      {/* Bottom-Right Zoom Button */}
                      <div className="absolute bottom-3 right-3 z-10 w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white backdrop-blur-md flex items-center justify-center shadow-md cursor-pointer border border-white/15">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Interaction Bar, Creator, CTA & Comments */}
                  <div className="md:col-span-6 p-5 sm:p-6 flex flex-col justify-between space-y-4 bg-white">
                    <div className="space-y-4">
                      {/* Top Action Bar */}
                      <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
                        <div className="flex items-center gap-1 sm:gap-1.5">
                          <button
                            type="button"
                            onClick={handleToggleLike}
                            disabled={isLiking}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[5px] text-xs font-bold transition-all cursor-pointer border ${
                              isLiked ? "bg-red-50 text-red-600 border-red-200" : "hover:bg-[#F4EFE6] text-[#18181B] border-transparent"
                            }`}
                            title="Real Database Like"
                          >
                            <Heart className={`w-4 h-4 ${isLiked ? "fill-red-600 stroke-red-600" : "stroke-[2]"}`} />
                            <span className="font-mono">{likesCount}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              document.getElementById("dedicated-comment-input")?.focus();
                            }}
                            className="p-2 rounded-[5px] hover:bg-[#F4EFE6] text-[#18181B] transition-colors cursor-pointer flex items-center gap-1"
                            title="Real Database Comments"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-xs font-mono">{comments.length}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard?.writeText(shareableUrl);
                              toast.success("Share link copied to clipboard ✦");
                            }}
                            className="p-2 rounded-[5px] hover:bg-[#F4EFE6] text-[#18181B] transition-colors cursor-pointer"
                            title="Share"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>

                          {/* Options 3-Dots */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                              className="p-2 rounded-[5px] hover:bg-[#F4EFE6] text-[#18181B] transition-colors cursor-pointer"
                              title="More options"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>

                            {showOptionsMenu && (
                              <div
                                onClick={(e) => e.stopPropagation()}
                                className="absolute left-0 top-10 w-48 bg-white rounded-[5px] shadow-xl border border-black/10 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-150 text-left"
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShowOptionsMenu(false);
                                    handleFreeDownload();
                                  }}
                                  className="w-full px-3.5 py-2 text-xs font-semibold text-[#064E3B] hover:bg-[#ECFDF5] flex items-center gap-2.5 transition-colors cursor-pointer"
                                >
                                  <Download className="w-3.5 h-3.5 text-[#064E3B]" />
                                  <span>Download Free Asset</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShowOptionsMenu(false);
                                    navigator.clipboard?.writeText(shareableUrl);
                                    toast.success("Link copied ✦");
                                  }}
                                  className="w-full px-3.5 py-2 text-xs font-medium text-[#18181B] hover:bg-[#F4EFE6] flex items-center gap-2.5 transition-colors cursor-pointer"
                                >
                                  <Link2 className="w-3.5 h-3.5 text-[#71717A]" />
                                  <span>Copy link</span>
                                </button>

                                {isOwnPost && (
                                  <>
                                    <div className="h-px bg-black/[0.06] my-1" />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setShowOptionsMenu(false);
                                        handleDeletePost();
                                      }}
                                      className="w-full px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                      <span>Delete drop</span>
                                    </button>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {post.creatorUsername && (
                            <Link
                              href={`/creator/${post.creatorUsername}`}
                              className="hidden sm:inline-block text-xs font-semibold text-[#18181B] hover:underline"
                            >
                              Profile ⌄
                            </Link>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              setIsSaved(!isSaved);
                              toast.success(isSaved ? "Removed from saved" : "Saved to collection ✦");
                            }}
                            className={`px-5 py-2 rounded-[5px] text-xs font-bold transition-all cursor-pointer shadow-sm ${
                              isSaved ? "bg-[#18181B] text-white" : "bg-[#E60023] hover:bg-[#CC001F] text-white"
                            }`}
                          >
                            {isSaved ? "Saved" : "Save"}
                          </button>
                        </div>
                      </div>

                      {/* Creator Capsule */}
                      <div className="flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 flex-wrap min-w-0">
                          <span className="text-[#71717A]">Collage created by</span>
                          <Link
                            href={post.creatorUsername ? `/creator/${post.creatorUsername}` : "#"}
                            className="flex items-center gap-1.5 font-bold text-[#18181B] hover:underline"
                          >
                            <div className="w-6 h-6 rounded-[5px] overflow-hidden bg-[#E60023] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                              {post.creatorAvatar ? (
                                <Image src={post.creatorAvatar} alt={post.creatorName || "Creator"} width={24} height={24} className="object-cover" />
                              ) : (
                                (post.creatorName || "H")[0].toUpperCase()
                              )}
                            </div>
                            <span>{post.creatorName || "Creator"}</span>
                          </Link>
                        </div>

                        <button
                          type="button"
                          onClick={handleToggleFollow}
                          disabled={isLoadingFollow}
                          className={`px-3 py-1 rounded-[5px] text-xs font-semibold transition-all cursor-pointer shrink-0 border ${
                            isFollowing ? "bg-[#FAF8F5] border-black/15 text-[#18181B]" : "bg-[#18181B] border-[#18181B] text-white hover:bg-black"
                          }`}
                        >
                          {isLoadingFollow ? "..." : isFollowing ? "Following" : "+ Follow"}
                        </button>
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-[#18181B] leading-snug">
                          {post.title}
                        </h1>
                        <p className="text-xs sm:text-sm text-[#52525B] mt-1 leading-relaxed">
                          {post.description || "Curated visual asset with perpetual commercial rights and instant download."}
                        </p>
                      </div>

                      {/* Main CTA */}
                      {isSell ? (
                        <div className="space-y-2.5 pt-1">
                          <div className="flex items-center justify-between p-3 rounded-[5px] bg-[#FAF8F5] border border-black/[0.08]">
                            <div>
                              <span className="text-[10px] font-mono uppercase font-bold text-[#71717A] block">
                                MARKETPLACE ASSET
                              </span>
                              <span className="text-lg font-bold text-[#18181B]">
                                PKR {basePrice.toLocaleString()}
                              </span>
                            </div>
                            <span className="text-xs font-semibold text-[#064E3B] bg-[#4DE3A5]/40 px-2.5 py-1 rounded-[5px]">
                              Commercial Rights Included
                            </span>
                          </div>

                          <Link
                            href={`/checkout/${post.id}`}
                            className="w-full py-3.5 px-6 rounded-[5px] bg-[#18181B] hover:bg-black text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                          >
                            <ShoppingBag className="w-4 h-4 text-[#4DE3A5]" />
                            <span>Buy Commercial License &middot; PKR {basePrice.toLocaleString()}</span>
                            <ArrowRight className="w-4 h-4 text-white/70" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => setShowQuickPayment(!showQuickPayment)}
                            className="w-full py-1 text-xs font-semibold text-[#71717A] hover:text-[#18181B] text-center cursor-pointer transition-colors"
                          >
                            {showQuickPayment ? "Hide Quick Payment" : "Quick 1-Click Buy in Window"}
                          </button>

                          {showQuickPayment && (
                            <div className="p-3.5 rounded-[5px] bg-[#FAF8F5] border border-black/10 space-y-2 animate-in fade-in duration-150">
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={accountNumber}
                                  onChange={(e) => setAccountNumber(e.target.value)}
                                  placeholder="0300-1234567 (Easypaisa/JazzCash)"
                                  className="flex-1 px-3 py-2 rounded-[5px] bg-white border border-black/15 text-xs font-mono"
                                />
                                <button
                                  type="button"
                                  onClick={handleQuickBuy}
                                  disabled={isProcessingQuickPay}
                                  className="px-4 py-2 rounded-[5px] bg-[#064E3B] text-white font-bold text-xs cursor-pointer"
                                >
                                  {isProcessingQuickPay ? "..." : "Pay"}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={handleFreeDownload}
                            disabled={isDownloading}
                            className="w-full py-3.5 px-6 rounded-[5px] bg-[#EFEAE1] hover:bg-[#E2DDD3] text-[#18181B] font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98"
                          >
                            {isDownloading ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Preparing Download...</span>
                              </>
                            ) : (
                              <>
                                <Download className="w-4 h-4" />
                                <span>Download Free Asset</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      {/* Real Database Comments Section */}
                      <div className="pt-3 border-t border-black/[0.06] space-y-3">
                        <h4 className="text-xs font-bold text-[#18181B] flex items-center gap-1 cursor-pointer">
                          <span>{comments.length} {comments.length === 1 ? "Comment" : "Comments"}</span>
                          <span className="text-[10px] text-[#71717A]">⌄</span>
                        </h4>

                        <div className="space-y-2.5 max-h-36 overflow-y-auto pr-1">
                          {comments.length === 0 ? (
                            <p className="text-xs text-[#71717A] py-2">No comments yet. Be the first to start the conversation!</p>
                          ) : (
                            comments.map((c) => (
                              <div key={c.id} className="flex items-start gap-2.5 text-xs">
                                <div className="w-7 h-7 rounded-[5px] overflow-hidden bg-black/10 shrink-0 relative mt-0.5">
                                  <Image src={c.avatar || "/ceramics.jpeg"} alt={c.author} fill className="object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-baseline gap-1.5">
                                    <span className="font-bold text-[#18181B]">{c.author}</span>
                                    <span className="text-[10px] text-[#71717A] font-mono">{c.time}</span>
                                  </div>
                                  <p className="text-[#52525B] text-xs break-words leading-relaxed">{c.text}</p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Add Comment Input (5px radius) */}
                        <form onSubmit={handleAddComment} className="relative flex items-center">
                          <input
                            id="dedicated-comment-input"
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment"
                            className="w-full pl-4 pr-24 py-2.5 rounded-[5px] bg-[#FAF8F5] hover:bg-[#F4EFE6] focus:bg-white border border-black/15 text-xs text-[#18181B] focus:outline-none focus:ring-1 focus:ring-black transition-all placeholder:text-[#71717A]"
                          />
                          <div className="absolute right-2.5 flex items-center gap-1 text-[#71717A]">
                            <button
                              type="button"
                              onClick={() => setNewComment((prev) => `${prev} 😊`)}
                              className="p-1 hover:text-[#18181B] transition-colors cursor-pointer"
                              title="Emoji"
                            >
                              <Smile className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setNewComment((prev) => `${prev} 🖼️`)}
                              className="p-1 hover:text-[#18181B] transition-colors cursor-pointer"
                              title="Image"
                            >
                              <ImageIcon className="w-4 h-4" />
                            </button>
                            <button
                              type="submit"
                              disabled={!newComment.trim() || isPostingComment}
                              className="p-1 text-[#18181B] hover:text-[#E60023] disabled:opacity-30 transition-colors cursor-pointer"
                              title="Send"
                            >
                              {isPostingComment ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ================= RIGHT SIDE: SMART RECOMMENDATION MASONRY STREAM ================= */}
              <div className="w-full lg:w-[42%] xl:w-[38%] space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-sm font-bold text-[#18181B] uppercase tracking-wider font-mono">
                    More to explore
                  </h3>
                  <span className="text-[11px] text-[#71717A] font-mono">
                    {relatedPosts.length} curated drops
                  </span>
                </div>

                {relatedPosts.length === 0 ? (
                  <div className="p-8 text-center bg-white rounded-[5px] border border-black/10">
                    <Sparkles className="w-6 h-6 text-[#71717A] mx-auto mb-2" />
                    <p className="text-xs font-semibold text-[#18181B]">Finding similar aesthetics...</p>
                  </div>
                ) : (
                  <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-2 gap-3 space-y-3">
                    {relatedPosts.map((item) => {
                      const isItemSell = item.postType === "sell";
                      return (
                        <Link
                          key={item.id}
                          href={`/drop/${item.id}`}
                          className="break-inside-avoid block group relative rounded-[5px] overflow-hidden bg-white border border-black/[0.08] shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer"
                        >
                          <div className="relative w-full aspect-[3/4.2] overflow-hidden bg-[#FAF8F5]">
                            <Image
                              src={item.previewUrl || item.image || "/architecture-pavilion.jpeg"}
                              alt={item.title || "Drop"}
                              fill
                              sizes="(max-width: 640px) 50vw, 25vw"
                              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                            />

                            {/* Corner Badge */}
                            <div className="absolute top-2 left-2 z-10">
                              {isItemSell ? (
                                <span className="text-[9px] font-mono font-bold text-white bg-[#18181B]/90 backdrop-blur-md px-2 py-0.5 rounded-[5px] shadow-md">
                                  PKR {item.price?.toLocaleString() || 299}
                                </span>
                              ) : (
                                <span className="text-[9px] font-mono font-bold text-[#064E3B] bg-[#4DE3A5]/90 backdrop-blur-md px-2 py-0.5 rounded-[5px] shadow-xs">
                                  FREE
                                </span>
                              )}
                            </div>

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2.5 flex flex-col justify-end">
                              <p className="text-xs font-bold text-white truncate">{item.title}</p>
                              <p className="text-[10px] text-white/80 truncate">@{item.creatorUsername || "creator"}</p>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
