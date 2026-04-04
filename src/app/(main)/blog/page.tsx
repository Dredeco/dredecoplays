import { getPosts, getCategories } from "@core/api-client";
import PostCard from "@features/posts/PostCard";
import AdSlot from "@features/site/AdSlot";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 60;

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

  function pageHref(nextPage: number): string {
    const p = new URLSearchParams();
    if (nextPage > 1) p.set("page", String(nextPage));
    if (params.category) p.set("category", params.category);
    if (params.search) p.set("search", params.search);
    const s = p.toString();
    return s ? `/blog?${s}` : "/blog";
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-extrabold text-foreground sm:text-4xl">
          Blog
        </h1>
        <p className="text-muted">
          {meta.total} {meta.total === 1 ? "artigo" : "artigos"} publicados sobre
          games
        </p>
      </div>

      <div className="filter-tabs">
        <Link
          href="/blog"
          className="filter-tab"
          data-active={!params.category ? true : undefined}
        >
          Todos
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={
              params.category === cat.slug ? "/blog" : `/blog?category=${cat.slug}`
            }
            className="filter-tab"
            data-active={params.category === cat.slug ? true : undefined}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <div className="flex gap-8">
        <div className="min-w-0 flex-1">
          {posts.length === 0 ? (
            <div className="py-20 text-center text-muted">
              Nenhum post encontrado.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {meta.totalPages > 1 ? (
            <div className="pagination">
              {page > 1 ? (
                <Link href={pageHref(page - 1)} className="pagination__btn">
                  Anterior
                </Link>
              ) : null}
              <span className="pagination__info">
                Página {page} de {meta.totalPages}
              </span>
              {page < meta.totalPages ? (
                <Link href={pageHref(page + 1)} className="pagination__btn">
                  Próxima
                </Link>
              ) : null}
            </div>
          ) : null}

          <AdSlot position="footer" className="mt-12" />
        </div>

        <aside className="hidden w-64 shrink-0 flex-col gap-6 lg:flex">
          <div className="sticky top-24 rounded-xl border border-border bg-surface p-5 shadow-md">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-foreground">
              Categorias
            </h3>
            <ul className="divide-y divide-border">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/categoria/${cat.slug}`}
                    className="flex items-center justify-between py-2.5 text-sm text-muted transition-colors hover:text-violet-400"
                  >
                    <span>{cat.name}</span>
                    <span className="text-xs text-muted">&rarr;</span>
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
