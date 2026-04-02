import type { Metadata } from "next";
import Link from "next/link";
import {
  getFeaturedPost,
  getRecentPosts,
  getPopularPosts,
  getCategories,
} from "@/lib/api";
import { formatDate, getPostCoverUrl } from "@/lib/posts";
import PostThumbnail from "@/components/PostThumbnail";
import PostCardFeatured from "@/components/PostCardFeatured";
import PostCard from "@/components/PostCard";
import AdSlot from "@/components/AdSlot";
import CategoryBadge from "@/components/CategoryBadge";
import ProductsGridAd from "@/components/ProductsGridAd";
import ProductsRowAd from "@/components/ProductsRowAd";
import BreakingNewsBar from "@/components/BreakingNewsBar";
import HeroSecondaryCard from "@/components/HeroSecondaryCard";
import CategoryShowcase from "@/components/CategoryShowcase";

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
  const [featuredPost, recentPosts, popularPosts, categories] =
    await Promise.all([
      getFeaturedPost(),
      getRecentPosts(),
      getPopularPosts(),
      getCategories(),
    ]);

  const breakingPosts = recentPosts.slice(0, 5);
  const heroMain = featuredPost ?? recentPosts[0] ?? null;
  const heroSecondary = heroMain
    ? recentPosts.filter((p) => p.id !== heroMain.id).slice(0, 2)
    : [];
  const heroIds = new Set(
    [heroMain?.id, ...heroSecondary.map((p) => p.id)].filter(
      (id): id is number => id != null,
    ),
  );
  const latestGrid = recentPosts.filter((p) => !heroIds.has(p.id)).slice(0, 6);
  const gridDisplay =
    latestGrid.length >= 3 ? latestGrid : recentPosts.slice(0, 6);

  const mostRead = popularPosts.slice(0, 3);

  return (
    <div className="pb-6">
      {breakingPosts.length > 0 ? (
        <div className="mb-6">
          <BreakingNewsBar posts={breakingPosts} />
        </div>
      ) : null}

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <AdSlot position="top" className="mb-4" />
      </div>

      {heroMain ? (
        <div className="mx-auto mb-8 max-w-7xl px-4 sm:px-6">
          <div
            className={
              heroSecondary.length > 0
                ? "grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_300px] lg:h-[460px] lg:items-stretch"
                : "grid grid-cols-1"
            }
          >
            <PostCardFeatured post={heroMain} heroLayout />
            {heroSecondary.length > 0 ? (
              <div className="hidden flex-col gap-4 lg:flex">
                {heroSecondary.map((post) => (
                  <HeroSecondaryCard key={post.id} post={post} />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex gap-8" suppressHydrationWarning>
          <div className="min-w-0 flex-1 space-y-10">
            <CategoryShowcase categories={categories} />

            <section>
              <div className="mb-6 flex items-center gap-3">
                <div className="h-7 w-1 shrink-0 rounded-full bg-violet-600" />
                <h2 className="text-xl font-bold text-foreground">
                  Últimos Posts
                </h2>
                <Link
                  href="/blog"
                  className="ml-auto text-sm text-violet-400 transition-colors hover:text-violet-300"
                >
                  Ver todos →
                </Link>
              </div>
              {gridDisplay.length >= 6 ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
                  <div className="sm:col-span-2 lg:col-span-4 lg:row-span-2 flex">
                    <PostCard post={gridDisplay[0]} variant="featured" />
                  </div>
                  <div className="sm:col-span-1 lg:col-span-2">
                    <PostCard post={gridDisplay[1]} />
                  </div>
                  <div className="sm:col-span-1 lg:col-span-2">
                    <PostCard post={gridDisplay[2]} />
                  </div>
                  <div className="sm:col-span-1 lg:col-span-2">
                    <PostCard post={gridDisplay[3]} />
                  </div>
                  <div className="sm:col-span-1 lg:col-span-2">
                    <PostCard post={gridDisplay[4]} />
                  </div>
                  <div className="sm:col-span-1 lg:col-span-2">
                    <PostCard post={gridDisplay[5]} />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {gridDisplay.map((post, index) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      variant={
                        gridDisplay.length >= 2 && index === 0
                          ? "featured"
                          : "default"
                      }
                    />
                  ))}
                </div>
              )}
            </section>

            <AdSlot position="mid-content" />

            <section aria-labelledby="most-read-heading">
              <div className="mb-6 flex items-center gap-3">
                <div
                  className="h-7 w-1 shrink-0 rounded-full bg-violet-600"
                  aria-hidden
                />
                <h2
                  id="most-read-heading"
                  className="text-xs font-bold uppercase tracking-[0.12em] text-foreground"
                >
                  Mais Lidos
                </h2>
              </div>
              <ol className="space-y-0">
                {mostRead.map((post, index) => (
                  <li
                    key={post.id}
                    className="border-b border-[var(--color-border-subtle)] py-5 last:border-b-0 last:pb-0 first:pt-0"
                  >
                    <div className="relative flex items-start gap-4">
                      <div className="relative min-w-0 flex-1 overflow-hidden pl-1">
                        <span
                          className="pointer-events-none absolute -left-1 -top-2 select-none font-black leading-none text-[4.5rem] text-[var(--color-brand-violet)] opacity-[0.22] sm:text-[5rem]"
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

          <aside className="hidden w-72 shrink-0 flex-col gap-6 lg:flex">
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

            <ProductsGridAd />

            <AdSlot position="sidebar" />
          </aside>
        </div>
      </div>
    </div>
  );
}
