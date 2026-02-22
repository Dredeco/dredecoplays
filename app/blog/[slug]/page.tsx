import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import {
  getPostBySlug,
  getRelatedPosts,
} from "@/lib/api";
import {
  formatDate,
  getPostCoverUrl,
  getPostCategoryName,
  getPostCategorySlug,
  extractHeadingsFromHtml,
  injectHeadingIds,
  calculateReadingTime,
} from "@/lib/posts";
import Breadcrumbs from "@/components/Breadcrumbs";
import TableOfContents from "@/components/TableOfContents";
import RelatedPosts from "@/components/RelatedPosts";
import ShareButtons from "@/components/ShareButtons";
import AdSlot from "@/components/AdSlot";
import CategoryBadge from "@/components/CategoryBadge";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://dredecoplays.com";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return { title: "Post não encontrado" };

  const coverUrl = getPostCoverUrl(post);
  const imageUrl = coverUrl.startsWith("http") ? coverUrl : `${SITE_URL}${coverUrl}`;

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags?.map((t) => t.name) ?? [],
    authors: post.author ? [{ name: post.author.name }] : undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${SITE_URL}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      authors: post.author ? [post.author.name] : undefined,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [imageUrl],
    },
    alternates: {
      canonical: `${SITE_URL}/blog/${post.slug}`,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const headings = extractHeadingsFromHtml(post.content);
  const relatedPosts = await getRelatedPosts(
    slug,
    getPostCategorySlug(post),
    3
  );
  const readingTime = calculateReadingTime(post.content);
  const coverUrl = getPostCoverUrl(post);
  const categoryName = getPostCategoryName(post);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: coverUrl.startsWith("http") ? coverUrl : `${SITE_URL}${coverUrl}`,
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    author: post.author
      ? { "@type": "Person", name: post.author.name }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: "Dredeco Plays",
      url: SITE_URL,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${slug}` },
    keywords: post.tags?.map((t) => t.name).join(", ") ?? "",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            {
              label: categoryName,
              href: `/categoria/${getPostCategorySlug(post)}`,
            },
            { label: post.title },
          ]}
        />

        <div className="flex gap-10">
          <article className="flex-1 min-w-0">
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-8">
              <Image
                src={coverUrl}
                alt={post.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 70vw"
              />
            </div>

            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <CategoryBadge
                  category={
                    post.category
                      ? {
                          name: categoryName,
                          slug: post.category.slug,
                          color: post.category.color,
                        }
                      : categoryName
                  }
                  size="md"
                />
                {post.tags?.slice(0, 3).map((tag) => (
                  <span
                    key={tag.id}
                    className="text-xs text-gray-400 bg-[#1c1c28] px-2.5 py-1 rounded border border-[#2a2a3a]"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-4">
                {post.title}
              </h1>

              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                {post.excerpt}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pb-6 border-b border-[#2a2a3a]">
                <span>✍️ {post.author?.name ?? "Dredeco Plays"}</span>
                <span>·</span>
                <time dateTime={post.createdAt}>
                  📅 {formatDate(post.createdAt)}
                </time>
                {post.updatedAt !== post.createdAt && (
                  <>
                    <span>·</span>
                    <span>🔄 Atualizado em {formatDate(post.updatedAt)}</span>
                  </>
                )}
                <span>·</span>
                <span>⏱️ {readingTime} min de leitura</span>
                {post.views > 0 && (
                  <>
                    <span>·</span>
                    <span>👁️ {post.views} visualizações</span>
                  </>
                )}
              </div>
            </header>

            <div
              className="prose prose-invert prose-lg max-w-none [&_img]:rounded-lg [&_a]:text-violet-400 [&_a]:hover:text-violet-300"
              dangerouslySetInnerHTML={{ __html: injectHeadingIds(post.content) }}
            />

            <AdSlot position="mid-article" className="my-12" />

            <ShareButtons
              title={post.title}
              url={`${SITE_URL}/blog/${post.slug}`}
            />

            <RelatedPosts posts={relatedPosts} />

            <AdSlot position="footer" className="mt-12" />
          </article>

          {headings.length > 0 && (
            <aside className="hidden xl:block w-64 shrink-0">
              <TableOfContents headings={headings} />
            </aside>
          )}
        </div>
      </div>
    </>
  );
}
