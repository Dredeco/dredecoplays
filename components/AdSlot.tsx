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

export default function AdSlot({ className = "" }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense pode falhar em bloqueadores de anúncio
    }
  }, [mounted]);

  if (!mounted) {
    return <div className={`flex justify-center ${className}`} aria-hidden />;
  }

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
