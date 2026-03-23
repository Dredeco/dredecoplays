"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface Props {
  position: "top" | "mid-content" | "mid-article" | "footer" | "sidebar";
  className?: string;
}

/**
 * Renderiza slot de anúncio AdSense apenas no cliente para evitar hydration
 * mismatch: o script do AdSense modifica o <ins> antes do React hidratar.
 */
export default function AdSlot({ className = "" }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // bloqueador de anúncios
    }
  }, []);

  if (!mounted) return null;

  return (
    <div className={`flex justify-center ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-7501367689908064"
        data-ad-slot="4057072452"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
