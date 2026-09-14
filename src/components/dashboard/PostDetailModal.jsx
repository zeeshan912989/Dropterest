"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  X,
  Download,
  Check,
  Bookmark,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Loader2,
  CreditCard,
  Smartphone,
  Zap,
  UserCheck,
  UserPlus,
  Trash2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Maximize2,
  Smile,
  ImageIcon,
  Send,
  Sparkles,
  Link2,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth/auth-client";

export default function PostDetailModal({
  post,
  isOpen,
  onClose,
  onSaveToggle,
  isSaved,
  onSelectRelatedPost,
  onDeletePost,
}) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const currentUser = session?.user;
  const currentUserId = currentUser?.id;
  const isOwnPost = Boolean(currentUserId && post?.creatorId === currentUserId);

  const [isDownloading, setIsDownloading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [downloadCount, setDownloadCount] = useState(0);
  const [viewsCount, setViewsCount] = useState(0);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoadingFollow, setIsLoadingFollow] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  // In-Modal Direct Payment State (No Popup)
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState("commercial");
  const [paymentMethod, setPaymentMethod] = useState("easypaisa");
  const [accountNumber, setAccountNumber] = useState("0300-1234567");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [purchasedData, setPurchasedData] = useState(null);

  // Comments State
  const [comments, setComments] = useState([
    {
      id: "c1",
      author: "Officeworkboxx",
      avatar: "/ceramics.jpeg",
      text: "TapIn📱 @MotionWayys0 on telegram t...",
      time: "2h ago",
    },
  ]);
  const [newComment, setNewComment] = useState("");

  // Related drops
  const [relatedData, setRelatedData] = useState({ creatorPosts: [], similarPosts: [] });

  useEffect(() => {
    if (post) {
      setDownloadCount(post.downloadsCount || post.downloads || 0);
      setViewsCount(post.viewsCount || 1);
      setLikesCount(post.likesCount || post.likes || 38);
      setIsLiked(false);
      setPurchasedData(null);
      setShowPaymentForm(false);
      setShowOptionsMenu(false);

      // 1. Record Real View Count in DB
      if (post.id && !post.id.startsWith("pin-")) {
        fetch(`/api/posts/${post.id}/view`, { method: "POST" })
          .then((res) => res.json())
          .then((data) => {
            if (data.success && data.viewsCount) {
              setViewsCount(data.viewsCount);
            }
          })
          .catch(() => {});
      }

      // 2. Fetch Real Creator Follow Status & Count
      if (post.creatorId) {
        fetch(`/api/users/${post.creatorId}/follow`)
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              setIsFollowing(data.isFollowing);
              setFollowersCount(data.followersCount);
            }
          })
          .catch(() => {});
      }

      // 3. Fetch Real Related Data
      if (post.id && !post.id.startsWith("pin-")) {
        fetch(`/api/posts/${post.id}/related`)
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              setRelatedData({
                creatorPosts: data.creatorPosts || [],
                similarPosts: data.similarPosts || [],
              });
            }
          })
          .catch(() => {});
      }
    }
  }, [post]);

  if (!isOpen || !post) return null;

  const isSell = post.postType === "sell";
  const isPurchased = Boolean(purchasedData);
  const basePrice = Number(post.price) || 299;
  const personalPrice = Math.max(99, Math.round(basePrice * 0.7));
  const finalPrice = selectedLicense === "commercial" ? basePrice : personalPrice;

  // Toggle Likes
  const handleToggleLike = () => {
    setIsLiked((prev) => !prev);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
    toast.success(isLiked ? "Removed like" : "Liked drop ❤️");
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
      toast.error("Failed to update follow status");
    } finally {
      setIsLoadingFollow(false);
    }
  };

  // Add Comment
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const authorName = currentUser?.name || "You";
    const authorAvatar = currentUser?.image || null;
    setComments((prev) => [
      ...prev,
      {
        id: `c_${Date.now()}`,
        author: authorName,
        avatar: authorAvatar,
        text: newComment.trim(),
        time: "Just now",
      },
    ]);
    setNewComment("");
    toast.success("Comment added ✦");
  };

  // Direct In-Modal Free Download
  const handleFreeDownload = async () => {
    setIsDownloading(true);
    try {
      if (post.id && !post.id.startsWith("pin-")) {
        const res = await fetch(`/api/posts/${post.id}/download`, { method: "POST" });
        const data = await res.json();
        if (data.success) {
          setDownloadCount((prev) => prev + 1);
          const downloadUrl = data.asset.downloadUrl || post.previewUrl || post.image;
          try {
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
            const finalFileName = data.asset.fileName?.includes(".") ? data.asset.fileName : `${cleanTitle}.${ext}`;

            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = finalFileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(blobUrl);
            toast.success(`Downloaded ${finalFileName} ✦`);
          } catch {
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = `${(post.title || "design").toLowerCase().replace(/[^a-z0-9_-]/g, "-")}.jpg`;
            a.target = "_blank";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            toast.success("Download started ✦");
          }
        }
      } else {
        setDownloadCount((prev) => prev + 1);
        const downloadUrl = post.previewUrl || post.image;
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = `${(post.title || "design").toLowerCase().replace(/[^a-z0-9_-]/g, "-")}.jpg`;
        a.target = "_blank";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        toast.success("Download started ✦");
      }
    } catch {
      toast.error("Error initiating download.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Direct In-Modal In-Place Purchase
  const handleDirectBuy = async () => {
    setIsProcessingPayment(true);
    try {
      const res = await fetch(`/api/posts/${post.id}/buy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          licenseType: selectedLicense,
          paymentMethod: paymentMethod,
          accountNumber: accountNumber,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.error || "Purchase transaction failed.");
        setIsProcessingPayment(false);
        return;
      }

      setPurchasedData(data.purchase);
      toast.success("Payment verified! Downloading source asset... ✦");

      if (data.purchase?.downloadToken) {
        const downloadRes = await fetch(`/api/posts/${post.id}/download?token=${data.purchase.downloadToken}`);
        const downloadData = await downloadRes.json();
        if (downloadData.success) {
          setDownloadCount((prev) => prev + 1);
          const a = document.createElement("a");
          a.href = downloadData.asset.downloadUrl || post.previewUrl || post.image;
          a.download = downloadData.asset.fileName || `${(post.title || "design").toLowerCase().replace(/[^a-z0-9_-]/g, "-")}.zip`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          toast.success("Source asset package downloaded ✦");
        }
      }
    } catch {
      toast.error("Error processing payment.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this drop? This action cannot be undone.")) {
      return;
    }
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Drop deleted successfully ✦");
        if (onDeletePost) onDeletePost(post.id);
        onClose();
      } else {
        toast.error(data.error || "Failed to delete drop");
      }
    } catch {
      toast.error("Network error deleting drop");
    } finally {
      setIsDeleting(false);
    }
  };

  const creatorProfileLink = `/creator/${encodeURIComponent(post.creatorUsername || post.creatorName || post.creatorId || "creator")}`;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-6xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-black/10 my-auto flex flex-col max-h-[92vh]"
      >
        {/* Main Scrollable Canvas */}
        <div className="overflow-y-auto flex-1">
          {/* Top Pinterest 2-Column Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-black/[0.08]">
            {/* LEFT COLUMN: PINTEREST DROP VISUAL CANVAS */}
            <div className="lg:col-span-6 bg-black flex items-center justify-center relative min-h-[420px] lg:min-h-[580px] p-4 sm:p-6 select-none">
              {/* Top-Left Back Button */}
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 left-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md flex items-center justify-center shadow-lg transition-all cursor-pointer hover:scale-105 active:scale-95 border border-white/10"
                title="Back"
              >
                <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
              </button>

              {/* Main Visual Image */}
              <div className="relative w-full h-full max-h-[520px] aspect-[3/4.2] rounded-2xl overflow-hidden shadow-2xl bg-neutral-900 flex items-center justify-center">
                <Image
                  src={post.previewUrl || post.image || "/architecture-pavilion.jpeg"}
                  alt={post.title || "Design Asset"}
                  fill
                  priority
                  className="object-contain"
                />

                {/* Bottom-Right Zoom Icon Button */}
                <div className="absolute bottom-3 right-3 z-10 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white backdrop-blur-md flex items-center justify-center shadow-md cursor-pointer border border-white/15">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: PINTEREST INTERACTION BAR, CREATOR, CTAS & COMMENTS */}
            <div className="lg:col-span-6 p-5 sm:p-7 flex flex-col justify-between space-y-5 bg-white">
              <div className="space-y-4">
                {/* 1. Pinterest Top Action Bar (Screenshot Exact Match) */}
                <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
                  {/* Left Action Cluster: Likes, Comments, Share, Options */}
                  <div className="flex items-center gap-1 sm:gap-2">
                    <button
                      type="button"
                      onClick={handleToggleLike}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        isLiked ? "bg-red-50 text-red-600" : "hover:bg-[#F4EFE6] text-[#18181B]"
                      }`}
                      title="Like"
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? "fill-red-600 stroke-red-600" : "stroke-[2]"}`} />
                      <span>{likesCount}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const commentInput = document.getElementById("drop-comment-input");
                        commentInput?.focus();
                      }}
                      className="p-2 rounded-full hover:bg-[#F4EFE6] text-[#18181B] transition-colors cursor-pointer"
                      title="Comments"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(typeof window !== "undefined" ? `${window.location.origin}/drop/${post.id}` : "");
                        toast.success("Drop link copied to clipboard ✦");
                      }}
                      className="p-2 rounded-full hover:bg-[#F4EFE6] text-[#18181B] transition-colors cursor-pointer"
                      title="Share"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>

                    {/* Options 3-Dots Dropdown */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                        className="p-2 rounded-full hover:bg-[#F4EFE6] text-[#18181B] transition-colors cursor-pointer"
                        title="More options"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {showOptionsMenu && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute left-0 top-10 w-48 bg-white rounded-2xl shadow-xl border border-black/10 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-150 text-left"
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
                              navigator.clipboard?.writeText(typeof window !== "undefined" ? `${window.location.origin}/drop/${post.id}` : "");
                              toast.success("Drop link copied ✦");
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

                  {/* Right Action: Save Button (Pinterest Red Pill) */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={creatorProfileLink}
                      onClick={onClose}
                      className="hidden sm:inline-block text-xs font-semibold text-[#18181B] hover:underline"
                    >
                      Profile ⌄
                    </Link>

                    <button
                      type="button"
                      onClick={(e) => onSaveToggle && onSaveToggle(post.id, e)}
                      className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-sm ${
                        isSaved
                          ? "bg-[#18181B] text-white"
                          : "bg-[#E60023] hover:bg-[#CC001F] text-white"
                      }`}
                    >
                      {isSaved ? "Saved" : "Save"}
                    </button>
                  </div>
                </div>

                {/* 2. Creator Capsule (Screenshot Exact Match: "Collage created by...") */}
                <div className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 flex-wrap min-w-0">
                    <span className="text-[#71717A]">Collage created by</span>
                    <Link
                      href={creatorProfileLink}
                      onClick={onClose}
                      className="flex items-center gap-1.5 font-bold text-[#18181B] hover:underline"
                    >
                      <div className="w-6 h-6 rounded-full overflow-hidden bg-[#E60023] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                        {post.creatorAvatar ? (
                          <Image src={post.creatorAvatar} alt={post.creatorName || "Creator"} width={24} height={24} className="object-cover" />
                        ) : (
                          (post.creatorName || "H")[0].toUpperCase()
                        )}
                      </div>
                      <span>{post.creatorName || "Hasan"}</span>
                    </Link>
                  </div>

                  <button
                    type="button"
                    onClick={handleToggleFollow}
                    disabled={isLoadingFollow}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                      isFollowing
                        ? "bg-[#FAF8F5] border border-black/15 text-[#18181B]"
                        : "bg-[#18181B] text-white hover:bg-black"
                    }`}
                  >
                    {isLoadingFollow ? "..." : isFollowing ? "Following" : "+ Follow"}
                  </button>
                </div>

                {/* 3. Title & Description */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#18181B] leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#52525B] mt-1 leading-relaxed line-clamp-3">
                    {post.description || "Curated visual drop for graphic designers, creative remixers, and digital creators."}
                  </p>
                </div>

                {/* 4. Main CTA Actions (Buy on Dedicated Checkout Page / Download) */}
                {isSell ? (
                  <div className="space-y-2.5 pt-1">
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF8F5] border border-black/[0.06]">
                      <div>
                        <span className="text-[10px] font-mono uppercase font-bold text-[#71717A] block">
                          Marketplace Asset
                        </span>
                        <span className="text-lg font-bold text-[#18181B]">
                          PKR {basePrice.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-[#064E3B] bg-[#4DE3A5]/40 px-2.5 py-1 rounded-full">
                        Commercial Rights Included
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onClose?.();
                        router.push(`/checkout/${post.id}`);
                      }}
                      className="w-full py-3.5 px-6 rounded-full bg-[#18181B] hover:bg-black text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      <ShoppingBag className="w-4 h-4 text-[#4DE3A5]" />
                      <span>Buy Commercial License &middot; PKR {basePrice.toLocaleString()}</span>
                      <ArrowRight className="w-4 h-4 text-white/70" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowPaymentForm(!showPaymentForm)}
                      className="w-full py-2 px-4 text-xs font-semibold text-[#71717A] hover:text-[#18181B] text-center cursor-pointer transition-colors"
                    >
                      {showPaymentForm ? "Hide Quick Payment" : "Quick 1-Click Buy in Window"}
                    </button>

                    {/* Quick In-Place Buy (If toggled) */}
                    {showPaymentForm && (
                      <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-black/10 space-y-3 animate-in fade-in duration-150">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            placeholder="0300-1234567 (Easypaisa/JazzCash)"
                            className="flex-1 px-3 py-2 rounded-xl bg-white border border-black/15 text-xs font-mono"
                          />
                          <button
                            type="button"
                            onClick={handleDirectBuy}
                            disabled={isProcessingPayment}
                            className="px-4 py-2 rounded-xl bg-[#064E3B] text-white font-bold text-xs cursor-pointer"
                          >
                            {isProcessingPayment ? "..." : "Pay"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2 pt-1">
                    <button
                      type="button"
                      onClick={handleFreeDownload}
                      disabled={isDownloading}
                      className="w-full py-3.5 px-6 rounded-full bg-[#EFEAE1] hover:bg-[#E2DDD3] text-[#18181B] font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98"
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

                {/* 5. Comments Section (Screenshot Exact Match) */}
                <div className="pt-3 border-t border-black/[0.06] space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#18181B] flex items-center gap-1 cursor-pointer">
                      <span>{comments.length} {comments.length === 1 ? "Comment" : "Comments"}</span>
                      <span className="text-[10px] text-[#71717A]">⌄</span>
                    </h4>
                  </div>

                  {/* Comment List */}
                  <div className="space-y-2.5 max-h-36 overflow-y-auto pr-1">
                    {comments.map((c) => {
                      const avatarUrl = c.avatar && !c.avatar.includes("ceramics") ? c.avatar : null;
                      const initial = (c.author || "U")[0]?.toUpperCase() || "U";
                      return (
                        <div key={c.id} className="flex items-start gap-2.5 text-xs">
                          {avatarUrl ? (
                            <div className="w-7 h-7 rounded-[5px] overflow-hidden bg-black/10 shrink-0 relative mt-0.5 shadow-xs">
                              <img
                                src={avatarUrl}
                                alt={c.author || "User"}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-7 h-7 rounded-[5px] bg-[#E60023] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-xs select-none">
                              {initial}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-1.5">
                              <span className="font-bold text-[#18181B]">{c.author}</span>
                              <span className="text-[10px] text-[#71717A] font-mono">{c.time}</span>
                            </div>
                            <p className="text-[#52525B] text-xs break-words leading-relaxed">{c.text}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add a comment Pill Input (Screenshot Exact Match) */}
                  <form onSubmit={handleAddComment} className="relative flex items-center">
                    <input
                      id="drop-comment-input"
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment"
                      className="w-full pl-4 pr-24 py-2.5 rounded-full bg-[#FAF8F5] hover:bg-[#F4EFE6] focus:bg-white border border-black/10 text-xs text-[#18181B] focus:outline-none focus:ring-1 focus:ring-black transition-all placeholder:text-[#71717A]"
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
                        title="Attach image"
                      >
                        <ImageIcon className="w-4 h-4" />
                      </button>
                      <button
                        type="submit"
                        disabled={!newComment.trim()}
                        className="p-1 text-[#18181B] hover:text-[#E60023] disabled:opacity-30 transition-colors cursor-pointer"
                        title="Send"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* ================= PINTEREST "MORE LIKE THIS" CANVAS GRID ================= */}
          {(relatedData.similarPosts.length > 0 || relatedData.creatorPosts.length > 0) && (
            <div className="p-5 sm:p-7 bg-[#FAF8F5] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-bold text-[#18181B]">
                  More to explore
                </h3>
                <span className="text-xs text-[#71717A] font-mono">Curated visual recommendations</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {[...relatedData.similarPosts, ...relatedData.creatorPosts].slice(0, 12).map((item) => {
                  const isItemSell = item.postType === "sell";
                  return (
                    <div
                      key={item.id}
                      onClick={() => onSelectRelatedPost && onSelectRelatedPost(item)}
                      className="group relative rounded-2xl overflow-hidden bg-white border border-black/[0.06] aspect-[3/4.2] cursor-pointer hover:shadow-lg transition-all duration-300"
                    >
                      <Image
                        src={item.previewUrl || item.image || "/architecture-pavilion.jpeg"}
                        alt={item.title || "Related drop"}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2.5 flex flex-col justify-between">
                        <span className="text-[9px] font-bold text-white bg-black/60 px-2 py-0.5 rounded-full self-start">
                          {isItemSell ? `PKR ${item.price}` : "FREE"}
                        </span>
                        <p className="text-[11px] font-bold text-white truncate">{item.title}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
