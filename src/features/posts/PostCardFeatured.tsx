import Link from "next/link";
import PostThumbnail from "@features/posts/PostThumbnail";
import type { Post } from "@core/types";
import CategoryBadge from "@features/site/CategoryBadge";
import {
  getPostCoverUrl,
  getPostCategoryName,
  calculateReadingTime,
} from "@features/posts/post-content";

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
          ? "group relative flex min-h-0 flex-col overflow-hidden rounded-2xl shadow-lg ring-1 ring-white/10"
          : "group relative overflow-hidden rounded-xl shadow-lg"
      }
    >
      <div
        className={
          heroLayout
            ? "relative aspect-[16/10] max-h-[min(480px,70vh)] w-full sm:max-h-[min(500px,70vh)] lg:aspect-[16/9] lg:max-h-[min(520px,70vh)] lg:min-h-0 lg:flex-1"
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
              ? "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, min(1280px, 100vw)"
              : "(max-width: 1024px) 100vw, 65vw"
          }
        />
        <div
          className={
            heroLayout
              ? "absolute inset-0 bg-gradient-to-t from-black/[0.95] from-0% via-black/45 via-[55%] to-transparent to-100%"
              : "absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"
          }
          aria-hidden
        />
      </div>

      <div className="hero-enter absolute bottom-0 left-0 right-0 z-[1] p-5 sm:p-7">
        <div className="mb-3 flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="inline-block rounded-md bg-[var(--color-brand-primary)] px-3 py-1 text-xs font-black uppercase tracking-[var(--tracking-wider)] text-white">
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
          <h2 className="mb-3 max-w-3xl line-clamp-3 text-2xl font-bold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-white transition-colors hover:text-violet-300 sm:mb-4 sm:text-3xl md:text-[1.75rem] lg:text-4xl xl:max-w-[40rem] xl:text-[2.25rem] 2xl:text-[2.5rem]">
            {post.title}
          </h2>
        </Link>

        {heroLayout && post.excerpt ? (
          <p className="mb-4 hidden max-w-2xl text-[length:var(--text-lg)] leading-relaxed text-[var(--color-text-secondary)] opacity-90 line-clamp-2 sm:block">
            {post.excerpt}
          </p>
        ) : null}

        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-white/40 bg-transparent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:border-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary)] sm:inline-flex"
        >
          Leia Agora →
        </Link>
      </div>
    </article>
  );
}
