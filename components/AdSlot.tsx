// components/AdSlot.tsx
"use client";

import { useEffect, useRef } from "react";

type AdPosition = "top" | "mid-content" | "mid-article" | "footer" | "sidebar";

const SLOT_MAP: Record<AdPosition, string | undefined> = {
  top: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP,
  "mid-content": process.env.NEXT_PUBLIC_ADSENSE_SLOT_MID_CONTENT,
  "mid-article": process.env.NEXT_PUBLIC_ADSENSE_SLOT_MID_ARTICLE,
  footer: process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER,
  sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR,
};

interface AdSlotProps {
  position: AdPosition;
  className?: string;
}

export default function AdSlot({ position, className }: AdSlotProps) {
  const adRef = useRef<HTMLModElement>(null);
  const slotId = SLOT_MAP[position];
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  useEffect(() => {
    if (!slotId || !clientId) return;

    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, [slotId, clientId]);

  if (!slotId || !clientId) return null;

  return (
    <div className={className}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={slotId}
        data-ad-format={position === "mid-article" ? "fluid" : "auto"}
        data-full-width-responsive="true"
        // formato especial para in-article
        {...(position === "mid-article" && { "data-ad-layout": "in-article" })}
      />
    </div>
  );
}
