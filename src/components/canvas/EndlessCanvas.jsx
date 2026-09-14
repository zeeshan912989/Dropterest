"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function EndlessCanvas() {
  const containerRef = useRef(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / (innerWidth / 2);
      const y = (e.clientY - innerHeight / 2) / (innerHeight / 2);
      setMouseOffset({ x: x * 8, y: y * 8 });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[900px] lg:min-h-[1020px] py-20 px-4 sm:px-8 lg:px-16 bg-[#FAF8F5] overflow-hidden select-none flex flex-col justify-between"
    >
      {/* Top Editorial Corner Labels */}
      <div className="relative z-20 w-full max-w-7xl mx-auto flex items-center justify-between text-[10px] font-mono tracking-[0.25em] text-[#71717A] uppercase">
        <span>CURATED COLLECTION</span>
        <span className="font-semibold text-[#18181B] tracking-[0.3em]">DROPTEREST</span>
        <div className="flex flex-col gap-1 w-4 cursor-pointer hover:opacity-70 transition-opacity">
          <span className="w-full h-[1px] bg-[#18181B]" />
          <span className="w-full h-[1px] bg-[#18181B]" />
        </div>
      </div>

      {/* Main Headline */}
      <div className="relative z-20 text-center max-w-5xl mx-auto mt-8 mb-6 sm:mb-12">
        <h2 className="font-editorial text-4xl sm:text-6xl md:text-7xl lg:text-[5.75rem] text-[#18181B] leading-[1.02] font-normal tracking-[-0.03em]">
          Everything starts with a drop.
        </h2>
      </div>

      {/* Central Constellation Canvas */}
      <div className="relative z-10 w-full max-w-[1360px] mx-auto flex-1 min-h-[640px] sm:min-h-[720px] my-auto">
        
        {/* Vector Constellation Lines (SVG Connecting Thread) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          viewBox="0 0 1200 700"
          fill="none"
        >
          {/* Line 1: IDEA -> Center Drop */}
          <line
            x1="180"
            y1="180"
            x2="320"
            y2="340"
            stroke="#18181B"
            strokeWidth="1"
            strokeOpacity="0.35"
          />

          {/* Line 2: Center Fashion -> SAVE */}
          <line
            x1="320"
            y1="340"
            x2="220"
            y2="540"
            stroke="#18181B"
            strokeWidth="1"
            strokeOpacity="0.35"
          />

          {/* Line 3: Leaves -> COLLECT */}
          <line
            x1="660"
            y1="640"
            x2="840"
            y2="520"
            stroke="#18181B"
            strokeWidth="1"
            strokeOpacity="0.35"
          />

          {/* Line 4: COLLECT -> INSPIRE */}
          <line
            x1="880"
            y1="460"
            x2="940"
            y2="200"
            stroke="#18181B"
            strokeWidth="1"
            strokeOpacity="0.35"
          />
        </svg>

        {/* Floating Geometric Markers across the canvas */}
        <span className="absolute top-[28%] left-[20%] w-2 h-2 rounded-full bg-[#4DE3A5] shadow-[0_0_8px_#4DE3A5]" />
        <span className="absolute top-[18%] right-[32%] text-[#4DE3A5] text-sm font-thin">+</span>
        <span className="absolute bottom-[35%] right-[28%] text-[#DCD2F8] text-sm font-thin">+</span>
        <span className="absolute bottom-[32%] left-[34%] text-[#DCD2F8] text-sm rotate-45">▲</span>
        <span className="absolute bottom-[18%] right-[38%] text-[#DCD2F8] text-[9px] rotate-180">▲</span>

        {/* Margins Subtle Technical Text */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[9px] font-mono tracking-[0.25em] text-[#71717A] uppercase -rotate-90 origin-left hidden xl:block">
          VISUAL JOURNEY
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[9px] font-mono tracking-[0.25em] text-[#71717A] uppercase rotate-90 origin-right hidden xl:block">
          VISUAL JOURNEY
        </div>

        {/* ========================================================= */}
        {/* 1. TOP-LEFT: Brutalist Architecture + "IDEA" Label */}
        {/* ========================================================= */}
        <div
          className="absolute left-[3%] sm:left-[5%] top-[6%] sm:top-[8%] z-20 transition-transform duration-500 ease-out"
          style={{ transform: `translate3d(${mouseOffset.x * -0.6}px, ${mouseOffset.y * -0.6}px, 0)` }}
        >
          <div className="relative flex items-center gap-4">
            <div className="w-28 sm:w-36 aspect-square rounded-[5px] overflow-hidden shadow-[0_12px_28px_rgba(0,0,0,0.08)] rotate-[-2deg] hover:rotate-0 transition-transform duration-300 bg-white border border-black/[0.08] p-1">
              <div className="relative w-full h-full rounded-[4px] overflow-hidden">
                <Image src="/architecture-modern.jpeg" alt="Architecture" fill className="object-cover grayscale contrast-125" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-px bg-[#18181B]/40" />
              <span className="text-xs font-mono font-medium tracking-widest text-[#18181B]">
                IDEA
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. MID-LEFT: Haute Couture Fabric Sculpture + "Drop this" */}
        {/* ========================================================= */}
        <div
          className="absolute left-[20%] sm:left-[23%] top-[24%] sm:top-[26%] z-30 transition-transform duration-500 ease-out"
          style={{ transform: `translate3d(${mouseOffset.x * -1}px, ${mouseOffset.y * -1}px, 0)` }}
        >
          <div className="relative">
            <div className="w-32 sm:w-44 aspect-[3/4] rounded-[5px] overflow-hidden shadow-[0_16px_36px_rgba(0,0,0,0.1)] rotate-[1.5deg] hover:rotate-0 transition-transform duration-300 bg-white border border-black/[0.08] p-1">
              <div className="relative w-full h-full rounded-[4px] overflow-hidden">
                <Image src="/fashion-textiles.jpeg" alt="Fabric sculpture" fill className="object-cover" />
              </div>
            </div>
            {/* "Drop this" Tooltip Indicator with Green Target */}
            <div className="absolute -bottom-3 -right-6 flex items-center gap-1.5 z-40 bg-white/95 backdrop-blur-md px-3 py-1 rounded-[5px] shadow-md border border-black/[0.08]">
              <span className="w-3 h-3 rounded-[2px] border-2 border-[#4DE3A5] bg-white flex items-center justify-center">
                <span className="w-1 h-1 rounded-[1px] bg-[#4DE3A5]" />
              </span>
              <span className="text-[10px] font-medium text-[#18181B] whitespace-nowrap">
                Drop this
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. CENTER VISUAL: The Organic Floating "DROP" Object */}
        {/* ========================================================= */}
        <div
          className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center transition-transform duration-700 ease-out"
          style={{ transform: `translate3d(calc(-50% + ${mouseOffset.x * 0.4}px), calc(-50% + ${mouseOffset.y * 0.4}px), 0)` }}
        >
          {/* Square UI Precision Pebble Shape */}
          <div className="relative w-52 sm:w-64 md:w-72 aspect-square rounded-[5px] bg-gradient-to-br from-[#FFFFFF] via-[#F4F1EA] to-[#EAE4D8] border border-black/[0.08] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1),0_0_0_1px_rgba(255,255,255,0.8)_inset] flex items-center justify-center rotate-3 hover:rotate-0 transition-transform duration-500">
            
            {/* Center Glowing Mint Drop Icon */}
            <div className="relative w-10 h-10 rounded-[5px] bg-gradient-to-b from-[#8EF4C8] to-[#4DE3A5] shadow-[0_0_24px_rgba(77,227,165,0.8)] flex items-center justify-center animate-pulse border border-[#4DE3A5]">
              <span className="w-2.5 h-2.5 rounded-[1px] bg-white opacity-90" />
            </div>

            {/* 4 Cardinal Orientation Markers */}
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-2 rounded-[1px] bg-[#4DE3A5] shadow-[0_0_8px_#4DE3A5]" />
            <span className="absolute top-1/2 -right-3 -translate-y-1/2 text-[#DCD2F8] text-[10px] rotate-90 font-mono">▲</span>
            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[#DCD2F8] text-[10px] rotate-180 font-mono">▲</span>
            <span className="absolute top-1/2 -left-3 -translate-y-1/2 w-2 h-2 rounded-[1px] bg-[#4DE3A5] shadow-[0_0_8px_#4DE3A5]" />
          </div>
        </div>

        {/* ========================================================= */}
        {/* 4. BOTTOM-LEFT: Sculptural Ceramic Vase + "SAVE" */}
        {/* ========================================================= */}
        <div
          className="absolute left-[6%] sm:left-[8%] bottom-[6%] sm:bottom-[8%] z-20 transition-transform duration-500 ease-out"
          style={{ transform: `translate3d(${mouseOffset.x * -0.8}px, ${mouseOffset.y * -0.8}px, 0)` }}
        >
          <div className="relative flex items-center gap-4">
            <div className="w-28 sm:w-36 aspect-[4/5] rounded-[5px] overflow-hidden shadow-[0_12px_28px_rgba(0,0,0,0.08)] rotate-[-2deg] hover:rotate-0 transition-transform duration-300 bg-white border border-black/[0.08] p-1">
              <div className="relative w-full h-full rounded-[4px] overflow-hidden">
                <Image src="/ceramics.jpeg" alt="Ceramic vase" fill className="object-cover" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-px bg-[#18181B]/40" />
              <span className="text-xs font-mono font-medium tracking-widest text-[#18181B]">
                SAVE
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 5. BOTTOM-CENTER: Earthy Leaves & Pebble Flatlay */}
        {/* ========================================================= */}
        <div
          className="absolute left-[44%] sm:left-[46%] bottom-0 z-20 transition-transform duration-500 ease-out"
          style={{ transform: `translate3d(${mouseOffset.x * 0.5}px, ${mouseOffset.y * 0.5}px, 0)` }}
        >
          <div className="w-32 sm:w-44 aspect-square rounded-[5px] overflow-hidden shadow-[0_14px_32px_rgba(0,0,0,0.09)] rotate-[2deg] hover:rotate-0 transition-transform duration-300 bg-white border border-black/[0.08] p-1">
            <div className="relative w-full h-full rounded-[4px] overflow-hidden">
              <Image src="/table-main.jpeg" alt="Natural textures" fill className="object-cover" />
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 6. BOTTOM-RIGHT: Minimalist Shelf & Twisted Sculpture + "COLLECT" */}
        {/* ========================================================= */}
        <div
          className="absolute right-[8%] sm:right-[12%] bottom-[10%] sm:bottom-[12%] z-20 transition-transform duration-500 ease-out"
          style={{ transform: `translate3d(${mouseOffset.x * 0.9}px, ${mouseOffset.y * 0.9}px, 0)` }}
        >
          <div className="relative flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-medium tracking-widest text-[#18181B]">
                COLLECT
              </span>
              <span className="w-6 h-px bg-[#18181B]/40" />
            </div>
            <div className="w-32 sm:w-40 aspect-[4/5] rounded-[5px] overflow-hidden shadow-[0_14px_32px_rgba(0,0,0,0.09)] rotate-[-1.5deg] hover:rotate-0 transition-transform duration-300 bg-white border border-black/[0.08] p-1">
              <div className="relative w-full h-full rounded-[4px] overflow-hidden">
                <Image src="/product-design.jpeg" alt="Curated shelf object" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 7. TOP-RIGHT: Minimalist Chair in Sunlit Interior + "INSPIRE" */}
        {/* ========================================================= */}
        <div
          className="absolute right-[5%] sm:right-[8%] top-[10%] sm:top-[12%] z-20 transition-transform duration-500 ease-out"
          style={{ transform: `translate3d(${mouseOffset.x * 0.7}px, ${mouseOffset.y * 0.7}px, 0)` }}
        >
          <div className="relative flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-medium tracking-widest text-[#18181B]">
                INSPIRE
              </span>
              <span className="w-6 h-px bg-[#18181B]/40" />
            </div>
            <div className="w-28 sm:w-36 aspect-[4/5] rounded-[5px] overflow-hidden shadow-[0_12px_28px_rgba(0,0,0,0.08)] rotate-[2.5deg] hover:rotate-0 transition-transform duration-300 bg-white border border-black/[0.08] p-1">
              <div className="relative w-full h-full rounded-[4px] overflow-hidden">
                <Image src="/furniture-chair.jpeg" alt="Minimalist armchair" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Editorial Corner Labels */}
      <div className="relative z-20 w-full max-w-7xl mx-auto flex items-center justify-between text-[10px] font-mono tracking-[0.25em] text-[#71717A] uppercase mt-12">
        <span>CURATED COLLECTION</span>
        <span>CREATIVE FLOW</span>
      </div>
    </section>
  );
}
