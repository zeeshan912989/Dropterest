"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export interface FeedItem {
  id: string;
  creatorId: string;
  title: string;
  description?: string | null;
  category: string;
  tags?: string[] | null;
  previewUrl: string;
  postType: "free" | "sell";
  price?: number | null;
  currency: string;
  assetFileName?: string | null;
  assetFileType?: string | null;
  assetFileSize?: string | null;
  licenseType?: string | null;
  viewsCount: number;
  downloadsCount: number;
  likesCount: number;
  savesCount: number;
  createdAt: string;
  creatorName?: string | null;
  creatorAvatar?: string | null;
  creatorUsername?: string | null;
}

interface UseInfinitePinsOptions {
  category?: string;
  postType?: string;
  search?: string;
  limit?: number;
  enabled?: boolean;
}

export function useInfinitePins({
  category = "All",
  postType = "all",
  search = "",
  limit = 30,
  enabled = true,
}: UseInfinitePinsOptions = {}) {
  const query = useInfiniteQuery({
    queryKey: ["pins", "feed", { category, postType, search }],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();
      params.set("limit", String(limit));

      if (category && category !== "All") {
        params.set("category", category);
      }
      if (postType && postType !== "all") {
        params.set("postType", postType);
      }
      if (search && search.trim()) {
        params.set("search", search.trim());
      }
      if (pageParam) {
        params.set("cursor", String(pageParam));
      }

      const res = await fetch(`/api/pins/feed?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to load pins feed");
      }
      return res.json() as Promise<{
        success: boolean;
        items: FeedItem[];
        nextCursor: string | null;
        hasMore: boolean;
      }>;
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 30 * 1000,
    enabled,
  });

  // Flatten pages into a single continuous list of items
  const pins = useMemo(() => {
    if (!query.data?.pages) return [];
    return query.data.pages.flatMap((page) => page.items || []);
  }, [query.data?.pages]);

  return {
    pins,
    ...query,
  };
}
