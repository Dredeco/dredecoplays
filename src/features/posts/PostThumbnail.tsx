"use client";

import Image from "next/image";
import { useState } from "react";
import { DEFAULT_COVER_IMAGE } from "@features/posts/post-content";

function isDataUri(url: string): boolean {
  return typeof url === "string" && url.startsWith("data:");
}

interface Props {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  sizes?: string;
}

interface PostThumbnailProps extends Props {
  /** Mostra shimmer atrás da imagem até carregar (Next/Image) */
  showSkeleton?: boolean;
}

export default function PostThumbnail({
  src,
  alt,
  fill = true,
  priority = false,
  className = "object-cover",
  sizes,
  showSkeleton = true,
}: PostThumbnailProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(DEFAULT_COVER_IMAGE);
    }
  };

  if (isDataUri(imgSrc)) {
    return (
      <div className={fill ? "absolute inset-0" : undefined}>
        <img
          src={imgSrc}
          alt={alt}
          className={fill ? `w-full h-full ${className}` : className}
          onError={handleError}
          onLoad={() => setLoaded(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={
        fill
          ? "absolute inset-0 overflow-hidden bg-[var(--color-surface)]"
          : "relative overflow-hidden bg-[var(--color-surface)]"
      }
    >
      {showSkeleton && fill ? (
        <div
          className={`absolute inset-0 skeleton transition-opacity duration-300 ${loaded ? "opacity-0" : "opacity-100"}`}
          aria-hidden
        />
      ) : null}
      {/* Image comes after skeleton in DOM → naturally paints on top (no z-index needed) */}
      <Image
        src={imgSrc}
        alt={alt}
        fill={fill}
        priority={priority}
        className={className}
        sizes={sizes}
        onError={handleError}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
