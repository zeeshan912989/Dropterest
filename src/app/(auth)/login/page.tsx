"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validation/auth-schemas";
import { signIn } from "@/lib/auth/auth-client";
import { Eye, EyeOff, Lock, Mail, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/ideas";

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const response = await signIn.email({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      });

      if (response.error) {
        setServerError("Invalid email or password. Please verify your credentials.");
        toast.error("Authentication failed. Please verify your details.");
        setIsLoading(false);
        return;
      }

      toast.success("Welcome back! Signed in successfully ✦");
      
      let targetPath = redirectPath;
      if (targetPath.startsWith("http://") || targetPath.startsWith("https://")) {
        try {
          const parsed = new URL(targetPath);
          targetPath = parsed.pathname + parsed.search;
        } catch {
          targetPath = "/ideas";
        }
      }
      if (!targetPath.startsWith("/")) {
        targetPath = `/${targetPath}`;
      }

      window.location.href = targetPath;
    } catch (err) {
      console.error("[LOGIN ERROR]:", err);
      setServerError("An unexpected authentication error occurred. Please try again.");
      toast.error("Authentication error. Please retry.");
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full"
    >
      {/* Title & Subtitle */}
      <div className="mb-8">
        <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-[#18181B] tracking-tight">
          Welcome back
        </h2>
        <p className="text-xs sm:text-sm text-[#71717A] mt-1.5">
          Enter your credentials to access your drops and workspace.
        </p>
      </div>

      {/* Server Error Alert */}
      {serverError && (
        <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200/80 text-red-700 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p>{serverError}</p>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-[#71717A] mb-1.5 font-medium">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
            <input
              {...register("email")}
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
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

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#71717A] font-medium">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-[#71717A] hover:text-[#18181B] font-medium transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
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
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[11px] text-red-600 mt-1 pl-1 font-medium">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center gap-2 pt-0.5">
          <input
            {...register("rememberMe")}
            id="rememberMe"
            type="checkbox"
            className="w-4 h-4 rounded accent-[#18181B] cursor-pointer"
          />
          <label
            htmlFor="rememberMe"
            className="text-xs text-[#71717A] cursor-pointer select-none"
          >
            Remember me on this device
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-6 rounded-full bg-[#18181B] hover:bg-black text-white font-semibold text-xs sm:text-sm shadow-md hover:scale-[1.005] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center gap-2 mt-3"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Signup */}
      <div className="mt-8 pt-4 border-t border-black/[0.06] text-center">
        <p className="text-xs text-[#71717A]">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-bold text-[#18181B] hover:underline ml-1"
          >
            Create free account
          </Link>
        </p>
      </div>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full text-center text-xs text-[#71717A] py-12">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#18181B] mb-2" />
          Loading authentication form...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
