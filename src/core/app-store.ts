"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LOCALE_STORAGE_KEY } from "./constants";

export type AppLocale = "pt-BR";

type AppState = {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      locale: "pt-BR",
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: LOCALE_STORAGE_KEY,
      partialize: (s) => ({ locale: s.locale }),
    },
  ),
);
