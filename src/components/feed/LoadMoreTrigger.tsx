"use client";

import React, { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

interface LoadMoreTriggerProps {
  loadMore: () => void;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
}

export function LoadMoreTrigger({
  loadMore,
  hasNextPage,
  isFetchingNextPage,
}: LoadMoreTriggerProps) {
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!triggerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          loadMore();
        }
      },
      {
        // 1200px rootMargin pre-fetches next 30 items before user reaches the bottom
        rootMargin: "1200px",
      }
    );

    observer.observe(triggerRef.current);

    return () => observer.disconnect();
  }, [loadMore, hasNextPage, isFetchingNextPage]);

  if (!hasNextPage) {
    return null;
  }

  return (
    <div
      ref={triggerRef}
      className="w-full py-8 flex items-center justify-center text-[#71717A]"
    >
      {isFetchingNextPage && (
        <div className="flex items-center gap-2 text-xs font-medium">
          <Loader2 className="w-4 h-4 animate-spin text-[#18181B]" />
          <span>Discovering more drops...</span>
        </div>
      )}
    </div>
  );
}
