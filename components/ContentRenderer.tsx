"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ContentSegment } from "@/lib/posts";
import YouTubeFacade from "@/components/YouTubeFacade";

interface Props {
  segments: ContentSegment[];
  className?: string;
}

interface Mount {
  container: Element;
  videoId: string;
  title: string;
}

/**
 * Renderiza o HTML do post inteiramente via dangerouslySetInnerHTML para preservar
 * o fluxo do prose e evitar CLS por wrappers extras. Em seguida, substitui
 * os placeholders data-yt-facade com portais React (YouTubeFacade lazy).
 */
export default function ContentRenderer({
  segments,
  className = "prose prose-invert prose-lg max-w-none [&_*]:!my-0 [&_hr]:!my-6 [&_p:empty]:!my-4",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounts, setMounts] = useState<Mount[]>([]);

  const fullHtml = segments
    .map((seg) =>
      seg.type === "html"
        ? seg.html
        : `<div data-yt-facade data-yt-id="${encodeHtmlAttr(seg.videoId)}" data-yt-title="${encodeHtmlAttr(seg.title)}" class="my-6 rounded-lg overflow-hidden aspect-video bg-surface-2 relative"></div>`,
    )
    .join("");

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const placeholders = Array.from(
      root.querySelectorAll<HTMLElement>("[data-yt-facade]"),
    );
    if (placeholders.length === 0) return;
    setMounts(
      placeholders.map((el) => ({
        container: el,
        videoId: el.dataset.ytId ?? "",
        title: el.dataset.ytTitle ?? "Vídeo do YouTube",
      })),
    );
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        className={className}
        dangerouslySetInnerHTML={{ __html: fullHtml }}
      />
      {mounts.map((m, i) =>
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
