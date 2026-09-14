"use client";

import React, { useEffect, useRef } from "react";
import Button from "@/components/ui/Button.jsx";

export default function MobileMenu({
  isOpen,
  setIsOpen,
  links = [],
  authConfig,
  activeHref,
  onSelect,
}) {
  const panelRef = useRef(null);

  // Close on Escape or click outside
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") setIsOpen(false);
    }
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  return (
    <div className="relative md:hidden" ref={panelRef}>
      {/* Circular Trigger Button */}
      <button
        type="button"
        aria-label="Toggle navigation menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className={`mobile-menu-trigger ${isOpen ? "open" : ""}`}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform duration-200"
        >
          {isOpen ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            <>
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="16" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </>
          )}
        </svg>
      </button>

      {/* Floating Radial Expanding Panel */}
      {isOpen && (
        <div className="mobile-radial-panel">
          <div className="flex flex-col gap-1.5">
            {links.map((link) => {
              const isActive = activeHref === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => {
                    if (onSelect) onSelect(link.href);
                    setIsOpen(false);
                  }}
                  className={`mobile-nav-link ${isActive ? "active" : ""}`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#111827] shadow-[0_0_6px_rgba(17,24,39,0.25)]" />
                  )}
                </a>
              );
            })}
          </div>

          <div className="h-px bg-[#E5E7EB] my-1" />

          {/* Auth / CTA in Mobile Panel */}
          <div className="flex items-center gap-2 pt-1">
            {authConfig?.login && (
              <Button
                variant="ghost"
                size="sm"
                href={authConfig.login.href}
                className="flex-1 text-center"
                onClick={() => setIsOpen(false)}
              >
                {authConfig.login.label}
              </Button>
            )}
            {authConfig?.cta && (
              <Button
                variant="primary"
                size="sm"
                href={authConfig.cta.href}
                className="flex-1 text-center"
                onClick={() => setIsOpen(false)}
              >
                {authConfig.cta.label}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
