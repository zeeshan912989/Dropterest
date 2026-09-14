"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupInput } from "@/lib/validation/auth-schemas";
import { signUp } from "@/lib/auth/auth-client";
import { Eye, EyeOff, Lock, Mail, User, AtSign, ArrowRight, Loader2, AlertCircle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";

export default function SignupPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessVerificationRequired, setIsSuccessVerificationRequired] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
  });

  const passwordValue = watch("password") || "";

  // Password strength score calculation (0 - 4)
  const passwordStrength = useMemo(() => {
    let score = 0;
    if (passwordValue.length >= 12) score += 1;
    if (/[A-Z]/.test(passwordValue)) score += 1;
    if (/[0-9]/.test(passwordValue)) score += 1;
    if (/[^A-Za-z0-9]/.test(passwordValue)) score += 1;
    return score;
  }, [passwordValue]);

  const onSubmit = async (data: SignupInput) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const response = await signUp.email({
        email: data.email,
        password: data.password,
        name: data.displayName,
      });

      if (response.error) {
        const errorMsg = response.error.message || "Failed to create account. Please verify your details.";
        setServerError(errorMsg);
        toast.error(errorMsg);
        setIsLoading(false);
        return;
      }

      setRegisteredEmail(data.email);
      toast.success("Account created successfully ✦");
      
      setIsSuccessVerificationRequired(true);
      setTimeout(() => {
        window.location.href = "/ideas";
      }, 1500);
    } catch (err: unknown) {
      console.error("[SIGNUP ERROR]:", err);
      const message = err instanceof Error ? err.message : "An unexpected signup error occurred. Please try again.";
      setServerError(message);
      toast.error("Signup error. Please check your details.");
      setIsLoading(false);
    }
  };

  if (isSuccessVerificationRequired) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full text-center py-8"
      >
        <div className="w-16 h-16 rounded-full bg-[#ECFDF5] text-[#059669] flex items-center justify-center mx-auto mb-4 shadow-xs">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <h2 className="font-editorial text-3xl font-normal text-[#18181B] mb-2">
          Account Created
        </h2>

        <p className="text-xs sm:text-sm text-[#71717A] leading-relaxed mb-6">
          Welcome to Dropterest! Your account for{" "}
          <strong className="text-[#18181B]">{registeredEmail}</strong> is ready.
          Redirecting to Ideas feed...
        </p>

        <Link
          href="/ideas"
          className="w-full py-3.5 px-6 rounded-full bg-[#18181B] hover:bg-black text-white font-semibold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2"
        >
          <span>Go to Ideas</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full"
    >
      {/* Title & Subtitle */}
      <div className="mb-6">
        <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-[#18181B] tracking-tight">
          Create your account
        </h2>
        <p className="text-xs sm:text-sm text-[#71717A] mt-1.5">
          Start curating and saving inspiration in seconds.
        </p>
      </div>

      {/* Server Error Alert */}
      {serverError && (
        <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200/80 text-red-700 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p>{serverError}</p>
        </div>
      )}

      {/* Signup Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* 1. Full Name */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-[#71717A] mb-1.5 font-medium">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
            <input
              {...register("displayName")}
              type="text"
              placeholder="Elena Rostova"
              className={`w-full h-11 pl-11 pr-4 rounded-2xl bg-black/[0.03] border text-xs sm:text-sm text-[#18181B] placeholder:text-[#A1A1AA] outline-none transition-all ${
                errors.displayName
                  ? "border-red-400 focus:border-red-500 bg-red-50/20"
                  : "border-black/10 focus:border-[#18181B] focus:bg-white"
              }`}
            />
          </div>
          {errors.displayName && (
            <p className="text-[11px] text-red-600 mt-1 pl-1 font-medium">
              {errors.displayName.message}
            </p>
          )}
        </div>

        {/* 2. Username */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-[#71717A] mb-1.5 font-medium">
            Username
          </label>
          <div className="relative">
            <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
            <input
              {...register("username")}
              type="text"
              placeholder="elena_studio"
              className={`w-full h-11 pl-11 pr-4 rounded-2xl bg-black/[0.03] border text-xs sm:text-sm text-[#18181B] placeholder:text-[#A1A1AA] outline-none font-mono transition-all ${
                errors.username
                  ? "border-red-400 focus:border-red-500 bg-red-50/20"
                  : "border-black/10 focus:border-[#18181B] focus:bg-white"
              }`}
            />
          </div>
          {errors.username && (
            <p className="text-[11px] text-red-600 mt-1 pl-1 font-medium">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* 3. Email Address */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-[#71717A] mb-1.5 font-medium">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
            <input
              {...register("email")}
              type="email"
              placeholder="elena@example.com"
              className={`w-full h-11 pl-11 pr-4 rounded-2xl bg-black/[0.03] border text-xs sm:text-sm text-[#18181B] placeholder:text-[#A1A1AA] outline-none transition-all ${
                errors.email
                  ? "border-red-400 focus:border-red-500 bg-red-50/20"
                  : "border-black/10 focus:border-[#18181B] focus:bg-white"
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-[11px] text-red-600 mt-1 pl-1 font-medium">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* 4. Password */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-[#71717A] mb-1.5 font-medium">
            Password (min. 12 characters)
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              className={`w-full h-11 pl-11 pr-11 rounded-2xl bg-black/[0.03] border text-xs sm:text-sm text-[#18181B] placeholder:text-[#A1A1AA] outline-none transition-all ${
                errors.password
                  ? "border-red-400 focus:border-red-500 bg-red-50/20"
                  : "border-black/10 focus:border-[#18181B] focus:bg-white"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-[#18181B] transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Password Strength Meter */}
          {passwordValue.length > 0 && (
            <div className="mt-1.5 space-y-1">
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                      passwordStrength >= step
                        ? passwordStrength === 4
                          ? "bg-[#10B981]"
                          : passwordStrength >= 2
                          ? "bg-[#FBBF24]"
                          : "bg-[#EF4444]"
                        : "bg-black/10"
                    }`}
                  />
                ))}
              </div>
              <p className="text-[10px] text-[#71717A] font-mono">
                {passwordStrength === 4
                  ? "Strong password (12+ chars, uppercase, number & symbol)"
                  : "Requires uppercase, number, symbol & min. 12 chars"}
              </p>
            </div>
          )}

          {errors.password && (
            <p className="text-[11px] text-red-600 mt-1 pl-1 font-medium">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* 5. Confirm Password */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-[#71717A] mb-1.5 font-medium">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
            <input
              {...register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••••••"
              className={`w-full h-11 pl-11 pr-11 rounded-2xl bg-black/[0.03] border text-xs sm:text-sm text-[#18181B] placeholder:text-[#A1A1AA] outline-none transition-all ${
                errors.confirmPassword
                  ? "border-red-400 focus:border-red-500 bg-red-50/20"
                  : "border-black/10 focus:border-[#18181B] focus:bg-white"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-[#18181B] transition-colors cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-[11px] text-red-600 mt-1 pl-1 font-medium">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* 6. Terms Acceptance */}
        <div className="pt-1">
          <div className="flex items-center gap-2.5">
            <input
              {...register("termsAccepted")}
              id="termsAccepted"
              type="checkbox"
              className="w-4 h-4 rounded accent-[#18181B] cursor-pointer"
            />
            <label
              htmlFor="termsAccepted"
              className="text-xs text-[#71717A] leading-tight cursor-pointer select-none"
            >
              I agree to Dropterest&apos;s{" "}
              <Link href="/terms" className="font-semibold text-[#18181B] underline">
                Terms of Service
              </Link>{" "}
              &amp;{" "}
              <Link href="/privacy" className="font-semibold text-[#18181B] underline">
                Privacy Policy
              </Link>
              .
            </label>
          </div>
          {errors.termsAccepted && (
            <p className="text-[11px] text-red-600 mt-1 pl-1 font-medium">
              {errors.termsAccepted.message}
            </p>
          )}
        </div>

        {/* 7. Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-6 rounded-full bg-[#18181B] hover:bg-black text-white font-semibold text-xs sm:text-sm shadow-md hover:scale-[1.005] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center gap-2 mt-3"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* 8. Switch to Login */}
      <div className="mt-6 pt-4 border-t border-black/[0.06] text-center">
        <p className="text-xs text-[#71717A]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-[#18181B] hover:underline ml-1"
          >
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
