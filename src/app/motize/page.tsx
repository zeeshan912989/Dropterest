"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { authClient } from "@/lib/auth/auth-client";
import {
  ArrowRight,
  TrendingUp,
  DollarSign,
  Sparkles,
  Zap,
  ShoppingBag,
  Share2,
  ShieldCheck,
  BarChart3,
  Users,
  Target,
  Crown,
  CheckCircle2,
  ChevronRight,
  Download,
  CreditCard,
  Layers,
  ArrowUpRight,
  PieChart,
  Activity,
  Globe2,
  Lock,
} from "lucide-react";

export default function MotizeLandingPage() {
  const { data: session, isPending } = authClient.useSession();
  const [mounted, setMounted] = useState(false);
  const [activeSegment, setActiveSegment] = useState<"creators" | "businesses">("creators");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [monthlyViews, setMonthlyViews] = useState(50000);
  const [salesPerMonth, setSalesPerMonth] = useState(120);
  const [avgPrice, setAvgPrice] = useState(499);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAuthenticated = Boolean(session?.user);

  // Dynamic estimated earnings formula
  const calculatedEarnings = Math.round(
    salesPerMonth * avgPrice * 0.88 + (monthlyViews / 1000) * 120
  );

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#18181B] font-sans selection:bg-[#4DE3A5] selection:text-[#064E3B] antialiased">
      {/* ================= 1. MOTIZE TOP NAVIGATION ================= */}
      <header className="sticky top-0 z-50 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo - Navigates to Dropterest Home */}
          <div className="flex items-center gap-4">
            <Link href="/" title="Go to Dropterest" className="flex items-center gap-2.5 group cursor-pointer">
              <div className="w-10 h-10 rounded-[5px] bg-[#18181B] text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-black transition-colors">
                <span>M</span>
              </div>
              <div>
                <span className="font-editorial text-2xl font-bold tracking-tight text-[#18181B] block leading-none">
                  MOTIZE
                </span>
                <span className="text-[10px] font-mono tracking-widest text-[#71717A] uppercase block mt-0.5 group-hover:text-[#18181B] transition-colors">
                  BY DROPTEREST ↗
                </span>
              </div>
            </Link>

            <span className="hidden md:inline-flex text-[11px] font-mono text-[#064E3B] bg-[#ECFDF5] border border-[#A7F3D0] px-2.5 py-0.5 rounded-[5px]">
              Revenue Engine ✦
            </span>
          </div>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold text-[#52525B]">
            <a href="#creators" className="hover:text-[#18181B] transition-colors">
              Creators
            </a>
            <a href="#businesses" className="hover:text-[#18181B] transition-colors">
              Businesses
            </a>
            <a href="#how-it-works" className="hover:text-[#18181B] transition-colors">
              How It Works
            </a>
            <a href="#calculator" className="hover:text-[#18181B] transition-colors">
              Earnings Calculator
            </a>
            <a href="#pricing" className="hover:text-[#18181B] transition-colors">
              Pricing
            </a>
          </nav>

          {/* Right Action CTA Buttons */}
          <div className="flex items-center gap-3">
            {mounted && !isPending && isAuthenticated ? (
              <Link
                href="/creator"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-[5px] bg-[#18181B] hover:bg-black text-white text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>Start Earning</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#4DE3A5]" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login?redirect=/motize"
                  className="text-xs font-semibold text-[#18181B] hover:text-black px-3.5 py-2 rounded-[5px] transition-colors"
                >
                  Sign In
                </Link>

                <Link
                  href="/login?redirect=/creator"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-[5px] bg-[#18181B] hover:bg-black text-white text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <span>Start Earning</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#4DE3A5]" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ================= 2. HERO SECTION ================= */}
      <section className="relative pt-16 sm:pt-24 pb-20 sm:pb-28 overflow-hidden border-b border-black/[0.05]">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-[#4DE3A5]/15 via-[#6366F1]/10 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[5px] bg-white border border-black/[0.08] shadow-xs mb-8">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-xs font-medium text-[#52525B]">
              Dropterest Monetization &amp; Ad Network Platform
            </span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#18181B] leading-[1.08] mb-6">
            Turn Inspiration <br className="hidden sm:inline" />
            <span className="italic font-serif font-normal text-[#064E3B] underline decoration-[#4DE3A5] decoration-wavy decoration-2">
              Into Sustainable Income.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-[#71717A] leading-relaxed mb-10">
            Motize is the monetization engine behind Dropterest — helping creators earn from downloads, businesses reach high-intent design buyers, and visual ideas become real recurring revenue.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-16">
            <Link
              href="/ideas?tab=create"
              className="w-full sm:w-auto px-8 py-4 rounded-[5px] bg-[#18181B] hover:bg-black text-white text-xs sm:text-sm font-semibold shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Start Earning as Creator</span>
              <ArrowRight className="w-4 h-4 text-[#4DE3A5]" />
            </Link>

            <a
              href="#businesses"
              className="w-full sm:w-auto px-7 py-4 rounded-[5px] bg-white hover:bg-[#F3EFE6] border border-black/10 text-xs sm:text-sm font-semibold text-[#18181B] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Advertise on Dropterest</span>
              <ArrowUpRight className="w-4 h-4 text-[#71717A]" />
            </a>
          </div>

          {/* Live Ecosystem Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-8 border-t border-black/[0.06] text-left">
            <div className="p-4 rounded-[5px] bg-white/70 border border-black/[0.06]">
              <div className="text-xs font-mono font-bold text-[#064E3B] mb-1">FOR CREATORS</div>
              <p className="text-xs text-[#71717A] leading-relaxed">
                Sell digital downloads (PSD, AI, FIG, ZIP) with instant payouts &amp; zero hassle.
              </p>
            </div>
            <div className="p-4 rounded-[5px] bg-white/70 border border-black/[0.06]">
              <div className="text-xs font-mono font-bold text-[#6366F1] mb-1">FOR BUSINESSES</div>
              <p className="text-xs text-[#71717A] leading-relaxed">
                Run targeted Promoted Pin campaigns directly inside curated visual feeds.
              </p>
            </div>
            <div className="p-4 rounded-[5px] bg-white/70 border border-black/[0.06]">
              <div className="text-xs font-mono font-bold text-[#D97706] mb-1">FOR DISCOVERERS</div>
              <p className="text-xs text-[#71717A] leading-relaxed">
                Unlock commercial licenses, high-resolution source packages &amp; curated assets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3. SECTION 2: 4 MONETIZATION PILLARS ================= */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#71717A] block mb-2">
            MULTIPLE REVENUE STREAMS
          </span>
          <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-[#18181B]">
            One platform. Multiple ways to earn.
          </h2>
          <p className="text-xs sm:text-sm text-[#71717A] mt-3 max-w-xl mx-auto">
            Whether you are a solo 3D artist, UI designer, or global brand, Motize turns your creative work into scalable revenue.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1: Sell Designs */}
          <div className="p-7 rounded-[5px] bg-white border border-black/[0.08] shadow-xs hover:shadow-lg transition-all group">
            <div className="w-12 h-12 rounded-[5px] bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-xl font-bold text-[#18181B] mb-2">
              Sell Designs &amp; Kits
            </h3>
            <p className="text-xs text-[#71717A] leading-relaxed mb-4">
              Upload templates, 3D models, fonts, and Figma components. Set your price in PKR or USD and get paid directly.
            </p>
            <span className="text-[11px] font-mono text-[#064E3B] font-semibold flex items-center gap-1">
              <span>Instant Digital Delivery</span>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Pillar 2: Boost Your Pins */}
          <div className="p-7 rounded-[5px] bg-white border border-black/[0.08] shadow-xs hover:shadow-lg transition-all group">
            <div className="w-12 h-12 rounded-[5px] bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-xl font-bold text-[#18181B] mb-2">
              Boost Your Pins
            </h3>
            <p className="text-xs text-[#71717A] leading-relaxed mb-4">
              Get placed at the very top of high-intent visual search results and category streams with precision targeting.
            </p>
            <span className="text-[11px] font-mono text-[#2563EB] font-semibold flex items-center gap-1">
              <span>3.8x Higher CTR</span>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Pillar 3: Affiliate Earnings */}
          <div className="p-7 rounded-[5px] bg-white border border-black/[0.08] shadow-xs hover:shadow-lg transition-all group">
            <div className="w-12 h-12 rounded-[5px] bg-[#FEF3C7] text-[#D97706] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
              <Share2 className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-xl font-bold text-[#18181B] mb-2">
              Affiliate Earnings
            </h3>
            <p className="text-xs text-[#71717A] leading-relaxed mb-4">
              Tag products, materials, and gear in your Pins. Earn automated commissions whenever someone shops your recommendations.
            </p>
            <span className="text-[11px] font-mono text-[#D97706] font-semibold flex items-center gap-1">
              <span>Up to 15% Commission</span>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Pillar 4: Creator Pro */}
          <div className="p-7 rounded-[5px] bg-white border border-black/[0.08] shadow-xs hover:shadow-lg transition-all group">
            <div className="w-12 h-12 rounded-[5px] bg-[#F5F3FF] text-[#7C3AED] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
              <Crown className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-xl font-bold text-[#18181B] mb-2">
              Creator Pro Tier
            </h3>
            <p className="text-xs text-[#71717A] leading-relaxed mb-4">
              Enjoy verified creator badges, unlimited asset hosting up to 2GB per package, priority ranking, and 0% platform fees.
            </p>
            <span className="text-[11px] font-mono text-[#7C3AED] font-semibold flex items-center gap-1">
              <span>Keep 100% of Sales</span>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </section>

      {/* ================= 4. SECTION 3: CREATOR REVENUE SPOTLIGHT & DASHBOARD MOCKUP ================= */}
      <section id="creators" className="py-20 sm:py-28 bg-[#F5F1E8]/60 border-y border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[5px] bg-[#ECFDF5] text-[#064E3B] text-xs font-mono font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>CREATOR MONETIZATION</span>
              </div>

              <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-[#18181B] leading-tight">
                Your creativity deserves to pay your bills.
              </h2>

              <p className="text-xs sm:text-sm text-[#71717A] leading-relaxed">
                Traditional social platforms monetize your audience with ads and pay you zero. Motize flips the script — every time someone downloads your design asset, saves your template, or shops your aesthetic, revenue goes directly into your wallet.
              </p>

              <div className="space-y-3.5 pt-2">
                {[
                  "Direct bank & local payment withdrawals (Raast, JazzCash, Stripe, Bank Wire)",
                  "Transparent analytics on impressions, views, downloads & sales conversion",
                  "Automated licensing generator for commercial and personal design rights",
                  "Instant download delivery with secure 256-bit encrypted storage tokens",
                ].map((text, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-[5px] bg-[#064E3B] text-white flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-medium text-[#27272A]">{text}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link
                  href="/ideas?tab=create"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[5px] bg-[#18181B] hover:bg-black text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
                >
                  <span>Open Creator Account</span>
                  <ArrowRight className="w-4 h-4 text-[#4DE3A5]" />
                </Link>
              </div>
            </div>

            {/* Right: Realistic Creator Dashboard Mockup */}
            <div className="lg:col-span-6">
              <div className="p-6 sm:p-8 rounded-[5px] bg-white border border-black/10 shadow-2xl relative">
                <div className="flex items-center justify-between pb-4 border-b border-black/[0.06] mb-6">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717A] block">
                      MOTIZE CREATOR HUB
                    </span>
                    <h4 className="font-bold text-base text-[#18181B]">Revenue &amp; Payouts</h4>
                  </div>
                  <span className="text-xs font-mono text-[#064E3B] bg-[#ECFDF5] px-2.5 py-1 rounded-[5px] font-semibold border border-[#A7F3D0]">
                    ● Live Active
                  </span>
                </div>

                {/* Main Total Balance */}
                <div className="p-5 rounded-[5px] bg-[#FAF8F5] border border-black/[0.06] mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-[#71717A] font-medium block mb-1">
                      Available Balance
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-editorial text-3xl sm:text-4xl font-bold text-[#18181B]">
                        PKR 248,140
                      </span>
                      <span className="text-xs font-mono text-[#064E3B] font-bold">
                        ↑ +24.8% this month
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => alert("Withdrawal simulated: Funds transferred to linked bank account ✦")}
                    className="px-4 py-2.5 rounded-[5px] bg-[#064E3B] hover:bg-[#085a44] text-white text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
                  >
                    Withdraw Earnings
                  </button>
                </div>

                {/* Revenue Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between p-3 rounded-[5px] bg-white border border-black/[0.05] text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-[5px] bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center font-bold">
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-semibold text-[#18181B] block">Digital Asset Sales</span>
                        <span className="text-[10px] text-[#71717A]">42 design packages sold</span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-sm text-[#18181B]">PKR 142,000</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-[5px] bg-white border border-black/[0.05] text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-[5px] bg-[#FEF3C7] text-[#D97706] flex items-center justify-center font-bold">
                        <Share2 className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-semibold text-[#18181B] block">Affiliate Tag Commissions</span>
                        <span className="text-[10px] text-[#71717A]">183 shoppers converted</span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-sm text-[#18181B]">PKR 68,040</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-[5px] bg-white border border-black/[0.05] text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-[5px] bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center font-bold">
                        <Zap className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-semibold text-[#18181B] block">Pin Boost Creator Royalty</span>
                        <span className="text-[10px] text-[#71717A]">Brand sponsorship bonus</span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-sm text-[#18181B]">PKR 38,100</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-black/[0.06] flex items-center justify-between text-[11px] text-[#71717A]">
                  <span>Next automatic payout on Friday</span>
                  <span className="font-mono text-[#18181B] font-semibold">100% Guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 5. SECTION 4: FOR BUSINESSES & ADVERTISERS ================= */}
      <section id="businesses" className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Realistic Campaign Performance Mockup */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="p-6 sm:p-8 rounded-[5px] bg-white border border-black/10 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-black/[0.06] mb-6">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717A] block">
                    CAMPAIGN PERFORMANCE
                  </span>
                  <h4 className="font-bold text-base text-[#18181B]">Fall Architectural Collection</h4>
                </div>
                <span className="text-xs font-mono text-[#2563EB] bg-[#EFF6FF] px-2.5 py-1 rounded-[5px] font-semibold border border-[#BFDBFE]">
                  Promoted Pin
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="p-3.5 rounded-[5px] bg-[#FAF8F5] border border-black/[0.05]">
                  <span className="text-[10px] font-mono text-[#71717A] uppercase block">Impressions</span>
                  <span className="font-mono font-bold text-base sm:text-lg text-[#18181B] block mt-1">1.24M</span>
                  <span className="text-[9px] text-[#064E3B] font-mono font-bold">+18.4%</span>
                </div>
                <div className="p-3.5 rounded-[5px] bg-[#FAF8F5] border border-black/[0.05]">
                  <span className="text-[10px] font-mono text-[#71717A] uppercase block">Clicks</span>
                  <span className="font-mono font-bold text-base sm:text-lg text-[#18181B] block mt-1">48.2K</span>
                  <span className="text-[9px] text-[#064E3B] font-mono font-bold">+12.1%</span>
                </div>
                <div className="p-3.5 rounded-[5px] bg-[#FAF8F5] border border-black/[0.05]">
                  <span className="text-[10px] font-mono text-[#71717A] uppercase block">CTR</span>
                  <span className="font-mono font-bold text-base sm:text-lg text-[#18181B] block mt-1">3.89%</span>
                  <span className="text-[9px] text-[#064E3B] font-mono font-bold">2.4x avg</span>
                </div>
                <div className="p-3.5 rounded-[5px] bg-[#FAF8F5] border border-black/[0.05]">
                  <span className="text-[10px] font-mono text-[#71717A] uppercase block">Spend</span>
                  <span className="font-mono font-bold text-base sm:text-lg text-[#18181B] block mt-1">$1,240</span>
                  <span className="text-[9px] text-[#71717A] font-mono">On budget</span>
                </div>
              </div>

              <div className="p-4 rounded-[5px] bg-[#064E3B] text-white space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white/90">Audience Intent Match</span>
                  <span className="font-mono font-bold text-[#4DE3A5]">98.4% High Intent</span>
                </div>
                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#4DE3A5] h-full w-[98.4%]" />
                </div>
                <p className="text-[11px] text-white/80 leading-relaxed">
                  Targeted at creators searching for &ldquo;Architecture&rdquo;, &ldquo;Brutalism&rdquo; and &ldquo;3D Renders&rdquo;.
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-[#71717A] pt-2">
                <span>Conversion rate to checkout</span>
                <span className="font-mono font-bold text-[#18181B]">8.64% ($14,280 ROI)</span>
              </div>
            </div>
          </div>

          {/* Right Narrative */}
          <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[5px] bg-[#EFF6FF] text-[#2563EB] text-xs font-mono font-bold">
              <Target className="w-3.5 h-3.5" />
              <span>ADVERTISERS &amp; BRANDS</span>
            </div>

            <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-[#18181B] leading-tight">
              Put your brand where people discover what&apos;s next.
            </h2>

            <p className="text-xs sm:text-sm text-[#71717A] leading-relaxed">
              Users on Dropterest aren&apos;t passively scrolling memes. They are active creators, architects, designers, and buyers hunting for visual assets and commercial products.
            </p>

            <div className="space-y-3.5 pt-2">
              {[
                "Native Promoted Pins that seamlessly blend into the infinite discovery feed",
                "Keyword & Category audience targeting (Architecture, Fashion, Tech, Ceramics)",
                "Full conversion tracking with real-time impression & click analytics",
                "Brand safety guarantee: Zero spam, 100% verified visual curation",
              ].map((text, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-[5px] bg-[#2563EB] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-medium text-[#27272A]">{text}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link
                href="/login?redirect=/motize"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[5px] bg-[#18181B] hover:bg-black text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
              >
                <span>Launch First Campaign</span>
                <ArrowRight className="w-4 h-4 text-[#4DE3A5]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 6. SECTION 5: HOW MOTIZE WORKS ================= */}
      <section id="how-it-works" className="py-20 sm:py-28 bg-white border-y border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-mono uppercase tracking-widest text-[#71717A] block mb-2">
            SIMPLE WORKFLOW
          </span>
          <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-[#18181B] mb-16">
            How Motize works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <div className="p-6 rounded-[5px] bg-[#FAF8F5] border border-black/[0.06] text-left relative">
              <span className="font-mono text-3xl font-bold text-[#064E3B] block mb-4">01</span>
              <h4 className="font-editorial text-xl font-bold text-[#18181B] mb-2">Create</h4>
              <p className="text-xs text-[#71717A] leading-relaxed">
                Design your graphics, photo series, UI kit, 3D render, or downloadable creative resource.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-[5px] bg-[#FAF8F5] border border-black/[0.06] text-left relative">
              <span className="font-mono text-3xl font-bold text-[#064E3B] block mb-4">02</span>
              <h4 className="font-editorial text-xl font-bold text-[#18181B] mb-2">Publish</h4>
              <p className="text-xs text-[#71717A] leading-relaxed">
                Upload to Dropterest with single-click pricing, tags, license terms, and attached raw file packages.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-[5px] bg-[#FAF8F5] border border-black/[0.06] text-left relative">
              <span className="font-mono text-3xl font-bold text-[#064E3B] block mb-4">03</span>
              <h4 className="font-editorial text-xl font-bold text-[#18181B] mb-2">Get Discovered</h4>
              <p className="text-xs text-[#71717A] leading-relaxed">
                Our high-speed infinite feed matches your pin with buyers looking for that exact aesthetic.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-[5px] bg-[#FAF8F5] border border-black/[0.06] text-left relative">
              <span className="font-mono text-3xl font-bold text-[#064E3B] block mb-4">04</span>
              <h4 className="font-editorial text-xl font-bold text-[#18181B] mb-2">Earn</h4>
              <p className="text-xs text-[#71717A] leading-relaxed">
                Receive direct digital payments to your wallet on every sale with automated instant delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 7. INTERACTIVE ESTIMATED EARNINGS CALCULATOR ================= */}
      <section id="calculator" className="py-20 sm:py-28 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-12 rounded-[5px] bg-[#18181B] text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs font-mono uppercase tracking-widest text-[#4DE3A5] block mb-2">
                CALCULATE YOUR POTENTIAL
              </span>
              <h3 className="font-editorial text-3xl sm:text-4xl font-bold text-white">
                How much could you earn on Motize?
              </h3>
              <p className="text-xs text-white/70 mt-2">
                Estimate your monthly earnings based on monthly views and digital asset sales.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Sliders */}
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-medium text-white/90 mb-2">
                    <span>Monthly Pin Views</span>
                    <span className="font-mono text-[#4DE3A5] font-bold">{monthlyViews.toLocaleString()} views</span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="500000"
                    step="5000"
                    value={monthlyViews}
                    onChange={(e) => setMonthlyViews(Number(e.target.value))}
                    className="w-full accent-[#4DE3A5] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-white/90 mb-2">
                    <span>Asset Sales / Downloads</span>
                    <span className="font-mono text-[#4DE3A5] font-bold">{salesPerMonth} orders / mo</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="1000"
                    step="10"
                    value={salesPerMonth}
                    onChange={(e) => setSalesPerMonth(Number(e.target.value))}
                    className="w-full accent-[#4DE3A5] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-white/90 mb-2">
                    <span>Average Price Per Asset</span>
                    <span className="font-mono text-[#4DE3A5] font-bold">PKR {avgPrice}</span>
                  </div>
                  <input
                    type="range"
                    min="199"
                    max="2499"
                    step="50"
                    value={avgPrice}
                    onChange={(e) => setAvgPrice(Number(e.target.value))}
                    className="w-full accent-[#4DE3A5] cursor-pointer"
                  />
                </div>
              </div>

              {/* Earnings Result Display */}
              <div className="p-6 rounded-[5px] bg-white/10 backdrop-blur-md border border-white/15 text-center flex flex-col items-center justify-center">
                <span className="text-xs font-mono text-white/70 uppercase tracking-wider block mb-1">
                  Estimated Monthly Income
                </span>
                <span className="font-editorial text-4xl sm:text-5xl font-bold text-[#4DE3A5] block mb-2">
                  PKR {calculatedEarnings.toLocaleString()}
                </span>
                <span className="text-[11px] text-white/60 mb-6">
                  ~ ${(calculatedEarnings / 280).toFixed(0)} USD / month at current creator split
                </span>

                <Link
                  href="/ideas?tab=create"
                  className="w-full py-3.5 px-6 rounded-[5px] bg-[#4DE3A5] hover:bg-[#60ebb0] text-[#064E3B] font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Start Monetizing Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 8. SECTION 7: PRICING PLANS ================= */}
      <section id="pricing" className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-black/[0.06]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#71717A] block mb-2">
            TRANSPARENT PLANS
          </span>
          <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-[#18181B]">
            Keep more of what you create.
          </h2>
          <p className="text-xs sm:text-sm text-[#71717A] mt-3">
            Choose the plan that fits your growth. Upgrade or cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Plan 1: Free */}
          <div className="p-8 rounded-[5px] bg-white border border-black/[0.08] shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#71717A] block mb-1">
                COMMUNITY
              </span>
              <h3 className="font-editorial text-2xl font-bold text-[#18181B]">Free</h3>
              <p className="text-xs text-[#71717A] mt-2 mb-6">
                Perfect for creators getting started with visual curation.
              </p>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="font-editorial text-4xl font-bold text-[#18181B]">$0</span>
                <span className="text-xs text-[#71717A]">/ month</span>
              </div>

              <div className="space-y-3 text-xs text-[#3F3F46]">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#064E3B] shrink-0" />
                  <span>Unlimited public visual pins</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#064E3B] shrink-0" />
                  <span>Curate unlimited moodboards</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#064E3B] shrink-0" />
                  <span>Sell digital downloads (15% platform fee)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#064E3B] shrink-0" />
                  <span>Basic view &amp; save analytics</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Link
                href="/ideas"
                className="w-full py-3 px-4 rounded-[5px] bg-[#EFEAE1]/70 hover:bg-[#EFEAE1] text-[#18181B] text-xs font-bold transition-all block text-center"
              >
                Join Free
              </Link>
            </div>
          </div>

          {/* Plan 2: Creator Pro (Featured) */}
          <div className="p-8 rounded-[5px] bg-[#18181B] text-white shadow-xl relative flex flex-col justify-between border-2 border-[#4DE3A5]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#4DE3A5] text-[#064E3B] text-[10px] font-mono font-bold px-3 py-0.5 rounded-[5px] uppercase">
              MOST POPULAR FOR CREATORS
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#4DE3A5] block mb-1">
                PROFESSIONAL
              </span>
              <h3 className="font-editorial text-2xl font-bold text-white">Creator Pro</h3>
              <p className="text-xs text-white/70 mt-2 mb-6">
                For serious creators and visual studios maximizing digital asset revenue.
              </p>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="font-editorial text-4xl font-bold text-white">$9</span>
                <span className="text-xs text-white/70">/ month</span>
              </div>

              <div className="space-y-3 text-xs text-white/90">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#4DE3A5] shrink-0" />
                  <span>Keep 95% of digital asset sales</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#4DE3A5] shrink-0" />
                  <span>Verified Creator Badge ✦</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#4DE3A5] shrink-0" />
                  <span>High-res downloads up to 2GB package</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#4DE3A5] shrink-0" />
                  <span>Deep audience search &amp; conversion metrics</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#4DE3A5] shrink-0" />
                  <span>Ad-free discovery experience</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Link
                href="/ideas?tab=create"
                className="w-full py-3 px-4 rounded-[5px] bg-[#4DE3A5] hover:bg-[#60ebb0] text-[#064E3B] text-xs font-bold transition-all block text-center shadow-md cursor-pointer"
              >
                Upgrade to Creator Pro
              </Link>
            </div>
          </div>

          {/* Plan 3: Business */}
          <div className="p-8 rounded-[5px] bg-white border border-black/[0.08] shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#71717A] block mb-1">
                ADVERTISERS &amp; STUDIOS
              </span>
              <h3 className="font-editorial text-2xl font-bold text-[#18181B]">Business</h3>
              <p className="text-xs text-[#71717A] mt-2 mb-6">
                Custom ad campaigns, sponsored pins, and enterprise brand tools.
              </p>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="font-editorial text-4xl font-bold text-[#18181B]">$49</span>
                <span className="text-xs text-[#71717A]">/ month + ad spend</span>
              </div>

              <div className="space-y-3 text-xs text-[#3F3F46]">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#064E3B] shrink-0" />
                  <span>Promoted Pins in Top Search Results</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#064E3B] shrink-0" />
                  <span>Granular Category &amp; Demographic Targeting</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#064E3B] shrink-0" />
                  <span>Live ROI, CTR &amp; Conversion Pixel</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#064E3B] shrink-0" />
                  <span>Dedicated Campaign Account Manager</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Link
                href="/login?redirect=/motize"
                className="w-full py-3 px-4 rounded-[5px] bg-[#18181B] hover:bg-black text-white text-xs font-bold transition-all block text-center shadow-xs"
              >
                Launch Brand Campaign
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 9. FINAL CALL TO ACTION ================= */}
      <section className="py-24 sm:py-32 bg-[#18181B] text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[5px] bg-white/10 text-white text-xs font-mono font-bold mb-6">
            <span>✦ JOIN MOTIZE TODAY</span>
          </div>

          <h2 className="font-editorial text-4xl sm:text-6xl font-bold tracking-tight text-white mb-6">
            Your audience is already here. <br />
            <span className="text-[#4DE3A5] italic font-serif font-normal">Now monetize it.</span>
          </h2>

          <p className="max-w-xl mx-auto text-xs sm:text-sm text-white/70 leading-relaxed mb-10">
            Join thousands of creators turning their visual inspirations, design assets, and boards into reliable recurring revenue.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/ideas?tab=create"
              className="w-full sm:w-auto px-8 py-4 rounded-[5px] bg-[#4DE3A5] hover:bg-[#60ebb0] text-[#064E3B] font-bold text-xs sm:text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>Join Motize as Creator</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/ideas"
              className="w-full sm:w-auto px-8 py-4 rounded-[5px] bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all flex items-center justify-center"
            >
              Explore Dropterest Feed
            </Link>
          </div>
        </div>
      </section>

      {/* ================= 10. MOTIZE FOOTER ================= */}
      <footer className="bg-[#111113] text-white/80 py-16 border-t border-white/10 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {/* Col 1 */}
            <div className="col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[5px] bg-white text-[#18181B] flex items-center justify-center font-bold text-sm">
                  <span>M</span>
                </div>
                <span className="font-editorial text-xl font-bold tracking-tight text-white">
                  MOTIZE
                </span>
              </div>
              <p className="text-xs text-white/60 max-w-sm leading-relaxed">
                The monetization and advertiser network for the Dropterest ecosystem. Empowering creators and brands worldwide.
              </p>
              <span className="text-[11px] font-mono text-[#4DE3A5] block">
                motize.dropterest.com
              </span>
            </div>

            {/* Col 2 */}
            <div className="space-y-2.5">
              <h5 className="font-bold text-xs text-white uppercase tracking-wider font-mono">Creators</h5>
              <ul className="space-y-2 text-white/70">
                <li><a href="#creators" className="hover:text-white transition-colors">Sell Designs</a></li>
                <li><a href="#calculator" className="hover:text-white transition-colors">Earnings Calculator</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Creator Pro Tier</a></li>
                <li><Link href="/ideas?tab=create" className="hover:text-white transition-colors">Upload Asset</Link></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div className="space-y-2.5">
              <h5 className="font-bold text-xs text-white uppercase tracking-wider font-mono">Businesses</h5>
              <ul className="space-y-2 text-white/70">
                <li><a href="#businesses" className="hover:text-white transition-colors">Promoted Pins</a></li>
                <li><a href="#businesses" className="hover:text-white transition-colors">Audience Targeting</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Business Pricing</a></li>
                <li><Link href="/login?redirect=/motize" className="hover:text-white transition-colors">Ad Manager</Link></li>
              </ul>
            </div>

            {/* Col 4 */}
            <div className="space-y-2.5">
              <h5 className="font-bold text-xs text-white uppercase tracking-wider font-mono">Legal &amp; Trust</h5>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-white transition-colors">Commercial Licensing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Creator Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security &amp; Payouts</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/50 text-[11px]">
            <span>&copy; 2026 Motize Inc. A Dropterest company. All rights reserved.</span>
            <div className="flex items-center gap-6">
              <Link href="/" className="hover:text-white transition-colors">Dropterest Home</Link>
              <Link href="/ideas" className="hover:text-white transition-colors">Visual Feed</Link>
              <Link href="/settings" className="hover:text-white transition-colors">Account Settings</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
