import type { MetadataRoute } from "next";
import { getPosts, getCategories, getTags, getHubs } from "@core/api-client";
import { getPostCoverUrl } from "@features/posts/post-content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://dredecoplays.com.br";

export const revalidate = 3600;

/** Sitemap indexado em fatias — melhor para sites grandes (Google Search Console) */
export async function generateSitemaps() {
  return [{ id: "static" }, { id: "posts" }, { id: "taxonomy" }];
}

export default async function sitemap(props: {
  id?: string;
}): Promise<MetadataRoute.Sitemap> {
  const id = props.id ?? "static";

  if (id === "posts") {
    const postsRes = await getPosts({ limit: 1000, status: "published" });
    return postsRes.data.map((post) => {
      const coverUrl = getPostCoverUrl(post);
      return {
        url: `${SITE_URL}/blog/${post.slug}`,
        lastModified: new Date(post.updatedAt),
        changeFrequency: "monthly" as const,
        priority: post.featured ? 0.9 : 0.8,
        images: post.thumbnail ? [coverUrl] : undefined,
      };
    });
  }

  if (id === "taxonomy") {
    const [categories, tags, hubs] = await Promise.all([
      getCategories(),
      getTags(),
      getHubs(),
    ]);

    const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
      url: `${SITE_URL}/categoria/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    const tagPages: MetadataRoute.Sitemap = tags.map((tag) => ({
      url: `${SITE_URL}/tag/${tag.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }));

    const hubPages: MetadataRoute.Sitemap = hubs.map((h) => ({
      url: `${SITE_URL}/melhores/${h.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.75,
    }));

    return [...categoryPages, ...tagPages, ...hubPages];
  }

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/ofertas`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/guias-gratuitos`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.55,
    },
    {
      url: `${SITE_URL}/sobre`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/contato`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  return staticPages;
}
