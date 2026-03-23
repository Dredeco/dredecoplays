"use client";

import type { ContentSegment } from "@/lib/posts";
import YouTubeFacade from "@/components/YouTubeFacade";

interface Props {
  segments: ContentSegment[];
  className?: string;
}

/**
 * Renderiza HTML do post intercalando facades lazy para embeds do YouTube.
 */
export default function ContentRenderer({
  segments,
  className = "prose prose-invert prose-lg max-w-none [&_*]:!my-0 [&_hr]:!my-6 [&_p:empty]:!my-4",
}: Props) {
  return (
    <div className={className}>
      {segments.map((seg, i) =>
        seg.type === "html" ? (
          <div key={i} dangerouslySetInnerHTML={{ __html: seg.html }} />
        ) : (
          <YouTubeFacade
            key={`yt-${seg.videoId}-${i}`}
            videoId={seg.videoId}
            title={seg.title}
            className="my-6"
          />
        ),
      )}
    </div>
  );
}
