import type { PostSeoData } from "@core/types";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://dredecoplays.com.br";

export default function ArticleJsonLd({ seo }: { seo: PostSeoData }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: seo.title,
    description: seo.description,
    image: [seo.image.url],
    datePublished: seo.publishedAt,
    dateModified: seo.updatedAt,
    author: {
      "@type": "Person",
      name: seo.author.name,
      ...(seo.author.url ? { url: seo.author.url } : {}),
    },
    publisher: {
      "@type": "Organization",
      name: "Dredeco Plays",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": seo.url,
    },
    articleSection: seo.category.name,
    inLanguage: "pt-BR",
    url: seo.url,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
