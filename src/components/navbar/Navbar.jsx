"use client";

import React, { useState, useEffect } from "react";
import { navigationConfig } from "@/config/navigation";
import NavLinks from "./NavLinks";
import MobileMenu from "./MobileMenu";
import Button from "@/components/ui/Button.jsx";
import { authClient, signOut } from "@/lib/auth/auth-client";
import { LogOut, User } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function Navbar() {
  const { brand, links, auth } = navigationConfig;
  const { data: session, isPending } = authClient.useSession();
  const [mounted, setMounted] = useState(false);
  const [activeHref, setActiveHref] = useState(links[0]?.href || "/ideas");
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll detection for navbar shrink and progress bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);

      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(Math.max(scrollY / totalHeight, 0), 1);
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully.");
      window.location.href = "/login";
    } catch {
      toast.error("Failed to sign out.");
    }
  };

  const isAuthenticated = Boolean(session?.user);

  return (
    <header className="floating-nav-wrapper">
      <nav
        className={`floating-capsule ${isScrolled ? "scrolled" : ""}`}
        aria-label="Main Navigation"
      >
        {/* Left: Brand Logo */}
        <div className="flex items-center">
          <Link href={brand.href} className="nav-brand-link">
            <span className="nav-brand-wordmark">{brand.name}</span>
            <span className="nav-brand-dot" aria-hidden="true" />
          </Link>
        </div>

        {/* Center: Desktop Navigation Capsule */}
        <div className="hidden md:flex items-center justify-center">
          <NavLinks
            links={links}
            activeHref={activeHref}
            onSelect={(href) => setActiveHref(href)}
          />
        </div>

        {/* Right: Actions (Desktop Login + CTA) & Mobile Menu Trigger */}
        <div className="flex items-center gap-3">
          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {mounted && !isPending && isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/ideas"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[5px] bg-[#18181B] text-white text-xs font-semibold hover:bg-black transition-all shadow-xs"
                >
                  <span>Explore Ideas</span>
                  <span className="w-1.5 h-1.5 rounded-[2px] bg-[#4DE3A5]" />
                </Link>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[5px] border border-black/10 hover:bg-red-50 hover:text-red-600 text-[#71717A] text-xs font-medium transition-colors cursor-pointer"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <>
                {auth.login && (
                  <Link
                    href={auth.login.href}
                    className="text-xs font-medium text-[#6B7280] hover:text-[#18181B] transition-colors duration-200 px-2 py-1"
                  >
                    {auth.login.label}
                  </Link>
                )}
                {auth.cta && (
                  <Button href={auth.cta.href} variant="primary" size="md">
                    {auth.cta.label}
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <MobileMenu
            isOpen={mobileMenuOpen}
            setIsOpen={setMobileMenuOpen}
            links={links}
            authConfig={auth}
            activeHref={activeHref}
            onSelect={(href) => setActiveHref(href)}
          />
        </div>

        {/* Bottom subtle progress line */}
        <div
          className="nav-progress-bar"
          style={{
            transform: `scaleX(${scrollProgress})`,
            opacity: isScrolled ? 0.9 : 0.3,
          }}
          aria-hidden="true"
        />
      </nav>
    </header>
  );
}
