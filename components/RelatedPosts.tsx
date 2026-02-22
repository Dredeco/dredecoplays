import type { Post } from "@/lib/types";
import PostCard from "./PostCard";

interface Props {
  posts: Post[];
}

export default function RelatedPosts({ posts }: Props) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16 pt-10 border-t border-[#2a2a3a]">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1 h-7 bg-violet-600 rounded-full" />
        <h2 className="text-2xl font-bold text-white">Posts Relacionados</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
