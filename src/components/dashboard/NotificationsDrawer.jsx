"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { X, Bell, Sparkles, CheckCheck, Compass, Heart, Bookmark, UserCheck } from "lucide-react";

export default function NotificationsDrawer({
  isOpen,
  onClose,
  onExploreFeed,
  onOpenPin,
}) {
  const [activeTab, setActiveTab] = useState("updates"); // "updates", "all"
  const [showSampleNotifications, setShowSampleNotifications] = useState(false);

  const sampleNotifications = [
    {
      id: "notif-1",
      user: "Elena Rostova",
      avatar: "/ceramics.jpeg",
      action: "saved your Pin to",
      target: "Brutalist Architecture",
      time: "2h ago",
      pinImage: "/architecture-pavilion.jpeg",
      unread: true,
    },
    {
      id: "notif-2",
      user: "Studio Kanso",
      avatar: "/interior-wood.jpeg",
      action: "liked your Pin",
      target: "Handcrafted Stoneware Vessels",
      time: "5h ago",
      pinImage: "/ceramics.jpeg",
      unread: true,
    },
    {
      id: "notif-3",
      user: "Marcus Lind",
      avatar: "/table-main.jpeg",
      action: "started following you",
      target: "",
      time: "1d ago",
      unread: false,
    },
    {
      id: "notif-4",
      user: "Dropterest Curator",
      avatar: "/architecture-modern.jpeg",
      action: "Your Pin is trending in",
      target: "Modern Minimalist",
      time: "2d ago",
      pinImage: "/table-main.jpeg",
      unread: false,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop on mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-30 lg:hidden"
          />

          {/* Slide-out Panel */}
          <motion.aside
            key="notifications-drawer-panel"
            initial={{ x: -380, opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -380, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            className="fixed left-16 sm:left-20 top-0 bottom-0 w-80 sm:w-[380px] bg-white border-r border-black/[0.08] shadow-[12px_0_35px_rgba(0,0,0,0.07)] z-35 flex flex-col select-none"
          >
        {/* Panel Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-black/[0.05]">
          <h2 className="font-sans text-2xl font-bold text-[#18181B] tracking-tight">
            Notifications
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-[#F4EFE6] flex items-center justify-center text-[#71717A] hover:text-[#18181B] transition-colors cursor-pointer"
            title="Close notifications"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-6 pt-3 pb-2 flex items-center justify-between border-b border-black/[0.04]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("updates")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "updates"
                  ? "bg-[#18181B] text-white"
                  : "bg-transparent text-[#71717A] hover:bg-[#F4EFE6]"
              }`}
            >
              Updates
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "all"
                  ? "bg-[#18181B] text-white"
                  : "bg-transparent text-[#71717A] hover:bg-[#F4EFE6]"
              }`}
            >
              Activity
            </button>
          </div>

          <button
            onClick={() => setShowSampleNotifications(!showSampleNotifications)}
            className="text-[11px] font-mono text-[#71717A] hover:text-[#18181B] underline cursor-pointer"
          >
            {showSampleNotifications ? "Empty view" : "Sample feed"}
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-center items-center">
          {!showSampleNotifications ? (
            /* Screenshot 1 Match: Empty state with retro sunglasses illustration */
            <div className="flex flex-col items-center text-center max-w-[300px] my-auto">
              {/* Custom Retro Sunglasses Illustration matching Screenshot 1 */}
              <div className="relative w-44 h-44 flex items-center justify-center">
                {/* Soft pastel pink circular background */}
                <div className="absolute inset-2 rounded-full bg-[#FCE7F3] shadow-inner" />

                {/* SVG Artwork: Sunglasses with orange/red frame and sunset gradient lenses */}
                <svg
                  viewBox="0 0 200 160"
                  className="w-40 h-32 relative z-10 drop-shadow-md"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    {/* Frame Gradient */}
                    <linearGradient id="frameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FB923C" />
                      <stop offset="50%" stopColor="#F97316" />
                      <stop offset="100%" stopColor="#DC2626" />
                    </linearGradient>

                    {/* Lens Sunset Gradient */}
                    <linearGradient id="lensSunset" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3B0764" />
                      <stop offset="45%" stopColor="#701A75" />
                      <stop offset="75%" stopColor="#BE185D" />
                      <stop offset="100%" stopColor="#FB7185" />
                    </linearGradient>

                    {/* Bridge Gradient */}
                    <linearGradient id="bridgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#EA580C" />
                      <stop offset="100%" stopColor="#DC2626" />
                    </linearGradient>
                  </defs>

                  {/* Sunglasses Arms / Temples behind */}
                  <path
                    d="M38 65 Q 60 25 105 32 Q 130 35 160 65"
                    stroke="#F97316"
                    strokeWidth="12"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.85"
                  />
                  <path
                    d="M48 60 Q 65 30 110 36"
                    stroke="#F43F5E"
                    strokeWidth="7"
                    strokeLinecap="round"
                    fill="none"
                  />

                  {/* Left Outer Frame (Hexagonal rounded) */}
                  <path
                    d="M 22 55 L 42 35 L 82 35 L 94 58 L 84 92 L 40 92 Z"
                    fill="url(#frameGrad)"
                    stroke="#B91C1C"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />

                  {/* Left Lens */}
                  <path
                    d="M 28 55 L 44 41 L 78 41 L 87 58 L 79 86 L 43 86 Z"
                    fill="url(#lensSunset)"
                  />
                  {/* Left Lens Mountain/Cloud Silhouette */}
                  <path
                    d="M 28 68 Q 42 60 58 66 Q 74 62 87 69 L 87 86 L 43 86 L 28 86 Z"
                    fill="#4A044E"
                    opacity="0.8"
                  />
                  {/* Left Lens Reflection & Sunlight Highlight */}
                  <path
                    d="M 34 82 L 72 82"
                    stroke="#FDE047"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    opacity="0.9"
                  />
                  <path
                    d="M 38 78 L 60 78"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.75"
                  />

                  {/* Right Outer Frame (Hexagonal rounded) */}
                  <path
                    d="M 106 58 L 118 35 L 158 35 L 178 55 L 160 92 L 116 92 Z"
                    fill="url(#frameGrad)"
                    stroke="#B91C1C"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />

                  {/* Right Lens */}
                  <path
                    d="M 113 58 L 122 41 L 156 41 L 172 55 L 157 86 L 121 86 Z"
                    fill="url(#lensSunset)"
                  />
                  {/* Right Lens Mountain Silhouette */}
                  <path
                    d="M 113 69 Q 128 62 144 66 Q 160 60 172 68 L 172 86 L 157 86 L 121 86 Z"
                    fill="#4A044E"
                    opacity="0.8"
                  />
                  {/* Right Lens Sunset Sun dot and reflection */}
                  <circle cx="160" cy="50" r="4.5" fill="#FACC15" />
                  <path
                    d="M 128 82 L 164 82"
                    stroke="#FDE047"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    opacity="0.9"
                  />
                  <path
                    d="M 136 78 L 158 78"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.75"
                  />

                  {/* Nose Bridge */}
                  <path
                    d="M 88 50 Q 100 44 112 50"
                    stroke="url(#bridgeGrad)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M 91 50 Q 100 46 109 50"
                    stroke="#FEF08A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.6"
                  />
                </svg>
              </div>

              {/* Title & Subtext matching Screenshot 1 */}
              <h3 className="font-sans font-bold text-xl sm:text-2xl text-[#18181B] tracking-tight mt-6 leading-snug">
                Updates are on their way
              </h3>

              <p className="text-xs sm:text-sm text-[#52525B] leading-relaxed mt-2.5">
                Use updates to see activity on your Pins and boards and get tips on topics to explore. They’ll be here soon.
              </p>

              {/* Quick Action Button */}
              <button
                onClick={() => {
                  onClose();
                  if (onExploreFeed) onExploreFeed();
                }}
                className="mt-6 px-6 py-2.5 rounded-full bg-[#18181B] hover:bg-black text-white text-xs font-semibold shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Explore Trending Ideas</span>
              </button>
            </div>
          ) : (
            /* Interactive Notifications List */
            <div className="w-full space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#71717A] uppercase font-mono tracking-wider">
                  Recent Activity
                </span>
                <button
                  onClick={() => setShowSampleNotifications(false)}
                  className="text-xs text-[#064E3B] font-semibold hover:underline"
                >
                  Clear
                </button>
              </div>

              {sampleNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    if (n.pinImage && onOpenPin) {
                      onOpenPin({
                        id: n.id,
                        title: n.target || "Curated Design Pin",
                        image: n.pinImage,
                        author: n.user,
                        category: "Architecture",
                        aspect: "aspect-[3/4]",
                        saves: 42,
                        likes: 120,
                        avatar: n.avatar,
                      });
                    }
                  }}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    n.unread
                      ? "bg-[#FAF8F5] border-[#4DE3A5]/40 shadow-xs"
                      : "bg-white border-black/[0.05] hover:bg-[#FAF8F5]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-black/10 shrink-0">
                      <Image src={n.avatar} alt={n.user} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="text-xs text-[#18181B] leading-tight">
                        <strong className="font-semibold">{n.user}</strong> {n.action}{" "}
                        {n.target && <span className="font-medium text-[#18181B]">“{n.target}”</span>}
                      </p>
                      <span className="text-[10px] text-[#A1A1AA] mt-0.5 block">{n.time}</span>
                    </div>
                  </div>

                  {n.pinImage && (
                    <div className="relative w-10 h-12 rounded-lg overflow-hidden border border-black/10 shrink-0 bg-[#EFEAE1]">
                      <Image src={n.pinImage} alt="Pin" fill className="object-cover" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.aside>
    </>
  )}
</AnimatePresence>
  );
}
