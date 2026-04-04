import type { Metadata } from "next";
import Link from "next/link";
import { getPosts } from "@/lib/api";
import PostCard from "@/components/PostCard";
import AdSlot from "@/components/AdSlot";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q?.trim() || "";

  return {
    title: query ? `Busca: "${query}"` : "Busca",
    description: query
      ? `Resultados de busca para "${query}" no Dredeco Plays.`
      : "Pesquise reviews, guias, notícias e listas de jogos no Dredeco Plays.",
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() || "";

  const results = query
    ? await getPosts({ search: query, limit: 24, status: "published" }).catch(
        () => null
      )
    : null;

  const posts = results?.data ?? [];
  const total = results?.meta?.total ?? 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <AdSlot position="top" className="mb-8" />

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-2">
          {query ? (
            <>
              Busca:{" "}
              <span className="text-violet-400">&ldquo;{query}&rdquo;</span>
            </>
          ) : (
            "O que você está procurando?"
          )}
        </h1>
        {query && (
          <p className="text-muted text-sm">
            {total > 0
              ? `${total} resultado${total !== 1 ? "s" : ""} encontrado${total !== 1 ? "s" : ""}`
              : "Nenhum resultado encontrado"}
          </p>
        )}
      </div>

      <form action="/busca" method="GET" className="mb-10">
        <div className="relative max-w-2xl">
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Buscar reviews, guias, notícias..."
            autoFocus={!query}
            className="w-full bg-surface border border-border rounded-xl px-5 py-4 pr-14 text-foreground placeholder:text-muted focus:outline-none focus:border-violet-600 transition-colors text-base"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-violet-700 hover:bg-violet-600 text-white rounded-lg p-2.5 transition-colors"
            aria-label="Buscar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </form>

      {!query && (
        <p className="text-muted text-center py-16 text-lg">
          Digite acima para buscar reviews, guias e notícias.
        </p>
      )}

      {query && posts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted text-lg mb-2">
            Nenhum resultado para <strong className="text-foreground">&ldquo;{query}&rdquo;</strong>
          </p>
          <p className="text-muted text-sm">
            Tente palavras-chave diferentes ou navegue pelas{" "}
            <Link href="/blog" className="text-violet-400 hover:underline">
              categorias
            </Link>
            .
          </p>
        </div>
      )}

      {posts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {posts.length > 0 && (
        <AdSlot position="footer" className="mt-12" />
      )}
    </div>
  );
}
