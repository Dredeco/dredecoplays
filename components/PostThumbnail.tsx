"use client";

import Image from "next/image";
import { useState } from "react";
import { DEFAULT_COVER_IMAGE } from "@/lib/posts";

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
