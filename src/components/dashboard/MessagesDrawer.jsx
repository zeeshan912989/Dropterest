"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { X, PenSquare, UserPlus, Send, MessageCircle } from "lucide-react";

export default function MessagesDrawer({
  isOpen,
  onClose,
  onOpenNewMessage,
  onOpenInviteFriends,
  chats = [],
  onSelectChat,
}) {
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
            key="messages-drawer-panel"
            initial={{ x: -380, opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -380, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            className="fixed left-16 sm:left-20 top-0 bottom-0 w-80 sm:w-[380px] bg-white border-r border-black/[0.08] shadow-[12px_0_35px_rgba(0,0,0,0.07)] z-35 flex flex-col select-none"
          >
        {/* Panel Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-black/[0.05]">
          <h2 className="font-sans text-2xl font-bold text-[#18181B] tracking-tight">
            Messages
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-[#F4EFE6] flex items-center justify-center text-[#71717A] hover:text-[#18181B] transition-colors cursor-pointer"
            title="Close messages"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Buttons matching Screenshot 2 */}
        <div className="px-6 py-4 space-y-3 border-b border-black/[0.04]">
          {/* Action 1: New message (Red circle with pencil) */}
          <button
            onClick={onOpenNewMessage}
            className="w-full flex items-center gap-4 p-2 rounded-2xl hover:bg-[#FAF8F5] transition-colors text-left group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-[#E60023] group-hover:bg-[#CC001F] text-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 shrink-0">
              <PenSquare className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#18181B] group-hover:text-[#E60023] transition-colors">
                New message
              </h3>
            </div>
          </button>

          {/* Action 2: Invite your friends (Grey circle with user plus) */}
          <button
            onClick={onOpenInviteFriends}
            className="w-full flex items-center gap-4 p-2 rounded-2xl hover:bg-[#FAF8F5] transition-colors text-left group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-[#E4E4E7] group-hover:bg-[#D4D4D8] text-[#18181B] flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 shrink-0">
              <UserPlus className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#18181B]">
                Invite your friends
              </h3>
              <p className="text-xs text-[#71717A] mt-0.5">
                Connect to start chatting
              </p>
            </div>
          </button>
        </div>

        {/* Main Content / Empty state matching Screenshot 2 */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-center items-center">
          {chats.length === 0 ? (
            /* Screenshot 2 Match: Empty state with Message-in-a-bottle illustration */
            <div className="flex flex-col items-center text-center max-w-[300px] my-auto">
              {/* Custom Message in a bottle illustration matching Screenshot 2 */}
              <div className="relative w-44 h-44 flex items-center justify-center">
                {/* Soft pastel baby-blue circular background */}
                <div className="absolute inset-2 rounded-full bg-[#E0F2FE] shadow-inner" />

                {/* SVG Artwork: Glass Bottle with Red Stopper & Letter Scroll */}
                <svg
                  viewBox="0 0 200 200"
                  className="w-40 h-40 relative z-10 drop-shadow-md"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    {/* Bottle Glass Gradient */}
                    <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
                      <stop offset="40%" stopColor="#BAE6FD" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#7DD3FC" stopOpacity="0.3" />
                    </linearGradient>

                    {/* Paper Note Gradient */}
                    <linearGradient id="paperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1E3A8A" />
                      <stop offset="70%" stopColor="#0284C7" />
                      <stop offset="100%" stopColor="#38BDF8" />
                    </linearGradient>

                    {/* Pink Ribbon Glow */}
                    <linearGradient id="pinkRibbon" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FDA4AF" />
                      <stop offset="100%" stopColor="#F43F5E" />
                    </linearGradient>
                  </defs>

                  {/* Bottle Outline & Body (diagonal glass bottle) */}
                  <g transform="rotate(-32 100 100)">
                    {/* Bottle Neck */}
                    <rect
                      x="90"
                      y="16"
                      width="20"
                      height="26"
                      rx="3"
                      fill="url(#glassGrad)"
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                    />
                    {/* Bottle Lip */}
                    <rect
                      x="86"
                      y="14"
                      width="28"
                      height="7"
                      rx="3.5"
                      fill="#FFFFFF"
                    />

                    {/* Red Cork Stopper */}
                    <polygon
                      points="89,16 111,16 107,2 93,2"
                      fill="#DC2626"
                      stroke="#B91C1C"
                      strokeWidth="1.5"
                    />

                    {/* Main Bottle Glass Body */}
                    <path
                      d="M 90 42 C 80 50, 52 75, 52 110 C 52 155, 75 178, 100 178 C 125 178, 148 155, 148 110 C 148 75, 120 50, 110 42 Z"
                      fill="url(#glassGrad)"
                      stroke="#FFFFFF"
                      strokeWidth="3.5"
                    />

                    {/* Glass Reflection Highlight */}
                    <path
                      d="M 64 95 C 64 80, 75 65, 88 54"
                      stroke="#FFFFFF"
                      strokeWidth="4"
                      strokeLinecap="round"
                      fill="none"
                      opacity="0.8"
                    />
                    <path
                      d="M 62 115 C 62 145, 80 165, 100 165"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      fill="none"
                      opacity="0.6"
                    />

                    {/* Paper Scroll Inside Bottle */}
                    <path
                      d="M 72 85 L 122 118 L 105 145 L 60 115 Z"
                      fill="url(#paperGrad)"
                      rx="4"
                      opacity="0.95"
                    />

                    {/* Pink Ribbon & Spiral Accent */}
                    <path
                      d="M 60 118 C 75 125, 110 120, 125 130"
                      stroke="url(#pinkRibbon)"
                      strokeWidth="12"
                      strokeLinecap="round"
                      opacity="0.35"
                    />
                    {/* Whimsical Spiral */}
                    <path
                      d="M 115 125 Q 128 128 126 138 Q 124 144 116 142 Q 112 140 114 135"
                      stroke="#F43F5E"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                    />

                    {/* Red Navigation Arrow / Paper Airplane in Scroll */}
                    <polygon
                      points="102,110 126,128 100,128 108,120"
                      fill="#DC2626"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />
                  </g>
                </svg>
              </div>

              {/* Title & Subtext matching Screenshot 2 */}
              <h3 className="font-sans font-bold text-xl sm:text-2xl text-[#18181B] tracking-tight mt-6 leading-snug">
                Start a conversation
              </h3>

              <p className="text-xs sm:text-sm text-[#52525B] leading-relaxed mt-2.5">
                Use messages to chat with friends, share Pins and boards, and plan ideas together. Your conversations will appear here.
              </p>

              {/* Action Button */}
              <button
                onClick={onOpenNewMessage}
                className="mt-6 px-6 py-2.5 rounded-full bg-[#E60023] hover:bg-[#CC001F] text-white text-xs font-semibold shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
              >
                <PenSquare className="w-3.5 h-3.5" />
                <span>Write a Message</span>
              </button>
            </div>
          ) : (
            /* Active Conversations List */
            <div className="w-full space-y-2">
              <span className="text-xs font-semibold text-[#71717A] uppercase font-mono tracking-wider block mb-2">
                Recent Conversations
              </span>
              {chats.map((c) => (
                <div
                  key={c.id}
                  onClick={() => onSelectChat && onSelectChat(c)}
                  className="p-3 rounded-2xl hover:bg-[#FAF8F5] border border-black/[0.04] transition-all flex items-center justify-between gap-3 cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-11 h-11 rounded-full overflow-hidden border border-black/10 shrink-0">
                      <Image src={c.avatar} alt={c.name} fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#18181B] group-hover:text-[#E60023] transition-colors">
                        {c.name}
                      </h4>
                      <p className="text-xs text-[#71717A] truncate max-w-[180px]">
                        {c.lastMessage}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#A1A1AA] shrink-0 font-mono">
                    {c.time}
                  </span>
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
