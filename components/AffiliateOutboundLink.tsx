"use client";

import type { ReactNode } from "react";
import { trackAffiliateClick } from "@/lib/affiliate-track";

interface Props {
  href: string;
  productId?: number;
  postId?: number;
  className?: string;
  rel?: string;
  children: ReactNode;
}

export default function AffiliateOutboundLink({
  href,
  productId,
  postId,
  className,
  rel = "nofollow sponsored noopener noreferrer",
  children,
}: Props) {
  return (
    <a
      href={href}
      className={className}
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
