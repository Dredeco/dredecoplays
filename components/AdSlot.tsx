"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface Props {
  position: "top" | "mid-content" | "mid-article" | "footer" | "sidebar";
  className?: string;
}

export default function AdSlot({ className = "" }: Props) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // bloqueador de anúncios
    }
  }, []);

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
