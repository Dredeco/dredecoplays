import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPosts, getTags } from "@core/api-client";
import PostCard from "@features/posts/PostCard";
import Breadcrumbs from "@features/site/Breadcrumbs";
import AdSlot from "@features/site/AdSlot";
import BreadcrumbJsonLd from "@features/seo/BreadcrumbJsonLd";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://dredecoplays.com.br";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateStaticParams() {
  const tags = await getTags();
  return tags.map((tag) => ({ slug: tag.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tags = await getTags();
  const tag = tags.find((t) => t.slug === slug);

  if (!tag) return { title: "Tag não encontrada" };

  const title = `#${tag.name} — Artigos sobre ${tag.name}`;
  const description = `Todos os artigos sobre ${tag.name} no Dredeco Plays — reviews, guias e notícias.`;
  const canonical = `${SITE_URL}/tag/${slug}`;

  return {
    title,
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

export default async function TagPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam || "1", 10));

  const [tags, postsRes] = await Promise.all([
    getTags(),
    getPosts({ tag: slug, page, limit: 12, status: "published" }).catch(
      () => null
    ),
  ]);

  const tag = tags.find((t) => t.slug === slug);
  if (!tag) notFound();

  const posts = postsRes?.data ?? [];
  const total = postsRes?.meta?.total ?? posts.length;
  const totalPages = postsRes?.meta?.totalPages ?? 1;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: SITE_URL },
          { name: `#${tag.name}`, item: `${SITE_URL}/tag/${slug}` },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Tags" },
            { label: `#${tag.name}` },
          ]}
        />

        <AdSlot position="top" className="mb-8" />

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-surface-2 border border-border rounded-full px-4 py-1.5 mb-4">
            <span className="text-violet-400 font-bold text-sm">#</span>
            <span className="text-foreground font-bold text-sm">{tag.name}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-2">
            Artigos sobre{" "}
            <span className="text-violet-400">{tag.name}</span>
          </h1>
          <p className="text-muted">
            {total} {total === 1 ? "artigo encontrado" : "artigos encontrados"}
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 text-muted">
            <p className="text-4xl mb-4">🎮</p>
            <p className="text-lg">Nenhum post com esta tag ainda.</p>
            <Link
              href="/blog"
              className="mt-4 inline-block text-violet-400 hover:underline text-sm"
            >
              Ver todos os artigos →
            </Link>
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
                    href={`/tag/${slug}?page=${page - 1}`}
                    className="px-4 py-2 rounded-lg bg-surface-2 text-foreground hover:bg-violet-900/40 border border-border"
                  >
                    Anterior
                  </Link>
                )}
                <span className="px-4 py-2 text-muted">
                  Página {page} de {totalPages}
                </span>
                {page < totalPages && (
                  <Link
                    href={`/tag/${slug}?page=${page + 1}`}
                    className="px-4 py-2 rounded-lg bg-surface-2 text-foreground hover:bg-violet-900/40 border border-border"
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
    </>
  );
}
