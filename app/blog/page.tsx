import { getPosts, getCategories } from "@/lib/api";
import PostCard from "@/components/PostCard";
import AdSlot from "@/components/AdSlot";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Todos os artigos, reviews, guias e listas de games do Dredeco Plays.",
};

interface Props {
  searchParams: Promise<{ page?: string; search?: string; category?: string }>;
}

export default async function BlogPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const limit = 12;

  const [postsRes, categories] = await Promise.all([
    getPosts({
      page,
      limit,
      search: params.search || undefined,
      category: params.category || undefined,
      status: "published",
    }),
    getCategories(),
  ]);

  const posts = postsRes.data;
  const meta = postsRes.meta;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
          Blog
        </h1>
        <p className="text-gray-400">
          {meta.total} {meta.total === 1 ? "artigo" : "artigos"} publicados sobre games
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8 pb-6 border-b border-[#2a2a3a]">
        <Link
          href="/blog"
          className={`px-4 py-1.5 rounded-full text-sm font-medium ${
            !params.category ? "bg-violet-700 text-white" : "bg-[#1c1c28] text-gray-300 hover:bg-violet-900/40 hover:text-violet-300 border border-[#2a2a3a] transition-colors"
          }`}
        >
          Todos
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={params.category === cat.slug ? "/blog" : `/blog?category=${cat.slug}`}
            className={`px-4 py-1.5 rounded-full text-sm font-medium ${
              params.category === cat.slug
                ? "bg-violet-700 text-white"
                : "bg-[#1c1c28] text-gray-300 hover:bg-violet-900/40 hover:text-violet-300 border border-[#2a2a3a] transition-colors"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <div className="flex gap-8">
        <div className="flex-1 min-w-0">
          {posts.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              Nenhum post encontrado.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {meta.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {page > 1 && (
                <Link
                  href={`/blog?page=${page - 1}${params.category ? `&category=${params.category}` : ""}${params.search ? `&search=${encodeURIComponent(params.search)}` : ""}`}
                  className="px-4 py-2 rounded-lg bg-[#1c1c28] text-gray-300 hover:bg-violet-900/40 border border-[#2a2a3a]"
                >
                  Anterior
                </Link>
              )}
              <span className="px-4 py-2 text-gray-400">
                Página {page} de {meta.totalPages}
              </span>
              {page < meta.totalPages && (
                <Link
                  href={`/blog?page=${page + 1}${params.category ? `&category=${params.category}` : ""}${params.search ? `&search=${encodeURIComponent(params.search)}` : ""}`}
                  className="px-4 py-2 rounded-lg bg-[#1c1c28] text-gray-300 hover:bg-violet-900/40 border border-[#2a2a3a]"
                >
                  Próxima
                </Link>
              )}
            </div>
          )}

          <AdSlot position="footer" className="mt-12" />
        </div>

        <aside className="hidden lg:flex flex-col gap-6 w-64 shrink-0">
          <div className="bg-[#13131a] rounded-xl border border-[#2a2a3a] p-5 sticky top-24">
            <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-4">
              Categorias
            </h3>
            <ul className="divide-y divide-[#2a2a3a]">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/categoria/${cat.slug}`}
                    className="flex items-center justify-between py-2.5 text-sm text-gray-400 hover:text-violet-400 transition-colors"
                  >
                    <span>{cat.name}</span>
                    <span className="text-gray-600 text-xs">&rarr;</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
