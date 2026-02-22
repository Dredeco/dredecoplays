import Link from "next/link";
import CategoryBadge from "./CategoryBadge";
import PostThumbnail from "./PostThumbnail";
import type { Post } from "@/lib/types";
import { formatDate, getPostCoverUrl, getPostCategoryName, calculateReadingTime } from "@/lib/posts";

interface Props {
  post: Post;
}

export default function PostCard({ post }: Props) {
  const coverUrl = getPostCoverUrl(post);
  const categoryName = getPostCategoryName(post);
  const readingTime = calculateReadingTime(post.content);

  return (
    <article className="group bg-[#13131a] rounded-xl overflow-hidden border border-[#2a2a3a] hover:border-violet-700/50 transition-all duration-300 flex flex-col">
      <Link href={`/blog/${post.slug}`} className="block relative aspect-video overflow-hidden">
        <PostThumbnail
          src={coverUrl}
          alt={post.title}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <CategoryBadge
          category={post.category ? { name: categoryName, slug: post.category.slug, color: post.category.color } : categoryName}
        />

        <Link href={`/blog/${post.slug}`} className="flex-1">
          <h3 className="mt-2 text-white font-bold text-base leading-tight group-hover:text-violet-400 transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="mt-1.5 text-gray-400 text-sm line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        </Link>

        <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
          <span>·</span>
          <span>{readingTime} min de leitura</span>
        </div>
      </div>
    </article>
  );
}
