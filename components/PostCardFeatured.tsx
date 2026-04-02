import Link from "next/link";
import PostThumbnail from "./PostThumbnail";
import type { Post } from "@/lib/types";
import CategoryBadge from "./CategoryBadge";
import {
  getPostCoverUrl,
  getPostCategoryName,
  calculateReadingTime,
} from "@/lib/posts";

interface Props {
  post: Post;
  /** Quando true, preenche altura do hero (desktop) com excerpt e tempo de leitura */
  heroLayout?: boolean;
}

export default function PostCardFeatured({ post, heroLayout = false }: Props) {
  const coverUrl = getPostCoverUrl(post);
  const categoryName = getPostCategoryName(post);
  const readingTime = calculateReadingTime(post.content);

  return (
    <article
      className={
        heroLayout
          ? "group relative flex h-full min-h-[280px] flex-col overflow-hidden rounded-2xl shadow-lg ring-1 ring-white/10"
          : "group relative overflow-hidden rounded-xl shadow-lg"
      }
    >
      <div
        className={
          heroLayout
            ? "relative min-h-[240px] flex-1 lg:min-h-0"
            : "relative aspect-[16/9] sm:aspect-[21/9]"
        }
      >
        <PostThumbnail
          src={coverUrl}
          alt={post.title}
          priority
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes={
            heroLayout
              ? "(max-width: 1024px) 100vw, calc(100vw - 380px)"
              : "(max-width: 1024px) 100vw, 65vw"
          }
        />
        {/* Gradients come after PostThumbnail wrapper in DOM → paint on top of image */}
        <div
          className={
            heroLayout
              ? "absolute inset-0 bg-gradient-to-t from-black/[0.96] via-black/55 to-transparent"
              : "absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"
          }
          aria-hidden
        />
        <div
          className={
            heroLayout
              ? "absolute inset-0 bg-gradient-to-r from-violet-950/35 to-transparent"
              : "absolute inset-0 bg-gradient-to-r from-violet-950/20 to-transparent"
          }
          aria-hidden
        />
      </div>

      {/* z-[1] ensures text is always above image in the article stacking context */}
      <div className="absolute bottom-0 left-0 right-0 z-[1] p-5 sm:p-7">
        <div className="mb-3 flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="inline-block rounded bg-orange-500 px-3 py-1 text-xs font-black uppercase tracking-widest text-white">
            Destaque
          </span>
          <CategoryBadge
            category={
              post.category
                ? {
                    name: categoryName,
                    slug: post.category.slug,
                    color: post.category.color,
                  }
                : categoryName
            }
            asLink={false}
          />
          {heroLayout ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white/90 backdrop-blur-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5 shrink-0 opacity-90"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {readingTime} min
            </span>
          ) : null}
        </div>

        <Link href={`/blog/${post.slug}`}>
          <h2
            className={`mb-4 max-w-2xl font-extrabold leading-tight text-white transition-colors hover:text-violet-300 line-clamp-2 ${
              heroLayout
                ? "text-lg sm:text-4xl"
                : "text-lg sm:text-3xl"
            }`}
          >
            {post.title}
          </h2>
        </Link>

        {heroLayout && post.excerpt ? (
          <p className="mb-4 hidden max-w-2xl text-sm leading-relaxed text-white/80 line-clamp-2 sm:block">
            {post.excerpt}
          </p>
        ) : null}

        <Link
          href={`/blog/${post.slug}`}
          className="hidden rounded-lg border border-white/40 bg-transparent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:border-violet-600 hover:bg-violet-600 sm:inline-block"
        >
          Leia Agora →
        </Link>
      </div>
    </article>
  );
}
