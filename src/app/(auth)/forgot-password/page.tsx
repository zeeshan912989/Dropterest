"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validation/auth-schemas";
import { authClient } from "@/lib/auth/auth-client";
import { Mail, Loader2, ArrowLeft, CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true);

    try {
      await authClient.requestPasswordReset({
        email: data.email,
        redirectTo: "/reset-password",
      });

      setSubmitted(true);
      toast.success("If an account exists with that email, a reset link has been sent.");
    } catch {
      setSubmitted(true);
      toast.success("If an account exists with that email, a reset link has been sent.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full max-w-sm sm:max-w-md mx-auto"
    >
      <div className="mb-6">
        <h2 className="font-editorial text-2xl sm:text-3xl font-normal text-[#18181B] tracking-tight">
          {submitted ? "Check your inbox" : "Reset password"}
        </h2>
        <p className="text-xs text-[#71717A] mt-1 leading-relaxed">
          {submitted
            ? "We sent password reset instructions if your email exists in our system."
            : "Enter your email address and we'll send you a secure link to reset your password."}
        </p>
      </div>

      {submitted ? (
        <div className="space-y-4 text-center py-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#ECFDF5] text-[#059669]">
            <CheckCircle2 className="h-6 w-6" />
          </div>

          <div className="rounded-xl border border-black/5 bg-black/[0.02] p-3.5 text-xs text-[#71717A] leading-relaxed text-left">
            <p className="font-semibold text-[#18181B] mb-0.5">Didn&apos;t receive an email?</p>
            <p>
              Check your spam folder or ensure you entered the correct email address.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="text-xs font-semibold text-[#18181B] hover:underline cursor-pointer"
          >
            Try another email address
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5" noValidate>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-[10px] font-mono uppercase tracking-wider text-[#71717A] mb-1 font-medium"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A1A1AA]" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                disabled={isLoading}
                {...register("email")}
                className={`w-full h-11 pl-9 pr-3.5 rounded-xl bg-black/[0.03] border text-xs text-[#18181B] placeholder:text-[#A1A1AA] outline-none transition-all ${
                  errors.email
                    ? "border-red-400 focus:border-red-500 bg-red-50/30"
                    : "border-black/10 focus:border-[#18181B] focus:bg-white"
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-[10px] text-red-600 mt-0.5 pl-1 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-6 rounded-full bg-[#18181B] hover:bg-black text-white font-semibold text-xs shadow-sm hover:scale-[1.005] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Sending reset link...</span>
              </>
            ) : (
              <>
                <span>Send Reset Link</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      )}

      {/* Back to Login */}
      <div className="mt-6 pt-4 border-t border-black/[0.05] text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#71717A] hover:text-[#18181B] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to log in</span>
        </Link>
      </div>
    </motion.div>
  );
}
