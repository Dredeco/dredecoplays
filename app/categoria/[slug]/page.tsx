import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategories, getCategoryPosts } from "@/lib/api";
import PostCard from "@/components/PostCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdSlot from "@/components/AdSlot";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);

  if (!category) return { title: "Categoria não encontrada" };

  return {
    title: `${category.name} — Todos os artigos`,
    description: `Veja todos os artigos sobre ${category.name} no Dredeco Plays.`,
    robots: { index: true, follow: true },
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam || "1", 10));

  const [categories, postsRes] = await Promise.all([
    getCategories(),
    getCategoryPosts(slug, { page, limit: 12 }),
  ]);

  // Se getCategories falhar (API indisponível), cria um fallback com o slug
  const category = categories.find((c) => c.slug === slug) ?? (
    // Mantém o notFound apenas se a lista veio mas o slug não existe
    categories.length > 0 ? null : { id: 0, name: slug, slug, color: "#8B5CF6", createdAt: "", updatedAt: "" }
  );
  if (!category) notFound();

  const posts = Array.isArray(postsRes.data) ? postsRes.data : postsRes.data;
  const meta = "meta" in postsRes ? postsRes.meta : null;
  const total = meta?.total ?? posts.length;
  const totalPages = meta?.totalPages ?? 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Categorias" },
          { label: category.name },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
          {category.name}
        </h1>
        <p className="text-gray-400">
          {total} {total === 1 ? "artigo" : "artigos"} encontrados
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-4xl mb-4">🎮</p>
          <p className="text-lg">Nenhum post nesta categoria ainda.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {page > 1 && (
                <Link
                  href={`/categoria/${slug}?page=${page - 1}`}
                  className="px-4 py-2 rounded-lg bg-[#1c1c28] text-gray-300 hover:bg-violet-900/40 border border-[#2a2a3a]"
                >
                  Anterior
                </Link>
              )}
              <span className="px-4 py-2 text-gray-400">
                Página {page} de {totalPages}
              </span>
              {page < totalPages && (
                <Link
                  href={`/categoria/${slug}?page=${page + 1}`}
                  className="px-4 py-2 rounded-lg bg-[#1c1c28] text-gray-300 hover:bg-violet-900/40 border border-[#2a2a3a]"
                >
                  Próxima
                </Link>
              )}
            </div>
          )}
        </>
      )}

      <AdSlot position="footer" className="mt-12" />
    </div>
  );
}
