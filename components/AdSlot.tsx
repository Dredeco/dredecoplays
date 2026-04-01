"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

type AdPosition = "top" | "mid-content" | "mid-article" | "footer" | "sidebar";

interface Props {
  position: AdPosition;
  className?: string;
}

const AD_CLIENT = "ca-pub-7501367689908064";

/**
 * Slot IDs por posição — configure via env vars para slots dedicados.
 * No painel AdSense: Anúncios > Por anúncio > criar um slot para cada posição.
 * Slots distintos = Google otimiza o leilão individualmente = RPM mais alto.
 */
const SLOT_BY_POSITION: Record<AdPosition, string> = {
  top: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP || "4057072452",
  "mid-content": process.env.NEXT_PUBLIC_ADSENSE_SLOT_MID_CONTENT || "4057072452",
  "mid-article": process.env.NEXT_PUBLIC_ADSENSE_SLOT_MID_ARTICLE || "4057072452",
  footer: process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER || "4057072452",
  sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR || "4057072452",
};

export default function AdSlot({ position, className = "" }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // bloqueador de anúncios ativo
    }
  }, []);

  if (!mounted) return null;

  return (
    <div className={`flex justify-center ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={SLOT_BY_POSITION[position]}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
