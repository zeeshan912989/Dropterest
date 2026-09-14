"use client";

import React from "react";

export default function Hero() {
  return (
    <section className="relative w-full pt-40 sm:pt-48 pb-8 sm:pb-12 px-4 sm:px-6 flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Editorial Headline */}
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[5px] bg-[#EFEAE1] border border-black/[0.06] text-xs font-mono font-medium text-[#71717A] mb-8">
          <span className="w-1.5 h-1.5 rounded-[1px] bg-[#064E3B]" />
          <span>VISUAL DISCOVERY &amp; DIGITAL ASSETS</span>
        </div>

        <h1 className="font-editorial text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] text-[#18181B] leading-[1.12] font-normal tracking-[-0.02em]">
          The{" "}
          <span className="inline-flex items-center justify-center bg-[#A594FD]/35 text-[#18181B] px-3 sm:px-4 py-0 sm:py-0.5 rounded-[5px] mx-1 sm:mx-1.5 align-baseline font-editorial shadow-xs">
            creative
          </span>{" "}
          operating <br className="hidden sm:inline" />
          system for{" "}
          <span className="inline-flex items-center justify-center bg-[#4EEDA4] text-[#0A261A] px-5 sm:px-8 py-0.5 sm:py-1 rounded-[5px] mx-1 sm:mx-1.5 align-baseline font-editorial font-medium shadow-xs">
            discovery.
          </span>
        </h1>

        {/* Supporting Subtitle */}
        <p className="mt-7 sm:mt-9 text-base sm:text-lg md:text-[1.15rem] text-[#52525B] max-w-2xl mx-auto leading-relaxed font-normal">
          Dropterest connects visual curation, digital asset downloads, and creator monetization as one infinite system. Collect inspiration, share drops, and earn from your creativity.
        </p>

        {/* Action Buttons */}
        <div className="mt-9 sm:mt-10 flex flex-wrap items-center justify-center gap-3.5">
          <a
            href="/ideas"
            className="inline-flex items-center justify-center px-7 py-3.5 bg-[#18181B] text-[#FFFFFF] text-sm font-semibold rounded-[5px] hover:bg-black active:scale-[0.98] transition-all shadow-md"
          >
            Explore Visual Ideas &rarr;
          </a>
          <a
            href="/motize"
            className="inline-flex items-center justify-center px-7 py-3.5 bg-white border border-black/15 text-[#18181B] text-sm font-semibold rounded-[5px] hover:bg-[#FAF8F5] hover:border-black/30 active:scale-[0.98] transition-all shadow-xs"
          >
            Motize Monetization ✦
          </a>
        </div>
      </div>
    </section>
  );
}
