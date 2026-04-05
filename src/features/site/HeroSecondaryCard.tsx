import Link from "next/link";
import PostThumbnail from "@features/posts/PostThumbnail";
import CategoryBadge from "@features/site/CategoryBadge";
import type { Post } from "@core/types";
import {
  formatDate,
  getPostCoverUrl,
  getPostCategoryName,
} from "@features/posts/post-content";

interface Props {
  post: Post;
  /** Card grande no bento (span 4×2) */
  layout?: "default" | "large";
}

/** Card compacto para bento / colunas — imagem full-bleed + texto */
export default function HeroSecondaryCard({ post, layout = "default" }: Props) {
  const coverUrl = getPostCoverUrl(post);
  const categoryName = getPostCategoryName(post);
  const isLarge = layout === "large";

  return (
    <article
      className={`group relative h-full min-h-0 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] transition-[transform,border-color] duration-[var(--transition-base)] hover:scale-[1.02] hover:border-[var(--color-border-default)] ${
        isLarge
          ? "min-h-[200px] md:min-h-[230px] lg:min-h-[248px]"
          : "min-h-[112px] sm:min-h-[128px]"
      }`}
    >
      <div className="absolute inset-0">
        <PostThumbnail
          src={coverUrl}
          alt={post.title}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes={
            isLarge
              ? "(max-width: 1024px) 100vw, 55vw"
              : "(max-width: 1024px) 100vw, 280px"
          }
        />
        <div
          className="absolute inset-0 z-[1] bg-gradient-to-t from-black/90 via-black/35 to-black/10"
          aria-hidden
        />
      </div>

      <div className="absolute left-3 top-3 z-[1]">
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
      </div>

      <Link
        href={`/blog/${post.slug}`}
        className="absolute bottom-3 left-3 right-3 z-[1] block"
      >
        <h3
          className={`line-clamp-2 font-bold leading-snug text-white transition-colors group-hover:text-violet-200 ${
            isLarge
              ? "text-sm sm:text-base lg:text-2xl"
              : "text-sm sm:text-base"
          }`}
        >
          {post.title}
        </h3>
        {isLarge ? (
          <span className="hidden lg:block mt-1 mb-2 text-sm text-white/70 max-w-[80%]">
            {post.excerpt}
          </span>
        ) : (
          <></>
        )}
        <time
          className="mt-1 block text-xs text-white/70"
          dateTime={post.createdAt}
        >
          {formatDate(post.createdAt)}
        </time>
      </Link>
    </article>
  );
}
