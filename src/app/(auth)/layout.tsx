import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Toaster } from "sonner";
import { Sparkles, ArrowLeft, Layers, ShieldCheck, Heart } from "lucide-react";

export const metadata = {
  title: "Authentication — Dropterest",
  description: "Secure authentication and member access for Dropterest.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] text-[#18181B] flex flex-col lg:flex-row selection:bg-[#4DE3A5]/40 selection:text-[#064E3B]">
      {/* ======================================================== */}
      {/* LEFT PANEL: Editorial Visual Hero (Sticky Full Screen)   */}
      {/* ======================================================== */}
      <aside className="hidden lg:flex lg:w-1/2 xl:w-[48%] sticky top-0 h-screen flex-col justify-between p-10 xl:p-14 overflow-hidden bg-[#09090B] text-white shrink-0">
        {/* Editorial Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/architecture-modern.jpeg"
            alt="Dropterest Architecture"
            fill
            priority
            className="object-cover object-center opacity-40 filter saturate-125"
          />
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/60 to-[#09090B]/40" />
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#4DE3A5]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#E60023]/15 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Top: Brand Header */}
        <div className="relative z-10 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 group transition-transform duration-300 hover:scale-[1.02]"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#E60023] text-white flex items-center justify-center font-editorial text-2xl font-bold shadow-lg shadow-[#E60023]/25 border border-white/15">
              <span>D</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#4DE3A5] ml-0.5" />
            </div>
            <span className="font-editorial text-2xl font-bold tracking-tight text-white drop-shadow-sm">
              Dropterest
            </span>
          </Link>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[11px] font-medium text-white/90">
            <Sparkles className="w-3 h-3 text-[#4DE3A5]" />
            Visual Discovery
          </span>
        </div>

        {/* Center: Bold Typography & Value Statement */}
        <div className="relative z-10 my-auto py-8 max-w-lg space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-[#4DE3A5]">
            <Layers className="w-3.5 h-3.5" />
            <span>The Infinite Visual Canvas</span>
          </div>

          <h1 className="font-editorial text-4xl xl:text-5xl font-normal tracking-tight text-white leading-[1.1]">
            Curate your taste. <br />
            <span className="italic font-serif text-[#4DE3A5]">Organize</span> your world.
          </h1>

          <p className="text-xs xl:text-sm text-zinc-300 font-light leading-relaxed max-w-md">
            Join thousands of visual creators, designers, and innovators building rich moodboards and discovering inspiration that moves culture forward.
          </p>

          {/* Metric Badges */}
          <div className="grid grid-cols-2 gap-3 pt-2 max-w-sm">
            <div className="p-3.5 rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/10 space-y-0.5 shadow-md">
              <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                <Heart className="w-3.5 h-3.5 text-[#E60023]" />
                <span>Active Creators</span>
              </div>
              <p className="text-2xl font-bold text-white font-mono">140K+</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/10 space-y-0.5 shadow-md">
              <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                <ShieldCheck className="w-3.5 h-3.5 text-[#4DE3A5]" />
                <span>Curated Drops</span>
              </div>
              <p className="text-2xl font-bold text-white font-mono">3.8M+</p>
            </div>
          </div>
        </div>

        {/* Bottom: Testimonial */}
        <div className="relative z-10 border-t border-white/10 pt-5">
          <blockquote className="text-xs text-zinc-300 italic font-serif leading-relaxed mb-3">
            &ldquo;Dropterest has completely replaced how our design studio collects drops, builds moodboards, and shares concepts with clients.&rdquo;
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#4DE3A5] to-[#DCD2F8] text-[#09090B] font-bold text-xs flex items-center justify-center">
              SV
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Sophia Vance</p>
              <p className="text-[10px] text-zinc-400">Design Lead, Studio Aethel</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* RIGHT PANEL: Seamless Form Container                     */}
      {/* ======================================================== */}
      <main className="w-full lg:w-1/2 xl:w-[52%] min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16">
        {/* Top Header Navigation */}
        <div className="flex items-center justify-between w-full max-w-md mx-auto mb-6">
          <Link
            href="/"
            className="lg:hidden flex items-center gap-2 group transition-transform hover:scale-105"
          >
            <div className="w-9 h-9 rounded-2xl bg-[#E60023] text-white flex items-center justify-center font-editorial text-xl font-bold shadow-sm">
              <span>D</span>
            </div>
            <span className="font-editorial text-xl font-bold tracking-tight text-[#18181B]">
              Dropterest
            </span>
          </Link>

          <Link
            href="/"
            className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-[#71717A] hover:text-[#18181B] transition-colors py-1.5 px-3 rounded-full hover:bg-black/5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Dynamic Centered Form Component */}
        <div className="w-full max-w-md mx-auto my-auto py-4">
          {children}
        </div>

        {/* Bottom Footer */}
        <footer className="w-full max-w-md mx-auto pt-6 text-center text-xs text-[#A1A1AA]">
          <div className="flex flex-wrap items-center justify-center gap-4 mb-1 text-[#71717A]">
            <Link href="/privacy" className="hover:text-[#18181B] transition-colors">
              Privacy Policy
            </Link>
            <span>&bull;</span>
            <Link href="/terms" className="hover:text-[#18181B] transition-colors">
              Terms of Service
            </Link>
            <span>&bull;</span>
            <Link href="/help" className="hover:text-[#18181B] transition-colors">
              Help Center
            </Link>
          </div>
          <p>&copy; {new Date().getFullYear()} Dropterest Inc. All rights reserved.</p>
        </footer>
      </main>

      {/* Global Toast Manager */}
      <Toaster position="top-right" richColors />
    </div>
  );
}
