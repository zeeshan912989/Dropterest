"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { authClient } from "@/lib/auth/auth-client";
import { MailCheck, AlertCircle, Loader2, ArrowRight, RefreshCw, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const emailParam = searchParams.get("email") || "";

  const [status, setStatus] = useState<"loading" | "success" | "error" | "pending">(
    token ? "loading" : "pending"
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [resending, setResending] = useState(false);
  const [emailInput, setEmailInput] = useState(emailParam);

  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      try {
        const { error } = await authClient.verifyEmail({
          query: { token },
        });

        if (error) {
          setStatus("error");
          setErrorMessage(
            error.message || "The verification link is invalid or has expired."
          );
        } else {
          setStatus("success");
          toast.success("Email verified successfully!");
          setTimeout(() => {
            router.push("/ideas");
          }, 2500);
        }
      } catch {
        setStatus("error");
        setErrorMessage("An unexpected error occurred during verification.");
      }
    };

    verify();
  }, [token, router]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) {
      toast.error("Please provide an email address.");
      return;
    }

    setResending(true);
    try {
      const { error } = await authClient.sendVerificationEmail({
        email: emailInput,
        callbackURL: "/ideas",
      });

      if (error) {
        toast.error(error.message || "Failed to resend verification link.");
      } else {
        toast.success("A new verification link has been sent to your email.");
      }
    } catch {
      toast.error("An error occurred while attempting to resend the link.");
    } finally {
      setResending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full text-center"
    >
      {status === "loading" && (
        <div className="space-y-4 py-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-black/[0.03] text-[#18181B]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
          <h2 className="font-editorial text-3xl font-normal text-[#18181B]">
            Verifying your email...
          </h2>
          <p className="text-xs sm:text-sm text-[#71717A]">
            Please wait while we confirm your email address.
          </p>
        </div>
      )}

      {status === "success" && (
        <div className="space-y-4 py-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ECFDF5] text-[#059669]">
            <MailCheck className="h-8 w-8" />
          </div>
          <h2 className="font-editorial text-3xl font-normal text-[#18181B]">
            Email Verified!
          </h2>
          <p className="text-xs sm:text-sm text-[#71717A]">
            Your email has been verified. Redirecting you to Ideas feed...
          </p>
          <div className="pt-2">
            <Link
              href="/ideas"
              className="w-full py-3.5 px-6 rounded-full bg-[#18181B] hover:bg-black text-white font-semibold text-xs sm:text-sm shadow-md inline-flex items-center justify-center gap-2"
            >
              <span>Go to Ideas</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-4 py-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h2 className="font-editorial text-3xl font-normal text-[#18181B]">
            Verification Failed
          </h2>
          <p className="text-xs sm:text-sm text-[#71717A] max-w-sm mx-auto">
            {errorMessage}
          </p>

          <form onSubmit={handleResend} className="space-y-3 pt-4 text-left">
            <div>
              <label htmlFor="resend-email" className="block text-[11px] font-mono uppercase tracking-wider text-[#71717A] mb-1.5 font-medium">
                Your email address
              </label>
              <input
                id="resend-email"
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full h-12 px-4 rounded-2xl bg-[#FAF8F5] border border-black/10 text-xs sm:text-sm text-[#18181B] placeholder:text-[#A1A1AA] outline-none focus:border-[#18181B] focus:bg-white transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={resending}
              className="w-full py-3 px-4 rounded-full bg-[#18181B] hover:bg-black text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {resending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span>Resend verification email</span>
            </button>
          </form>
        </div>
      )}

      {status === "pending" && (
        <div className="space-y-4 py-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FAF8F5] text-[#18181B]">
            <MailCheck className="h-8 w-8" />
          </div>
          <h2 className="font-editorial text-3xl font-normal text-[#18181B]">
            Check your inbox
          </h2>
          <p className="text-xs sm:text-sm text-[#71717A] max-w-sm mx-auto">
            We sent a verification link to your email address. Please click the link to activate your account.
          </p>

          <form onSubmit={handleResend} className="space-y-3 pt-4 text-left">
            <div>
              <label htmlFor="pending-email" className="block text-[11px] font-mono uppercase tracking-wider text-[#71717A] mb-1.5 font-medium">
                Didn&apos;t receive an email?
              </label>
              <input
                id="pending-email"
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full h-12 px-4 rounded-2xl bg-[#FAF8F5] border border-black/10 text-xs sm:text-sm text-[#18181B] placeholder:text-[#A1A1AA] outline-none focus:border-[#18181B] focus:bg-white transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={resending}
              className="w-full py-3 px-4 rounded-full bg-[#18181B] hover:bg-black text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {resending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span>Resend verification email</span>
            </button>
          </form>
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-black/[0.05] text-center">
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

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md bg-white rounded-3xl p-10 border border-black/[0.08] text-center text-xs text-[#71717A]">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#18181B] mb-2" />
          Loading verification...
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
