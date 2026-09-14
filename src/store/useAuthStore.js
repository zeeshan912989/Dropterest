"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,

      login: (userData) => {
        set({
          isAuthenticated: true,
          user: {
            name: userData?.name || "Elena Rostova",
            email: userData?.email || "elena@dropterest.com",
            handle: "@elena_arch",
            avatar: "/ceramics.jpeg",
          },
        });
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
        });
      },
    }),
    {
      name: "dropterest_auth_store",
    }
  )
);
