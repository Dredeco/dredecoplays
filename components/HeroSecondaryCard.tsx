import Link from "next/link";
import PostThumbnail from "./PostThumbnail";
import CategoryBadge from "./CategoryBadge";
import type { Post } from "@/lib/types";
import { formatDate, getPostCoverUrl, getPostCategoryName } from "@/lib/posts";

interface Props {
  post: Post;
}

/** Card compacto para coluna lateral do hero (imagem full-bleed + texto) */
export default function HeroSecondaryCard({ post }: Props) {
  const coverUrl = getPostCoverUrl(post);
  const categoryName = getPostCategoryName(post);

  return (
    <article className="group relative min-h-[140px] flex-1 overflow-hidden rounded-2xl ring-1 ring-white/10 transition-transform duration-300 hover:scale-[1.01]">
      <div className="absolute inset-0">
        <PostThumbnail
          src={coverUrl}
          alt={post.title}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="300px"
        />
        {/* Gradient after PostThumbnail in DOM → on top; z-[1] for extra safety */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/90 via-black/30 to-black/10" aria-hidden />
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
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-white transition-colors group-hover:text-violet-200 sm:text-base">
          {post.title}
        </h3>
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
