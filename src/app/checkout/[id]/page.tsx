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
  Check,
  Download,
  ShoppingBag,
  ArrowLeft,
  UserCheck,
  UserPlus,
  Loader2,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Zap,
  Lock,
  Copy,
  Layers,
  FileCheck,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { authClient, signOut } from "@/lib/auth/auth-client";
import NotificationsDrawer from "@/components/dashboard/NotificationsDrawer";
import MessagesDrawer from "@/components/dashboard/MessagesDrawer";
import SettingsSupportDrawer from "@/components/dashboard/SettingsSupportDrawer";

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const dropId = params?.id as string;

  const { data: session } = authClient.useSession();
  const currentUser = session?.user;

  // Drop & Creator State
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [isLoadingFollow, setIsLoadingFollow] = useState(false);

  // Form State
  const [selectedLicense, setSelectedLicense] = useState<"commercial" | "personal">("commercial");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"easypaisa" | "jazzcash" | "card">("easypaisa");
  
  // Card & Wallet Inputs
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [walletPhone, setWalletPhone] = useState("0300-1234567");
  
  // Actions State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [purchaseResult, setPurchaseResult] = useState<any>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  // Drawers & Nav
  const [activeDrawer, setActiveDrawer] = useState<"notifications" | "messages" | "settings" | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Fetch Drop
  useEffect(() => {
    if (!dropId) return;
    setLoading(true);

    fetch(`/api/posts/${dropId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.post) {
          setPost(data.post);
          if (typeof document !== "undefined" && data.post.title) {
            document.title = `Checkout: ${data.post.title} — Dropterest`;
          }
          if (data.post.creatorId) {
            fetch(`/api/users/${data.post.creatorId}/follow`)
              .then((fRes) => fRes.json())
              .then((fData) => {
                if (fData.success) {
                  setIsFollowing(fData.isFollowing);
                  setFollowersCount(fData.followersCount);
                }
              })
              .catch(() => {});
          }
        } else {
          toast.error(data.error || "Drop not found");
        }
      })
      .catch(() => toast.error("Failed to load drop details"))
      .finally(() => setLoading(false));
  }, [dropId]);

  useEffect(() => {
    if (currentUser?.email && !buyerEmail) {
      setBuyerEmail(currentUser.email);
    }
  }, [currentUser, buyerEmail]);

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

  const basePrice = Number(post?.price) || 299;
  const personalPrice = Math.max(99, Math.round(basePrice * 0.7));
  const finalPrice = selectedLicense === "commercial" ? basePrice : personalPrice;

  // Purchase Action
  const handleCompletePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post?.id) return;

    if (!currentUser) {
      toast.error("Please sign in to complete purchase");
      router.push(`/login?redirect=/checkout/${post.id}`);
      return;
    }

    if (!buyerEmail.trim() || !buyerEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (paymentMethod === "card" && (!cardNumber || !cardExpiry || !cardCvc)) {
      toast.error("Please fill in card payment details");
      return;
    }

    if ((paymentMethod === "easypaisa" || paymentMethod === "jazzcash") && !walletPhone.trim()) {
      toast.error(`Please enter your ${paymentMethod === "easypaisa" ? "Easypaisa" : "JazzCash"} mobile number`);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${post.id}/buy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          licenseType: selectedLicense,
          paymentMethod,
          buyerEmail,
          accountNumber: paymentMethod === "card" ? cardNumber : walletPhone,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPurchaseResult(data.purchase);
        toast.success(`Payment verified! Order confirmed ✦`);
        if (data.purchase.downloadUrl) {
          triggerFileDownload(data.purchase.downloadUrl);
        }
      } else {
        toast.error(data.error || "Purchase failed");
      }
    } catch {
      toast.error("Network error during payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Download Trigger
  const triggerFileDownload = async (customUrl?: string) => {
    setIsDownloading(true);
    const downloadEndpoint = customUrl || purchaseResult?.downloadUrl || `/api/posts/${post.id}/download?token=${purchaseResult?.downloadToken}`;
    
    try {
      const res = await fetch(downloadEndpoint);
      if (!res.ok) throw new Error("Download failed");
      
      const blob = await res.blob();
      let ext = "jpg";
      const mime = blob.type?.toLowerCase() || "";
      if (mime.includes("png")) ext = "png";
      else if (mime.includes("webp")) ext = "webp";
      else if (mime.includes("jpeg") || mime.includes("jpg")) ext = "jpg";
      else if (mime.includes("svg")) ext = "svg";
      else if (mime.includes("zip")) ext = "zip";
      else if (mime.includes("pdf")) ext = "pdf";

      const cleanTitle = (post.title || "design-asset").toLowerCase().replace(/[^a-z0-9_-]/g, "-").replace(/-+/g, "-");
      const fileName = `${cleanTitle}-${selectedLicense}.${ext}`;

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
      toast.error("Download failed. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const isDrawerOpen = Boolean(activeDrawer);

  return (
    <div className="min-h-screen bg-[#FAF9F5] font-sans antialiased text-[#18181B] flex relative overflow-x-hidden selection:bg-[#4DE3A5] selection:text-[#064E3B]">
      {/* ================= LEFT SLIDER RAIL ================= */}
      <aside className="w-16 bg-[#F4EFE6] border-r border-black/10 flex flex-col items-center justify-between py-5 fixed left-0 top-0 bottom-0 z-40">
        <div className="flex flex-col items-center gap-5 w-full">
          <Link
            href="/ideas"
            className="w-10 h-10 rounded-sm bg-[#18181B] text-white flex items-center justify-center font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-sm"
            title="Dropterest Home"
          >
            <span>✦</span>
          </Link>

          <nav className="flex flex-col items-center gap-1.5 w-full px-2">
            <Link
              href="/ideas"
              className="w-10 h-10 rounded-sm hover:bg-black/5 flex items-center justify-center text-[#71717A] hover:text-[#18181B] transition-colors"
              title="Explore Feed"
            >
              <Compass className="w-4 h-4" />
            </Link>

            <Link
              href="/ideas?tab=saved"
              className="w-10 h-10 rounded-sm hover:bg-black/5 flex items-center justify-center text-[#71717A] hover:text-[#18181B] transition-colors"
              title="Your Saved Drops"
            >
              <Bookmark className="w-4 h-4" />
            </Link>

            <Link
              href="/ideas?tab=create"
              className="w-10 h-10 rounded-sm hover:bg-black/5 flex items-center justify-center text-[#71717A] hover:text-[#18181B] transition-colors"
              title="Create Drops"
            >
              <Plus className="w-4 h-4" />
            </Link>
          </nav>
        </div>

        <div className="flex flex-col items-center gap-2.5">
          <button
            type="button"
            onClick={() => setActiveDrawer(activeDrawer === "notifications" ? null : "notifications")}
            className={`w-10 h-10 rounded-sm flex items-center justify-center transition-colors cursor-pointer relative ${
              activeDrawer === "notifications" ? "bg-black/10 text-[#18181B]" : "text-[#71717A] hover:bg-black/5 hover:text-[#18181B]"
            }`}
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
          </button>

          <button
            type="button"
            onClick={() => setActiveDrawer(activeDrawer === "messages" ? null : "messages")}
            className={`w-10 h-10 rounded-sm flex items-center justify-center transition-colors cursor-pointer ${
              activeDrawer === "messages" ? "bg-black/10 text-[#18181B]" : "text-[#71717A] hover:bg-black/5 hover:text-[#18181B]"
            }`}
            title="Messages"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setActiveDrawer(activeDrawer === "settings" ? null : "settings")}
            className={`w-10 h-10 rounded-sm flex items-center justify-center transition-colors cursor-pointer ${
              activeDrawer === "settings" ? "bg-black/10 text-[#18181B]" : "text-[#71717A] hover:bg-black/5 hover:text-[#18181B]"
            }`}
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          <div className="w-6 h-px bg-black/10 my-0.5" />

          {/* User Profile */}
          <div className="relative">
            {currentUser ? (
              <button
                type="button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-9 h-9 rounded-sm overflow-hidden border border-black/15 shadow-xs hover:scale-105 transition-all cursor-pointer bg-white flex items-center justify-center"
                title="Account"
              >
                {currentUser.image ? (
                  <Image src={currentUser.image} alt={currentUser.name || "User"} width={36} height={36} className="object-cover" />
                ) : (
                  <span className="text-xs font-bold text-[#18181B]">
                    {(currentUser.name || "U")[0].toUpperCase()}
                  </span>
                )}
              </button>
            ) : (
              <Link
                href="/login"
                className="w-9 h-9 rounded-sm bg-[#18181B] text-white flex items-center justify-center font-bold text-[11px] hover:bg-black transition-colors"
                title="Sign In"
              >
                In
              </Link>
            )}

            {showProfileMenu && currentUser && (
              <div className="absolute left-12 bottom-0 w-60 bg-white shadow-xl border border-black/10 py-1.5 z-50 animate-in fade-in duration-150">
                <div className="px-3.5 py-2 border-b border-black/[0.08]">
                  <p className="text-xs font-bold text-[#18181B] truncate">{currentUser.name || "User"}</p>
                  <p className="text-[10px] text-[#71717A] truncate font-mono">{currentUser.email}</p>
                </div>
                <Link
                  href={currentUser.email ? `/creator/${currentUser.email.split("@")[0]}` : "/ideas"}
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full px-3.5 py-2 text-xs font-medium text-[#18181B] hover:bg-[#F4EFE6] flex items-center gap-2 transition-colors"
                >
                  <span>Creator Profile</span>
                </Link>
                <button
                  type="button"
                  onClick={async () => {
                    await signOut();
                    setShowProfileMenu(false);
                    router.push("/login");
                  }}
                  className="w-full px-3.5 py-2 text-xs font-medium text-[#DC2626] hover:bg-red-50 flex items-center gap-2 transition-colors cursor-pointer text-left"
                >
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ================= DRAWERS ================= */}
      <NotificationsDrawer
        isOpen={activeDrawer === "notifications"}
        onClose={() => setActiveDrawer(null)}
        onExploreFeed={() => router.push("/ideas")}
        onOpenPin={() => {}}
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
        className={`flex-1 flex flex-col min-h-screen pl-16 transition-all duration-300 ease-in-out ${
          isDrawerOpen ? "lg:mr-[380px]" : ""
        }`}
      >
        {/* Compact Top Navbar */}
        <header className="sticky top-0 z-30 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-black/10 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/ideas"
              className="flex items-center gap-1.5 text-xs font-semibold text-[#18181B] hover:text-black transition-colors py-1 px-2.5 bg-black/[0.04] hover:bg-black/[0.08]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Feed</span>
            </Link>

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#71717A] font-mono">
              <span>/</span>
              <span className="uppercase text-[11px] font-bold text-[#18181B]">{post?.category || "Marketplace"}</span>
              <span>/</span>
              <span className="text-[#18181B] truncate max-w-[240px] font-sans font-medium">{post?.title || "Drop"}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-black/10 text-[11px] font-mono text-[#065F46] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
              <span>256-Bit SSL Verified</span>
            </div>
          </div>
        </header>

        {/* Compact Studio Body - High Viewport Density */}
        <main className="flex-1 max-w-6xl w-full mx-auto p-3 sm:p-5 lg:p-6">
          {loading ? (
            <div className="min-h-[400px] flex flex-col items-center justify-center gap-2 text-[#71717A]">
              <Loader2 className="w-6 h-6 animate-spin text-[#18181B]" />
              <p className="text-xs font-mono">Loading studio checkout...</p>
            </div>
          ) : !post ? (
            <div className="min-h-[350px] flex flex-col items-center justify-center text-center gap-3">
              <p className="text-base font-bold text-[#18181B]">Drop Not Found</p>
              <Link href="/ideas" className="px-4 py-2 bg-[#18181B] text-white text-xs font-semibold">
                Back to Feed
              </Link>
            </div>
          ) : purchaseResult ? (
            /* ================= COMPACT SUCCESS SCREEN ================= */
            <div className="max-w-xl mx-auto bg-white border border-black/10 p-6 sm:p-8 text-center shadow-md animate-in fade-in duration-200">
              <div className="w-12 h-12 bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>

              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#065F46] bg-[#ECFDF5] px-2 py-0.5 inline-block mb-1">
                Order Completed
              </span>
              <h1 className="text-xl font-bold text-[#18181B] mb-1">
                License Activated Successfully
              </h1>
              <p className="text-xs text-[#71717A] mb-5">
                "{post.title}" is ready for immediate binary download.
              </p>

              <div className="bg-[#FAF9F5] border border-black/10 p-3.5 flex items-center gap-4 text-left mb-6">
                <div className="relative w-16 h-16 bg-black/5 shrink-0 border border-black/10">
                  <Image src={post.previewUrl || post.image || "/architecture-pavilion.jpeg"} alt={post.title} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 bg-[#18181B] text-white inline-block mb-1">
                    {purchaseResult.licenseType || selectedLicense} License
                  </span>
                  <h3 className="text-xs font-bold text-[#18181B] truncate">{post.title}</h3>
                  <p className="text-[11px] font-mono text-[#059669] font-bold">PKR {finalPrice.toLocaleString()} Paid</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => triggerFileDownload()}
                  disabled={isDownloading}
                  className="w-full sm:flex-1 py-3 px-4 bg-[#18181B] hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98"
                >
                  {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  <span>Download Source Asset Now</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(purchaseResult.downloadToken || purchaseResult.id || "");
                    setCopiedToken(true);
                    toast.success("License token copied ✦");
                    setTimeout(() => setCopiedToken(false), 2000);
                  }}
                  className="w-full sm:w-auto px-4 py-3 bg-[#FAF9F5] hover:bg-[#EFEAE1] text-[#18181B] font-semibold text-xs border border-black/10 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copiedToken ? <Check className="w-3.5 h-3.5 text-[#059669]" /> : <Copy className="w-3.5 h-3.5 text-[#71717A]" />}
                  <span>{copiedToken ? "Copied" : "Copy Key"}</span>
                </button>
              </div>

              <div className="mt-5 pt-4 border-t border-black/10 flex items-center justify-center gap-4 text-[11px] text-[#71717A]">
                <Link href="/ideas" className="hover:text-[#18181B] underline font-semibold">
                  Back to Feed
                </Link>
                <span>•</span>
                {post.creatorUsername && (
                  <Link href={`/creator/${post.creatorUsername}`} className="hover:text-[#18181B] underline font-semibold">
                    Creator Profile
                  </Link>
                )}
              </div>
            </div>
          ) : (
            /* ================= HIGH-DENSITY PROFESSIONAL 2-COLUMN CHECKOUT ================= */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start">
              {/* LEFT COLUMN: ZERO-RADIUS CLEAN DROP SHOWCASE */}
              <div className="lg:col-span-6 space-y-3">
                {/* Image Showcase (Sharp Corners, No Bubble Curves) */}
                <div className="bg-white border border-black/15 shadow-xs overflow-hidden">
                  <div className="relative w-full aspect-[4/3] bg-[#EFEAE1] overflow-hidden">
                    <Image
                      src={post.previewUrl || post.image || "/architecture-pavilion.jpeg"}
                      alt={post.title}
                      fill
                      priority
                      className="object-cover"
                    />

                    {/* Minimal Top Badges */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
                      <span className="px-2.5 py-1 bg-[#18181B] text-white font-mono font-bold text-xs shadow-sm">
                        PKR {basePrice.toLocaleString()}
                      </span>
                      <span className="px-2 py-1 bg-white/95 text-[#064E3B] font-mono text-[10px] font-bold uppercase border border-black/10 shadow-xs">
                        Marketplace Drop
                      </span>
                    </div>
                  </div>

                  {/* Compact Info Section */}
                  <div className="p-4 space-y-3 border-t border-black/10">
                    {/* Creator Row */}
                    <div className="flex items-center justify-between pb-3 border-b border-black/[0.08]">
                      <Link
                        href={post.creatorUsername ? `/creator/${post.creatorUsername}` : "#"}
                        className="flex items-center gap-2.5 group/cr"
                      >
                        <div className="w-8 h-8 overflow-hidden bg-[#FAF9F5] border border-black/15 relative shrink-0">
                          {post.creatorAvatar ? (
                            <Image src={post.creatorAvatar} alt={post.creatorName || "Creator"} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-xs text-[#18181B]">
                              {(post.creatorName || "C")[0].toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-[#18181B] group-hover/cr:underline">
                              {post.creatorName || "Verified Creator"}
                            </span>
                            <Sparkles className="w-3 h-3 text-[#059669] fill-[#059669]" />
                          </div>
                          <span className="text-[10px] text-[#71717A] font-mono block">
                            @{post.creatorUsername || "creator"} &middot; {followersCount} followers
                          </span>
                        </div>
                      </Link>

                      <button
                        type="button"
                        onClick={handleToggleFollow}
                        disabled={isLoadingFollow}
                        className={`px-3 py-1 text-[11px] font-semibold transition-all cursor-pointer border ${
                          isFollowing
                            ? "bg-[#FAF9F5] border-black/20 text-[#18181B] hover:bg-[#EFEAE1]"
                            : "bg-[#18181B] border-[#18181B] text-white hover:bg-black"
                        }`}
                      >
                        {isLoadingFollow ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : isFollowing ? (
                          "Following"
                        ) : (
                          "+ Follow"
                        )}
                      </button>
                    </div>

                    {/* Title & Short Description */}
                    <div>
                      <h1 className="text-base font-bold text-[#18181B] leading-snug">
                        {post.title}
                      </h1>
                      <p className="text-xs text-[#52525B] mt-1 line-clamp-2 leading-relaxed">
                        {post.description || "High-resolution design asset with commercial rights and perpetual license."}
                      </p>
                    </div>

                    {/* Specs Pills (Compact High-Density) */}
                    <div className="grid grid-cols-3 gap-1.5 pt-1 text-[10px] font-mono">
                      <div className="p-2 bg-[#FAF9F5] border border-black/10">
                        <span className="text-[#71717A] uppercase block">Format</span>
                        <span className="font-bold text-[#18181B] truncate block">Ultra-HD Binary</span>
                      </div>
                      <div className="p-2 bg-[#FAF9F5] border border-black/10">
                        <span className="text-[#71717A] uppercase block">License</span>
                        <span className="font-bold text-[#065F46] uppercase block">{selectedLicense}</span>
                      </div>
                      <div className="p-2 bg-[#FAF9F5] border border-black/10">
                        <span className="text-[#71717A] uppercase block">Access</span>
                        <span className="font-bold text-[#18181B] block">Lifetime</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: COMPACT STUDIO CHECKOUT TERMINAL */}
              <div className="lg:col-span-6">
                <div className="bg-white border border-black/15 shadow-xs p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between pb-2.5 border-b border-black/10">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717A] font-bold">
                        Studio Checkout
                      </span>
                      <h2 className="text-sm font-bold text-[#18181B]">License &amp; Payment Gateway</h2>
                    </div>
                    <div className="px-2 py-0.5 bg-black/5 text-[#18181B] font-mono text-[10px] font-bold">
                      SECURE ✦
                    </div>
                  </div>

                  <form onSubmit={handleCompletePurchase} className="space-y-4">
                    {/* 1. License Tier (Compact Selector) */}
                    <div>
                      <label className="text-[11px] font-bold font-mono text-[#18181B] uppercase tracking-wider block mb-1.5">
                        1. Select License Tier
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedLicense("commercial")}
                          className={`p-2.5 border text-left transition-all cursor-pointer ${
                            selectedLicense === "commercial"
                              ? "bg-[#18181B] text-white border-[#18181B]"
                              : "bg-white text-[#18181B] border-black/15 hover:border-black/30"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold">Commercial</span>
                            <span className={`text-[9px] font-mono px-1 py-0.2 ${selectedLicense === "commercial" ? "bg-white/20 text-white" : "bg-[#4DE3A5] text-[#064E3B]"}`}>
                              FULL
                            </span>
                          </div>
                          <span className={`text-xs font-mono font-bold block mt-1 ${selectedLicense === "commercial" ? "text-white" : "text-[#18181B]"}`}>
                            PKR {basePrice.toLocaleString()}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedLicense("personal")}
                          className={`p-2.5 border text-left transition-all cursor-pointer ${
                            selectedLicense === "personal"
                              ? "bg-[#18181B] text-white border-[#18181B]"
                              : "bg-white text-[#18181B] border-black/15 hover:border-black/30"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold">Personal</span>
                            <span className={`text-[9px] font-mono px-1 py-0.2 ${selectedLicense === "personal" ? "bg-white/20 text-white" : "bg-black/5 text-[#71717A]"}`}>
                              -30%
                            </span>
                          </div>
                          <span className={`text-xs font-mono font-bold block mt-1 ${selectedLicense === "personal" ? "text-white" : "text-[#18181B]"}`}>
                            PKR {personalPrice.toLocaleString()}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* 2. Email Address (Compact) */}
                    <div>
                      <label className="text-[11px] font-bold font-mono text-[#18181B] uppercase tracking-wider block mb-1">
                        2. Delivery &amp; Receipt Email
                      </label>
                      <input
                        type="email"
                        required
                        value={buyerEmail}
                        onChange={(e) => setBuyerEmail(e.target.value)}
                        placeholder="buyer@domain.com"
                        className="w-full px-3 py-2 bg-[#FAF9F5] border border-black/15 text-xs text-[#18181B] font-mono focus:outline-none focus:border-black placeholder:text-[#A1A1AA]"
                      />
                    </div>

                    {/* 3. Payment Method (Compact Studio Tabs) */}
                    <div>
                      <label className="text-[11px] font-bold font-mono text-[#18181B] uppercase tracking-wider block mb-1.5">
                        3. Payment Method
                      </label>
                      <div className="grid grid-cols-3 gap-1.5 mb-2.5">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("easypaisa")}
                          className={`py-2 px-1 border text-center transition-all cursor-pointer text-xs font-semibold ${
                            paymentMethod === "easypaisa"
                              ? "bg-[#007F3E] border-[#007F3E] text-white"
                              : "bg-white border-black/15 text-[#71717A] hover:bg-black/5"
                          }`}
                        >
                          Easypaisa
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentMethod("jazzcash")}
                          className={`py-2 px-1 border text-center transition-all cursor-pointer text-xs font-semibold ${
                            paymentMethod === "jazzcash"
                              ? "bg-[#E30613] border-[#E30613] text-white"
                              : "bg-white border-black/15 text-[#71717A] hover:bg-black/5"
                          }`}
                        >
                          JazzCash
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentMethod("card")}
                          className={`py-2 px-1 border text-center transition-all cursor-pointer text-xs font-semibold ${
                            paymentMethod === "card"
                              ? "bg-[#18181B] border-[#18181B] text-white"
                              : "bg-white border-black/15 text-[#71717A] hover:bg-black/5"
                          }`}
                        >
                          Card
                        </button>
                      </div>

                      {/* Payment Inputs */}
                      {paymentMethod === "card" ? (
                        <div className="space-y-2 p-2.5 bg-[#FAF9F5] border border-black/10">
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="Card Number • 4242 •••• •••• 4242"
                            className="w-full px-2.5 py-1.5 bg-white border border-black/15 text-xs font-mono text-[#18181B] focus:outline-none focus:border-black"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              placeholder="MM/YY (12/28)"
                              className="w-full px-2.5 py-1.5 bg-white border border-black/15 text-xs font-mono text-[#18181B] focus:outline-none focus:border-black"
                            />
                            <input
                              type="text"
                              value={cardCvc}
                              onChange={(e) => setCardCvc(e.target.value)}
                              placeholder="CVC (123)"
                              className="w-full px-2.5 py-1.5 bg-white border border-black/15 text-xs font-mono text-[#18181B] focus:outline-none focus:border-black"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="p-2.5 bg-[#FAF9F5] border border-black/10 space-y-1">
                          <div className="flex items-center justify-between text-[10px] font-mono text-[#71717A]">
                            <span>{paymentMethod === "easypaisa" ? "Easypaisa Number" : "JazzCash Number"}</span>
                            <span className="text-[#059669] font-bold">Instant USSD / OTP</span>
                          </div>
                          <input
                            type="text"
                            value={walletPhone}
                            onChange={(e) => setWalletPhone(e.target.value)}
                            placeholder="0300-1234567"
                            className="w-full px-2.5 py-1.5 bg-white border border-black/15 text-xs font-mono text-[#18181B] focus:outline-none focus:border-black"
                          />
                        </div>
                      )}
                    </div>

                    {/* 4. Compact Total & Breakdown */}
                    <div className="pt-2 border-t border-black/10 space-y-1 text-xs">
                      <div className="flex items-center justify-between text-[#71717A]">
                        <span>Subtotal</span>
                        <span className="font-mono">PKR {finalPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-[#71717A]">
                        <span>Platform Fee</span>
                        <span className="font-mono text-[#059669] font-bold">PKR 0</span>
                      </div>
                      <div className="flex items-center justify-between text-sm font-bold text-[#18181B] pt-1.5 border-t border-black/10">
                        <span>Total Due</span>
                        <span className="font-mono text-base">PKR {finalPrice.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* 5. Complete Button (High Impact Studio Style) */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 px-4 bg-[#18181B] hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Authorizing...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5 text-[#4DE3A5]" />
                          <span>Pay PKR {finalPrice.toLocaleString()} &amp; Download</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
