// components/AdSlot.tsx
"use client";

import { useEffect, useRef, useState } from "react";

export type AdPosition =
  | "top"
  | "mid-content"
  | "mid-article"
  | "inline"
  | "footer"
  | "sidebar";

/** Fallback único (legado) — configure slots distintos no AdSense e nas env vars para melhor RPM */
const LEGACY_FALLBACK_SLOT = "4057072452";

function resolveSlot(position: AdPosition): string | undefined {
  const envMap: Record<AdPosition, string | undefined> = {
    top: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP,
    "mid-content": process.env.NEXT_PUBLIC_ADSENSE_SLOT_MID_CONTENT,
    "mid-article": process.env.NEXT_PUBLIC_ADSENSE_SLOT_MID_ARTICLE,
    inline:
      process.env.NEXT_PUBLIC_ADSENSE_SLOT_INLINE ||
      process.env.NEXT_PUBLIC_ADSENSE_SLOT_MID_ARTICLE,
    footer: process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER,
    sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR,
  };
  const v = envMap[position];
  if (v) return v;
  return LEGACY_FALLBACK_SLOT;
}

interface AdSlotProps {
  position: AdPosition;
  className?: string;
  /** Só carrega o anúncio quando o bloco entra na viewport (melhora Core Web Vitals) */
  lazy?: boolean;
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export default function AdSlot({
  position,
  className,
  lazy = true,
}: AdSlotProps) {
  const adRef = useRef<HTMLModElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(!lazy);
  const pushedRef = useRef(false);
  const slotId = resolveSlot(position);
  const clientId =
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-7501367689908064";

  useEffect(() => {
    if (!lazy || visible) return;
    const el = wrapperRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [lazy, visible]);

  useEffect(() => {
    if (!visible || !slotId || !clientId || pushedRef.current) return;
    const ins = adRef.current;
    if (!ins) return;
    pushedRef.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // bloqueador de anúncios
    }
  }, [visible, slotId, clientId]);

  if (!slotId || !clientId) return null;

  const isInArticle = position === "mid-article" || position === "inline";

  return (
    <div ref={wrapperRef} className={className} data-ad-position={position}>
      {visible ? (
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={clientId}
          data-ad-slot={slotId}
          data-ad-format={isInArticle ? "fluid" : "auto"}
          data-full-width-responsive="true"
          {...(isInArticle && { "data-ad-layout": "in-article" as const })}
        />
      ) : (
        <div
          className="min-h-[120px] w-full animate-pulse rounded-lg bg-surface-2/50"
          aria-hidden
        />
      )}
    </div>
  );
}
