"use client";

import Image from "next/image";
import { useState } from "react";
import { DEFAULT_COVER_IMAGE } from "@/lib/posts";

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

export default function PostThumbnail({
  src,
  alt,
  fill = true,
  priority = false,
  className = "object-cover",
  sizes,
}: Props) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

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
        />
      </div>
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      priority={priority}
      className={className}
      sizes={sizes}
      onError={handleError}
    />
  );
}
