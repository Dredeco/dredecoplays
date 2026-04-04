import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getHubBySlug } from "@core/api-client";
import { formatDate, getPostCoverUrl } from "@features/posts/post-content";
import PostThumbnail from "@features/posts/PostThumbnail";
import CategoryBadge from "@features/site/CategoryBadge";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://dredecoplays.com.br";

export const revalidate = 300;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const hub = await getHubBySlug(slug);
  if (!hub) return { title: "Não encontrado" };
  const desc =
    hub.meta_description ||
    hub.description?.slice(0, 160) ||
    `${hub.title} — Dredeco Plays`;
  return {
    title: hub.title,
    description: desc,
    alternates: { canonical: `${SITE_URL}/melhores/${hub.slug}` },
    openGraph: {
      title: hub.title,
      description: desc,
      url: `${SITE_URL}/melhores/${hub.slug}`,
      locale: "pt_BR",
      type: "website",
    },
  };
}

export default async function MelhoresHubPage({ params }: Props) {
  const { slug } = await params;
  const hub = await getHubBySlug(slug);
  if (!hub) notFound();

  const posts = hub.posts ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <header className="mb-12 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-widest text-violet-400">
          Guias e rankings
        </p>
        <h1 className="mt-2 text-3xl font-black text-foreground sm:text-4xl">
          {hub.title}
        </h1>
        {hub.description ? (
          <p className="mt-4 text-lg text-muted leading-relaxed">{hub.description}</p>
        ) : null}
      </header>

      {posts.length === 0 ? (
        <p className="text-muted">
          Em breve: artigos serão vinculados a este hub no painel.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <li key={post.id}>
              <Link
                href={`/blog/${post.slug}`}
                className="group block overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-violet-500/50"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <PostThumbnail
                    src={getPostCoverUrl(post)}
                    alt={post.title}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                </div>
                <div className="p-5">
                  {post.category ? (
                    <CategoryBadge
                      category={{
                        name: post.category.name,
                        slug: post.category.slug,
                        color: post.category.color,
                      }}
                    />
                  ) : null}
                  <h2 className="mt-2 text-lg font-bold leading-snug text-foreground group-hover:text-violet-300">
                    {post.title}
                  </h2>
                  <time
                    className="mt-2 block text-xs text-muted"
                    dateTime={post.createdAt}
                  >
                    {formatDate(post.createdAt)}
                  </time>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-12 text-center">
        <Link
          href="/blog"
          className="text-sm font-semibold text-violet-400 hover:text-violet-300"
        >
          Ver todo o blog →
        </Link>
      </p>
    </div>
  );
}
