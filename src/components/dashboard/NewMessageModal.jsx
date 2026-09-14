"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Search, Send, Check, Sparkles, Pin as PinIcon } from "lucide-react";

const SUGGESTED_FRIENDS = [
  { id: "u-1", name: "Elena Rostova", handle: "@rostova_design", avatar: "/ceramics.jpeg", mutuals: "Architect & Spatial Designer" },
  { id: "u-2", name: "Studio Kanso", handle: "@studio_kanso", avatar: "/interior-wood.jpeg", mutuals: "Ceramicist & Material Studio" },
  { id: "u-3", name: "Marcus Lind", handle: "@marcuslind", avatar: "/table-main.jpeg", mutuals: "Nordic Furniture Craft" },
  { id: "u-4", name: "Clara Chen", handle: "@clarachen", avatar: "/desk-setup.jpeg", mutuals: "Editorial & Interior Stylist" },
  { id: "u-5", name: "Solstice Studio", handle: "@solstice", avatar: "/travel-cove.jpeg", mutuals: "Nature & Visual Researcher" },
];

export default function NewMessageModal({
  isOpen,
  onClose,
  onSendMessage,
}) {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageText, setMessageText] = useState("");

  if (!isOpen) return null;

  const filteredUsers = SUGGESTED_FRIENDS.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.handle.toLowerCase().includes(search.toLowerCase())
  );

  const handleSend = (e) => {
    e.preventDefault();
    if (!selectedUser || !messageText.trim()) return;

    onSendMessage({
      id: `chat-${Date.now()}`,
      userId: selectedUser.id,
      name: selectedUser.name,
      avatar: selectedUser.avatar,
      lastMessage: messageText.trim(),
      time: "Just now",
      messages: [
        { id: `msg-${Date.now()}`, sender: "me", text: messageText.trim(), time: "Just now" },
      ],
    });

    setMessageText("");
    setSelectedUser(null);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-black/10 flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-black/[0.06]">
          <h3 className="font-editorial text-2xl font-bold text-[#18181B]">
            New message
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#F4EFE6] flex items-center justify-center text-[#71717A] hover:text-[#18181B] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected User capsule or Search Box */}
        <div className="py-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email"
              className="w-full h-11 pl-10 pr-4 rounded-2xl bg-[#FAF8F5] border border-black/10 focus:border-[#18181B] text-xs sm:text-sm text-[#18181B] outline-none transition-all"
            />
          </div>
        </div>

        {/* User Selection List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[160px] max-h-[220px]">
          <span className="text-[11px] font-mono text-[#71717A] uppercase tracking-wider block mb-1">
            Suggested Friends & Curators
          </span>

          {filteredUsers.map((u) => {
            const isSelected = selectedUser?.id === u.id;
            return (
              <div
                key={u.id}
                onClick={() => setSelectedUser(u)}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                  isSelected
                    ? "bg-[#FAF8F5] border-[#18181B] shadow-xs"
                    : "bg-white border-black/[0.05] hover:bg-[#FAF8F5]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-black/10 shrink-0">
                    <Image src={u.avatar} alt={u.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#18181B]">{u.name}</h4>
                    <p className="text-[11px] text-[#71717A]">{u.handle} &middot; {u.mutuals}</p>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                    isSelected
                      ? "bg-[#E60023] border-[#E60023] text-white"
                      : "border-[#D4CEBF] bg-white"
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Message Input and Send */}
        <form onSubmit={handleSend} className="pt-4 mt-2 border-t border-black/[0.06] space-y-3">
          <div className="relative">
            <textarea
              rows={2}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder={
                selectedUser
                  ? `Write a message to ${selectedUser.name}...`
                  : "Select someone above to send a message..."
              }
              disabled={!selectedUser}
              className="w-full p-3.5 rounded-2xl bg-[#FAF8F5] border border-black/10 focus:border-[#18181B] text-xs sm:text-sm text-[#18181B] outline-none disabled:opacity-50 resize-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-[#71717A]">
              {selectedUser ? (
                <>Chatting with <strong className="text-[#18181B]">{selectedUser.name}</strong></>
              ) : (
                "Choose a recipient"
              )}
            </span>

            <button
              type="submit"
              disabled={!selectedUser || !messageText.trim()}
              className="px-6 py-2.5 rounded-full bg-[#E60023] hover:bg-[#CC001F] text-white text-xs font-semibold shadow-md disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
