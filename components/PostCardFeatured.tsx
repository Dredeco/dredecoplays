import Link from "next/link";
import PostThumbnail from "./PostThumbnail";
import type { Post } from "@/lib/types";
import CategoryBadge from "./CategoryBadge";
import { getPostCoverUrl, getPostCategoryName } from "@/lib/posts";

interface Props {
  post: Post;
}

export default function PostCardFeatured({ post }: Props) {
  const coverUrl = getPostCoverUrl(post);
  const categoryName = getPostCategoryName(post);

  return (
    <article className="relative rounded-xl overflow-hidden group">
      <div className="relative aspect-[16/9] sm:aspect-[21/9]">
        <PostThumbnail
          src={coverUrl}
          alt={post.title}
          priority
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 1024px) 100vw, 65vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-violet-950/20 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
        <div className="flex items-center gap-3 mb-3">
          <span className="inline-block bg-orange-500 text-white text-xs font-black px-3 py-1 rounded uppercase tracking-widest">
            Destaque
          </span>
          <CategoryBadge
            category={post.category ? { name: categoryName, slug: post.category.slug, color: post.category.color } : categoryName}
            asLink={false}
          />
        </div>

        <Link href={`/blog/${post.slug}`}>
          <h2 className="text-white font-extrabold text-xl sm:text-3xl leading-tight mb-4 hover:text-violet-300 transition-colors max-w-2xl">
            {post.title}
          </h2>
        </Link>

        <p className="text-gray-300 text-sm sm:text-base mb-5 line-clamp-2 max-w-xl hidden sm:block">
          {post.excerpt}
        </p>

        <Link
          href={`/blog/${post.slug}`}
          className="inline-block bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors shadow-lg shadow-violet-900/40"
        >
          Leia Mais →
        </Link>
      </div>
    </article>
  );
}
