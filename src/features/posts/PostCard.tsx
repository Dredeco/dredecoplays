import Link from "next/link";
import CategoryBadge from "@features/site/CategoryBadge";
import PostThumbnail from "@features/posts/PostThumbnail";
import type { Post } from "@core/types";
import {
  formatDate,
  getPostCoverUrl,
  getPostCategoryName,
  calculateReadingTime,
} from "@features/posts/post-content";

interface Props {
  post: Post;
  /** Apenas layout de grid: preenche célula + sizes maiores na imagem (sem mudar tipografia) */
  variant?: "default" | "featured";
}

export default function PostCard({ post, variant = "default" }: Props) {
  const coverUrl = getPostCoverUrl(post);
  const categoryName = getPostCategoryName(post);
  const readingTime = calculateReadingTime(post.content);
  const isFeatured = variant === "featured";

  return (
    <article
      className="article-card group flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] shadow-[var(--shadow-card)] transition-[transform,box-shadow,border-color] duration-[var(--transition-base)] hover:-translate-y-1 hover:border-[var(--color-border-default)] hover:shadow-[var(--shadow-elevated)]"
    >
      <Link
        href={`/blog/${post.slug}`}
        className="article-card__image relative block aspect-video overflow-hidden"
      >
        <PostThumbnail
          src={coverUrl}
          alt={post.title}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          sizes={
            isFeatured
              ? "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 66vw"
              : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          }
        />
      </Link>

      {/* Tipografia e espaçamento idênticos em todos os cards (consistência editorial) */}
      <div className="flex flex-col p-4">
        <CategoryBadge
          variant="pill"
          category={
            post.category
              ? {
                  name: categoryName,
                  slug: post.category.slug,
                  color: post.category.color,
                }
              : categoryName
          }
        />

        <Link href={`/blog/${post.slug}`} className="mt-2 flex flex-col">
          <h3 className="article-card__title line-clamp-2 text-base font-bold leading-[var(--leading-snug)] tracking-[var(--tracking-tight)] text-foreground transition-colors group-hover:text-violet-400 sm:text-lg lg:text-[1.125rem]">
            {post.title}
          </h3>
          <p className="article-card__excerpt mt-1.5 line-clamp-2 text-[length:var(--text-sm)] leading-[var(--leading-normal)] text-[var(--color-text-secondary)]">
            {post.excerpt}
          </p>
        </Link>

        <div className="article-card__meta mt-3 flex min-h-[44px] items-center gap-2 pt-1 text-[length:var(--text-xs)] text-[var(--color-text-muted)]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
          <span aria-hidden>·</span>
          <span>{readingTime} min de leitura</span>
        </div>
      </div>
    </article>
  );
}
