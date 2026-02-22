import type { MetadataRoute } from "next";
import { getPosts, getCategories } from "@/lib/api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://dredecoplays.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [postsRes, categories] = await Promise.all([
    getPosts({ limit: 500, status: "published" }),
    getCategories(),
  ]);

  const posts = postsRes.data;

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

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "monthly" as const,
    priority: post.featured ? 0.9 : 0.8,
  }));

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${SITE_URL}/categoria/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...postPages, ...categoryPages];
}
