import type { Metadata } from "next";
import Link from "next/link";
import {
  getFeaturedPost,
  getRecentPosts,
  getPopularPosts,
  getCategories,
  getPosts,
} from "@core/api-client";
import { formatDate, getPostCoverUrl } from "@features/posts/post-content";
import PostThumbnail from "@features/posts/PostThumbnail";
import PostCardFeatured from "@features/posts/PostCardFeatured";
import PostCard from "@features/posts/PostCard";
import AdSlot from "@features/site/AdSlot";
import CategoryBadge from "@features/site/CategoryBadge";
import ProductsGridAd from "@features/products/ProductsGridAd";
import ProductsRowAd from "@features/products/ProductsRowAd";
import BreakingNewsBar from "@features/site/BreakingNewsBar";
import HeroSecondaryCard from "@features/site/HeroSecondaryCard";
import CategoryShowcase from "@features/site/CategoryShowcase";
import SectionHeader from "@features/site/SectionHeader";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://dredecoplays.com.br";

export const metadata: Metadata = {
  title: "Dredeco Plays — Portal de Games",
  description:
    "Notícias, reviews, guias e listas sobre games. Conteúdo para jogadores de PS5, Xbox, PC e Nintendo.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "Dredeco Plays — Portal de Games",
    description: "Notícias, reviews, guias e listas sobre games.",
    url: SITE_URL,
    siteName: "Dredeco Plays",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/og-default.png`,
        width: 1200,
        height: 630,
        alt: "Dredeco Plays — Portal de Games",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dredeco Plays — Portal de Games",
    description: "Notícias, reviews, guias e listas sobre games.",
    images: [`${SITE_URL}/og-default.png`],
  },
};

export const revalidate = 60;

export default async function HomePage() {
  const [featuredPost, recentPosts, popularPosts, categories, postsFeed] =
    await Promise.all([
      getFeaturedPost(),
      getRecentPosts(),
      getPopularPosts(),
      getCategories(),
      getPosts({ limit: 48, page: 1, status: "published" }),
    ]);

  const breakingPosts = recentPosts.slice(0, 5);
  const heroMain = featuredPost ?? recentPosts[0] ?? null;
  const heroSecondary = heroMain
    ? recentPosts.filter((p) => p.id !== heroMain.id).slice(0, 3)
    : [];
  const heroIds = new Set(
    [heroMain?.id, ...heroSecondary.map((p) => p.id)].filter(
      (id): id is number => id != null,
    ),
  );
  /** Lista ampla da API para preencher o grid sem repetir destaque/bento */
  const gridDisplay = postsFeed.data
    .filter((p) => !heroIds.has(p.id))
    .slice(0, 6);

  const mostRead = popularPosts.slice(0, 3);

  return (
    <div className="pb-6">
      {breakingPosts.length > 0 ? (
        <div className="mb-6">
          <BreakingNewsBar posts={breakingPosts} />
        </div>
      ) : null}

      {heroMain ? (
        <div className="mx-auto mb-6 max-w-7xl space-y-3 px-4 sm:px-6">
          <PostCardFeatured post={heroMain} heroLayout />
          {heroSecondary.length > 0 ? (
            <div className="bento-grid">
              <div className="bento-card-featured">
                <HeroSecondaryCard post={heroSecondary[0]} layout="large" />
              </div>
              {heroSecondary[1] ? (
                <div className="bento-card-secondary">
                  <HeroSecondaryCard post={heroSecondary[1]} />
                </div>
              ) : null}
              {heroSecondary[2] ? (
                <div className="bento-card-secondary">
                  <HeroSecondaryCard post={heroSecondary[2]} />
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <AdSlot position="top" className="mb-4" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex gap-6 lg:gap-7" suppressHydrationWarning>
          <div className="min-w-0 flex-1 space-y-10">
            <CategoryShowcase categories={categories} />

            <section>
              <SectionHeader
                label="Últimos Posts"
                href="/blog"
                linkText="Ver blog →"
              />
              {gridDisplay.length > 0 ? (
                <div
                  className={
                    gridDisplay.length >= 3
                      ? "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:items-start"
                      : "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:max-w-4xl lg:grid-cols-2 lg:items-start"
                  }
                >
                  {gridDisplay.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted">
                  Nenhum outro post para listar além do destaque.
                </p>
              )}
            </section>

            <AdSlot position="mid-content" />

            <section aria-labelledby="most-read-heading">
              <SectionHeader
                id="most-read-heading"
                label="Mais Lidos"
                href="/blog"
                linkText="Ver blog →"
              />
              <ol className="space-y-0">
                {mostRead.map((post, index) => (
                  <li
                    key={post.id}
                    className="border-b border-[var(--color-border-subtle)] py-5 last:border-b-0 last:pb-0 first:pt-0"
                  >
                    <div className="relative flex items-start gap-4">
                      <div className="relative min-w-0 flex-1 overflow-hidden pl-1">
                        <span
                          className="pointer-events-none absolute -left-1 -top-1 select-none font-black leading-none text-[2.5rem] text-[var(--color-brand-primary)] opacity-[0.15] sm:text-[2.75rem]"
                          aria-hidden
                        >
                          {index + 1}
                        </span>
                        <div className="relative z-[1]">
                          <CategoryBadge
                            category={
                              post.category
                                ? {
                                    name: post.category.name,
                                    slug: post.category.slug,
                                    color: post.category.color,
                                  }
                                : "Sem categoria"
                            }
                          />
                          <Link
                            href={`/blog/${post.slug}`}
                            className="mt-1 block font-semibold leading-snug text-foreground transition-colors hover:text-violet-400"
                          >
                            {post.title}
                          </Link>
                          <time
                            className="mt-1 block text-sm text-[var(--color-text-muted)]"
                            dateTime={post.createdAt}
                          >
                            {formatDate(post.createdAt)}
                          </time>
                        </div>
                      </div>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="relative z-[1] h-[60px] w-[60px] shrink-0 overflow-hidden rounded-lg ring-1 ring-[var(--color-border-subtle)] transition-transform duration-300 hover:scale-105"
                      >
                        <PostThumbnail
                          src={getPostCoverUrl(post)}
                          alt={post.title}
                          className="object-cover"
                          sizes="60px"
                        />
                      </Link>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <ProductsRowAd className="mt-10" />
          </div>

          <aside className="hidden w-64 shrink-0 flex-col gap-5 xl:w-72 xl:gap-6 lg:flex">
            <form action="/busca" method="GET" className="relative">
              <input
                type="search"
                name="q"
                placeholder="Buscar..."
                className="w-full rounded-lg border border-border bg-surface px-4 py-3 pr-10 text-sm text-foreground placeholder:text-muted transition-colors focus:border-violet-600 focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-violet-400"
                aria-label="Buscar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </form>

            <div className="rounded-xl border border-[var(--color-border-subtle)] bg-surface p-5 shadow-[var(--shadow-card)]">
              <div className="mb-4 flex items-center gap-2">
                <div
                  className="h-6 w-1 shrink-0 rounded-full bg-orange-500"
                  aria-hidden
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-4 w-4 shrink-0 text-orange-400"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M12 23c-1.1 0-2-.9-2-2h4c0 1.1-.9 2-2 2zm7-6H5v-2h14v2zm-1.5-9c0-3.1-2-5.7-4.8-6.6L14 2h-4l.3 1.4C7.5 4.3 5.5 6.9 5.5 10V11h13v-1.5z" />
                </svg>
                <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-foreground">
                  Populares
                </h3>
              </div>
              <ol className="space-y-0">
                {mostRead.map((post, index) => (
                  <li
                    key={post.id}
                    className="border-b border-[var(--color-border-subtle)] py-4 last:border-b-0 last:pb-0 first:pt-0"
                  >
                    <div className="relative flex items-start gap-3">
                      <div className="relative min-w-0 flex-1">
                        <span
                          className="pointer-events-none absolute -left-0.5 -top-1 select-none font-black leading-none text-[2.75rem] text-[var(--color-brand-violet)] opacity-25"
                          aria-hidden
                        >
                          {index + 1}
                        </span>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="relative z-[1] line-clamp-3 text-sm font-medium leading-snug text-foreground transition-colors hover:text-violet-400"
                        >
                          {post.title}
                        </Link>
                      </div>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="relative z-[1] h-[60px] w-[60px] shrink-0 overflow-hidden rounded-lg ring-1 ring-[var(--color-border-subtle)]"
                      >
                        <PostThumbnail
                          src={getPostCoverUrl(post)}
                          alt={post.title}
                          className="object-cover"
                          sizes="60px"
                        />
                      </Link>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <ProductsGridAd layout="sidebar" />

            <AdSlot position="sidebar" />
          </aside>
        </div>
      </div>
    </div>
  );
}
