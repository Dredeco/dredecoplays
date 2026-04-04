import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategories, getCategoryPosts } from "@core/api-client";
import PostCard from "@features/posts/PostCard";
import Breadcrumbs from "@features/site/Breadcrumbs";
import AdSlot from "@features/site/AdSlot";
import BreadcrumbJsonLd from "@features/seo/BreadcrumbJsonLd";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://dredecoplays.com.br";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);

  if (!category) return { title: "Categoria não encontrada" };

  const title = `${category.name} | Dredeco Plays`;
  const description = `Os melhores artigos sobre ${category.name} no Dredeco Plays.`;
  const canonical = `${SITE_URL}/categoria/${slug}`;

  return {
    title: `${category.name} — Todos os artigos`,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Dredeco Plays",
      locale: "pt_BR",
      type: "website",
      images: [
        {
          url: `${SITE_URL}/og-default.png`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/og-default.png`],
    },
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
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: SITE_URL },
          { name: category.name, item: `${SITE_URL}/categoria/${slug}` },
        ]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Categorias", href: "/blog" },
          { label: category.name },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-2">
          {category.name}
        </h1>
        <p className="text-muted">
          {total} {total === 1 ? "artigo" : "artigos"} encontrados
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 text-muted">
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

          {totalPages > 1 ? (
            <div className="pagination">
              {page > 1 ? (
                <Link
                  href={`/categoria/${slug}?page=${page - 1}`}
                  className="pagination__btn"
                >
                  Anterior
                </Link>
              ) : null}
              <span className="pagination__info">
                Página {page} de {totalPages}
              </span>
              {page < totalPages ? (
                <Link
                  href={`/categoria/${slug}?page=${page + 1}`}
                  className="pagination__btn"
                >
                  Próxima
                </Link>
              ) : null}
            </div>
          ) : null}
        </>
      )}

      <AdSlot position="footer" className="mt-12" />
      </div>
    </>
  );
}
