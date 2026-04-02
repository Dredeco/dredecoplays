interface Props {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate?: string;
  contentUrl: string;
  duration?: string;
}

export default function VideoJsonLd({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  contentUrl,
  duration,
}: Props) {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name,
    description,
    thumbnailUrl,
    contentUrl,
  };
  if (uploadDate) jsonLd.uploadDate = uploadDate;
  if (duration) jsonLd.duration = duration;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
