"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ContentSegment } from "@features/posts/post-content";
import type { Product } from "@core/types";
import YouTubeFacade from "@features/site/YouTubeFacade";
import AdSlot from "@features/site/AdSlot";
import InlineProductCTA from "@features/products/InlineProductCTA";
import InlineAffiliateStrip from "@features/products/InlineAffiliateStrip";

interface Props {
  segments: ContentSegment[];
  className?: string;
  /** Produtos para shortcodes [[product:ID]] */
  inlineProducts?: Partial<Record<number, Product>>;
  /** Produtos para o bloco in-article (meio do texto) */
  affiliateProducts?: Product[];
  postId?: number;
}

interface VideoMount {
  container: Element;
  videoId: string;
  title: string;
}

interface AdMount {
  container: Element;
  key: string;
}

interface AffiliateMount {
  container: Element;
}

interface ProductMount {
  container: Element;
  productId: number;
}

/**
 * Renderiza o HTML do post inteiramente via dangerouslySetInnerHTML para preservar
 * o fluxo do prose e evitar CLS por wrappers extras. Em seguida, substitui
 * os placeholders data-yt-facade com portais React (YouTubeFacade lazy)
 * e data-dp-ad-slot com AdSlot (AdSense in-article).
 */
export default function ContentRenderer({
  segments,
  className = "prose prose-invert prose-lg max-w-none [&_*]:!my-0 [&_hr]:!my-6 [&_p:empty]:!my-4",
  inlineProducts,
  affiliateProducts,
  postId,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [videoMounts, setVideoMounts] = useState<VideoMount[]>([]);
  const [adMounts, setAdMounts] = useState<AdMount[]>([]);
  const [productMounts, setProductMounts] = useState<ProductMount[]>([]);
  const [affiliateMounts, setAffiliateMounts] = useState<AffiliateMount[]>([]);

  const fullHtml = segments
    .map((seg) => {
      if (seg.type === "html") return seg.html;
      if (seg.type === "youtube") {
        return `<div data-yt-facade data-yt-id="${encodeHtmlAttr(seg.videoId)}" data-yt-title="${encodeHtmlAttr(seg.title)}" class="my-6 rounded-lg overflow-hidden aspect-video bg-surface-2 relative"></div>`;
      }
      if (seg.type === "affiliate-inline") {
        return `<div data-dp-affiliate-inline class="my-8 not-prose flex w-full max-w-full justify-center"></div>`;
      }
      return `<div data-dp-ad-slot class="my-8 not-prose flex justify-center w-full max-w-full"></div>`;
    })
    .join("");

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const yt = Array.from(
      root.querySelectorAll<HTMLElement>("[data-yt-facade]"),
    );
    setVideoMounts(
      yt.map((el) => ({
        container: el,
        videoId: el.dataset.ytId ?? "",
        title: el.dataset.ytTitle ?? "Vídeo do YouTube",
      })),
    );
    const ads = Array.from(
      root.querySelectorAll<HTMLElement>("[data-dp-ad-slot]"),
    );
    setAdMounts(
      ads.map((el, i) => ({
        container: el,
        key: `ad-${i}`,
      })),
    );
    const inline = Array.from(
      root.querySelectorAll<HTMLElement>("[data-inline-product]"),
    );
    setProductMounts(
      inline.map((el) => ({
        container: el,
        productId: parseInt(el.dataset.inlineProduct ?? "0", 10),
      })),
    );
    const aff = root.querySelectorAll<HTMLElement>("[data-dp-affiliate-inline]");
    setAffiliateMounts(Array.from(aff).map((container) => ({ container })));
  }, [fullHtml]);

  return (
    <>
      <div
        ref={containerRef}
        className={className}
        dangerouslySetInnerHTML={{ __html: fullHtml }}
      />
      {videoMounts.map((m, i) =>
        m.videoId
          ? createPortal(
              <YouTubeFacade
                videoId={m.videoId}
                title={m.title}
                inContainer
              />,
              m.container,
              `yt-${m.videoId}-${i}`,
            )
          : null,
      )}
      {adMounts.map((m) =>
        createPortal(
          <AdSlot position="inline" className="w-full max-w-2xl" lazy />,
          m.container,
          m.key,
        ),
      )}
      {productMounts.map((m) => {
        const p = inlineProducts?.[m.productId];
        if (!p) return null;
        return createPortal(
          <InlineProductCTA product={p} postId={postId} />,
          m.container,
          `ip-${m.productId}`,
        );
      })}
      {affiliateMounts.map((m, i) =>
        affiliateProducts && affiliateProducts.length > 0
          ? createPortal(
              <InlineAffiliateStrip
                products={affiliateProducts}
                postId={postId}
              />,
              m.container,
              `aff-inline-${i}`,
            )
          : null,
      )}
    </>
  );
}

function encodeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
