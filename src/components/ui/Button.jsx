"use client";

import React from "react";
import { cn } from "@/lib/utils";

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  href,
  onClick,
  ...props
}) {
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-all duration-200 outline-none select-none disabled:opacity-50 disabled:pointer-events-none";

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs rounded-[5px]",
    md: "px-4 py-1.5 text-xs sm:text-sm rounded-[5px]",
    lg: "px-6 py-2 text-sm rounded-[5px]",
    icon: "p-2 rounded-[5px]",
  };

  const variantClasses = {
    primary:
      "bg-[#D8FF45] text-[#10110F] font-semibold hover:bg-[#e4ff6b] hover:shadow-[0_0_20px_rgba(216,255,69,0.35)] active:scale-[0.98]",
    ghost:
      "text-[#92938C] hover:text-[#F5F5F0] hover:bg-[#1a1b18]/60 active:scale-[0.98]",
    outline:
      "border border-[#2A2C27] text-[#F5F5F0] bg-[#141512]/70 hover:border-[#8B7CFF]/50 hover:text-[#D8FF45] active:scale-[0.98]",
    accent:
      "bg-[#8B7CFF] text-[#10110F] font-semibold hover:bg-[#a194ff] hover:shadow-[0_0_20px_rgba(139,124,255,0.35)] active:scale-[0.98]",
  };

  const combinedClasses = cn(
    baseClasses,
    sizeClasses[size] || sizeClasses.md,
    variantClasses[variant] || variantClasses.primary,
    className
  );

  if (href) {
    return (
      <a href={href} className={combinedClasses} onClick={onClick} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={combinedClasses} onClick={onClick} {...props}>
      {children}
    </button>
  );
}

export default Button;
