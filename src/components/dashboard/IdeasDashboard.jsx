"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Compass,
  Bookmark,
  Plus,
  Bell,
  MessageSquare,
  Settings,
  Heart,
  Share2,
  MoreHorizontal,
  ExternalLink,
  LogOut,
  SlidersHorizontal,
  Home,
  Check,
  X,
  Lock,
  ArrowRight,
  Pin,
  LayoutGrid,
  Scissors,
  Upload,
  Link2,
  Trash2,
  ChevronDown,
  Sparkles,
  Layers,
  FileText,
  Type,
  Maximize2,
  Play,
  RotateCw,
  Crop,
  Tag,
  ShoppingBag,
  UserPlus,
  Users,
  Grid,
  Download,
  ShieldCheck,
  CreditCard,
  Loader2,
} from "lucide-react";
import { authClient, signOut } from "@/lib/auth/auth-client";
import NotificationsDrawer from "./NotificationsDrawer";
import MessagesDrawer from "./MessagesDrawer";
import SettingsSupportDrawer from "./SettingsSupportDrawer";
import NewMessageModal from "./NewMessageModal";
import InviteFriendsModal from "./InviteFriendsModal";
import SettingsModal from "./SettingsModal";
import PostDetailModal from "./PostDetailModal";
import { useInfinitePins } from "@/hooks/useInfinitePins";
import { useQueryClient } from "@tanstack/react-query";
import { LoadMoreTrigger } from "@/components/feed/LoadMoreTrigger";

function SafePinCardImage({ src, alt, className }) {
  const [imgSrc, setImgSrc] = useState(src || "/architecture-pavilion.jpeg");
  const [hasError, setHasError] = useState(!src);

  useEffect(() => {
    setImgSrc(src || "/architecture-pavilion.jpeg");
    setHasError(!src);
  }, [src]);

  if (hasError || !imgSrc) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#F3EFE6] text-[#A1A1AA] p-4 text-center select-none">
        <Sparkles className="w-7 h-7 text-[#A1A1AA] mb-1.5" />
        <span className="text-[11px] font-semibold text-[#71717A] truncate max-w-[90%]">{alt || "Visual Asset"}</span>
      </div>
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt || "Visual Asset"}
      fill
      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
      className={className}
      onError={() => {
        setHasError(true);
      }}
    />
  );
}

const INITIAL_PINS = [];

const CATEGORIES = [
  "All",
  "Architecture",
  "Product Design",
  "Ceramics",
  "Fashion",
  "Editorial",
  "Dark Aesthetics",
  "Nature",
  "Typography",
];

const INITIAL_BOARDS = [];

const PRODUCT_CATEGORIES = [
  "All",
  "Furniture",
  "Ceramics",
  "Textiles",
  "Decor",
  "Lighting",
  "Art",
  "Architecture",
];

const SUGGESTED_TOPIC_TAGS = [
  "minimal",
  "interior",
  "woodcraft",
  "brutalist",
  "ceramics",
  "sustainable",
  "lighting",
  "organic",
  "nordic",
  "spatial",
  "editorial",
  "tableware",
  "craft",
  "geometry",
  "atmosphere",
  "modernist",
  "workspace",
  "vintage",
];

const SAMPLE_PRODUCTS = [];

