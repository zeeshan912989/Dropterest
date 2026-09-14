export default function Footer() {
  return (
    <footer className="relative w-full pt-20 sm:pt-28 pb-14 px-4 sm:px-8 lg:px-16 bg-[#FAF8F5] select-none border-t border-black/[0.04]">
      {/* Top Editorial Headline & CTA */}
      <div className="max-w-4xl mx-auto text-center relative z-20 mb-16 sm:mb-20">
        <h2 className="font-editorial text-5xl sm:text-7xl md:text-8xl lg:text-[6.25rem] text-[#18181B] leading-[1.02] font-normal tracking-[-0.03em]">
          Keep discovering.
        </h2>

        {/* Minimal CTA Pill */}
        <div className="mt-7 sm:mt-8 flex justify-center">
          <a
            href="/ideas"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-[5px] bg-[#18181B] text-white text-xs sm:text-sm font-semibold shadow-[0_6px_24px_rgba(24,24,27,0.2)] hover:bg-black hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          >
            <span>Start exploring</span>
            <span className="text-base leading-none">&rarr;</span>
          </a>
        </div>
      </div>

      {/* Minimal Navigation Columns */}
      <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6 sm:gap-12 text-center text-xs mt-4 mb-16 sm:mb-20">
        {/* Col 1: EXPLORE */}
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-[11px] font-bold text-[#18181B] tracking-widest uppercase mb-1">
            EXPLORE
          </span>
          <a href="#discover" className="text-[#71717A] hover:text-[#18181B] transition-colors">Discover</a>
          <a href="#trending" className="text-[#71717A] hover:text-[#18181B] transition-colors">Trending</a>
          <a href="#categories" className="text-[#71717A] hover:text-[#18181B] transition-colors">Categories</a>
        </div>

        {/* Col 2: CREATE */}
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-[11px] font-bold text-[#18181B] tracking-widest uppercase mb-1">
            CREATE
          </span>
          <a href="#collections" className="text-[#71717A] hover:text-[#18181B] transition-colors">Collections</a>
          <a href="#saved" className="text-[#71717A] hover:text-[#18181B] transition-colors">Saved ideas</a>
          <a href="#drops" className="text-[#71717A] hover:text-[#18181B] transition-colors">Your drops</a>
        </div>

        {/* Col 3: COMPANY & MONETIZATION */}
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-[11px] font-bold text-[#18181B] tracking-widest uppercase mb-1">
            COMPANY
          </span>
          <a href="/motize" className="text-[#064E3B] font-semibold hover:text-[#18181B] transition-colors">Motize Platform ✦</a>
          <a href="#about" className="text-[#71717A] hover:text-[#18181B] transition-colors">About</a>
          <a href="#contact" className="text-[#71717A] hover:text-[#18181B] transition-colors">Contact</a>
          <a href="#careers" className="text-[#71717A] hover:text-[#18181B] transition-colors">Careers</a>
        </div>
      </div>

      {/* Bottom Legal & Brand Bar */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-black/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#71717A]">
        {/* Left: Brand Wordmark */}
        <div className="font-editorial text-lg tracking-[-0.02em] font-semibold text-[#18181B]">
          DROPTEREST
        </div>

        {/* Center: Copyright */}
        <div className="text-[11px] font-mono text-[#71717A]">
          &copy; 2026 Dropterest
        </div>

        {/* Right: Legal Links */}
        <div className="flex items-center gap-4 text-[11px] text-[#71717A]">
          <a href="#privacy" className="hover:text-[#18181B] transition-colors">Privacy</a>
          <span>&middot;</span>
          <a href="#terms" className="hover:text-[#18181B] transition-colors">Terms</a>
          <span>&middot;</span>
          <a href="#instagram" className="hover:text-[#18181B] transition-colors">Instagram</a>
        </div>
      </div>
    </footer>
  );
}
