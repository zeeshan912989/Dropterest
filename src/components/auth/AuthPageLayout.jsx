"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Check, ArrowLeft, Sparkles, Lock } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

function AuthFormContent({ initialMode = "login" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/ideas";
  const required = searchParams.get("required") === "true";

  const login = useAuthStore((state) => state.login);

  const [mode, setMode] = useState(initialMode); // "login" or "signup"
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    agreeTerms: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      login({
        name: formData.name || (mode === "signup" ? "Curator" : "Elena Rostova"),
        email: formData.email,
      });
      setIsLoading(false);
      setSubmitted(true);

      setTimeout(() => {
        router.push(redirectUrl);
      }, 700);
    }, 800);
  };

  const handleSocialLogin = (provider) => {
    setIsLoading(true);
    setTimeout(() => {
      login({
        name: `${provider} Curator`,
        email: `curator@${provider.toLowerCase()}.com`,
      });
      setIsLoading(false);
      setSubmitted(true);
      setTimeout(() => {
        router.push(redirectUrl);
      }, 700);
    }, 600);
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] text-[#18181B] flex flex-col lg:flex-row relative selection:bg-[#4DE3A5]/40 selection:text-[#064E3B]">
      {/* Top Mobile Bar */}
      <div className="lg:hidden w-full flex items-center justify-between p-6 border-b border-black/[0.04]">
        <Link
          href="/"
          className="font-editorial text-2xl font-bold tracking-tight text-[#18181B] flex items-center gap-1.5"
        >
          <span>Dropterest</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#4DE3A5]" />
        </Link>
        <Link
          href="/"
          className="text-xs font-medium text-[#71717A] hover:text-[#18181B] flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
      </div>

      {/* ================= LEFT EDITORIAL VISUAL SHOWCASE ================= */}
      <div className="hidden lg:flex lg:w-[48%] xl:w-[50%] relative p-12 xl:p-16 flex-col justify-between overflow-hidden bg-[#F3EFE6]/60 border-r border-black/[0.04]">
        {/* Subtle Ambient Glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#DCD2F8]/40 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#4DE3A5]/20 blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between">
          <Link
            href="/"
            className="font-editorial text-3xl font-bold tracking-tight text-[#18181B] flex items-center gap-1.5 group"
          >
            <span>Dropterest</span>
            <span className="w-2 h-2 rounded-full bg-[#4DE3A5] group-hover:scale-125 transition-transform" />
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#71717A] hover:text-[#18181B] bg-white/80 hover:bg-white px-3.5 py-1.5 rounded-full border border-black/[0.06] shadow-xs transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to discovery</span>
          </Link>
        </div>

        {/* Center: Curated Floating Moodboard Collage */}
        <div className="relative z-10 my-auto py-12 max-w-lg mx-auto w-full">
          {/* Asymmetric Imagery Stage */}
          <div className="relative w-full aspect-[4/3] rounded-3xl bg-white/40 p-4 border border-black/[0.05] shadow-[0_20px_50px_rgba(0,0,0,0.04)] backdrop-blur-xs flex items-center justify-center">
            {/* Primary Main Visual */}
            <div className="relative w-[58%] h-[85%] rounded-2xl overflow-hidden shadow-xl border-2 border-white -rotate-2 hover:rotate-0 transition-transform duration-500">
              <Image
                src="/architecture-pavilion.jpeg"
                alt="Editorial space"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono text-[#18181B] shadow-sm">
                #Architecture
              </div>
            </div>

            {/* Overlapping Secondary Visual */}
            <div className="absolute right-4 top-6 w-[44%] h-[65%] rounded-2xl overflow-hidden shadow-2xl border-2 border-white rotate-4 hover:rotate-1 transition-transform duration-500">
              <Image
                src="/ceramics.jpeg"
                alt="Ceramic art"
                fill
                className="object-cover"
              />
              <div className="absolute top-2 right-2 bg-[#4DE3A5] text-[#064E3B] px-2 py-0.5 rounded-full text-[9px] font-semibold shadow-xs">
                ✦ Curated
              </div>
            </div>

            {/* Small Floating Pill Badge */}
            <div className="absolute -bottom-3 left-8 bg-white/95 backdrop-blur-md border border-black/[0.06] shadow-lg rounded-2xl px-4 py-2 flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#4DE3A5] animate-ping" />
              <div className="text-[11px]">
                <span className="font-semibold text-[#18181B]">Live Sync</span>
                <span className="text-[#71717A] ml-1.5">&middot; 14 drops added</span>
              </div>
            </div>
          </div>

          {/* Testimonial Quote */}
          <div className="mt-8 text-center sm:text-left">
            <p className="font-editorial text-2xl text-[#18181B] leading-snug italic">
              &ldquo;The quietest, most refined space to collect and build visual narratives.&rdquo;
            </p>
            <p className="mt-2 text-xs font-mono text-[#71717A] uppercase tracking-wider">
              Studio Archetype &mdash; Milan
            </p>
          </div>
        </div>

        {/* Left Bottom Footer Tag */}
        <div className="relative z-10 text-[11px] font-mono text-[#71717A] flex items-center justify-between">
          <span>&copy; 2026 Dropterest Inc.</span>
          <span>Editorial visual architecture</span>
        </div>
      </div>

      {/* ================= RIGHT AUTH FORM CONTAINER ================= */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-16 relative">
        <div className="w-full max-w-md mx-auto">
          {/* Auth Required Notice if user was redirected */}
          {required && (
            <div className="mb-6 p-3.5 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] flex items-center gap-2.5 text-xs text-[#92400E]">
              <Lock className="w-4 h-4 text-[#D97706] shrink-0" />
              <span>Please sign in to access your personalized <strong>Ideas</strong> workspace and save drops.</span>
            </div>
          )}

          {/* Mode Switcher Tabs */}
          <div className="inline-flex p-1 rounded-full bg-[#F0EBE1] border border-black/[0.04] mb-8">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setSubmitted(false);
              }}
              className={`px-5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                mode === "login"
                  ? "bg-white text-[#18181B] shadow-xs"
                  : "text-[#71717A] hover:text-[#18181B]"
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setSubmitted(false);
              }}
              className={`px-5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                mode === "signup"
                  ? "bg-white text-[#18181B] shadow-xs"
                  : "text-[#71717A] hover:text-[#18181B]"
              }`}
            >
              Create account
            </button>
          </div>

          {/* Title & Subtitle */}
          <div className="mb-8">
            <h1 className="font-editorial text-4xl sm:text-5xl text-[#18181B] font-normal tracking-[-0.02em] leading-tight">
              {mode === "login"
                ? "Welcome back."
                : "Begin your archive."}
            </h1>
            <p className="mt-2 text-sm text-[#71717A]">
              {mode === "login"
                ? "Sign in to access your curated drops and saved collections."
                : "Join an ecosystem of designers, curators, and creative thinkers."}
            </p>
          </div>

          {/* Success State Notification */}
          {submitted ? (
            <div className="p-6 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] text-center my-6">
              <div className="w-10 h-10 rounded-full bg-[#4DE3A5] text-[#064E3B] flex items-center justify-center mx-auto mb-3">
                <Check className="w-5 h-5" />
              </div>
              <h3 className="font-editorial text-xl font-semibold text-[#064E3B]">
                {mode === "login" ? "Signed in successfully" : "Welcome to Dropterest"}
              </h3>
              <p className="text-xs text-[#047857] mt-1">
                Taking you to your Ideas feed...
              </p>
            </div>
          ) : (
            <>
              {/* One-Click Social Auth Options */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => handleSocialLogin("Google")}
                  className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#D4CEBF]/80 shadow-[0_1px_2px_rgba(0,0,0,0.03)] text-xs font-medium text-[#18181B] transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.2-2 .4-2.8L1.9 6.3C.7 8.7 0 10.8 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                    />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialLogin("Apple")}
                  className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#D4CEBF]/80 shadow-[0_1px_2px_rgba(0,0,0,0.03)] text-xs font-medium text-[#18181B] transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 1.01-2.85-.92.04-2.02.62-2.66 1.37-.56.65-1.06 1.71-.93 2.74 1.02.08 2.05-.57 2.58-1.26z" />
                  </svg>
                  <span>Apple</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-6">
                <div className="w-full border-t border-black/[0.06]" />
                <span className="absolute bg-[#FAF8F5] px-3 text-[11px] font-mono text-[#71717A] uppercase tracking-wider">
                  or email
                </span>
              </div>

              {/* Main Form */}
              <form onSubmit={handleSubmit} className="space-y-4.5">
                {/* Full Name for Signup */}
                {mode === "signup" && (
                  <div>
                    <label className="block text-[12px] font-medium text-[#27272A] mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Elena Rostova"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#D4CEBF]/80 text-sm text-[#18181B] placeholder:text-[#A1A1AA] shadow-[0_1px_2px_rgba(0,0,0,0.03)] outline-none hover:border-[#A8A29E] focus:border-[#18181B] focus:ring-1 focus:ring-[#18181B] transition-all duration-150"
                    />
                  </div>
                )}

                {/* Email Input */}
                <div>
                  <label className="block text-[12px] font-medium text-[#27272A] mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@studio.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#D4CEBF]/80 text-sm text-[#18181B] placeholder:text-[#A1A1AA] shadow-[0_1px_2px_rgba(0,0,0,0.03)] outline-none hover:border-[#A8A29E] focus:border-[#18181B] focus:ring-1 focus:ring-[#18181B] transition-all duration-150"
                  />
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[12px] font-medium text-[#27272A]">
                      Password
                    </label>
                    {mode === "login" && (
                      <a
                        href="#forgot"
                        className="text-[11px] text-[#71717A] hover:text-[#18181B] transition-colors"
                      >
                        Forgot password?
                      </a>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••••••"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full h-11 px-3.5 pr-10 rounded-xl bg-white border border-[#D4CEBF]/80 text-sm text-[#18181B] placeholder:text-[#A1A1AA] shadow-[0_1px_2px_rgba(0,0,0,0.03)] outline-none hover:border-[#A8A29E] focus:border-[#18181B] focus:ring-1 focus:ring-[#18181B] transition-all duration-150"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-[#18181B] transition-colors p-1 cursor-pointer"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Terms Agreement Checkbox for Signup */}
                {mode === "signup" && (
                  <div className="flex items-start gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={formData.agreeTerms}
                      onChange={(e) =>
                        setFormData({ ...formData, agreeTerms: e.target.checked })
                      }
                      className="mt-0.5 rounded text-[#064E3B] focus:ring-[#4DE3A5] border-black/20 cursor-pointer"
                    />
                    <label htmlFor="terms" className="text-[11px] text-[#71717A] leading-relaxed cursor-pointer">
                      I agree to the{" "}
                      <span className="text-[#18181B] underline underline-offset-2">
                        Terms of Service
                      </span>{" "}
                      and{" "}
                      <span className="text-[#18181B] underline underline-offset-2">
                        Privacy Policy
                      </span>
                      .
                    </label>
                  </div>
                )}

                {/* Submit Pill CTA */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-3 py-3 px-6 rounded-full bg-[#4DE3A5] hover:bg-[#60ebb0] text-[#064E3B] font-semibold text-xs sm:text-sm shadow-[0_6px_24px_rgba(77,227,165,0.35)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-[#064E3B]/40 border-t-[#064E3B] rounded-full animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>
                      {mode === "login" ? "Sign In to Dropterest" : "Create My Account"} &rarr;
                    </span>
                  )}
                </button>
              </form>

              {/* Bottom Switcher Prompt */}
              <div className="mt-8 text-center text-xs text-[#71717A]">
                {mode === "login" ? (
                  <p>
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("signup")}
                      className="font-semibold text-[#18181B] hover:underline underline-offset-2 ml-1 cursor-pointer"
                    >
                      Sign up for free
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className="font-semibold text-[#18181B] hover:underline underline-offset-2 ml-1 cursor-pointer"
                    >
                      Log in here
                    </button>
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AuthPageLayout({ initialMode = "login" }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center text-xs text-[#71717A]">Loading authentication...</div>}>
      <AuthFormContent initialMode={initialMode} />
    </Suspense>
  );
}