export default function IdeasDashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session, isPending } = authClient.useSession();
  const isAuthenticated = Boolean(session?.user);
  const user = session?.user;
  const [mounted, setMounted] = useState(false);

  // Main UI States — clean and empty initial state
  const [activeTab, setActiveTab] = useState("feed"); // "feed", "saved", "create"
  const [savedSubTab, setSavedSubTab] = useState("Boards"); // "Pins", "Boards", "Collages"
  const [activeCategory, setActiveCategory] = useState("All");
  const [contentTypeFilter, setContentTypeFilter] = useState("all"); // "all", "free", "sell"
  const [searchQuery, setSearchQuery] = useState("");
  const [pins, setPins] = useState(INITIAL_PINS);
  const [deletedPinIds, setDeletedPinIds] = useState(() => new Set());
  const [savedPins, setSavedPins] = useState({});
  const [boards, setBoards] = useState([]);
  const [selectedPin, setSelectedPin] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showCreateFlyout, setShowCreateFlyout] = useState(false);
  const [activeDrawer, setActiveDrawer] = useState(null); // "notifications", "messages", null
  const [activeMenuPinId, setActiveMenuPinId] = useState(null); // 3-dot dropdown menu ID
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [showInviteFriendsModal, setShowInviteFriendsModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [chats, setChats] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);

  // "Create a Board" Modal State (Screenshot 2)
  const [showCreateBoardModal, setShowCreateBoardModal] = useState(false);
  const [boardForm, setBoardForm] = useState({
    name: "",
    isPrivate: false,
    isGroup: false,
  });

  // Create Pin Form State — starts completely empty
  const fileInputRef = useRef(null);
  const sourceFileInputRef = useRef(null);
  const [createForm, setCreateForm] = useState({
    title: "",
    description: "",
    link: "",
    board: "Main Board",
    category: "Architecture",
    tags: ["curated", "design"],
    tagInput: "",
    postType: "free", // "free" or "sell"
    price: 499,
    currency: "PKR",
    assetFileName: "",
    assetFileType: "zip", // "zip", "psd", "ai", "figma", "pdf"
    assetFileSize: "24.5 MB",
    licenseType: "commercial", // "personal", "commercial"
    isAiModified: false,
    hasAiPerson: false,
    allowComments: true,
    showSimilarProducts: true,
    altText: "",
    taggedProducts: [],
    mediaUrl: "",
    mediaPreview: "",
    sourceFileUploaded: false,
  });

  // Modal States
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [showMoreOptions, setShowMoreOptions] = useState(true);
  const [showProductTagsModal, setShowProductTagsModal] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [productTab, setProductTab] = useState("search"); // "search", "tags", "link"
  const [productCategoryFilter, setProductCategoryFilter] = useState("All");
  const [tagSearchQuery, setTagSearchQuery] = useState("");
  const [productLink, setProductLink] = useState("");
  const [customProductForm, setCustomProductForm] = useState({ name: "", price: "", url: "" });

  // "Design your Pin" Studio Editor State
  const [showPinDesigner, setShowPinDesigner] = useState(false);
  const [designerLayers, setDesignerLayers] = useState([
    { id: "layer-text", name: "Add text", type: "text", text: "Add text", color: "#ffffff", size: 36, visible: true },
    { id: "layer-media", name: "Image / Video", type: "media", visible: true },
    { id: "layer-canvas", name: "Canvas", type: "canvas", visible: true },
  ]);
  const [activeLayerId, setActiveLayerId] = useState("layer-text");
  const [canvasText, setCanvasText] = useState("Add text");
  const [textColor, setTextColor] = useState("#ffffff");
  const [textSize, setTextSize] = useState(36);

  // Drafts Sidebar — starts clean
  const [showDraftsSidebar, setShowDraftsSidebar] = useState(true);
  const [drafts, setDrafts] = useState([]);
  const [localPublishedPins, setLocalPublishedPins] = useState([]);

  // Production Infinite Feed with Cursor Pagination & TanStack Query
  const {
    pins: infinitePins,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingFeed,
    refetch: refetchFeed,
  } = useInfinitePins({
    category: activeCategory,
    postType: contentTypeFilter,
    search: searchQuery,
    enabled: mounted,
  });

  useEffect(() => {
    setMounted(true);

    const handleClickOutside = () => setActiveMenuPinId(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const handleDirectDownload = async (pin, e) => {
    e?.stopPropagation();
    setActiveMenuPinId(null);
    const targetUrl = pin.previewUrl || pin.image;
    if (!targetUrl) {
      showToast("No downloadable asset available");
      return;
    }

    showToast("Preparing download... 📥");
    try {
      const res = await fetch(targetUrl);
      const blob = await res.blob();

      // Accurately determine proper file extension from MIME type, filename or asset type
      let ext = "jpg";
      const mime = blob.type?.toLowerCase() || "";
      if (mime.includes("png")) ext = "png";
      else if (mime.includes("webp")) ext = "webp";
      else if (mime.includes("jpeg") || mime.includes("jpg")) ext = "jpg";
      else if (mime.includes("svg")) ext = "svg";
      else if (mime.includes("gif")) ext = "gif";
      else if (mime.includes("zip") || mime.includes("compressed")) ext = "zip";
      else if (mime.includes("pdf")) ext = "pdf";
      else if (pin.assetFileType && pin.assetFileType !== "image") {
        ext = pin.assetFileType;
      } else if (targetUrl.includes(".") && !targetUrl.startsWith("blob:") && !targetUrl.startsWith("data:")) {
        const cleanPath = targetUrl.split("?")[0].split("#")[0];
        const lastPart = cleanPath.split(".").pop()?.toLowerCase();
        if (lastPart && lastPart.length <= 4 && /^[a-z0-9]+$/.test(lastPart)) {
          ext = lastPart;
        }
      }

      // Format clean, human-readable filename
      const rawTitle = (pin.title || "design-asset").trim();
      const sanitized = rawTitle
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      const fileName = `${sanitized || "design"}.${ext}`;

      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      // Increment downloads count locally
      setPins((prev) =>
        prev.map((p) =>
          p.id === pin.id
            ? { ...p, downloadsCount: (p.downloadsCount || 0) + 1 }
            : p
        )
      );

      if (pin.id && !pin.id.startsWith("pin-")) {
        fetch(`/api/posts/${pin.id}/download`, { method: "POST" }).catch(() => {});
      }

      showToast(`Downloaded ${fileName} ✦`);
    } catch {
      const ext = pin.assetFileType || "jpg";
      const sanitized = (pin.title || "design").toLowerCase().replace(/[^a-z0-9_-]/g, "-");
      const fileName = `${sanitized || "design"}.${ext}`;
      const link = document.createElement("a");
      link.href = targetUrl;
      link.download = fileName;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("Download initiated ✦");
    }
  };

  const handleDeletePost = async (postId, e) => {
    e?.stopPropagation();
    setActiveMenuPinId(null);
    if (!window.confirm("Are you sure you want to delete this drop? This action cannot be undone.")) {
      return;
    }

    // 1. Instant Real-Time UI Eviction (0ms delay)
    setDeletedPinIds((prev) => {
      const next = new Set(prev);
      next.add(postId);
      return next;
    });
    setLocalPublishedPins((prev) => prev.filter((p) => p.id !== postId));
    setPins((prev) => prev.filter((p) => p.id !== postId));
    if (selectedPin?.id === postId) {
      setSelectedPin(null);
    }
    showToast("Deleting drop... ✦");

    try {
      const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Drop deleted successfully ✦");
        queryClient.invalidateQueries({ queryKey: ["pins"] });
      } else {
        // Rollback on server error
        setDeletedPinIds((prev) => {
          const next = new Set(prev);
          next.delete(postId);
          return next;
        });
        showToast(data.error || "Failed to delete drop");
      }
    } catch {
      setDeletedPinIds((prev) => {
        const next = new Set(prev);
        next.delete(postId);
        return next;
      });
      showToast("Error deleting drop");
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const toggleSave = (pinId, e) => {
    e?.stopPropagation();
    setSavedPins((prev) => {
      const isSaved = !prev[pinId];
      showToast(isSaved ? "Saved to your Pin collection ✦" : "Removed from collection");
      return { ...prev, [pinId]: isSaved };
    });
  };

  const handleSendMessage = (newChat) => {
    setChats((prev) => [newChat, ...prev]);
    showToast(`Message sent to ${newChat.name} ✦`);
    setActiveDrawer("messages");
  };

  // Handle local image file upload preview & persist to /api/upload
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show immediate local preview
    const previewUrl = URL.createObjectURL(file);
    setCreateForm((prev) => ({
      ...prev,
      mediaPreview: previewUrl,
      mediaUrl: previewUrl,
    }));
    showToast("Uploading media visual... ⏳");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setCreateForm((prev) => ({
          ...prev,
          mediaPreview: data.url,
          mediaUrl: data.url,
        }));
        showToast("Media uploaded & formatted successfully ✦");
      } else {
        showToast(data.error || "Using local preview");
      }
    } catch {
      showToast("Media preview ready ✦");
    }
  };

  // Handle raw digital source asset file upload (PSD, AI, ZIP, Figma) & persist to /api/upload
  const handleSourceFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name;
    const extension = fileName.split(".").pop()?.toLowerCase() || "zip";
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1) + " MB";

    setCreateForm((prev) => ({
      ...prev,
      assetFileName: fileName,
      assetFileType: ["zip", "psd", "ai", "figma", "pdf"].includes(extension) ? extension : "zip",
      assetFileSize: sizeMB,
      sourceFileUploaded: true,
    }));

    showToast("Uploading source asset package... ⏳");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setCreateForm((prev) => ({
          ...prev,
          assetFileName: data.fileName || fileName,
          assetStorageKey: data.url,
          assetFileSize: data.fileSize || sizeMB,
          sourceFileUploaded: true,
        }));
        showToast(`Source package attached: ${fileName} (${sizeMB}) ✦`);
      }
    } catch {
      showToast(`Source asset selected: ${fileName}`);
    }
  };

  // Handle Tag Input
  const handleAddTag = (e) => {
    if (e.key === "Enter" && createForm.tagInput.trim()) {
      e.preventDefault();
      const newTag = createForm.tagInput.trim().replace(/^#/, "");
      if (!createForm.tags.includes(newTag)) {
        setCreateForm((prev) => ({
          ...prev,
          tags: [...prev.tags, newTag],
          tagInput: "",
        }));
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setCreateForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  // Handle Create Board
  const handleCreateBoard = (e) => {
    e.preventDefault();
    if (!boardForm.name.trim()) return;

    const newBoard = {
      id: `board-${Date.now()}`,
      name: boardForm.name.trim(),
      isPrivate: boardForm.isPrivate,
      pinsCount: 0,
      images: ["/architecture-pavilion.jpeg"],
    };

    setBoards((prev) => [newBoard, ...prev]);
    setShowCreateBoardModal(false);
    setBoardForm({ name: "", isPrivate: false, isGroup: false });
    showToast(`Created board: ${newBoard.name} ✦`);
  };

  // Publish / Create Pin handler with real Neon DB API
  const handlePublishPin = async (e) => {
    e.preventDefault();
    if (!createForm.title.trim()) {
      showToast("Please give your Pin a title");
      return;
    }
    if (!createForm.mediaPreview) {
      showToast("Please upload a visual preview image");
      return;
    }

    const isSell = createForm.postType === "sell";
    setIsPublishing(true);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: createForm.title,
          description: createForm.description,
          category: createForm.category || "Architecture",
          tags: createForm.tags,
          previewUrl: createForm.mediaPreview,
          postType: createForm.postType,
          price: isSell ? Number(createForm.price) || 499 : 0,
          currency: "PKR",
          assetFileName: createForm.assetFileName || (isSell ? `${createForm.title.toLowerCase().replace(/\s+/g, "-")}.zip` : null),
          assetFileType: createForm.assetFileType || (isSell ? "zip" : "image"),
          assetFileSize: createForm.assetFileSize || (isSell ? "24.5 MB" : "4.2 MB"),
          licenseType: createForm.licenseType || "commercial",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Failed to publish design");
        setIsPublishing(false);
        return;
      }

      const newPin = {
        id: data.post?.id || `pin-${Date.now()}`,
        title: createForm.title,
        category: createForm.category || "Architecture",
        author: user?.name || "Ali shah",
        avatar: user?.avatar || "/ceramics.jpeg",
        image: createForm.mediaPreview || "/table-main.jpeg",
        previewUrl: createForm.mediaPreview || "/table-main.jpeg",
        aspect: "aspect-[3/4.2]",
        likes: 1,
        saves: 1,
        downloadsCount: 0,
        postType: createForm.postType,
        price: isSell ? Number(createForm.price) || 499 : 0,
        currency: "PKR",
        assetFileType: createForm.assetFileType,
        assetFileSize: createForm.assetFileSize,
        licenseType: createForm.licenseType,
        tag: createForm.tags[0] || "Curated",
      };

      setLocalPublishedPins((prev) => [newPin, ...prev]);
      refetchFeed();
      setActiveTab("feed");
      showToast(
        isSell
          ? `Design live on Marketplace for PKR ${createForm.price}! ✦`
          : "Design published for Free Download! ✦"
      );

      // Reset Form completely clean
      setCreateForm({
        title: "",
        description: "",
        link: "",
        board: boards[0]?.name || "Main Board",
        category: "Architecture",
        tags: ["curated"],
        tagInput: "",
        postType: "free",
        price: 499,
        currency: "PKR",
        assetFileName: "",
        assetFileType: "zip",
        assetFileSize: "24.5 MB",
        licenseType: "commercial",
        isAiModified: false,
        hasAiPerson: false,
        allowComments: true,
        showSimilarProducts: true,
        altText: "",
        taggedProducts: [],
        mediaUrl: "",
        mediaPreview: "",
        sourceFileUploaded: false,
      });
    } catch {
      showToast("Network error publishing design.");
    } finally {
      setIsPublishing(false);
    }
  };

  // Combine server infinite pins with locally published pins, excluding deleted drops
  const filteredPins = useMemo(() => {
    const formattedInfinite = infinitePins
      .filter((p) => p && p.id && !deletedPinIds.has(p.id))
      .map((p) => ({
        ...p,
        image: p.previewUrl,
        author: p.creatorName || p.creatorUsername || "Creator",
        avatar: p.creatorAvatar || null,
        aspect: "aspect-[3/4.2]",
        likes: p.likesCount || 0,
        saves: p.savesCount || 0,
        downloadsCount: p.downloadsCount || 0,
        tag: (p.tags && p.tags[0]) || "Curated",
      }));

    const validLocalPins = localPublishedPins.filter(
      (p) => p && p.id && !deletedPinIds.has(p.id)
    );
    const combined = [...validLocalPins, ...formattedInfinite];
    const seen = new Set();
    return combined.filter((pin) => {
      if (!pin || !pin.id) return false;
      if (deletedPinIds.has(pin.id)) return false;
      if (seen.has(pin.id)) return false;
      seen.add(pin.id);
      return true;
    });
  }, [infinitePins, localPublishedPins, deletedPinIds]);

  // Saved pins list
  const userSavedPinsList = useMemo(() => {
    return filteredPins.filter((p) => savedPins[p.id]);
  }, [filteredPins, savedPins]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center text-xs text-[#71717A]">
        Loading your creative workspace...
      </div>
    );
  }

  // If user is not authenticated, show Auth Required State
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full p-8 sm:p-10 rounded-3xl bg-white border border-black/[0.06] shadow-[0_20px_60px_rgba(0,0,0,0.06)] relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-[#4DE3A5]/20 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-[#DCD2F8]/30 blur-2xl pointer-events-none" />

          <div className="w-12 h-12 rounded-2xl bg-[#F4EFE6] border border-black/[0.06] flex items-center justify-center mx-auto mb-5 text-[#18181B]">
            <Lock className="w-5 h-5" />
          </div>

          <span className="font-editorial text-2xl font-bold tracking-tight text-[#18181B] block mb-2">
            Dropterest Ideas
          </span>

          <h1 className="font-editorial text-3xl sm:text-4xl text-[#18181B] leading-snug font-normal mb-3">
            Authentication Required
          </h1>

          <p className="text-xs sm:text-sm text-[#71717A] leading-relaxed mb-8">
            Access to the curated Ideas feed, private moodboards, and saved drops is reserved for members.
          </p>

          <div className="space-y-3">
            <Link
              href="/login?redirect=/ideas&required=true"
              className="w-full py-3 px-6 rounded-full bg-[#4DE3A5] hover:bg-[#60ebb0] text-[#064E3B] font-semibold text-xs sm:text-sm shadow-[0_6px_24px_rgba(77,227,165,0.35)] flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              <span>Sign In to Continue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/signup?redirect=/ideas"
              className="w-full py-2.5 px-6 rounded-full bg-white hover:bg-[#FAF8F5] border border-black/[0.08] text-xs font-semibold text-[#18181B] flex items-center justify-center transition-all"
            >
              Create Free Account
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-black/[0.05]">
            <Link
              href="/"
              className="text-xs text-[#71717A] hover:text-[#18181B] transition-colors"
            >
              &larr; Back to Landing Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#18181B] flex selection:bg-[#4DE3A5]/40 selection:text-[#064E3B]">
      {/* ================= 1. LEFT MINI SIDEBAR (Screenshots 1 & 2 Match) ================= */}
      {/* ================= 1. LEFT SLIDER RAIL (Matching Screenshot Layout) ================= */}
      <aside className="fixed left-0 top-0 bottom-0 w-16 sm:w-20 bg-[#FAF8F5] border-r border-black/[0.06] z-40 flex flex-col items-center justify-between py-6 select-none">
        {/* Top Section: Red Star Icon + Main Navigation (Compass, Bookmark, Plus) */}
        <div className="flex flex-col items-center gap-6 w-full">
          {/* Red Star App Logo */}
          <button
            onClick={() => {
              setActiveTab("feed");
              setActiveDrawer(null);
              setShowCreateFlyout(false);
            }}
            className="w-11 h-11 rounded-xl bg-[#E60023] hover:bg-[#CC001F] text-white flex items-center justify-center font-bold text-xl hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
            title="Dropterest"
          >
            <span className="text-xl leading-none select-none">✦</span>
          </button>

          {/* Top Nav Icons */}
          <nav className="flex flex-col items-center gap-3 w-full px-2">
            {/* 1. Compass (Feed / Explore) */}
            <button
              onClick={() => {
                setActiveTab("feed");
                setActiveDrawer(null);
                setShowCreateFlyout(false);
              }}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                activeTab === "feed" && !activeDrawer
                  ? "bg-[#EFEAE1] text-[#18181B] shadow-xs"
                  : "text-[#52525B] hover:bg-[#EFEAE1]/70 hover:text-[#18181B]"
              }`}
              title="Explore Feed"
            >
              <Compass className="w-5 h-5 stroke-[2]" />
            </button>

            {/* 2. Bookmark (Saved) */}
            <button
              onClick={() => {
                setActiveTab("saved");
                setActiveDrawer(null);
                setShowCreateFlyout(false);
              }}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all relative cursor-pointer ${
                activeTab === "saved" && !activeDrawer
                  ? "bg-[#EFEAE1] text-[#18181B] shadow-xs"
                  : "text-[#52525B] hover:bg-[#EFEAE1]/70 hover:text-[#18181B]"
              }`}
              title="Your Saved Drops"
            >
              <Bookmark className="w-5 h-5 stroke-[2]" />
            </button>

            {/* 3. Plus (Create Drops) */}
            <button
              onClick={() => {
                setActiveTab("create");
                setActiveDrawer(null);
                setShowCreateFlyout(false);
              }}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                activeTab === "create" && !activeDrawer
                  ? "bg-[#EFEAE1] text-[#18181B] shadow-xs"
                  : "text-[#52525B] hover:bg-[#EFEAE1]/70 hover:text-[#18181B]"
              }`}
              title="Create Drops"
            >
              <Plus className="w-5 h-5 stroke-[2.2]" />
            </button>
          </nav>
        </div>

        {/* Bottom Section: Bell (Notifications), Message (Chats), Settings (Gear) — No Account Avatar */}
        <div className="flex flex-col items-center gap-3 w-full px-2">
          {/* Notifications (Bell) */}
          <button
            onClick={() => {
              setActiveDrawer(activeDrawer === "notifications" ? null : "notifications");
              setShowCreateFlyout(false);
            }}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all relative cursor-pointer ${
              activeDrawer === "notifications"
                ? "bg-[#EFEAE1] text-[#18181B]"
                : "text-[#52525B] hover:bg-[#EFEAE1]/70 hover:text-[#18181B]"
            }`}
            title="Notifications"
          >
            <Bell className="w-5 h-5 stroke-[2]" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#EF4444]" />
          </button>

          {/* Messages (Chat Bubble) */}
          <button
            onClick={() => {
              setActiveDrawer(activeDrawer === "messages" ? null : "messages");
              setShowCreateFlyout(false);
            }}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all relative cursor-pointer ${
              activeDrawer === "messages"
                ? "bg-[#EFEAE1] text-[#18181B]"
                : "text-[#52525B] hover:bg-[#EFEAE1]/70 hover:text-[#18181B]"
            }`}
            title="Messages"
          >
            <MessageSquare className="w-5 h-5 stroke-[2]" />
            {chats.length > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#E60023]" />
            )}
          </button>

          {/* Settings & Support (Gear) */}
          <button
            onClick={() => {
              setActiveDrawer(activeDrawer === "settings" ? null : "settings");
              setShowCreateFlyout(false);
            }}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              activeDrawer === "settings"
                ? "bg-[#EFEAE1] text-[#18181B]"
                : "text-[#52525B] hover:bg-[#EFEAE1]/70 hover:text-[#18181B]"
            }`}
            title="Settings"
          >
            <Settings className="w-5 h-5 stroke-[2]" />
          </button>
        </div>
      </aside>

      {/* ================= NOTIFICATIONS DRAWER (Screenshot 1) ================= */}
      <NotificationsDrawer
        isOpen={activeDrawer === "notifications"}
        onClose={() => setActiveDrawer(null)}
        onExploreFeed={() => {
          setActiveTab("feed");
          setActiveDrawer(null);
        }}
        onOpenPin={(pin) => {
          setSelectedPin(pin);
          setActiveDrawer(null);
        }}
      />

      {/* ================= MESSAGES DRAWER (Screenshot 2) ================= */}
      <MessagesDrawer
        isOpen={activeDrawer === "messages"}
        onClose={() => setActiveDrawer(null)}
        onOpenNewMessage={() => setShowNewMessageModal(true)}
        onOpenInviteFriends={() => setShowInviteFriendsModal(true)}
        chats={chats}
        onSelectChat={(chat) => {
          showToast(`Opened conversation with ${chat.name}`);
        }}
      />

      {/* ================= SETTINGS & SUPPORT DRAWER (Screenshot Match) ================= */}
      <SettingsSupportDrawer
        isOpen={activeDrawer === "settings"}
        onClose={() => setActiveDrawer(null)}
        onOpenSettingsModal={() => setShowSettingsModal(true)}
        showToast={showToast}
      />

      {/* ================= MODALS ================= */}
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

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        showToast={showToast}
      />

      {/* ================= 2. MAIN CONTAINER ================= */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          activeDrawer === "notifications" || activeDrawer === "messages" || activeDrawer === "settings"
            ? "pl-16 sm:pl-20 lg:pl-[460px]"
            : "pl-16 sm:pl-20"
        }`}
      >
        {/* Top Sticky Header Bar */}
        <header className="sticky top-0 bg-[#FAF8F5]/90 backdrop-blur-md z-20 px-4 sm:px-8 py-3.5 border-b border-black/[0.04] flex items-center justify-between gap-4">
          {/* Search Bar (Full Width) */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === "saved"
                  ? "Search your saved ideas, boards, pins..."
                  : "Search ideas, aesthetics, curators, materials..."
              }
              className="w-full h-11 pl-10 pr-12 rounded-[5px] bg-[#EFEAE1]/70 hover:bg-[#EFEAE1] focus:bg-white border border-transparent focus:border-black/15 text-xs sm:text-sm text-[#18181B] placeholder:text-[#8E8B82] outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-[#18181B]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {activeTab !== "create" ? (
              <button
                onClick={() => {
                  setActiveTab("create");
                  setActiveDrawer(null);
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-[5px] bg-[#18181B] text-white text-xs font-semibold hover:bg-black transition-all cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Drops</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveTab("feed")}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[5px] bg-white hover:bg-[#F3EFE6] border border-black/[0.08] text-xs font-semibold text-[#18181B] transition-all cursor-pointer"
              >
                &larr; Back to Feed
              </button>
            )}

            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-9 h-9 rounded-[5px] bg-[#6366F1] text-white flex items-center justify-center font-bold text-sm shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
                title="Account Menu"
              >
                {user?.name ? user.name[0].toUpperCase() : "A"}
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
                        {user?.name ? user.name[0].toUpperCase() : "A"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm text-[#18181B] truncate">{user?.name || "User"}</p>
                        <p className="text-xs text-[#71717A]">Personal</p>
                        <p className="text-xs text-[#71717A] truncate mt-0.5">{user?.email || "user@dropterest.com"}</p>
                      </div>
                      <Check className="w-4 h-4 text-[#18181B] shrink-0 mt-1" />
                    </div>

                    {/* Convert to business */}
                    <button
                      onClick={() => {
                        showToast("Convert to business feature coming soon ✦");
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

        {/* ================= VIEW 1: "YOUR SAVED IDEAS" (Screenshot 1) ================= */}
        {activeTab === "saved" ? (
          <div className="flex-1 px-4 sm:px-12 lg:px-16 py-8">
            {/* Top User Header Row (Screenshot 1) */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6">
              {/* Left Headline */}
              <div>
                <h1 className="font-editorial text-4xl sm:text-5xl text-[#18181B] font-normal tracking-tight">
                  Your saved ideas
                </h1>
              </div>

              {/* Right Profile Capsule */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#6366F1] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                    {user?.name ? user.name[0].toUpperCase() : "A"}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-[#18181B]">
                      {user?.name || "Ali shah"}
                    </h3>
                    <p className="text-xs text-[#71717A]">
                      0 following
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => showToast("Profile link copied to clipboard ✦")}
                  className="px-4 py-2 rounded-full bg-[#EFEAE1]/70 hover:bg-[#EFEAE1] text-xs font-semibold text-[#18181B] transition-all cursor-pointer"
                >
                  Share profile
                </button>
              </div>
            </div>

            {/* Sub-tabs: Pins, Boards, Collages (Screenshot 1) */}
            <div className="flex items-center gap-8 border-b border-black/[0.08] mb-6">
              {["Pins", "Boards", "Collages"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSavedSubTab(tab)}
                  className={`pb-3 text-sm font-semibold transition-all relative cursor-pointer ${
                    savedSubTab === tab
                      ? "text-[#18181B]"
                      : "text-[#71717A] hover:text-[#18181B]"
                  }`}
                >
                  <span>{tab}</span>
                  {savedSubTab === tab && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#18181B] rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Sub-tab Action Bar (Filter, Group, Create) */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => showToast("Filter preferences opened")}
                  className="w-10 h-10 rounded-full hover:bg-[#EFEAE1] flex items-center justify-center text-[#18181B] transition-colors cursor-pointer"
                  title="Filter"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => showToast("Grouped by recently saved")}
                  className="px-4 py-1.5 rounded-full bg-[#EFEAE1]/70 hover:bg-[#EFEAE1] text-xs font-semibold text-[#18181B] transition-all cursor-pointer"
                >
                  Group
                </button>
              </div>

              {/* Red/Mint Create Pill */}
              <button
                type="button"
                onClick={() => {
                  if (savedSubTab === "Boards") {
                    setShowCreateBoardModal(true);
                  } else {
                    setActiveTab("create");
                  }
                }}
                className="px-5 py-2 rounded-full bg-[#EF4444] hover:bg-red-600 text-white text-xs font-semibold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                Create
              </button>
            </div>

            {/* TAB CONTENT: BOARDS (Screenshot 1 & Boards Grid) */}
            {savedSubTab === "Boards" && (
              <div>
                {boards.length === 0 ? (
                  /* Empty State Bulletin Board Graphic */
                  <div className="py-12 flex flex-col items-center justify-center text-center max-w-md mx-auto">
                    {/* Illustrated Corkboard Graphic with sticky notes */}
                    <div className="w-48 h-36 rounded-2xl bg-[#FBBF24]/30 border-4 border-[#B45309]/30 p-3 flex flex-wrap gap-2 items-center justify-center shadow-md relative mb-6">
                      <div className="w-10 h-10 rounded bg-[#EF4444] shadow-xs rotate-[-6deg]" />
                      <div className="w-10 h-10 rounded bg-[#FBBF24] shadow-xs rotate-[4deg]" />
                      <div className="w-10 h-10 rounded bg-[#10B981] shadow-xs rotate-[-3deg]" />
                      <div className="w-10 h-10 rounded bg-[#6366F1] shadow-xs rotate-[8deg]" />
                    </div>

                    <h3 className="font-bold text-xl text-[#18181B] mb-2">
                      Organize your ideas
                    </h3>
                    <p className="text-xs sm:text-sm text-[#71717A] leading-relaxed mb-6">
                      Pins are sparks of inspiration. Boards are where they live. Create boards to organize your Pins your way.
                    </p>

                    <button
                      type="button"
                      onClick={() => setShowCreateBoardModal(true)}
                      className="px-6 py-2.5 rounded-full bg-[#EF4444] hover:bg-red-600 text-white text-xs font-semibold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      Create a board
                    </button>
                  </div>
                ) : (
                  /* Boards Grid */
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {boards.map((b) => (
                      <div
                        key={b.id}
                        onClick={() => showToast(`Opening board: ${b.name}`)}
                        className="group rounded-3xl overflow-hidden bg-white border border-black/[0.06] shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer"
                      >
                        {/* 3-cell Collage Preview */}
                        <div className="aspect-[4/3] grid grid-cols-3 gap-1 p-2 bg-[#EFEAE1]/60">
                          <div className="col-span-2 relative rounded-2xl overflow-hidden bg-[#D4CEBF]">
                            <Image src={b.images[0] || "/architecture-pavilion.jpeg"} alt={b.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                          </div>
                          <div className="grid grid-rows-2 gap-1">
                            <div className="relative rounded-xl overflow-hidden bg-[#D4CEBF]">
                              <Image src={b.images[1] || "/ceramics.jpeg"} alt={b.name} fill className="object-cover" />
                            </div>
                            <div className="relative rounded-xl overflow-hidden bg-[#D4CEBF]">
                              <Image src={b.images[2] || "/table-main.jpeg"} alt={b.name} fill className="object-cover" />
                            </div>
                          </div>
                        </div>

                        {/* Board Info */}
                        <div className="p-4 flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-semibold text-sm text-[#18181B] group-hover:text-[#064E3B] transition-colors">
                                {b.name}
                              </h4>
                              {b.isPrivate && (
                                <Lock className="w-3.5 h-3.5 text-[#71717A]" />
                              )}
                            </div>
                            <span className="text-[11px] text-[#71717A] mt-0.5 block">
                              {b.pinsCount} Pins
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              showToast(`Board settings for ${b.name}`);
                            }}
                            className="text-[#A1A1AA] hover:text-[#18181B] p-1"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Quick Create Board Card */}
                    <div
                      onClick={() => setShowCreateBoardModal(true)}
                      className="rounded-3xl border-2 border-dashed border-[#D4CEBF] hover:border-[#18181B] bg-white/40 hover:bg-white p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all aspect-[4/3]"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-[#EFEAE1] flex items-center justify-center text-[#18181B] mb-3">
                        <Plus className="w-6 h-6" />
                      </div>
                      <h4 className="font-semibold text-sm text-[#18181B]">
                        Create new board
                      </h4>
                      <p className="text-[11px] text-[#71717A] mt-1">
                        Organize pins into spaces
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: PINS */}
            {savedSubTab === "Pins" && (
              <div>
                {userSavedPinsList.length === 0 ? (
                  <div className="py-16 text-center">
                    <p className="font-editorial text-2xl text-[#18181B]">
                      You haven&apos;t saved any Pins yet.
                    </p>
                    <p className="text-xs text-[#71717A] mt-2 mb-6">
                      Explore the visual feed and click Save on ideas you love.
                    </p>
                    <button
                      onClick={() => setActiveTab("feed")}
                      className="px-6 py-2.5 rounded-full bg-[#4DE3A5] text-[#064E3B] text-xs font-semibold"
                    >
                      Explore Ideas Feed
                    </button>
                  </div>
                ) : (
                  <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 space-y-4">
                    {userSavedPinsList.map((pin) => (
                      <div
                        key={pin.id}
                        onClick={() => setSelectedPin(pin)}
                        className="break-inside-avoid group relative rounded-2xl overflow-hidden bg-white border border-black/[0.06] shadow-xs cursor-pointer"
                      >
                        <div className={`relative w-full ${pin.aspect || "aspect-[3/4.2]"} overflow-hidden bg-[#F3EFE6]`}>
                          <SafePinCardImage src={pin.image || pin.previewUrl} alt={pin.title} className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="p-2.5 flex items-center justify-between text-xs">
                          <span className="font-medium text-xs text-[#18181B] truncate">{pin.title}</span>
                          <span className="text-[10px] font-mono text-[#064E3B] bg-[#ECFDF5] px-2 py-0.5 rounded-full">Saved ✓</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: COLLAGES */}
            {savedSubTab === "Collages" && (
              <div className="py-12 text-center max-w-md mx-auto">
                <div className="w-16 h-16 rounded-3xl bg-[#FEF08A] text-[#854D0E] flex items-center justify-center mx-auto mb-4">
                  <Scissors className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl text-[#18181B] mb-2">
                  Mix & Match Collages
                </h3>
                <p className="text-xs sm:text-sm text-[#71717A] leading-relaxed mb-6">
                  Combine visual cutouts, textures, and quotes into stunning infinite moodboards.
                </p>
                <button
                  type="button"
                  onClick={() => showToast("Opening Collage Canvas Studio ✦")}
                  className="px-6 py-2.5 rounded-full bg-[#18181B] hover:bg-black text-white text-xs font-semibold shadow-md"
                >
                  Create New Collage
                </button>
              </div>
            )}
          </div>
        ) : activeTab === "create" ? (
          /* ================= VIEW 2: CREATE DROP STUDIO ================= */
          <div className="flex-1 flex flex-col lg:flex-row min-h-[calc(100vh-65px)]">
            <div className="flex-1 p-6 sm:p-10 max-w-5xl mx-auto w-full">
              <div className="flex items-center justify-between pb-6 mb-8 border-b border-black/[0.06]">
                <div className="flex items-center gap-3">
                  <h1 className="font-editorial text-3xl sm:text-4xl text-[#18181B] font-normal tracking-tight">
                    Create Drops
                  </h1>
                  <span className="text-xs font-sans font-medium text-[#71717A] bg-[#ECE6DE] px-3.5 py-1 rounded-full border border-black/[0.04]">
                    Draft Autosaved
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => showToast("Draft saved to your collection")}
                    className="px-4 py-2 rounded-full bg-white hover:bg-[#F4EFE6] border border-black/[0.08] text-xs font-semibold text-[#18181B] transition-all cursor-pointer"
                  >
                    Save Draft
                  </button>

                  <button
                    type="button"
                    onClick={handlePublishPin}
                    className="px-6 py-2 rounded-full bg-[#4DE3A5] hover:bg-[#60ebb0] text-[#064E3B] text-xs font-semibold shadow-[0_4px_16px_rgba(77,227,165,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Publish</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
                <div className="lg:col-span-5 flex flex-col gap-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative w-full aspect-[3/4.2] rounded-3xl bg-[#EFEAE1]/70 hover:bg-[#EFEAE1] border-2 border-dashed border-[#D4CEBF] hover:border-[#18181B] transition-all flex flex-col items-center justify-center p-6 text-center cursor-pointer group overflow-hidden shadow-xs"
                  >
                    {createForm.mediaPreview ? (
                      <>
                        <Image
                          src={createForm.mediaPreview}
                          alt="Preview"
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 text-white z-10">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowPinDesigner(true);
                            }}
                            className="px-4 py-2 rounded-full bg-white text-[#18181B] text-xs font-semibold shadow-lg hover:scale-105 transition-transform flex items-center gap-1.5 cursor-pointer"
                          >
                            <Sparkles className="w-4 h-4 text-[#4DE3A5]" />
                            <span>Design & Edit Pin</span>
                          </button>
                          <span className="text-[11px] text-white/80">Click background to replace file</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center max-w-xs">
                        <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-black/[0.05] flex items-center justify-center mb-4 text-[#18181B] group-hover:scale-110 transition-transform">
                          <Upload className="w-6 h-6" />
                        </div>
                        <h4 className="font-semibold text-sm text-[#18181B] mb-1">
                          Upload your media
                        </h4>
                        <p className="text-xs text-[#71717A] leading-relaxed mb-6">
                          Select multiple files in your file picker with Shift or Cmd/Ctrl
                        </p>
                        <span className="text-[11px] font-mono text-[#A1A1AA] bg-white/80 px-3 py-1 rounded-full border border-black/[0.04]">
                          JPG, PNG up to 20MB &middot; MP4 up to 200MB
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowUrlModal(true)}
                      className="flex-1 py-3 px-4 rounded-2xl bg-[#EFEAE1]/60 hover:bg-[#EFEAE1] border border-black/[0.04] text-xs font-semibold text-[#18181B] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Link2 className="w-4 h-4 text-[#71717A]" />
                      <span>Save from URL</span>
                    </button>

                    {createForm.mediaPreview && (
                      <>
                        <button
                          type="button"
                          onClick={() => setShowPinDesigner(true)}
                          className="py-3 px-4 rounded-2xl bg-[#18181B] hover:bg-black text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Sparkles className="w-4 h-4 text-[#4DE3A5]" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setCreateForm((prev) => ({
                              ...prev,
                              mediaPreview: "",
                              mediaUrl: "",
                            }))
                          }
                          className="p-3 rounded-2xl bg-[#EFEAE1]/60 hover:bg-red-50 hover:text-red-600 text-[#71717A] transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <form onSubmit={handlePublishPin} className="lg:col-span-7 space-y-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#71717A] mb-1.5">
                      TITLE
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Tell everyone what your Pin is about"
                      value={createForm.title}
                      onChange={(e) =>
                        setCreateForm({ ...createForm, title: e.target.value })
                      }
                      className="w-full h-12 px-4 rounded-2xl bg-[#EFEAE1]/50 hover:bg-[#EFEAE1]/80 focus:bg-white border border-transparent focus:border-[#18181B] text-sm text-[#18181B] placeholder:text-[#8E8B82] outline-none transition-all shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#71717A] mb-1.5">
                      DESCRIPTION
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Describe your Pin"
                      value={createForm.description}
                      onChange={(e) =>
                        setCreateForm({ ...createForm, description: e.target.value })
                      }
                      className="w-full p-4 rounded-2xl bg-[#EFEAE1]/50 hover:bg-[#EFEAE1]/80 focus:bg-white border border-transparent focus:border-[#18181B] text-sm text-[#18181B] placeholder:text-[#8E8B82] outline-none transition-all resize-none shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#71717A] mb-1.5">
                      LINK
                    </label>
                    <input
                      type="url"
                      placeholder="Add a link (e.g. https://studio.com/project)"
                      value={createForm.link}
                      onChange={(e) =>
                        setCreateForm({ ...createForm, link: e.target.value })
                      }
                      className="w-full h-12 px-4 rounded-2xl bg-[#EFEAE1]/50 hover:bg-[#EFEAE1]/80 focus:bg-white border border-transparent focus:border-[#18181B] text-sm text-[#18181B] placeholder:text-[#8E8B82] outline-none transition-all shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#71717A] mb-1.5">
                      BOARD
                    </label>
                    <div className="relative">
                      <select
                        value={createForm.board}
                        onChange={(e) =>
                          setCreateForm({ ...createForm, board: e.target.value })
                        }
                        className="w-full h-12 px-4 pr-10 rounded-2xl bg-[#EFEAE1]/50 hover:bg-[#EFEAE1]/80 focus:bg-white border border-transparent focus:border-[#18181B] text-sm text-[#18181B] outline-none transition-all appearance-none cursor-pointer shadow-xs"
                      >
                        {boards.map((b) => (
                          <option key={b.id} value={b.name}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A] pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-[#71717A]">
                        TAGGED TOPICS ({createForm.tags.length})
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setProductTab("tags");
                          setShowProductTagsModal(true);
                        }}
                        className="text-[11px] text-[#064E3B] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Tag className="w-3 h-3" />
                        <span>Search & Browse Tags &rarr;</span>
                      </button>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-[#EFEAE1]/50 focus-within:bg-white border border-transparent focus-within:border-[#18181B] transition-all shadow-xs flex flex-wrap items-center gap-2">
                      {createForm.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-xs font-semibold text-[#18181B] border border-black/[0.06] shadow-xs"
                        >
                          <span>#{tag}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="text-[#A1A1AA] hover:text-red-500 transition-colors cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        placeholder="Search for a tag (press Enter)"
                        value={createForm.tagInput}
                        onChange={(e) =>
                          setCreateForm({ ...createForm, tagInput: e.target.value })
                        }
                        onKeyDown={handleAddTag}
                        className="flex-1 min-w-[140px] bg-transparent text-xs text-[#18181B] placeholder:text-[#8E8B82] outline-none py-1 px-2"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-semibold text-[#18181B]">
                        Tag Products
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setProductTab("search");
                          setShowProductTagsModal(true);
                        }}
                        className="text-[11px] text-[#064E3B] font-semibold hover:underline cursor-pointer"
                      >
                        Open Product Search &rarr;
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setProductTab("search");
                          setShowProductTagsModal(true);
                        }}
                        className="px-4 py-2 rounded-xl bg-[#EFEAE1]/80 hover:bg-[#EFEAE1] text-xs font-semibold text-[#18181B] transition-all cursor-pointer shadow-xs flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-[#064E3B]" />
                        <span>Add products</span>
                      </button>

                      {createForm.taggedProducts.map((p) => (
                        <span
                          key={p.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-black/[0.08] text-xs font-medium text-[#18181B]"
                        >
                          <span>{p.name.split("—")[0]}</span>
                          <span className="font-bold text-[#064E3B]">{p.price}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setCreateForm((prev) => ({
                                ...prev,
                                taggedProducts: prev.taggedProducts.filter(
                                  (item) => item.id !== p.id
                                ),
                              }))
                            }
                            className="text-[#71717A] hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* ================= MONETIZATION ENGINE ================= */}
                  <div className="pt-5 border-t border-black/[0.08] space-y-4">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#18181B]">
                        Delivery &amp; Monetization
                      </h3>
                      <p className="text-xs text-[#71717A] mt-0.5">
                        How do you want people to get this design?
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Option 1: Free Download */}
                      <div
                        onClick={() => setCreateForm((prev) => ({ ...prev, postType: "free" }))}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                          createForm.postType === "free"
                            ? "border-[#18181B] bg-white ring-2 ring-[#18181B] shadow-sm"
                            : "border-black/[0.08] bg-[#EFEAE1]/40 hover:bg-white text-[#71717A]"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${createForm.postType === "free" ? "border-[#18181B]" : "border-[#A1A1AA]"}`}>
                              {createForm.postType === "free" && <span className="w-2 h-2 rounded-full bg-[#18181B]" />}
                            </span>
                            <span className="font-bold text-sm text-[#18181B]">Free Download</span>
                          </div>
                          <span className="text-[10px] font-mono text-[#064E3B] bg-[#4DE3A5]/30 px-2 py-0.5 rounded-full font-semibold">GROWTH</span>
                        </div>
                        <p className="text-xs text-[#71717A] leading-relaxed">
                          User gets <strong>Download Free</strong> button. You gain views, saves, downloads &amp; followers to grow your audience.
                        </p>
                      </div>

                      {/* Option 2: Sell Design */}
                      <div
                        onClick={() => setCreateForm((prev) => ({ ...prev, postType: "sell" }))}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                          createForm.postType === "sell"
                            ? "border-[#E60023] bg-white ring-2 ring-[#E60023] shadow-sm"
                            : "border-black/[0.08] bg-[#EFEAE1]/40 hover:bg-white text-[#71717A]"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${createForm.postType === "sell" ? "border-[#E60023]" : "border-[#A1A1AA]"}`}>
                              {createForm.postType === "sell" && <span className="w-2 h-2 rounded-full bg-[#E60023]" />}
                            </span>
                            <span className="font-bold text-sm text-[#18181B]">Sell Design</span>
                          </div>
                          <span className="text-[10px] font-mono text-[#E60023] bg-red-50 px-2 py-0.5 rounded-full font-semibold">MARKETPLACE</span>
                        </div>
                        <p className="text-xs text-[#71717A] leading-relaxed">
                          Charge for source assets. User gets <strong>Buy Design</strong> button and receives a secure private asset download.
                        </p>
                      </div>
                    </div>

                    {/* Dynamic Sell Design Fields */}
                    {createForm.postType === "sell" && (
                      <div className="p-5 rounded-2xl bg-white border border-[#E60023]/20 shadow-xs space-y-4 animate-in fade-in zoom-in-98 duration-150">
                        <div className="flex items-center gap-2 pb-2 border-b border-black/[0.05]">
                          <ShoppingBag className="w-4 h-4 text-[#E60023]" />
                          <h4 className="font-bold text-xs text-[#18181B]">Marketplace Listing Details</h4>
                        </div>

                        {/* Price Input */}
                        <div>
                          <label className="block text-[11px] font-mono uppercase tracking-wider text-[#71717A] mb-1.5">
                            PRICE (PKR)
                          </label>
                          <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#71717A]">
                                PKR
                              </span>
                              <input
                                type="number"
                                min="50"
                                step="50"
                                value={createForm.price}
                                onChange={(e) => setCreateForm((prev) => ({ ...prev, price: e.target.value }))}
                                placeholder="499"
                                className="w-full h-11 pl-14 pr-4 rounded-xl bg-[#FAF8F5] border border-black/15 focus:border-[#E60023] font-mono font-bold text-sm text-[#18181B] outline-none"
                              />
                            </div>

                            {/* Quick preset chips */}
                            <div className="flex items-center gap-1.5 overflow-x-auto">
                              {[299, 499, 799, 1499].map((amt) => (
                                <button
                                  key={amt}
                                  type="button"
                                  onClick={() => setCreateForm((prev) => ({ ...prev, price: amt }))}
                                  className={`px-3 py-2 rounded-xl text-xs font-mono font-semibold border transition-all cursor-pointer ${
                                    Number(createForm.price) === amt
                                      ? "bg-[#18181B] text-white border-[#18181B]"
                                      : "bg-[#FAF8F5] border-black/10 hover:bg-[#EFEAE1] text-[#18181B]"
                                  }`}
                                >
                                  {amt}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Digital Asset File Upload */}
                        <div>
                          <label className="block text-[11px] font-mono uppercase tracking-wider text-[#71717A] mb-1.5">
                            DIGITAL SOURCE ASSET (ZIP, PSD, AI, FIGMA, PDF)
                          </label>
                          <input
                            ref={sourceFileInputRef}
                            type="file"
                            accept=".zip,.psd,.ai,.fig,.pdf,.rar,.eps"
                            onChange={handleSourceFileUpload}
                            className="hidden"
                          />
                          <div
                            onClick={() => sourceFileInputRef.current?.click()}
                            className="p-4 rounded-2xl border-2 border-dashed border-[#D4CEBF] hover:border-[#E60023] bg-[#FAF8F5] hover:bg-white transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-2"
                          >
                            <Upload className="w-5 h-5 text-[#71717A]" />
                            {createForm.sourceFileUploaded ? (
                              <div>
                                <p className="font-bold text-xs text-[#064E3B] flex items-center justify-center gap-1">
                                  <Check className="w-3.5 h-3.5" />
                                  <span>{createForm.assetFileName}</span>
                                </p>
                                <span className="text-[10px] text-[#71717A] font-mono">
                                  {createForm.assetFileSize} &middot; Stored privately on secure server
                                </span>
                              </div>
                            ) : (
                              <div>
                                <p className="font-semibold text-xs text-[#18181B]">
                                  Click to attach raw downloadable file
                                </p>
                                <span className="text-[10px] text-[#71717A]">
                                  PSD, AI, FIG, ZIP up to 500MB (Private &amp; delivered after purchase)
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* License Type */}
                        <div>
                          <label className="block text-[11px] font-mono uppercase tracking-wider text-[#71717A] mb-1.5">
                            LICENSE TYPE
                          </label>
                          <div className="grid grid-cols-2 gap-2.5">
                            <button
                              type="button"
                              onClick={() => setCreateForm((prev) => ({ ...prev, licenseType: "personal" }))}
                              className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                                createForm.licenseType === "personal"
                                  ? "border-[#18181B] bg-[#18181B] text-white"
                                  : "border-black/10 bg-[#FAF8F5] text-[#71717A] hover:text-[#18181B]"
                              }`}
                            >
                              <span>Personal License</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setCreateForm((prev) => ({ ...prev, licenseType: "commercial" }))}
                              className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                                createForm.licenseType === "commercial"
                                  ? "border-[#18181B] bg-[#18181B] text-white"
                                  : "border-black/10 bg-[#FAF8F5] text-[#71717A] hover:text-[#18181B]"
                              }`}
                            >
                              <span>Commercial License</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-black/[0.05]">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold text-[#18181B] block">
                          Mark as AI-Modified
                        </span>
                        <p className="text-[11px] text-[#71717A] mt-0.5">
                          Content that was made completely or partly with AI
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setCreateForm({
                            ...createForm,
                            isAiModified: !createForm.isAiModified,
                          })
                        }
                        className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                          createForm.isAiModified ? "bg-[#4DE3A5]" : "bg-[#D4CEBF]"
                        }`}
                      >
                        <span
                          className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                            createForm.isAiModified ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-black/[0.05]">
                    <button
                      type="button"
                      onClick={() => setShowMoreOptions(!showMoreOptions)}
                      className="text-xs font-semibold text-[#18181B] hover:text-black flex items-center gap-1.5 transition-colors cursor-pointer mb-3"
                    >
                      <span>More options</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          showMoreOptions ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {showMoreOptions && (
                      <div className="space-y-4 pt-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-[#18181B]">
                            Allow people to comment
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setCreateForm((prev) => ({
                                ...prev,
                                allowComments: !prev.allowComments,
                              }))
                            }
                            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                              createForm.allowComments ? "bg-[#3B82F6]" : "bg-[#D4CEBF]"
                            }`}
                          >
                            <span
                              className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                                createForm.allowComments ? "translate-x-5" : "translate-x-0"
                              }`}
                            />
                          </button>
                        </div>

                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-[#18181B]">
                              Show similar products
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setCreateForm((prev) => ({
                                  ...prev,
                                  showSimilarProducts: !prev.showSimilarProducts,
                                }))
                              }
                              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                                createForm.showSimilarProducts ? "bg-[#3B82F6]" : "bg-[#D4CEBF]"
                              }`}
                            >
                              <span
                                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                                  createForm.showSimilarProducts ? "translate-x-5" : "translate-x-0"
                                }`}
                              />
                            </button>
                          </div>
                          <p className="text-[11px] text-[#71717A] leading-relaxed mt-1">
                            People can shop products similar to what&apos;s shown in this Pin using visual search. Shopping recommendations aren&apos;t available for Idea ads and Pins with tagged products or paid partnership label.
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-white border border-[#D4CEBF]/80 shadow-xs">
                          <label className="block text-[11px] font-semibold text-[#18181B] mb-1">
                            Alt Text
                          </label>
                          <textarea
                            rows={2}
                            placeholder="Describe your Pin's visual details"
                            value={createForm.altText}
                            onChange={(e) =>
                              setCreateForm({ ...createForm, altText: e.target.value })
                            }
                            className="w-full text-xs text-[#18181B] placeholder:text-[#A1A1AA] outline-none bg-transparent resize-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {showDraftsSidebar && (
              <aside className="w-full lg:w-72 bg-white border-l border-black/[0.06] p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-black/[0.05] mb-4">
                    <h3 className="font-semibold text-sm text-[#18181B]">
                      Pin drafts
                    </h3>
                    <button
                      onClick={() => setShowDraftsSidebar(false)}
                      className="text-[#71717A] hover:text-[#18181B]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setCreateForm({
                        title: "",
                        description: "",
                        link: "",
                        board: boards[0]?.name || "Main Board",
                        category: "Architecture",
                        tags: ["new"],
                        tagInput: "",
                        postType: "free",
                        price: 499,
                        currency: "PKR",
                        assetFileName: "",
                        assetFileType: "zip",
                        assetFileSize: "24.5 MB",
                        licenseType: "commercial",
                        isAiModified: false,
                        hasAiPerson: false,
                        allowComments: true,
                        showSimilarProducts: true,
                        altText: "",
                        taggedProducts: [],
                        mediaUrl: "",
                        mediaPreview: "",
                        sourceFileUploaded: false,
                      });
                      showToast("Started fresh blank draft");
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#EFEAE1]/70 hover:bg-[#EFEAE1] text-xs font-semibold text-[#18181B] transition-all mb-4 cursor-pointer"
                  >
                    Create new
                  </button>

                  <div className="space-y-3">
                    {drafts.map((d) => (
                      <div
                        key={d.id}
                        onClick={() => {
                          setCreateForm((prev) => ({
                            ...prev,
                            title: d.title,
                            mediaPreview: d.image,
                            mediaUrl: d.image,
                          }));
                          showToast(`Loaded draft: ${d.title}`);
                        }}
                        className="p-2.5 rounded-2xl hover:bg-[#FAF8F5] border border-black/[0.05] flex items-center gap-3 cursor-pointer group transition-all"
                      >
                        <div className="relative w-12 h-14 rounded-xl overflow-hidden bg-[#EFEAE1] shrink-0">
                          <Image src={d.image} alt={d.title} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium text-xs text-[#18181B] truncate group-hover:text-[#064E3B]">
                            {d.title}
                          </h5>
                          <span className="text-[10px] text-[#71717A] block mt-0.5">
                            {d.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-black/[0.05] text-[11px] text-[#71717A] text-center">
                  <span>Autosaves every 30 seconds</span>
                </div>
              </aside>
            )}
          </div>
        ) : (
          /* ================= VIEW 3: MAIN EXPLORE FEED ================= */
          <>
            {/* Filter Bar with Content Type Selector & Categories */}
            <div className="px-4 sm:px-8 py-3.5 border-b border-black/[0.04] space-y-3">
              {/* Content Type Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setContentTypeFilter("all")}
                  className={`px-4 py-1.5 rounded-[5px] text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    contentTypeFilter === "all"
                      ? "bg-[#18181B] text-white shadow-xs"
                      : "bg-[#EFEAE1]/70 text-[#71717A] hover:text-[#18181B] hover:bg-[#EFEAE1]"
                  }`}
                >
                  All Content
                </button>

                <button
                  onClick={() => setContentTypeFilter("free")}
                  className={`px-4 py-1.5 rounded-[5px] text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    contentTypeFilter === "free"
                      ? "bg-[#064E3B] text-white shadow-xs"
                      : "bg-[#EFEAE1]/70 text-[#71717A] hover:text-[#18181B] hover:bg-[#EFEAE1]"
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Free Downloads</span>
                </button>

                <button
                  onClick={() => setContentTypeFilter("sell")}
                  className={`px-4 py-1.5 rounded-[5px] text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    contentTypeFilter === "sell"
                      ? "bg-[#E60023] text-white shadow-xs"
                      : "bg-[#EFEAE1]/70 text-[#71717A] hover:text-[#18181B] hover:bg-[#EFEAE1]"
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Marketplace Designs</span>
                </button>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3.5 py-1 rounded-[5px] text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                      activeCategory === cat
                        ? "bg-[#18181B] text-white shadow-xs"
                        : "bg-white text-[#71717A] hover:bg-[#F3EFE6] hover:text-[#18181B] border border-black/[0.05]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-4 sm:px-8 pt-6 pb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="font-editorial text-2xl font-bold text-[#18181B]">
                  Visual Discovery &amp; Assets
                </h2>
                <span className="text-xs font-mono text-[#71717A] bg-white px-2.5 py-0.5 rounded-[5px] border border-black/[0.05]">
                  {filteredPins.length} {filteredPins.length === 1 ? "design" : "designs"}
                </span>
              </div>
            </div>

            <div className="flex-1 px-3 sm:px-8 py-6">
              {filteredPins.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-center max-w-md mx-auto px-4">
                  <div className="w-16 h-16 rounded-[5px] bg-[#EFEAE1] text-[#18181B] flex items-center justify-center mb-4 shadow-sm">
                    <Sparkles className="w-8 h-8 text-[#064E3B]" />
                  </div>
                  <h3 className="font-editorial text-3xl font-bold text-[#18181B] mb-2">
                    No designs found
                  </h3>
                  <p className="text-xs sm:text-sm text-[#71717A] leading-relaxed mb-6">
                    Be the first creator to upload high-resolution visuals, templates, or downloadable creative assets.
                  </p>
                  <button
                    onClick={() => setActiveTab("create")}
                    className="px-6 py-3 rounded-[5px] bg-[#4DE3A5] hover:bg-[#60ebb0] text-[#064E3B] text-xs font-semibold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Upload First Design</span>
                  </button>
                </div>
              ) : (
                <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-4 space-y-4">
                  {filteredPins.map((pin) => {
                    const isSaved = !!savedPins[pin.id];
                    const isSell = pin.postType === "sell";
                    const displayImg = pin.previewUrl || pin.image;

                    return (
                      <div
                        key={pin.id}
                        onClick={() => router.push(`/drop/${pin.id}`)}
                        className="break-inside-avoid group relative rounded-[5px] overflow-hidden bg-white border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_14px_30px_rgba(0,0,0,0.09)] transition-all duration-300 cursor-pointer"
                      >
                        <div className={`relative w-full ${pin.aspect || "aspect-[3/4.2]"} rounded-[5px] overflow-hidden bg-[#F3EFE6]`}>
                          <SafePinCardImage
                            src={displayImg}
                            alt={pin.title || "Design"}
                            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          />

                          {/* Permanent Corner Badge for Marketplace / Free */}
                          <div className="absolute top-2.5 left-2.5 z-10">
                            {isSell ? (
                              <span className="text-[10px] font-mono font-bold text-white bg-[#18181B]/90 backdrop-blur-md px-2 py-0.5 rounded-[5px] shadow-md border border-white/20">
                                PKR {pin.price?.toLocaleString() || 499}
                              </span>
                            ) : (
                              <span className="text-[9px] font-mono font-bold text-[#064E3B] bg-[#4DE3A5]/90 backdrop-blur-md px-2 py-0.5 rounded-[5px] shadow-xs">
                                FREE ASSET
                              </span>
                            )}
                          </div>

                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3 pointer-events-none" />

                          {/* Hover Top-Right Action Row with Save and 3-Dots */}
                          <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                            <button
                              onClick={(e) => toggleSave(pin.id, e)}
                              className={`px-3 py-1.5 rounded-[5px] text-xs font-semibold shadow-md transition-all cursor-pointer flex items-center gap-1 ${
                                isSaved
                                  ? "bg-[#18181B] text-white hover:bg-black"
                                  : "bg-[#4DE3A5] text-[#064E3B] hover:bg-[#60ebb0] hover:scale-105"
                              }`}
                            >
                              {isSaved ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  <span>Saved</span>
                                </>
                              ) : (
                                <span>Save</span>
                              )}
                            </button>

                            {/* 3-Dots Menu Trigger */}
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenuPinId(activeMenuPinId === pin.id ? null : pin.id);
                                }}
                                className="w-8 h-8 rounded-[5px] bg-white/90 hover:bg-white text-[#18181B] shadow-md backdrop-blur-md flex items-center justify-center transition-all cursor-pointer hover:scale-105"
                                title="Options & Download"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </button>

                              {/* 3-Dots Dropdown Menu */}
                              {activeMenuPinId === pin.id && (
                                <div
                                  onClick={(e) => e.stopPropagation()}
                                  className="absolute right-0 top-10 w-52 bg-white rounded-[5px] shadow-2xl border border-black/10 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150 text-left"
                                >
                                  <button
                                    onClick={(e) => handleDirectDownload(pin, e)}
                                    className="w-full px-3.5 py-2.5 text-xs font-semibold text-[#064E3B] hover:bg-[#ECFDF5] flex items-center gap-2.5 transition-colors cursor-pointer"
                                  >
                                    <Download className="w-4 h-4 text-[#064E3B]" />
                                    <span>Download Free</span>
                                  </button>

                                  <button
                                    onClick={(e) => {
                                      toggleSave(pin.id, e);
                                      setActiveMenuPinId(null);
                                    }}
                                    className="w-full px-3.5 py-2 text-xs font-medium text-[#18181B] hover:bg-[#F4EFE6] flex items-center gap-2.5 transition-colors cursor-pointer"
                                  >
                                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-[#18181B]" : ""}`} />
                                    <span>{isSaved ? "Remove from saved" : "Save to collection"}</span>
                                  </button>

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigator.clipboard?.writeText(typeof window !== "undefined" ? `${window.location.origin}/ideas?pin=${pin.id}` : "");
                                      showToast("Link copied to clipboard ✦");
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
                                      showToast("Share link ready ✦");
                                      setActiveMenuPinId(null);
                                    }}
                                    className="w-full px-3.5 py-2 text-xs font-medium text-[#18181B] hover:bg-[#F4EFE6] flex items-center gap-2.5 transition-colors cursor-pointer"
                                  >
                                    <Share2 className="w-3.5 h-3.5 text-[#71717A]" />
                                    <span>Share design</span>
                                  </button>

                                  {user?.id && (pin.creatorId === user.id || pin.author === user.name) && (
                                    <button
                                      onClick={(e) => handleDeletePost(pin.id, e)}
                                      className="w-full px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors cursor-pointer border-t border-black/5 mt-1"
                                    >
                                      <Trash2 className="w-3.5 h-3.5 text-red-600" />
                                      <span>Delete drop</span>
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Hover Bottom Bar */}
                          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-auto">
                            <div className="min-w-0 pr-2">
                              <span className="text-[11px] font-semibold text-white/95 truncate block">
                                {pin.title}
                              </span>
                              <span className="text-[10px] text-white/80 flex items-center gap-1.5 mt-0.5">
                                <span>@{pin.creatorUsername || pin.author || pin.creatorName || "creator"}</span>
                                <span>&middot;</span>
                                <span className="font-mono">❤️ {pin.likes || pin.likesCount || 0}</span>
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={(e) => handleDirectDownload(pin, e)}
                                className="w-7 h-7 rounded-[5px] bg-white/20 hover:bg-white/40 backdrop-blur-md flex items-center justify-center transition-colors cursor-pointer"
                                title="Download Free"
                              >
                                <Download className="w-3.5 h-3.5 text-white" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigator.clipboard?.writeText(typeof window !== "undefined" ? `${window.location.origin}/ideas?pin=${pin.id}` : "");
                                  showToast("Link copied to clipboard ✦");
                                }}
                                className="w-7 h-7 rounded-[5px] bg-white/20 hover:bg-white/40 backdrop-blur-md flex items-center justify-center transition-colors cursor-pointer"
                                title="Share"
                              >
                                <Share2 className="w-3.5 h-3.5 text-white" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Seamless Infinite Cursor Prefetch Trigger (1200px Root Margin) */}
              <LoadMoreTrigger
                loadMore={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
              />
            </div>
          </>
        )}
      </div>

      {/* ================= MODAL: CREATE A BOARD (Screenshot 2) ================= */}
      {showCreateBoardModal && (
        <div
          onClick={() => setShowCreateBoardModal(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-black/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-2xl text-[#18181B]">
                Create a board
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateBoardModal(false)}
                className="w-8 h-8 rounded-full hover:bg-[#F4EFE6] flex items-center justify-center text-[#71717A] hover:text-[#18181B] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 3-cell Board Skeleton Preview (Screenshot 2) */}
            <div className="w-48 aspect-[4/3] mx-auto mb-6 grid grid-cols-3 gap-1 p-1.5 rounded-2xl bg-[#EFEAE1]/70 border border-black/[0.05]">
              <div className="col-span-2 rounded-xl bg-[#D4CEBF]/60" />
              <div className="grid grid-rows-2 gap-1">
                <div className="rounded-lg bg-[#D4CEBF]/60" />
                <div className="rounded-lg bg-[#D4CEBF]/60" />
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateBoard} className="space-y-6">
              {/* Board Name Input Box */}
              <div className="p-3.5 rounded-2xl bg-white border border-[#D4CEBF]/90 shadow-xs focus-within:border-[#18181B] transition-all">
                <label className="block text-[11px] font-semibold text-[#18181B] mb-1">
                  Board name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Name your board"
                  value={boardForm.name}
                  onChange={(e) =>
                    setBoardForm({ ...boardForm, name: e.target.value })
                  }
                  className="w-full text-sm text-[#18181B] placeholder:text-[#A1A1AA] outline-none bg-transparent"
                />
              </div>

              {/* Toggle: Private Board */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-[#18181B] block">
                    Make this board private
                  </span>
                  <p className="text-[11px] text-[#71717A] mt-0.5 leading-relaxed">
                    Boards are public by default and anyone can see them. Only collaborators can see private boards.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setBoardForm((prev) => ({
                      ...prev,
                      isPrivate: !prev.isPrivate,
                    }))
                  }
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${
                    boardForm.isPrivate ? "bg-[#18181B]" : "bg-[#D4CEBF]"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                      boardForm.isPrivate ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Group Board with Collaborator Icon */}
              <div className="flex items-center justify-between gap-4 pt-2">
                <div>
                  <span className="text-xs font-semibold text-[#18181B] block">
                    Group board
                  </span>
                  <p className="text-[11px] text-[#71717A] mt-0.5">
                    Invite collaborators to join this board
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => showToast("Collaborator invite link ready")}
                  className="w-10 h-10 rounded-2xl bg-[#EFEAE1]/70 hover:bg-[#EFEAE1] flex items-center justify-center text-[#18181B] transition-all cursor-pointer"
                  title="Invite collaborator"
                >
                  <UserPlus className="w-4 h-4" />
                </button>
              </div>

              {/* Submit Action */}
              <button
                type="submit"
                disabled={!boardForm.name.trim()}
                className={`w-full py-3.5 px-6 rounded-full font-semibold text-xs transition-all cursor-pointer shadow-xs ${
                  boardForm.name.trim()
                    ? "bg-[#EF4444] hover:bg-red-600 text-white shadow-md"
                    : "bg-[#EFEAE1] text-[#A1A1AA] cursor-not-allowed"
                }`}
              >
                Create
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: "DESIGN YOUR PIN" EDITOR ================= */}
      {showPinDesigner && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col animate-in fade-in duration-200">
          <div className="h-16 px-6 border-b border-black/[0.08] flex items-center justify-between bg-white z-20">
            <h2 className="font-semibold text-base sm:text-lg text-[#18181B]">
              Design your Pin
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-xs text-[#71717A] hidden sm:inline">
                Changes stored!
              </span>
              <button
                type="button"
                onClick={() => {
                  setShowPinDesigner(false);
                  showToast("Design modifications saved ✦");
                }}
                className="px-5 py-2 rounded-full bg-[#EF4444] hover:bg-red-600 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-[#F5F2EB]">
            <div className="w-full lg:w-72 bg-white border-r border-black/[0.08] p-6 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="mb-4">
                  <h3 className="font-semibold text-sm text-[#18181B]">
                    Layers &middot; {designerLayers.length} of 10
                  </h3>
                  <p className="text-[11px] text-[#71717A] mt-0.5">
                    Select a layer to edit
                  </p>
                </div>

                <div className="space-y-2">
                  {designerLayers.map((layer) => (
                    <div
                      key={layer.id}
                      onClick={() => setActiveLayerId(layer.id)}
                      className={`p-3 rounded-2xl border transition-all flex items-center gap-3 cursor-pointer ${
                        activeLayerId === layer.id
                          ? "bg-[#FAF8F5] border-[#18181B] shadow-xs"
                          : "bg-white border-black/[0.06] hover:border-black/20"
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-[#EFEAE1] flex items-center justify-center text-[#18181B] shrink-0">
                        {layer.type === "text" ? (
                          <Type className="w-4 h-4" />
                        ) : layer.type === "media" ? (
                          <Upload className="w-4 h-4" />
                        ) : (
                          <Layers className="w-4 h-4" />
                        )}
                      </div>
                      <span className="font-medium text-xs text-[#18181B]">
                        {layer.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setDesignerLayers((prev) => [
                    {
                      id: `layer-${Date.now()}`,
                      name: "Custom text",
                      type: "text",
                      text: "New text layer",
                      color: "#ffffff",
                      size: 28,
                      visible: true,
                    },
                    ...prev,
                  ]);
                  showToast("Added new text layer ✦");
                }}
                className="w-full py-3 px-4 rounded-2xl bg-[#EFEAE1]/70 hover:bg-[#EFEAE1] border border-black/[0.04] text-xs font-semibold text-[#18181B] transition-all cursor-pointer mt-4"
              >
                Add text layer
              </button>
            </div>

            <div className="flex-1 p-6 sm:p-10 flex items-center justify-center overflow-auto relative">
              <div className="relative w-full max-w-md aspect-[3/4.2] rounded-2xl overflow-hidden shadow-2xl bg-[#18181B] flex items-center justify-center border-4 border-white">
                {createForm.mediaPreview ? (
                  <Image
                    src={createForm.mediaPreview}
                    alt="Design Preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="text-center p-6 text-white/60">
                    <p className="text-xs">No media loaded</p>
                  </div>
                )}

                <div
                  className="absolute inset-0 flex items-center justify-center p-6 text-center cursor-move select-none"
                  style={{ color: textColor }}
                >
                  <p
                    className="font-bold drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] tracking-tight"
                    style={{ fontSize: `${textSize}px` }}
                  >
                    {canvasText}
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-80 bg-white border-l border-black/[0.08] p-6 overflow-y-auto space-y-6">
              <div>
                <h4 className="font-semibold text-xs text-[#18181B] mb-1">
                  Edit your media to focus on the most interesting part.
                </h4>
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#EFEAE1] mt-3 border border-black/[0.06]">
                  {createForm.mediaPreview && (
                    <Image
                      src={createForm.mediaPreview}
                      alt="Thumbnail preview"
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
              </div>

              {activeLayerId === "layer-text" && (
                <div className="space-y-4 pt-4 border-t border-black/[0.05]">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#18181B] mb-1.5">
                      Text Content
                    </label>
                    <input
                      type="text"
                      value={canvasText}
                      onChange={(e) => setCanvasText(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-black/10 text-xs text-[#18181B] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#18181B] mb-1.5">
                      Font Size ({textSize}px)
                    </label>
                    <input
                      type="range"
                      min="16"
                      max="72"
                      value={textSize}
                      onChange={(e) => setTextSize(Number(e.target.value))}
                      className="w-full accent-[#18181B]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#18181B] mb-1.5">
                      Text Color
                    </label>
                    <div className="flex items-center gap-2">
                      {["#ffffff", "#18181B", "#4DE3A5", "#DCD2F8", "#EF4444", "#FEF08A"].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setTextColor(c)}
                          className={`w-7 h-7 rounded-full border-2 transition-transform ${
                            textColor === c ? "scale-110 border-black" : "border-black/10"
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-black/[0.05]">
                <h5 className="font-semibold text-xs text-[#18181B] mb-3">
                  Video & Canvas controls
                </h5>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => showToast("Aspect ratio set to 9:16")}
                    className="p-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#EFEAE1] border border-black/[0.06] text-center text-xs font-mono"
                  >
                    9:16
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast("Aspect ratio set to 1:1")}
                    className="p-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#EFEAE1] border border-black/[0.06] text-center text-xs font-mono"
                  >
                    1:1
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast("Aspect ratio set to 4:5")}
                    className="p-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#EFEAE1] border border-black/[0.06] text-center text-xs font-mono"
                  >
                    4:5
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= LEFT-SIDE SLIDER: TAGS & PRODUCTS DRAWER ================= */}
      {showProductTagsModal && (
        <>
          {/* Dimmed backdrop */}
          <div
            onClick={() => setShowProductTagsModal(false)}
            className="fixed inset-0 bg-black/45 backdrop-blur-[2px] z-50 animate-in fade-in duration-200"
          />

          {/* Left Slide-in Panel */}
          <div className="fixed left-0 top-0 bottom-0 w-full sm:w-[460px] md:w-[480px] bg-white border-r border-black/[0.08] shadow-[0_25px_70px_rgba(0,0,0,0.18)] z-50 flex flex-col p-6 sm:p-7 animate-in slide-in-from-left duration-300 ease-out">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-black/[0.06] mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717A] block">
                  Interactive Tagging
                </span>
                <h3 className="font-editorial text-2xl font-bold text-[#18181B]">
                  Tag Products & Topics
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowProductTagsModal(false)}
                className="w-9 h-9 rounded-full bg-[#FAF8F5] hover:bg-[#EFEAE1] flex items-center justify-center text-[#71717A] hover:text-[#18181B] transition-all cursor-pointer"
                title="Close slider"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Capsule Tabs: Search Products / Search Tags / Use a Link */}
            <div className="grid grid-cols-3 p-1 rounded-2xl bg-[#F4EFE6] mb-4 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setProductTab("search")}
                className={`py-2 px-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  productTab === "search"
                    ? "bg-[#18181B] text-white shadow-xs"
                    : "text-[#71717A] hover:text-[#18181B]"
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Products</span>
              </button>

              <button
                type="button"
                onClick={() => setProductTab("tags")}
                className={`py-2 px-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  productTab === "tags"
                    ? "bg-[#18181B] text-white shadow-xs"
                    : "text-[#71717A] hover:text-[#18181B]"
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Topics/Tags</span>
              </button>

              <button
                type="button"
                onClick={() => setProductTab("link")}
                className={`py-2 px-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  productTab === "link"
                    ? "bg-[#18181B] text-white shadow-xs"
                    : "text-[#71717A] hover:text-[#18181B]"
                }`}
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>Link URL</span>
              </button>
            </div>

            {/* TAB 1: SEARCH PRODUCTS */}
            {productTab === "search" && (
              <div className="flex-1 flex flex-col min-h-0">
                {/* Search Input Box */}
                <div className="relative mb-3">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
                  <input
                    type="text"
                    placeholder="Search by product name, category..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full h-11 pl-10 pr-9 rounded-2xl border border-black/15 bg-[#FAF8F5] focus:bg-white text-xs text-[#18181B] outline-none focus:border-[#18181B] transition-all shadow-xs"
                  />
                  {productSearch && (
                    <button
                      type="button"
                      onClick={() => setProductSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-[#18181B]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setProductCategoryFilter(cat)}
                      className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        productCategoryFilter === cat
                          ? "bg-[#18181B] text-white"
                          : "bg-[#FAF8F5] hover:bg-[#EFEAE1] text-[#71717A] border border-black/[0.05]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Products List */}
                <div className="space-y-2.5 flex-1 overflow-y-auto pr-1">
                  {SAMPLE_PRODUCTS.filter((p) => {
                    const matchCategory =
                      productCategoryFilter === "All" ||
                      p.category === productCategoryFilter;
                    const matchSearch =
                      !productSearch ||
                      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                      p.category.toLowerCase().includes(productSearch.toLowerCase());
                    return matchCategory && matchSearch;
                  }).map((product) => {
                    const isTagged = createForm.taggedProducts.some(
                      (t) => t.id === product.id
                    );
                    return (
                      <div
                        key={product.id}
                        onClick={() => {
                          if (isTagged) {
                            setCreateForm((prev) => ({
                              ...prev,
                              taggedProducts: prev.taggedProducts.filter(
                                (t) => t.id !== product.id
                              ),
                            }));
                          } else {
                            setCreateForm((prev) => ({
                              ...prev,
                              taggedProducts: [...prev.taggedProducts, product],
                            }));
                            showToast(`Tagged product: ${product.name}`);
                          }
                        }}
                        className={`p-3 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                          isTagged
                            ? "bg-[#ECFDF5] border-[#4DE3A5] shadow-xs"
                            : "bg-[#FAF8F5]/80 hover:bg-white border-black/[0.06] hover:border-black/15 shadow-xs"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#EFEAE1] shrink-0 border border-black/5">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] font-mono uppercase text-[#71717A] block">
                              {product.category}
                            </span>
                            <h5 className="font-semibold text-xs text-[#18181B] truncate">
                              {product.name}
                            </h5>
                            <span className="text-xs font-bold text-[#064E3B]">
                              {product.price}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          className={`text-xs px-3.5 py-1.5 rounded-full font-semibold shrink-0 transition-all ${
                            isTagged
                              ? "bg-[#4DE3A5] text-[#064E3B] shadow-xs"
                              : "bg-[#EFEAE1] hover:bg-[#18181B] hover:text-white text-[#18181B]"
                          }`}
                        >
                          {isTagged ? "✓ Tagged" : "+ Tag"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: SEARCH TAGS & TOPICS */}
            {productTab === "tags" && (
              <div className="flex-1 flex flex-col min-h-0">
                {/* Search & Add Tag input */}
                <div className="relative mb-4">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
                  <input
                    type="text"
                    placeholder="Search or type a new tag name..."
                    value={tagSearchQuery}
                    onChange={(e) => setTagSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && tagSearchQuery.trim()) {
                        e.preventDefault();
                        const newTag = tagSearchQuery.trim().replace(/^#/, "").toLowerCase();
                        if (!createForm.tags.includes(newTag)) {
                          setCreateForm((prev) => ({
                            ...prev,
                            tags: [...prev.tags, newTag],
                          }));
                          showToast(`Added #${newTag}`);
                        }
                        setTagSearchQuery("");
                      }
                    }}
                    className="w-full h-11 pl-10 pr-20 rounded-2xl border border-black/15 bg-[#FAF8F5] focus:bg-white text-xs text-[#18181B] outline-none focus:border-[#18181B] shadow-xs"
                  />
                  {tagSearchQuery.trim() && (
                    <button
                      type="button"
                      onClick={() => {
                        const newTag = tagSearchQuery.trim().replace(/^#/, "").toLowerCase();
                        if (!createForm.tags.includes(newTag)) {
                          setCreateForm((prev) => ({
                            ...prev,
                            tags: [...prev.tags, newTag],
                          }));
                          showToast(`Added #${newTag}`);
                        }
                        setTagSearchQuery("");
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-xl bg-[#18181B] text-white text-[11px] font-semibold cursor-pointer"
                    >
                      + Add
                    </button>
                  )}
                </div>

                {/* Active Tagged Topics */}
                <div className="mb-5">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#71717A] block mb-2">
                    Active Drop Tags ({createForm.tags.length})
                  </span>
                  {createForm.tags.length === 0 ? (
                    <p className="text-xs text-[#A1A1AA] italic">
                      No tags attached yet. Click suggested topics below to tag your Drop.
                    </p>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2">
                      {createForm.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18181B] text-white text-xs font-semibold shadow-xs"
                        >
                          <span>#{tag}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="text-white/70 hover:text-white cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Suggested & Popular Topics */}
                <div className="flex-1 overflow-y-auto pr-1">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#71717A] block mb-2.5">
                    Suggested & Trending Topics
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_TOPIC_TAGS.filter((t) =>
                      !tagSearchQuery || t.toLowerCase().includes(tagSearchQuery.toLowerCase())
                    ).map((t) => {
                      const isSelected = createForm.tags.includes(t);
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              handleRemoveTag(t);
                            } else {
                              setCreateForm((prev) => ({
                                ...prev,
                                tags: [...prev.tags, t],
                              }));
                              showToast(`Added #${t}`);
                            }
                          }}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                            isSelected
                              ? "bg-[#4DE3A5] border-[#4DE3A5] text-[#064E3B] shadow-xs font-bold"
                              : "bg-[#FAF8F5] border-black/[0.08] text-[#18181B] hover:bg-[#EFEAE1]"
                          }`}
                        >
                          <span>#{t}</span>
                          <span>{isSelected ? "✓" : "+"}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: USE A LINK */}
            {productTab === "link" && (
              <div className="space-y-4 flex-1 overflow-y-auto">
                <div>
                  <label className="block text-xs font-semibold text-[#18181B] mb-1.5">
                    Product Web Address / URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://brand.com/products/minimal-chair"
                    value={customProductForm.url || productLink}
                    onChange={(e) => {
                      setProductLink(e.target.value);
                      setCustomProductForm((prev) => ({ ...prev, url: e.target.value }));
                    }}
                    className="w-full h-11 px-3.5 rounded-2xl border border-black/15 bg-[#FAF8F5] focus:bg-white text-xs text-[#18181B] outline-none shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#18181B] mb-1.5">
                    Product Name / Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sculptural Ceramic Vase"
                    value={customProductForm.name}
                    onChange={(e) =>
                      setCustomProductForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full h-11 px-3.5 rounded-2xl border border-black/15 bg-[#FAF8F5] focus:bg-white text-xs text-[#18181B] outline-none shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#18181B] mb-1.5">
                    Price (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. $120.00"
                    value={customProductForm.price}
                    onChange={(e) =>
                      setCustomProductForm((prev) => ({ ...prev, price: e.target.value }))
                    }
                    className="w-full h-11 px-3.5 rounded-2xl border border-black/15 bg-[#FAF8F5] focus:bg-white text-xs text-[#18181B] outline-none shadow-xs"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const url = customProductForm.url || productLink;
                    if (url) {
                      const newProd = {
                        id: `custom-${Date.now()}`,
                        name: customProductForm.name.trim() || "Custom Product Link",
                        category: "Curated",
                        price: customProductForm.price.trim() || "$85.00",
                        image: "/table-main.jpeg",
                        url: url,
                      };
                      setCreateForm((prev) => ({
                        ...prev,
                        taggedProducts: [...prev.taggedProducts, newProd],
                      }));
                      setCustomProductForm({ name: "", price: "", url: "" });
                      setProductLink("");
                      showToast("Custom product tag added ✦");
                      setProductTab("search");
                    } else {
                      showToast("Please provide a valid product URL");
                    }
                  }}
                  className="w-full py-3 rounded-full bg-[#18181B] text-white text-xs font-semibold cursor-pointer hover:bg-black transition-all shadow-md mt-2"
                >
                  Save & Tag Product
                </button>
              </div>
            )}

            {/* Bottom Footer Summary */}
            <div className="pt-4 mt-4 border-t border-black/[0.06] flex items-center justify-between">
              <span className="text-xs text-[#71717A]">
                <strong className="text-[#18181B]">{createForm.taggedProducts.length}</strong> products &middot;{" "}
                <strong className="text-[#18181B]">{createForm.tags.length}</strong> tags selected
              </span>

              <button
                type="button"
                onClick={() => setShowProductTagsModal(false)}
                className="px-6 py-2.5 rounded-full bg-[#18181B] hover:bg-black text-white text-xs font-semibold shadow-xs cursor-pointer transition-all hover:scale-105"
              >
                Done
              </button>
            </div>
          </div>
        </>
      )}

      {/* ================= MODAL: SAVE FROM URL ================= */}
      {showUrlModal && (
        <div
          onClick={() => setShowUrlModal(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-black/10"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-editorial text-xl font-bold text-[#18181B]">
                Save from URL
              </h4>
              <button
                onClick={() => setShowUrlModal(false)}
                className="text-[#71717A] hover:text-[#18181B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[#71717A] mb-4">
              Enter the image link or webpage address to grab high-resolution visuals.
            </p>
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-[#FAF8F5] border border-[#D4CEBF]/80 text-xs text-[#18181B] outline-none mb-4"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowUrlModal(false)}
                className="px-4 py-2 rounded-full text-xs font-semibold text-[#71717A] hover:text-[#18181B]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (urlInput) {
                    setCreateForm((prev) => ({
                      ...prev,
                      mediaPreview: urlInput,
                      mediaUrl: urlInput,
                    }));
                    setShowUrlModal(false);
                    setUrlInput("");
                    showToast("Loaded visual from URL ✦");
                  }
                }}
                className="px-5 py-2 rounded-full bg-[#4DE3A5] text-[#064E3B] text-xs font-semibold shadow-xs"
              >
                Fetch Media
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: POST DETAIL (Free / Marketplace & Related Engine) ================= */}
      <PostDetailModal
        post={selectedPin}
        isOpen={Boolean(selectedPin)}
        onClose={() => setSelectedPin(null)}
        isSaved={Boolean(selectedPin && savedPins[selectedPin.id])}
        onSaveToggle={(pinId, e) => toggleSave(pinId, e)}
        onDeletePost={(deletedId) => {
          setDeletedPinIds((prev) => {
            const next = new Set(prev);
            next.add(deletedId);
            return next;
          });
          setLocalPublishedPins((prev) => prev.filter((p) => p.id !== deletedId));
          setPins((prev) => prev.filter((p) => p.id !== deletedId));
          queryClient.invalidateQueries({ queryKey: ["pins"] });
        }}
        onSelectRelatedPost={(relatedPost) => {
          setSelectedPin({
            ...relatedPost,
            image: relatedPost.previewUrl || relatedPost.image,
            author: relatedPost.creatorName || "Creator",
            avatar: relatedPost.creatorAvatar || "/ceramics.jpeg",
          });
        }}
      />

      {/* ================= TOAST NOTIFICATION ================= */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#18181B] text-white text-xs px-4 py-2.5 rounded-full shadow-2xl border border-white/10 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="w-2 h-2 rounded-full bg-[#4DE3A5]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
