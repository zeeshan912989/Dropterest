"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, User, Bell, Shield, Sliders, LogOut, Check } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

export default function SettingsModal({
  isOpen,
  onClose,
  showToast,
}) {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile"); // "profile", "notifications", "privacy"
  const [name, setName] = useState(user?.name || "Ali shah");
  const [bio, setBio] = useState("Curator of spatial aesthetics, minimal objects, and architectural crafts.");
  const [website, setWebsite] = useState("https://alishah.design");
  const [notifSaves, setNotifSaves] = useState(true);
  const [notifMessages, setNotifMessages] = useState(true);
  const [notifMentions, setNotifMentions] = useState(true);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (showToast) showToast("Settings updated successfully ✦");
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-black/10 flex flex-col md:flex-row max-h-[85vh]"
      >
        {/* Left Navigation in Modal */}
        <div className="w-full md:w-56 bg-[#FAF8F5] p-6 border-r border-black/[0.06] flex flex-col justify-between">
          <div>
            <h3 className="font-editorial text-2xl font-bold text-[#18181B] mb-6">
              Settings
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all flex items-center gap-2.5 ${
                  activeTab === "profile"
                    ? "bg-[#18181B] text-white shadow-xs"
                    : "text-[#71717A] hover:bg-[#EFEAE1] hover:text-[#18181B]"
                }`}
              >
                <User className="w-4 h-4" />
                <span>Public profile</span>
              </button>

              <button
                onClick={() => setActiveTab("notifications")}
                className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all flex items-center gap-2.5 ${
                  activeTab === "notifications"
                    ? "bg-[#18181B] text-white shadow-xs"
                    : "text-[#71717A] hover:bg-[#EFEAE1] hover:text-[#18181B]"
                }`}
              >
                <Bell className="w-4 h-4" />
                <span>Notifications</span>
              </button>

              <button
                onClick={() => setActiveTab("privacy")}
                className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all flex items-center gap-2.5 ${
                  activeTab === "privacy"
                    ? "bg-[#18181B] text-white shadow-xs"
                    : "text-[#71717A] hover:bg-[#EFEAE1] hover:text-[#18181B]"
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Privacy & Data</span>
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-black/[0.06] mt-6">
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full px-3 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </button>
          </div>
        </div>

        {/* Right Tab Content */}
        <div className="flex-1 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-black/[0.06] mb-6">
              <h4 className="font-bold text-lg text-[#18181B] capitalize">
                {activeTab === "profile" && "Public Profile"}
                {activeTab === "notifications" && "Notification Preferences"}
                {activeTab === "privacy" && "Privacy & Account"}
              </h4>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full hover:bg-[#FAF8F5] flex items-center justify-center text-[#71717A] hover:text-[#18181B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {activeTab === "profile" && (
              <form onSubmit={handleSave} className="space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-[#6366F1] text-white flex items-center justify-center font-bold text-xl shadow-md">
                    {name ? name[0].toUpperCase() : "A"}
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => showToast("Photo change dialog opened")}
                      className="px-4 py-2 rounded-full bg-[#FAF8F5] hover:bg-[#EFEAE1] text-xs font-semibold text-[#18181B] border border-black/10 transition-all cursor-pointer"
                    >
                      Change photo
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#71717A] uppercase tracking-wider mb-1.5">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-11 px-4 rounded-2xl bg-[#FAF8F5] border border-black/10 focus:border-[#18181B] text-xs text-[#18181B] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#71717A] uppercase tracking-wider mb-1.5">
                    About / Bio
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-[#FAF8F5] border border-black/10 focus:border-[#18181B] text-xs text-[#18181B] outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#71717A] uppercase tracking-wider mb-1.5">
                    Website link
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full h-11 px-4 rounded-2xl bg-[#FAF8F5] border border-black/10 focus:border-[#18181B] text-xs text-[#18181B] outline-none"
                  />
                </div>
              </form>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF8F5] border border-black/[0.04]">
                  <div>
                    <h5 className="font-bold text-xs text-[#18181B]">Activity on your Pins</h5>
                    <p className="text-[11px] text-[#71717A]">Get notified when people save or like your Pins</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifSaves}
                    onChange={(e) => setNotifSaves(e.target.checked)}
                    className="w-4 h-4 accent-[#18181B] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF8F5] border border-black/[0.04]">
                  <div>
                    <h5 className="font-bold text-xs text-[#18181B]">Direct Messages</h5>
                    <p className="text-[11px] text-[#71717A]">Get notified when friends send new messages or share ideas</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifMessages}
                    onChange={(e) => setNotifMessages(e.target.checked)}
                    className="w-4 h-4 accent-[#18181B] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF8F5] border border-black/[0.04]">
                  <div>
                    <h5 className="font-bold text-xs text-[#18181B]">Mentions & Tags</h5>
                    <p className="text-[11px] text-[#71717A]">Notify when someone tags you in collages or comments</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifMentions}
                    onChange={(e) => setNotifMentions(e.target.checked)}
                    className="w-4 h-4 accent-[#18181B] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {activeTab === "privacy" && (
              <div className="space-y-4 text-xs text-[#52525B]">
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-black/[0.04]">
                  <h5 className="font-bold text-xs text-[#18181B] mb-1">Search Privacy</h5>
                  <p className="text-[11px] text-[#71717A] leading-relaxed">
                    Hide your profile and private moodboards from external web search engines like Google and Bing.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-black/[0.04]">
                  <h5 className="font-bold text-xs text-[#18181B] mb-1">Personalized Recommendations</h5>
                  <p className="text-[11px] text-[#71717A] leading-relaxed">
                    We use your saved visual pins and boards to suggest trending aesthetic ideas tailored for your craft.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-6 mt-6 border-t border-black/[0.06] flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-semibold text-[#71717A] hover:text-[#18181B]"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-full bg-[#18181B] hover:bg-black text-white text-xs font-semibold shadow-md transition-all hover:scale-105 cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
