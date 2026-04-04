"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import NewsletterForm, {
  isNewsletterSubscribed,
} from "@/components/NewsletterForm";

const COOKIE_NAME = "newsletter_dismissed";
const SCROLL_THRESHOLD = 0.6;
const DELAY_MS = 30_000;
const COOKIE_MAX_AGE_SEC = 7 * 24 * 60 * 60;

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function setDismissCookie() {
  document.cookie = `${COOKIE_NAME}=1; path=/; max-age=${COOKIE_MAX_AGE_SEC}; SameSite=Lax`;
}

export default function NewsletterPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  const shouldNeverShow = useCallback(() => {
    if (typeof window === "undefined") return true;
    if (pathname.startsWith("/painel")) return true;
    if (getCookie(COOKIE_NAME)) return true;
    if (isNewsletterSubscribed()) return true;
    return false;
  }, [pathname]);

  const close = useCallback(() => {
    setOpen(false);
    setDismissCookie();
  }, []);

  useEffect(() => {
    if (shouldNeverShow()) {
      queueMicrotask(() => setReady(true));
      return;
    }

    let shown = false;
    const show = () => {
      if (shown) return;
      shown = true;
      setOpen(true);
      window.removeEventListener("scroll", onScroll);
    };

    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const max = doc.scrollHeight - doc.clientHeight;
      if (max <= 0) return;
      if (scrollTop / max >= SCROLL_THRESHOLD) show();
    };

    const timer = window.setTimeout(show, DELAY_MS);
    window.addEventListener("scroll", onScroll, { passive: true });

    queueMicrotask(() => setReady(true));

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [shouldNeverShow]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  if (!ready || !open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="newsletter-popup-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="relative w-full max-w-md rounded-2xl border border-violet-500/40 bg-surface p-6 sm:p-8 shadow-2xl shadow-violet-950/50">
        <button
          type="button"
          onClick={close}
          className="absolute right-3 top-3 rounded-lg p-2 text-muted hover:text-foreground hover:bg-surface-2 transition-colors"
          aria-label="Fechar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <p className="text-violet-400 text-xs font-bold uppercase tracking-widest mb-2">
          Fique por dentro
        </p>
        <h2
          id="newsletter-popup-title"
          className="text-xl sm:text-2xl font-extrabold text-foreground pr-8 mb-2"
        >
          Receba as novidades do mundo gamer
        </h2>
        <p className="text-muted text-sm mb-6 leading-relaxed">
          Uma vez por semana: notícias, listas e ofertas selecionadas para você.
        </p>

        <NewsletterForm variant="inline" inlineTheme="default" onSuccess={close} />

        <button
          type="button"
          onClick={close}
          className="mt-4 w-full text-center text-xs text-muted hover:text-foreground transition-colors"
        >
          Agora não, obrigado
        </button>
      </div>
    </div>
  );
}
