"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { X, Check, ShieldCheck, CreditCard, Sparkles, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function CheckoutModal({
  isOpen,
  onClose,
  post,
  onPurchaseSuccess,
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card"); // "card", "easypaisa", "jazzcash"
  const [licenseType, setLicenseType] = useState(post?.licenseType || "commercial");

  if (!isOpen || !post) return null;

  const price = post.price || 499;
  const currency = post.currency || "PKR";
  const platformFee = 0;
  const totalAmount = price + platformFee;

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/posts/${post.id}/buy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          licenseType,
          paymentMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Purchase failed.");
        setIsProcessing(false);
        return;
      }

      toast.success(`Purchased "${post.title}" ✦ Secure download unlocked!`);
      if (onPurchaseSuccess) {
        onPurchaseSuccess(data.purchase);
      }
      onClose();
    } catch {
      toast.error("Network error during checkout.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-black/10 overflow-hidden relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-black/[0.06] mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#E60023] text-white flex items-center justify-center font-bold text-xs">
                D
              </div>
              <h3 className="font-editorial text-2xl font-bold text-[#18181B]">
                Secure Checkout
              </h3>
            </div>
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="w-8 h-8 rounded-full hover:bg-[#F4EFE6] flex items-center justify-center text-[#71717A] hover:text-[#18181B] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Item Summary Card */}
          <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-black/[0.05] flex items-center gap-4 mb-6">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#EFEAE1] shrink-0 border border-black/10">
              <Image
                src={post.previewUrl || post.image || "/table-main.jpeg"}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-mono text-[#064E3B] bg-[#4DE3A5]/30 px-2 py-0.5 rounded-full font-semibold">
                {post.assetFileType ? post.assetFileType.toUpperCase() : "RAW ASSET"} &middot; {post.assetFileSize || "24 MB"}
              </span>
              <h4 className="font-bold text-sm text-[#18181B] truncate mt-1">
                {post.title}
              </h4>
              <p className="text-xs text-[#71717A]">
                By {post.creatorName || post.author || "Creator"}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="font-editorial text-xl font-bold text-[#18181B]">
                {currency} {price.toLocaleString()}
              </span>
            </div>
          </div>

          {/* License Selection */}
          <div className="space-y-2 mb-6">
            <label className="block text-xs font-semibold text-[#18181B]">
              License Option
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLicenseType("personal")}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  licenseType === "personal"
                    ? "border-[#18181B] bg-white ring-1 ring-[#18181B] shadow-xs"
                    : "border-black/[0.08] bg-[#FAF8F5] hover:bg-white text-[#71717A]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs text-[#18181B]">Personal License</span>
                  {licenseType === "personal" && <Check className="w-3.5 h-3.5 text-[#18181B]" />}
                </div>
                <p className="text-[10px] text-[#71717A] leading-tight">
                  For 1 personal project or non-commercial use
                </p>
              </button>

              <button
                type="button"
                onClick={() => setLicenseType("commercial")}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  licenseType === "commercial"
                    ? "border-[#18181B] bg-white ring-1 ring-[#18181B] shadow-xs"
                    : "border-black/[0.08] bg-[#FAF8F5] hover:bg-white text-[#71717A]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs text-[#18181B]">Commercial License</span>
                  {licenseType === "commercial" && <Check className="w-3.5 h-3.5 text-[#18181B]" />}
                </div>
                <p className="text-[10px] text-[#71717A] leading-tight">
                  Unlimited client &amp; commercial end products
                </p>
              </button>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2 mb-6">
            <label className="block text-xs font-semibold text-[#18181B]">
              Select Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                  paymentMethod === "card"
                    ? "border-[#18181B] bg-white shadow-xs font-semibold text-[#18181B]"
                    : "border-black/[0.08] bg-[#FAF8F5] text-[#71717A]"
                }`}
              >
                <CreditCard className="w-4 h-4 mx-auto mb-1 text-[#18181B]" />
                <span className="text-[11px] block">Credit / Debit</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("easypaisa")}
                className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                  paymentMethod === "easypaisa"
                    ? "border-[#00C853] bg-[#E8F5E9] font-semibold text-[#1B5E20] shadow-xs"
                    : "border-black/[0.08] bg-[#FAF8F5] text-[#71717A]"
                }`}
              >
                <span className="font-bold text-xs text-[#00C853] block mb-1">EP</span>
                <span className="text-[11px] block">Easypaisa</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("jazzcash")}
                className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                  paymentMethod === "jazzcash"
                    ? "border-[#D50000] bg-[#FFEBEE] font-semibold text-[#B71C1C] shadow-xs"
                    : "border-black/[0.08] bg-[#FAF8F5] text-[#71717A]"
                }`}
              >
                <span className="font-bold text-xs text-[#D50000] block mb-1">JC</span>
                <span className="text-[11px] block">JazzCash</span>
              </button>
            </div>
          </div>

          {/* Order Breakdown */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-black/[0.04] space-y-2 mb-6 text-xs">
            <div className="flex items-center justify-between text-[#71717A]">
              <span>Asset price</span>
              <span className="font-mono">{currency} {price.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-[#71717A]">
              <span>Platform fee</span>
              <span className="font-mono text-[#064E3B]">Free (PKR 0)</span>
            </div>
            <div className="pt-2 border-t border-black/[0.06] flex items-center justify-between text-sm font-bold text-[#18181B]">
              <span>Total to pay</span>
              <span className="font-editorial text-lg text-[#18181B]">{currency} {totalAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={handleCheckout}
            disabled={isProcessing}
            className="w-full py-3.5 px-6 rounded-full bg-[#E60023] hover:bg-[#CC001F] text-white font-semibold text-sm shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing Secure Payment...</span>
              </>
            ) : (
              <>
                <span>Pay {currency} {totalAmount.toLocaleString()} &amp; Unlock Download</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-[10px] text-center text-[#71717A] mt-3 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#064E3B]" />
            <span>Instant secure download token + receipt generated on purchase</span>
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
