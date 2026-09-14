"use client";

import React, { useState } from "react";
import Image from "next/image";

export default function CuriosityFeature() {
  const [activeStep, setActiveStep] = useState(0);
  const [collectedCount, setCollectedCount] = useState(24);
  const [savedItems, setSavedItems] = useState({ 1: true, 2: true, 3: false });

  const toggleItemSave = (id) => {
    setSavedItems((prev) => {
      const nextState = !prev[id];
      setCollectedCount((c) => (nextState ? c + 1 : c - 1));
      return { ...prev, [id]: nextState };
    });
  };

  return (
    <section className="relative w-full pt-4 sm:pt-8 pb-24 sm:pb-32 bg-[#FAF8F5] overflow-hidden">
      {/* Section Header */}
      <div className="max-w-4xl mx-auto text-center px-4 mb-16 sm:mb-20">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-[5px] bg-[#EAE6DE] border border-black/[0.06] text-[#71717A] text-xs font-mono uppercase tracking-widest mb-5">
          <span className="w-1.5 h-1.5 rounded-[1px] bg-[#18181B]" />
          THE DROPTEREST WORKFLOW
        </div>
        <h2 className="font-editorial text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem] text-[#18181B] leading-[1.06] font-normal tracking-[-0.025em]">
          Made for curiosity.
        </h2>
        <p className="mt-5 sm:mt-6 text-base sm:text-lg md:text-[1.15rem] text-[#52525B] max-w-xl mx-auto leading-relaxed font-normal">
          Find something unexpected. Follow the idea. Go deeper.
        </p>

        {/* Step Navigation Switcher */}
        <div className="mt-8 inline-flex items-center p-1.5 bg-[#F0ECE1] rounded-[5px] border border-black/[0.06] shadow-inner gap-1">
          {[
            { label: "01 — DISCOVER", color: "bg-[#4DE3A5] text-[#064E3B]" },
            { label: "02 — COLLECT", color: "bg-[#DCD2F8] text-[#1E1B4B]" },
            { label: "03 — CREATE", color: "bg-[#18181B] text-white" },
          ].map((tab, idx) => (
            <button
              key={tab.label}
              type="button"
              onClick={() => setActiveStep(idx)}
              className={`px-5 py-2 rounded-[5px] text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                activeStep === idx
                  ? `${tab.color} shadow-xs scale-100`
                  : "text-[#71717A] hover:text-[#18181B] hover:bg-white/60"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* ============================================================ */}
          {/* 01 — DISCOVER: Full-Bleed Dynamic Visual Cascade (Cols 1-4) */}
          {/* ============================================================ */}
          <div
            onClick={() => setActiveStep(0)}
            className={`lg:col-span-4 rounded-[5px] bg-white border transition-all duration-500 overflow-hidden flex flex-col justify-between cursor-pointer group ${
              activeStep === 0
                ? "border-[#4DE3A5] shadow-[0_16px_40px_-12px_rgba(77,227,165,0.3)] ring-2 ring-[#4DE3A5]/30"
                : "border-black/[0.08] shadow-[0_8px_24px_-8px_rgba(0,0,0,0.06)] hover:shadow-lg"
            }`}
          >
            {/* Header */}
            <div className="p-7 pb-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#064E3B] font-bold block mb-1">
                  STAGE 01
                </span>
                <h3 className="font-editorial text-2xl sm:text-3xl text-[#18181B] font-normal">
                  Discover
                </h3>
              </div>
              <div className="w-8 h-8 rounded-[5px] bg-[#B9F5D8] flex items-center justify-center text-[#064E3B] font-bold text-xs shadow-xs">
                01
              </div>
            </div>

            {/* Visual Body: Staggered Image Stream */}
            <div className="p-6 pt-2 flex-1 flex flex-col justify-between gap-4">
              <p className="text-xs text-[#71717A] leading-relaxed">
                An infinite, algorithm-free stream of architecture, objects, and tactile references.
              </p>

              {/* Dynamic Overlapping Cards */}
              <div className="relative h-[320px] rounded-[5px] bg-[#FAF8F5] p-3 overflow-hidden border border-black/[0.04]">
                {/* Image 1 (Back Layer) */}
                <div className="absolute top-3 left-3 w-40 h-48 rounded-[5px] overflow-hidden shadow-xs -rotate-4 group-hover:-rotate-6 transition-transform duration-500">
                  <Image src="/vintage-graphic.jpeg" alt="Typography" fill className="object-cover" />
                </div>

                {/* Image 2 (Front Focal Layer) */}
                <div className="absolute top-10 right-3 w-44 h-56 rounded-[5px] overflow-hidden shadow-md rotate-3 group-hover:rotate-1 group-hover:scale-105 transition-all duration-500 border border-white">
                  <Image src="/ceramics.jpeg" alt="Ceramics" fill className="object-cover" />
                  <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-[5px] text-[9px] font-bold text-[#18181B] shadow-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-[1px] bg-[#4DE3A5] animate-pulse" />
                    Sculptural Craft
                  </div>
                </div>

                {/* Image 3 (Bottom Layer) */}
                <div className="absolute -bottom-6 left-6 w-36 h-32 rounded-[5px] overflow-hidden shadow-xs rotate-2 group-hover:rotate-0 transition-transform duration-500">
                  <Image src="/travel-cove.jpeg" alt="Coast" fill className="object-cover" />
                </div>
              </div>

              {/* Interactive Tag Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="px-3 py-1 rounded-[5px] bg-[#F4F1EA] text-[10px] font-medium text-[#18181B]">
                  #Architecture
                </span>
                <span className="px-3 py-1 rounded-[5px] bg-[#F4F1EA] text-[10px] font-medium text-[#18181B]">
                  #NordicCeramics
                </span>
                <span className="px-3 py-1 rounded-[5px] bg-[#B9F5D8] text-[10px] font-semibold text-[#064E3B]">
                  Live Stream ↗
                </span>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* 02 — COLLECT: Interactive Moodboard & Bookmark Hub (Cols 5-8) */}
          {/* ============================================================ */}
          <div
            onClick={() => setActiveStep(1)}
            className={`lg:col-span-4 rounded-[5px] bg-white border transition-all duration-500 overflow-hidden flex flex-col justify-between cursor-pointer group ${
              activeStep === 1
                ? "border-[#DCD2F8] shadow-[0_16px_40px_-12px_rgba(220,210,248,0.5)] ring-2 ring-[#DCD2F8]/40"
                : "border-black/[0.08] shadow-[0_8px_24px_-8px_rgba(0,0,0,0.06)] hover:shadow-lg"
            }`}
          >
            {/* Header */}
            <div className="p-7 pb-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#4338CA] font-bold block mb-1">
                  STAGE 02
                </span>
                <h3 className="font-editorial text-2xl sm:text-3xl text-[#18181B] font-normal">
                  Collect
                </h3>
              </div>
              <div className="w-8 h-8 rounded-[5px] bg-[#DDD4FA] flex items-center justify-center text-[#231A54] font-bold text-xs shadow-xs">
                02
              </div>
            </div>

            {/* Visual Body: Interactive Moodboard Grid */}
            <div className="p-6 pt-2 flex-1 flex flex-col justify-between gap-4">
              <p className="text-xs text-[#71717A] leading-relaxed">
                Organize inspirations into bespoke boards with instant tactile pinning.
              </p>

              {/* Moodboard Frame */}
              <div className="relative h-[320px] rounded-[5px] bg-[#FAF8F5] p-3.5 flex flex-col justify-between border border-black/[0.04]">
                {/* Board Info Bar */}
                <div className="flex items-center justify-between bg-white px-3 py-1.5 rounded-[5px] shadow-xs border border-black/[0.04]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-[1px] bg-[#DCD2F8]" />
                    <span className="text-xs font-semibold text-[#18181B]">Material & Space</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#71717A]">{collectedCount} items</span>
                </div>

                {/* 2x2 Grid of Collectible Pieces */}
                <div className="grid grid-cols-2 gap-2 my-auto">
                  <div className="relative aspect-square rounded-[5px] overflow-hidden shadow-xs group/item">
                    <Image src="/textiles.jpeg" alt="Textile swatch" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleItemSave(1);
                      }}
                      className="absolute top-1.5 right-1.5 w-7 h-7 rounded-[5px] bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#18181B] shadow-xs hover:scale-105 transition-transform cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill={savedItems[1] ? "#4338CA" : "none"} stroke="currentColor" strokeWidth="2">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                      </svg>
                    </button>
                  </div>

                  <div className="relative aspect-square rounded-[5px] overflow-hidden shadow-xs group/item">
                    <Image src="/furniture-chair.jpeg" alt="Furniture piece" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleItemSave(2);
                      }}
                      className="absolute top-1.5 right-1.5 w-7 h-7 rounded-[5px] bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#18181B] shadow-xs hover:scale-105 transition-transform cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill={savedItems[2] ? "#4338CA" : "none"} stroke="currentColor" strokeWidth="2">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Color Palette Strip */}
                <div className="flex items-center justify-between bg-white px-3 py-1.5 rounded-[5px] border border-black/[0.04]">
                  <span className="text-[10px] text-[#71717A] font-medium font-mono">Palette:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-[2px] bg-[#B89B7E]" />
                    <span className="w-3.5 h-3.5 rounded-[2px] bg-[#DDD4FA]" />
                    <span className="w-3.5 h-3.5 rounded-[2px] bg-[#4DE3A5]" />
                    <span className="w-3.5 h-3.5 rounded-[2px] bg-[#231A54]" />
                  </div>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[#71717A]">Auto-synced across collections</span>
                <span className="font-semibold text-[#4338CA]">✓ Saved</span>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* 03 — CREATE: Creative Studio Canvas (Cols 9-12) */}
          {/* ============================================================ */}
          <div
            onClick={() => setActiveStep(2)}
            className={`lg:col-span-4 rounded-[5px] bg-white border transition-all duration-500 overflow-hidden flex flex-col justify-between cursor-pointer group ${
              activeStep === 2
                ? "border-[#18181B] shadow-[0_16px_40px_-12px_rgba(24,24,27,0.25)] ring-2 ring-[#18181B]/20"
                : "border-black/[0.08] shadow-[0_8px_24px_-8px_rgba(0,0,0,0.06)] hover:shadow-lg"
            }`}
          >
            {/* Header */}
            <div className="p-7 pb-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#18181B] font-bold block mb-1">
                  STAGE 03
                </span>
                <h3 className="font-editorial text-2xl sm:text-3xl text-[#18181B] font-normal">
                  Create
                </h3>
              </div>
              <div className="w-8 h-8 rounded-[5px] bg-[#18181B] flex items-center justify-center text-white font-bold text-xs shadow-xs">
                03
              </div>
            </div>

            {/* Visual Body: Canvas Assembly */}
            <div className="p-6 pt-2 flex-1 flex flex-col justify-between gap-4">
              <p className="text-xs text-[#71717A] leading-relaxed">
                Synthesize collected fragments into new concepts, decks, and design directions.
              </p>

              {/* Interactive Canvas */}
              <div className="relative h-[320px] rounded-[5px] bg-[#FAF8F5] p-3 flex items-center justify-center overflow-hidden border border-black/[0.04]">
                {/* Layer 1: Sketch Sheet with Tape */}
                <div className="absolute top-3 left-3 w-36 h-36 bg-white rounded-[5px] shadow-xs border border-black/[0.06] p-3 rotate-[-3deg] group-hover:rotate-0 transition-transform duration-500 flex flex-col justify-between">
                  <div className="w-8 h-2.5 bg-[#EAE2D0] rounded-[1px] self-center -mt-4 shadow-xs" />
                  <div className="text-[8px] font-mono text-[#71717A]">SKETCH_01</div>
                  <svg className="w-full h-14 text-[#18181B]/40" viewBox="0 0 100 40" fill="none" stroke="currentColor">
                    <path d="M10 25 Q 30 5, 50 20 T 90 12" strokeWidth="1.5" />
                  </svg>
                  <div className="w-full h-0.5 bg-[#18181B]/10 rounded-[1px]" />
                </div>

                {/* Layer 2: Architectural Texture Fragment */}
                <div className="absolute top-12 right-3 w-36 h-40 rounded-[5px] overflow-hidden shadow-md rotate-4 group-hover:rotate-2 group-hover:scale-105 transition-all duration-500 border border-white">
                  <Image src="/architecture-modern.jpeg" alt="Architecture" fill className="object-cover" />
                  <div className="absolute bottom-2 right-2 bg-[#18181B] text-white text-[8px] font-bold px-2 py-0.5 rounded-[3px] shadow-xs">
                    100% SPEC
                  </div>
                </div>

                {/* Floating Create Button */}
                <div className="absolute bottom-4 left-4 z-20">
                  <div className="inline-flex items-center gap-2 bg-[#18181B] text-white px-4 py-2 rounded-[5px] shadow-md text-xs font-semibold hover:bg-[#27272A] transition-colors">
                    <span className="w-4 h-4 rounded-[2px] bg-[#4DE3A5] text-[#064E3B] flex items-center justify-center text-[10px] font-bold">
                      +
                    </span>
                    <span>New Project Canvas</span>
                  </div>
                </div>
              </div>

              {/* Output Actions */}
              <div className="flex items-center justify-between text-xs pt-1 text-[#71717A]">
                <span>Export formats: PDF, Figma, Notion</span>
                <span className="font-semibold text-[#18181B]">Ready &rarr;</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
