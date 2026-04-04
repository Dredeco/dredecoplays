"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

interface Props {
  videoId: string;
  title: string;
  /**
   * Quando `true`, o componente assume que o container pai já tem
   * `position:relative` e `aspect-video` (caso do portal via ContentRenderer).
   */
  inContainer?: boolean;
}

const NOCOOKIE_EMBED = "https://www.youtube-nocookie.com/embed";

export default function YouTubeFacade({
  videoId,
  title,
  inContainer = false,
}: Props) {
  const [loaded, setLoaded] = useState(false);

  const thumbSrc = `https://i.ytimg.com/vi/${encodeURIComponent(videoId)}/hqdefault.jpg`;
  const embedSrc = `${NOCOOKIE_EMBED}/${encodeURIComponent(videoId)}?rel=0`;

  const loadVideo = useCallback(() => setLoaded(true), []);

  const wrapper = inContainer
    ? "absolute inset-0"
    : "relative w-full overflow-hidden rounded-lg aspect-video bg-surface-2";

  if (loaded) {
    return (
      <div className={inContainer ? "absolute inset-0" : "relative w-full overflow-hidden rounded-lg aspect-video"}>
        <iframe
          className="absolute inset-0 h-full w-full"
          src={embedSrc}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className={wrapper}>
      <Image
        src={thumbSrc}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 800px"
        className="object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/40" aria-hidden />
      <button
        type="button"
        onClick={loadVideo}
        className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        aria-label={`Carregar vídeo: ${title}`}
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 shadow-lg transition hover:bg-red-500">
          <svg
            className="ml-1 h-8 w-8"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
        <span className="max-w-[90%] text-center text-sm font-medium drop-shadow">
          Carregar vídeo do YouTube
        </span>
      </button>
    </div>
  );
}
