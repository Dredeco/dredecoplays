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

export const revalidate = 60;

export default async function HomePage() {
  const [featuredPost, recentPosts, popularPosts, categories] =
    await Promise.all([
      getFeaturedPost(),
      getRecentPosts(),
      getPopularPosts(),
      getCategories(),
    ]);

  const mostRead = popularPosts.slice(0, 3);
  const recent = recentPosts.slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <AdSlot position="top" className="mb-6" />

      <div className="flex gap-8">
        <div className="flex-1 min-w-0 space-y-10">
          {featuredPost && <PostCardFeatured post={featuredPost} />}

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-7 bg-violet-600 rounded-full shrink-0" />
              <h2 className="text-xl font-bold text-foreground">Últimos Posts</h2>
              <Link
                href="/blog"
                className="ml-auto text-sm text-violet-400 hover:text-violet-300 transition-colors"
              >
                Ver todos →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {recent.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </section>

          <AdSlot position="mid-content" />

          <ProductsRowAd className="mt-10" />

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-7 bg-violet-600 rounded-full shrink-0" />
              <h2 className="text-xl font-bold text-foreground">Mais Lidos</h2>
            </div>
            <div className="flex gap-6 items-start">
              <ol className="flex-1 space-y-5">
                {mostRead.map((post, index) => (
                  <li key={post.id} className="flex items-start gap-4">
                    <span className="text-4xl font-black text-violet-800/60 w-10 shrink-0 leading-none mt-0.5">
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
                        className="block mt-1 text-foreground font-semibold hover:text-violet-400 transition-colors leading-snug"
                      >
                        {post.title}
                      </Link>
                      <time
                        className="text-xs text-muted mt-1 block"
                        dateTime={post.createdAt}
                      >
                        {formatDate(post.createdAt)}
                      </time>
                    </div>
                  </li>
                ))}
              </ol>

              {mostRead[0] && (
                <div className="hidden sm:block w-52 shrink-0">
                  <Link href={`/blog/${mostRead[0].slug}`}>
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
                      <PostThumbnail
                        src={getPostCoverUrl(mostRead[0])}
                        alt={mostRead[0].title}
                        className="object-cover hover:scale-105 transition-transform duration-500"
                        sizes="208px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </section>
        </div>

        <aside className="hidden lg:flex flex-col gap-6 w-72 shrink-0">
          <div className="relative">
            <input
              type="search"
              placeholder="Buscar..."
              className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-violet-600 transition-colors"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 absolute right-3.5 top-3.5 text-muted"
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
          </div>

          <div className="bg-surface rounded-xl border border-border shadow-md p-5">
            <h3 className="text-foreground font-bold text-xs uppercase tracking-widest mb-4">
              Categorias
            </h3>
            <ul className="divide-y divide-border">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/categoria/${cat.slug}`}
                    className="flex items-center justify-between py-2.5 text-sm text-muted hover:text-violet-400 transition-colors"
                  >
                    <span>{cat.name}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-muted"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-surface rounded-xl border border-border shadow-md p-5">
            <h3 className="text-foreground font-bold text-xs uppercase tracking-widest mb-4">
              Populares
            </h3>
            <ol className="space-y-4">
              {mostRead.map((post, index) => (
                <li key={post.id} className="flex gap-3">
                  <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0">
                    <PostThumbnail
                      src={getPostCoverUrl(post)}
                      alt={post.title}
                      className="object-cover"
                      sizes="64px"
                    />
                    <div className="absolute top-0 left-0 bg-violet-700 text-white text-xs font-black w-5 h-5 flex items-center justify-center rounded-br-lg">
                      {index + 1}
                    </div>
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-xs text-foreground hover:text-violet-400 transition-colors font-medium leading-snug line-clamp-3"
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
  );
}
