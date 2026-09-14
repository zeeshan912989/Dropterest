"use client";

import React, { useState } from "react";
import Image from "next/image";

export default function IdeaShowcase() {
  const [savedCards, setSavedCards] = useState({});

  const toggleSave = (id, e) => {
    e.stopPropagation();
    setSavedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="ideas" className="relative w-full pt-6 sm:pt-10 pb-6 sm:pb-10 bg-[#FAF8F5] overflow-hidden select-none">
      {/* Editorial Section Header */}
      <div className="max-w-4xl mx-auto text-center px-4 mb-16 sm:mb-20">
        <h2 className="font-editorial text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem] text-[#18181B] leading-[1.06] font-normal tracking-[-0.025em]">
          Ideas, beautifully organized.
        </h2>
        <p className="mt-5 sm:mt-6 text-base sm:text-lg md:text-[1.15rem] text-[#52525B] max-w-xl mx-auto leading-relaxed font-normal">
          Discover, save, organize, and revisit everything that inspires you.
        </p>
      </div>

      {/* Panoramic Masonry Board Showcase */}
      <div className="relative w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Floating UI Badges (Exact Reference Positions) */}
        {/* 1. Top Right: + New collection */}
        <div className="absolute top-2 right-12 sm:right-28 lg:right-48 z-30 hidden md:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-[5px] bg-[#A7F3D0] text-[#064E3B] text-xs font-semibold shadow-[0_6px_20px_rgba(74,222,128,0.25)] hover:scale-105 transition-transform duration-200 cursor-pointer">
          <span className="text-sm font-bold leading-none">+</span>
          <span>New collection</span>
        </div>

        {/* 2. Mid-Right: ✓ Saved */}
        <div className="absolute top-[28%] right-2 sm:right-10 lg:right-28 z-30 hidden lg:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-[5px] bg-[#DCD2F8] text-[#1E1B4B] text-xs font-semibold shadow-[0_6px_20px_rgba(220,210,248,0.5)] hover:scale-105 transition-transform duration-200 cursor-pointer">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>Saved</span>
        </div>

        {/* 3. Bottom Center-Right: Trending ↗ */}
        <div className="absolute -bottom-3 right-16 sm:right-48 lg:right-96 z-30 hidden md:inline-flex items-center gap-1 px-4 py-1.5 rounded-[5px] bg-[#A7F3D0] text-[#064E3B] text-xs font-semibold shadow-[0_6px_20px_rgba(74,222,128,0.25)] hover:scale-105 transition-transform duration-200 cursor-pointer">
          <span>Trending</span>
          <span className="text-xs">↗</span>
        </div>

        {/* Staggered Masonry Columns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 items-start">
          
          {/* ================= COLUMN 1 ================= */}
          <div className="flex flex-col gap-6">
            {/* Card: Artisanal ceramic Studio */}
            <div className="group relative bg-white rounded-[5px] p-2.5 border border-black/[0.08] shadow-[0_8px_24px_-6px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300">
              <div className="relative w-full aspect-[4/5] rounded-[5px] overflow-hidden bg-[#F4F3EE]">
                <Image
                  src="/ceramics.jpeg"
                  alt="Artisanal ceramic Studio"
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-600 ease-out"
                />
                <button
                  type="button"
                  onClick={(e) => toggleSave("c1", e)}
                  aria-label="Save card"
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-8 h-8 rounded-[5px] bg-white/90 backdrop-blur-md flex items-center justify-center text-[#18181B] hover:bg-white shadow-md cursor-pointer"
                >
                  <svg className="w-4 h-4" fill={savedCards["c1"] ? "#18181B" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                </button>
              </div>
              <div className="pt-3.5 pb-1.5 px-2">
                <h3 className="text-[0.925rem] font-semibold text-[#18181B] tracking-tight">
                  Artisanal ceramic Studio
                </h3>
              </div>
            </div>

            {/* Card: Self-care Rituals */}
            <div className="group relative bg-white rounded-[5px] p-2.5 border border-black/[0.08] shadow-[0_8px_24px_-6px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300">
              <div className="relative w-full aspect-square rounded-[5px] overflow-hidden bg-[#F4F3EE]">
                <Image
                  src="/apothecary-bottles.jpeg"
                  alt="Self-care Rituals"
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-600 ease-out"
                />
                <button
                  type="button"
                  onClick={(e) => toggleSave("c2", e)}
                  aria-label="Save card"
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-8 h-8 rounded-[5px] bg-white/90 backdrop-blur-md flex items-center justify-center text-[#18181B] hover:bg-white shadow-md cursor-pointer"
                >
                  <svg className="w-4 h-4" fill={savedCards["c2"] ? "#18181B" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                </button>
              </div>
              <div className="pt-3.5 pb-1.5 px-2">
                <h3 className="text-[0.925rem] font-semibold text-[#18181B] tracking-tight">
                  Self-care Rituals
                </h3>
              </div>
            </div>
          </div>

          {/* ================= COLUMN 2 ================= */}
          <div className="flex flex-col gap-6">
            {/* Card: Summer Table Settings (Curated Multi-photo Board) */}
            <div className="group relative bg-white rounded-[5px] p-2.5 border border-black/[0.08] shadow-[0_8px_24px_-6px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300">
              <div className="grid grid-cols-2 gap-1.5 rounded-[5px] overflow-hidden bg-[#F4F3EE] p-1">
                <div className="relative aspect-square rounded-[5px] overflow-hidden">
                  <Image
                    src="/table-main.jpeg"
                    alt="Table setting plates"
                    fill
                    sizes="(max-width: 768px) 50vw, 15vw"
                    className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                  />
                </div>
                <div className="relative aspect-square rounded-[5px] overflow-hidden">
                  <Image
                    src="/desk-setup.jpeg"
                    alt="Table arrangement"
                    fill
                    sizes="(max-width: 768px) 50vw, 15vw"
                    className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                  />
                </div>
                <div className="col-span-2 relative aspect-[16/9] rounded-[5px] overflow-hidden">
                  <Image
                    src="/lifestyle-scene.jpeg"
                    alt="Sunlit dining atmosphere"
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="pt-3.5 pb-1.5 px-2">
                <h3 className="text-[0.925rem] font-semibold text-[#18181B] tracking-tight">
                  Summer Table Settings
                </h3>
                <span className="text-xs text-[#71717A] mt-0.5 block font-mono">12 pins</span>
              </div>
            </div>

            {/* Card: Vintage Graphic Design */}
            <div className="group relative bg-white rounded-[5px] p-2.5 border border-black/[0.08] shadow-[0_8px_24px_-6px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300">
              <div className="relative w-full aspect-[4/5] rounded-[5px] overflow-hidden bg-[#F4F3EE]">
                <Image
                  src="/vintage-graphic.jpeg"
                  alt="Vintage Graphic Design"
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-600 ease-out"
                />
                <button
                  type="button"
                  onClick={(e) => toggleSave("c3", e)}
                  aria-label="Save card"
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-8 h-8 rounded-[5px] bg-white/90 backdrop-blur-md flex items-center justify-center text-[#18181B] hover:bg-white shadow-md cursor-pointer"
                >
                  <svg className="w-4 h-4" fill={savedCards["c3"] ? "#18181B" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                </button>
              </div>
              <div className="pt-3.5 pb-1.5 px-2">
                <h3 className="text-[0.925rem] font-semibold text-[#18181B] tracking-tight">
                  Vintage Graphic Design
                </h3>
              </div>
            </div>
          </div>

          {/* ================= COLUMN 3 ================= */}
          <div className="flex flex-col gap-6">
            {/* Card: Sustainable Architecture (Mosaic Board) */}
            <div className="group relative bg-white rounded-[5px] p-2.5 border border-black/[0.08] shadow-[0_8px_24px_-6px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300">
              <div className="grid grid-cols-2 gap-1.5 rounded-[5px] overflow-hidden bg-[#F4F3EE] p-1">
                <div className="col-span-2 relative aspect-[16/10] rounded-[5px] overflow-hidden">
                  <Image
                    src="/architecture-pavilion.jpeg"
                    alt="Sustainable Architecture Pavilion"
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                  />
                </div>
                <div className="relative aspect-square rounded-[5px] overflow-hidden">
                  <Image
                    src="/architecture-modern.jpeg"
                    alt="Modern timber details"
                    fill
                    sizes="(max-width: 768px) 50vw, 15vw"
                    className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                  />
                </div>
                <div className="relative aspect-square rounded-[5px] overflow-hidden">
                  <Image
                    src="/interior-wood.jpeg"
                    alt="Interior daylight architecture"
                    fill
                    sizes="(max-width: 768px) 50vw, 15vw"
                    className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="pt-3.5 pb-1.5 px-2">
                <h3 className="text-[0.925rem] font-semibold text-[#18181B] tracking-tight">
                  Sustainable Architecture
                </h3>
              </div>
            </div>

            {/* Card: Dream Escapes */}
            <div className="group relative bg-white rounded-[5px] p-2.5 border border-black/[0.08] shadow-[0_8px_24px_-6px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300">
              <div className="relative w-full aspect-[4/5] rounded-[5px] overflow-hidden bg-[#F4F3EE]">
                <Image
                  src="/travel-cove.jpeg"
                  alt="Dream Escapes Coastal Cove"
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-600 ease-out"
                />
                <button
                  type="button"
                  onClick={(e) => toggleSave("c4", e)}
                  aria-label="Save card"
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-8 h-8 rounded-[5px] bg-white/90 backdrop-blur-md flex items-center justify-center text-[#18181B] hover:bg-white shadow-md cursor-pointer"
                >
                  <svg className="w-4 h-4" fill={savedCards["c4"] ? "#18181B" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                </button>
              </div>
              <div className="pt-3.5 pb-1.5 px-2">
                <h3 className="text-[0.925rem] font-semibold text-[#18181B] tracking-tight">
                  Dream Escapes
                </h3>
              </div>
            </div>
          </div>

          {/* ================= COLUMN 4 ================= */}
          <div className="flex flex-col gap-6">
            {/* Card: Textile Research */}
            <div className="group relative bg-white rounded-[5px] p-2.5 border border-black/[0.08] shadow-[0_8px_24px_-6px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300">
              <div className="relative w-full aspect-[4/5] rounded-[5px] overflow-hidden bg-[#F4F3EE]">
                <Image
                  src="/textiles.jpeg"
                  alt="Textile Research Linen"
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-600 ease-out"
                />
                <button
                  type="button"
                  onClick={(e) => toggleSave("c5", e)}
                  aria-label="Save card"
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-8 h-8 rounded-[5px] bg-white/90 backdrop-blur-md flex items-center justify-center text-[#18181B] hover:bg-white shadow-md cursor-pointer"
                >
                  <svg className="w-4 h-4" fill={savedCards["c5"] ? "#18181B" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                </button>
              </div>
              <div className="pt-3.5 pb-1.5 px-2">
                <h3 className="text-[0.925rem] font-semibold text-[#18181B] tracking-tight">
                  Textile Research
                </h3>
              </div>
            </div>

            {/* Card: Modern Furniture (Mosaic Board) */}
            <div className="group relative bg-white rounded-[5px] p-2.5 border border-black/[0.08] shadow-[0_8px_24px_-6px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300">
              <div className="grid grid-cols-2 gap-1.5 rounded-[5px] overflow-hidden bg-[#F4F3EE] p-1">
                <div className="col-span-2 relative aspect-[16/10] rounded-[5px] overflow-hidden">
                  <Image
                    src="/furniture-chair.jpeg"
                    alt="Modern Furniture Oak Armchair"
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                  />
                </div>
                <div className="relative aspect-square rounded-[5px] overflow-hidden">
                  <Image
                    src="/product-design.jpeg"
                    alt="Object system styling"
                    fill
                    sizes="(max-width: 768px) 50vw, 15vw"
                    className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                  />
                </div>
                <div className="relative aspect-square rounded-[5px] overflow-hidden">
                  <Image
                    src="/desk-setup.jpeg"
                    alt="Curated workspace elements"
                    fill
                    sizes="(max-width: 768px) 50vw, 15vw"
                    className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="pt-3.5 pb-1.5 px-2">
                <h3 className="text-[0.925rem] font-semibold text-[#18181B] tracking-tight">
                  Modern Furniture
                </h3>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
