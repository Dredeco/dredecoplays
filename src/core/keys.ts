import type { GetPostsParams } from "./api-client";

export const queryKeys = {
  auth: {
    me: (token: string | null) => ["auth", "me", token ?? ""] as const,
  },
  posts: {
    all: ["posts"] as const,
    list: (params: GetPostsParams) => ["posts", "list", params] as const,
    featured: () => ["posts", "featured"] as const,
    popular: () => ["posts", "popular"] as const,
    recent: () => ["posts", "recent"] as const,
    detail: (slug: string) => ["posts", "detail", slug] as const,
    seo: (slug: string) => ["posts", "seo", slug] as const,
    related: (slug: string, categorySlug: string, limit: number) =>
      ["posts", "related", slug, categorySlug, limit] as const,
  },
  categories: {
    all: ["categories"] as const,
    posts: (slug: string, page?: number, limit?: number) =>
      ["categories", slug, "posts", page, limit] as const,
  },
  tags: {
    all: ["tags"] as const,
  },
  products: {
    public: (params?: { category?: string; sort?: string }) =>
      ["products", "public", params ?? {}] as const,
    detail: (id: number) => ["products", "detail", id] as const,
    admin: (token: string | null) => ["products", "admin", token ?? ""] as const,
  },
  hubs: {
    all: ["hubs"] as const,
    detail: (slug: string) => ["hubs", "detail", slug] as const,
  },
  users: {
    admin: (token: string | null) => ["users", "admin", token ?? ""] as const,
  },
} as const;
