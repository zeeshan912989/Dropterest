"use client";

import React, { useState } from "react";
import { X, Copy, Check, Share2, Mail, Link as LinkIcon, Sparkles } from "lucide-react";

export default function InviteFriendsModal({
  isOpen,
  onClose,
  showToast,
}) {
  const [copied, setCopied] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const inviteLink = "https://dropterest.com/invite/alishah-creative-studio";

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(inviteLink);
    setCopied(true);
    if (showToast) showToast("Invite link copied to clipboard ✦");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendEmailInvite = (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    if (showToast) showToast(`Invitation sent to ${emailInput.trim()} ✦`);
    setEmailInput("");
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-black/10"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-black/[0.06]">
          <div>
            <h3 className="font-editorial text-2xl font-bold text-[#18181B]">
              Invite your friends
            </h3>
            <p className="text-xs text-[#71717A] mt-0.5">
              Connect to chat, collaborate on moodboards, and share Pins.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#F4EFE6] flex items-center justify-center text-[#71717A] hover:text-[#18181B] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shareable Link Box */}
        <div className="py-5 space-y-4">
          <div>
            <label className="block text-[11px] font-mono text-[#71717A] uppercase tracking-wider mb-2">
              Shareable Invite Link
            </label>
            <div className="flex items-center gap-2 p-2 rounded-2xl bg-[#FAF8F5] border border-black/10">
              <LinkIcon className="w-4 h-4 text-[#71717A] ml-2 shrink-0" />
              <input
                type="text"
                readOnly
                value={inviteLink}
                className="bg-transparent text-xs text-[#18181B] flex-1 outline-none font-mono truncate"
              />
              <button
                onClick={handleCopy}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  copied
                    ? "bg-[#18181B] text-white"
                    : "bg-[#E60023] hover:bg-[#CC001F] text-white shadow-xs"
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Email Invite Form */}
          <form onSubmit={handleSendEmailInvite} className="space-y-2">
            <label className="block text-[11px] font-mono text-[#71717A] uppercase tracking-wider">
              Or Invite by Email
            </label>
            <div className="flex items-center gap-2">
              <input
                type="email"
                placeholder="friend@example.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="flex-1 h-11 px-4 rounded-2xl bg-[#FAF8F5] border border-black/10 focus:border-[#18181B] text-xs text-[#18181B] outline-none"
              />
              <button
                type="submit"
                disabled={!emailInput.trim()}
                className="px-5 h-11 rounded-2xl bg-[#18181B] hover:bg-black text-white text-xs font-semibold disabled:opacity-40 cursor-pointer transition-all"
              >
                Send Invite
              </button>
            </div>
          </form>

          {/* Social Share Badges */}
          <div className="pt-2">
            <span className="text-[11px] font-mono text-[#71717A] uppercase tracking-wider block mb-2.5">
              Share to other apps
            </span>
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
              <button
                onClick={() => {
                  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent("Join me on Dropterest: " + inviteLink)}`, "_blank");
                }}
                className="py-2.5 px-3 rounded-2xl bg-[#25D366]/10 text-[#075E54] hover:bg-[#25D366]/20 transition-all border border-[#25D366]/20"
              >
                WhatsApp
              </button>
              <button
                onClick={() => {
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent("Join my curated inspiration circles on Dropterest! " + inviteLink)}`, "_blank");
                }}
                className="py-2.5 px-3 rounded-2xl bg-black/5 text-[#18181B] hover:bg-black/10 transition-all border border-black/10"
              >
                X / Twitter
              </button>
              <button
                onClick={() => {
                  window.open(`mailto:?subject=Join me on Dropterest&body=${encodeURIComponent("Hey! Check out my moodboards on Dropterest: " + inviteLink)}`, "_blank");
                }}
                className="py-2.5 px-3 rounded-2xl bg-[#3B82F6]/10 text-[#1D4ED8] hover:bg-[#3B82F6]/20 transition-all border border-[#3B82F6]/20"
              >
                Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
