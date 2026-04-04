"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { I18nextProvider } from "react-i18next";
import { StrictMode, useEffect, useState } from "react";
import { Toaster } from "sonner";
import { AuthProvider } from "@core/auth-provider";
import { THEME_STORAGE_KEY } from "@core/constants";
import { i18n } from "@core/i18n";
import { useAppStore } from "@core/app-store";
import { makeQueryClient } from "./query-client";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => makeQueryClient());
  const locale = useAppStore((s) => s.locale);

  useEffect(() => {
    void i18n.changeLanguage(locale);
  }, [locale]);

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            storageKey={THEME_STORAGE_KEY}
          >
            <AuthProvider>
              {children}
              <Toaster richColors position="top-center" />
            </AuthProvider>
          </ThemeProvider>
        </I18nextProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}
