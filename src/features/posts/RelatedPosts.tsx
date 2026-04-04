import type { Post } from "@core/types";
import PostCard from "./PostCard";

interface Props {
  posts: Post[];
}

export default function RelatedPosts({ posts }: Props) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16 border-t border-border pt-10">
      <div className="mb-8 border-l-[3px] border-[var(--color-brand-primary)] pl-4">
        <h2 className="text-[length:var(--text-2xl)] font-bold tracking-[var(--tracking-tight)] text-foreground">
          Leia também
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
