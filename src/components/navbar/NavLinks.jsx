"use client";

import React, { useRef, useEffect, useState } from "react";

export default function NavLinks({ links = [], activeHref, onSelect }) {
  const containerRef = useRef(null);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const activeEl = containerRef.current.querySelector(
      `[data-href="${activeHref}"]`
    );

    if (activeEl) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const activeRect = activeEl.getBoundingClientRect();

      setPillStyle({
        left: activeRect.left - containerRect.left,
        width: activeRect.width,
        opacity: 1,
      });
    } else {
      setPillStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [activeHref, links]);

  return (
    <div ref={containerRef} className="nav-links-capsule">
      {/* Moving Pill Indicator */}
      <span
        className="active-pill-indicator"
        style={{
          left: `${pillStyle.left}px`,
          width: `${pillStyle.width}px`,
          opacity: pillStyle.opacity,
        }}
      />

      {/* Navigation Items */}
      {links.map((link) => {
        const isActive = activeHref === link.href;
        return (
          <a
            key={link.href}
            href={link.href}
            data-href={link.href}
            onClick={(e) => {
              if (onSelect) onSelect(link.href);
            }}
            className={`nav-link-item ${isActive ? "active" : ""}`}
          >
            {link.label}
          </a>
        );
      })}
    </div>
  );
}
