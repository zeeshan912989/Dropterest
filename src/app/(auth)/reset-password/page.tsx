"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validation/auth-schemas";
import { authClient } from "@/lib/auth/auth-client";
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password", "");

  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 12) score += 1;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score += 1;
    if (/\d/.test(pass)) score += 1;
    if (/[^a-zA-Z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strengthScore = getPasswordStrength(passwordValue);

  if (!token) {
    return (
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-black/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.04)] text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <AlertCircle className="h-7 w-7" />
        </div>
        <div>
          <h2 className="font-editorial text-2xl font-normal text-[#18181B]">
            Invalid Reset Link
          </h2>
          <p className="text-xs sm:text-sm text-[#71717A] mt-2">
            This password reset link is missing a security token or has expired.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/forgot-password"
            className="w-full py-3 px-5 rounded-full bg-[#18181B] hover:bg-black text-white font-semibold text-xs shadow-md inline-block"
          >
            Request New Reset Link
          </Link>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: ResetPasswordInput) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const { error } = await authClient.resetPassword({
        newPassword: data.password,
        token,
      });

      if (error) {
        setServerError(
          error.message || "Failed to reset password. The link may have expired."
        );
        toast.error("Failed to reset password.");
      } else {
        setIsSuccess(true);
        toast.success("Password reset successfully!");
        setTimeout(() => {
          router.push("/login");
        }, 2500);
      }
    } catch {
      setServerError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-black/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.04)] relative"
    >
      <div className="mb-8">
        <h2 className="font-editorial text-3xl font-normal text-[#18181B] tracking-tight">
          {isSuccess ? "Password updated" : "Set new password"}
        </h2>
        <p className="text-xs sm:text-sm text-[#71717A] mt-2 leading-relaxed">
          {isSuccess
            ? "Your password has been updated securely. Redirecting to login..."
            : "Choose a strong password with at least 12 characters, numbers, and symbols."}
        </p>
      </div>

      {serverError && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200/80 text-red-700 text-xs flex items-start gap-3">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p>{serverError}</p>
        </div>
      )}

      {isSuccess ? (
        <div className="text-center py-4 space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ECFDF5] text-[#059669]">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <Link
            href="/login"
            className="w-full py-3.5 px-6 rounded-full bg-[#18181B] hover:bg-black text-white font-semibold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2"
          >
            <span>Go to Login</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* New Password */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#71717A] mb-1.5 font-medium">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="••••••••••••"
                disabled={isLoading}
                {...register("password")}
                className={`w-full h-12 pl-11 pr-12 rounded-2xl bg-[#FAF8F5] border text-xs sm:text-sm text-[#18181B] placeholder:text-[#A1A1AA] outline-none transition-all ${
                  errors.password
                    ? "border-red-400 focus:border-red-500 ring-2 ring-red-100"
                    : "border-black/10 focus:border-[#18181B] focus:bg-white"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-[#18181B] transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[11px] text-red-600 mt-1 pl-1 font-medium">
                {errors.password.message}
              </p>
            )}

            {passwordValue.length > 0 && (
              <div className="mt-2 space-y-1.5">
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                        strengthScore >= step
                          ? strengthScore === 4
                            ? "bg-[#10B981]"
                            : strengthScore >= 2
                            ? "bg-[#FBBF24]"
                            : "bg-[#EF4444]"
                          : "bg-[#E4E4E7]"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#71717A] mb-1.5 font-medium">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="••••••••••••"
                disabled={isLoading}
                {...register("confirmPassword")}
                className={`w-full h-12 pl-11 pr-12 rounded-2xl bg-[#FAF8F5] border text-xs sm:text-sm text-[#18181B] placeholder:text-[#A1A1AA] outline-none transition-all ${
                  errors.confirmPassword
                    ? "border-red-400 focus:border-red-500 ring-2 ring-red-100"
                    : "border-black/10 focus:border-[#18181B] focus:bg-white"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-[#18181B] transition-colors cursor-pointer"
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-full bg-[#18181B] hover:bg-black text-white font-semibold text-xs sm:text-sm shadow-md hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Updating password...</span>
              </>
            ) : (
              <>
                <span>Update Password</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}
    </motion.div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md bg-white rounded-3xl p-10 border border-black/[0.08] text-center text-xs text-[#71717A]">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#18181B] mb-2" />
          Loading reset form...
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
