"use client";

import type { ReactNode } from "react";
import { trackAffiliateClick } from "@/lib/affiliate-track";

interface Props {
  href: string;
  productId?: number;
  postId?: number;
  className?: string;
  rel?: string;
  /** Ex.: data-variant para testes / estilos contextuais */
  "data-variant"?: string;
  children: ReactNode;
}

export default function AffiliateOutboundLink({
  href,
  productId,
  postId,
  className,
  rel = "nofollow sponsored noopener noreferrer",
  "data-variant": dataVariant,
  children,
}: Props) {
  return (
    <a
      href={href}
      className={className}
      data-variant={dataVariant}
      rel={rel}
      target="_blank"
      onClick={() => {
        void trackAffiliateClick({ productId, postId, targetUrl: href });
      }}
    >
      {children}
    </a>
  );
}
