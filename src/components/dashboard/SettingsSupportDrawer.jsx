"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { X, ExternalLink, Settings, Sparkles, Shield, Monitor, HelpCircle, FileText, Check } from "lucide-react";

export default function SettingsSupportDrawer({
  isOpen,
  onClose,
  onOpenSettingsModal,
  showToast,
}) {
  const handleAction = (label) => {
    if (showToast) showToast(`Opened: ${label} ✦`);
  };

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

          {/* Slide-out Panel matching Screenshot */}
          <motion.aside
            key="settings-drawer-panel"
            initial={{ x: -360, opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -360, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            className="fixed left-16 sm:left-20 top-0 bottom-0 w-80 sm:w-[360px] bg-white border-r border-black/[0.08] shadow-[12px_0_35px_rgba(0,0,0,0.07)] z-35 flex flex-col select-none"
          >
        {/* Panel Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-black/[0.05]">
          <h2 className="font-sans text-2xl font-bold text-[#18181B] tracking-tight">
            Settings &amp; Support
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-[#F4EFE6] flex items-center justify-center text-[#71717A] hover:text-[#18181B] transition-colors cursor-pointer"
            title="Close Settings &amp; Support"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Menu Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-1">
          {/* Main Items */}
          <Link
            href="/settings"
            onClick={onClose}
            className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-[#F4EFE6] text-sm font-semibold text-[#18181B] transition-colors cursor-pointer flex items-center justify-between group"
          >
            <span>Settings</span>
          </Link>

          <button
            onClick={() => handleAction("Refine your recommendations")}
            className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-[#F4EFE6] text-sm font-semibold text-[#18181B] transition-colors cursor-pointer flex items-center justify-between"
          >
            <span>Refine your recommendations</span>
          </button>

          <button
            onClick={() => handleAction("Link to Dropterest")}
            className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-[#F4EFE6] text-sm font-semibold text-[#18181B] transition-colors cursor-pointer flex items-center justify-between"
          >
            <span>Link to Dropterest</span>
          </button>

          <button
            onClick={() => handleAction("Reports and violations center")}
            className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-[#F4EFE6] text-sm font-semibold text-[#18181B] transition-colors cursor-pointer flex items-center justify-between"
          >
            <span>Reports and violations center</span>
          </button>

          <button
            onClick={() => handleAction("Install the Windows app")}
            className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-[#F4EFE6] text-sm font-semibold text-[#18181B] transition-colors cursor-pointer flex items-center justify-between"
          >
            <span>Install the Windows app</span>
          </button>

          <button
            onClick={() => handleAction("Beta Tester Portal")}
            className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-[#F4EFE6] text-sm font-semibold text-[#18181B] transition-colors cursor-pointer flex items-center justify-between"
          >
            <span>Be a beta tester</span>
            <ExternalLink className="w-4 h-4 text-[#71717A]" />
          </button>

          {/* Section: Support */}
          <div className="pt-4 pb-1">
            <span className="text-[11px] font-semibold text-[#71717A] tracking-wider block px-3 mb-1">
              Support
            </span>

            <button
              onClick={() => handleAction("Help Center")}
              className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-[#F4EFE6] text-sm font-semibold text-[#18181B] transition-colors cursor-pointer flex items-center justify-between"
            >
              <span>Help center</span>
              <ExternalLink className="w-4 h-4 text-[#71717A]" />
            </button>

            <button
              onClick={() => handleAction("Create Widget")}
              className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-[#F4EFE6] text-sm font-semibold text-[#18181B] transition-colors cursor-pointer flex items-center justify-between"
            >
              <span>Create widget</span>
              <ExternalLink className="w-4 h-4 text-[#71717A]" />
            </button>

            <button
              onClick={() => handleAction("Content Removals")}
              className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-[#F4EFE6] text-sm font-semibold text-[#18181B] transition-colors cursor-pointer flex items-center justify-between"
            >
              <span>Removals</span>
              <ExternalLink className="w-4 h-4 text-[#71717A]" />
            </button>

            <button
              onClick={() => handleAction("Personalized Ads Preferences")}
              className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-[#F4EFE6] text-sm font-semibold text-[#18181B] transition-colors cursor-pointer flex items-center justify-between"
            >
              <span>Personalized Ads</span>
              <ExternalLink className="w-4 h-4 text-[#71717A]" />
            </button>

            <button
              onClick={() => handleAction("Your Privacy Rights")}
              className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-[#F4EFE6] text-sm font-semibold text-[#18181B] transition-colors cursor-pointer flex items-center justify-between"
            >
              <span>Your privacy rights</span>
            </button>

            <button
              onClick={() => handleAction("Privacy Policy")}
              className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-[#F4EFE6] text-sm font-semibold text-[#18181B] transition-colors cursor-pointer flex items-center justify-between"
            >
              <span>Privacy policy</span>
              <ExternalLink className="w-4 h-4 text-[#71717A]" />
            </button>

            <button
              onClick={() => handleAction("Terms of Service")}
              className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-[#F4EFE6] text-sm font-semibold text-[#18181B] transition-colors cursor-pointer flex items-center justify-between"
            >
              <span>Terms of service</span>
              <ExternalLink className="w-4 h-4 text-[#71717A]" />
            </button>
          </div>

          {/* Section: Resources */}
          <div className="pt-4 pb-4 px-3 border-t border-black/[0.04]">
            <span className="text-[11px] font-semibold text-[#71717A] tracking-wider block mb-2">
              Resources
            </span>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm font-semibold text-[#2563EB]">
              <button onClick={() => handleAction("About")} className="hover:underline cursor-pointer">
                About
              </button>
              <button onClick={() => handleAction("Blog")} className="hover:underline cursor-pointer">
                Blog
              </button>
              <button onClick={() => handleAction("Businesses")} className="hover:underline cursor-pointer">
                Businesses
              </button>
              <button onClick={() => handleAction("Careers")} className="hover:underline cursor-pointer">
                Careers
              </button>
              <button onClick={() => handleAction("Developers")} className="hover:underline cursor-pointer">
                Developers
              </button>
            </div>
          </div>

          {/* Section: Log out */}
          <div className="pt-4 pb-6 px-3 border-t border-black/[0.04]">
            <button
              onClick={async () => {
                const { signOut } = await import("@/lib/auth/auth-client");
                await signOut();
                window.location.href = "/login";
              }}
              className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-red-50 text-sm font-semibold text-red-600 transition-colors cursor-pointer flex items-center justify-between"
            >
              <span>Log out</span>
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  )}
</AnimatePresence>
  );
}
