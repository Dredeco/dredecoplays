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
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {gridDisplay.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </section>

            <AdSlot position="mid-content" />

            <section>
              <div className="mb-6 flex items-center gap-3">
                <div className="h-7 w-1 shrink-0 rounded-full bg-violet-600" />
                <h2 className="text-xl font-bold text-foreground">
                  Mais Lidos
                </h2>
              </div>
              <div className="flex items-start gap-6">
                <ol className="flex-1 space-y-5">
                  {mostRead.map((post, index) => (
                    <li key={post.id} className="flex items-start gap-4">
                      <span className="mt-0.5 w-10 shrink-0 text-4xl font-black leading-none text-violet-800/60">
                        {index + 1}
                      </span>
                      <div className="flex-1">
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
                          className="mt-1 block text-xs text-muted"
                          dateTime={post.createdAt}
                        >
                          {formatDate(post.createdAt)}
                        </time>
                      </div>
                    </li>
                  ))}
                </ol>

                {mostRead[0] ? (
                  <div className="hidden w-52 shrink-0 sm:block">
                    <Link href={`/blog/${mostRead[0].slug}`}>
                      <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
                        <PostThumbnail
                          src={getPostCoverUrl(mostRead[0])}
                          alt={mostRead[0].title}
                          className="object-cover transition-transform duration-500 hover:scale-105"
                          sizes="208px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>
                    </Link>
                  </div>
                ) : null}
              </div>
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

            <div className="rounded-xl border border-border bg-surface p-5 shadow-md">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-foreground">
                Populares
              </h3>
              <ol className="space-y-4">
                {mostRead.map((post, index) => (
                  <li key={post.id} className="flex gap-3">
                    <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg">
                      <PostThumbnail
                        src={getPostCoverUrl(post)}
                        alt={post.title}
                        className="object-cover"
                        sizes="64px"
                      />
                      <div className="absolute left-0 top-0 flex h-5 w-5 items-center justify-center rounded-br-lg bg-violet-700 text-xs font-black text-white">
                        {index + 1}
                      </div>
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="line-clamp-3 text-xs font-medium leading-snug text-foreground transition-colors hover:text-violet-400"
                    >
                      {post.title}
                    </Link>
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
