import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPostBySlug,
  getPostSeo,
  getRelatedPosts,
  getPosts,
  getProductById,
} from "@/lib/api";
import type { Product } from "@/lib/types";
import {
  formatDate,
  getPostCoverUrl,
  getPostCategoryName,
  getPostCategorySlug,
  extractHeadingsFromHtml,
  injectHeadingIds,
  splitContentForYouTube,
  injectParagraphAds,
  injectInternalLinks,
  extractProductShortcodeIds,
  replaceProductShortcodesWithPlaceholders,
  calculateReadingTime,
} from "@/lib/posts";
import { parseFaqJson, parseVideoJson, parseHowToJson } from "@/lib/seo-json";
import Breadcrumbs from "@/components/Breadcrumbs";
import TableOfContents from "@/components/TableOfContents";
import RelatedPosts from "@/components/RelatedPosts";
import ShareButtons from "@/components/ShareButtons";
import AdSlot from "@/components/AdSlot";
import CategoryBadge from "@/components/CategoryBadge";
import ProductsGridAd from "@/components/ProductsGridAd";
import ArticleJsonLd from "@/components/seo/ArticleJsonLd";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import FAQJsonLd from "@/components/seo/FAQJsonLd";
import VideoJsonLd from "@/components/seo/VideoJsonLd";
import HowToJsonLd from "@/components/seo/HowToJsonLd";
import AuthorBio from "@/components/AuthorBio";
import ContentRenderer from "@/components/ContentRenderer";
import NewsletterBanner from "@/components/NewsletterBanner";
import PostLinkedProducts from "@/components/PostLinkedProducts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://dredecoplays.com.br";

export const revalidate = 60;

export async function generateStaticParams() {
  const res = await getPosts({ limit: 200, status: "published" });
  return res.data.map((post) => ({ slug: post.slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const seo = await getPostSeo(slug);

  if (!seo) {
    notFound();
  }

  return {
    title: seo.title,
    description: seo.description,
    authors: [{ name: seo.author.name }],
    alternates: {
      canonical: seo.canonicalUrl,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: seo.url,
      siteName: "Dredeco Plays",
      locale: "pt_BR",
      type: "article",
      publishedTime: seo.publishedAt,
      modifiedTime: seo.updatedAt,
      authors: [seo.author.name],
      section: seo.category.name,
      images: [
        {
          url: seo.image.url,
          width: seo.image.width,
          height: seo.image.height,
          alt: seo.image.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [seo.image.url],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const [post, seo, postsList] = await Promise.all([
    getPostBySlug(slug),
    getPostSeo(slug),
    getPosts({ limit: 250, status: "published" }),
  ]);

  if (!post || !seo) notFound();

  const linkedHtml = injectInternalLinks(
    injectHeadingIds(post.content),
    postsList.data.map((p) => ({ slug: p.slug, title: p.title })),
    slug,
  );

  const shortcodeIds = extractProductShortcodeIds(linkedHtml);
  const inlineProducts: Partial<Record<number, Product>> = {};
  await Promise.all(
    shortcodeIds.map(async (id) => {
      const p = await getProductById(id);
      if (p) inlineProducts[id] = p;
    }),
  );

  const htmlWithShortcodes = replaceProductShortcodesWithPlaceholders(linkedHtml);
  const contentSegments = injectParagraphAds(
    splitContentForYouTube(htmlWithShortcodes),
    4,
  );

  const headings = extractHeadingsFromHtml(linkedHtml);
  const relatedPosts = await getRelatedPosts(
    slug,
    getPostCategorySlug(post),
    3,
  );
  const readingTime = calculateReadingTime(post.content);
  const coverUrl = getPostCoverUrl(post);
  const categoryName = getPostCategoryName(post);

  const faqItems = parseFaqJson(post.faq_json);
  const videoSchema = parseVideoJson(post.video_json);
  const howToSchema = parseHowToJson(post.howto_json);

  const linkedProductsList =
    post.linkedProducts ??
    (post as { linked_products?: Product[] }).linked_products ??
    [];
  const hasLinkedProducts = linkedProductsList.length > 0;

  return (
    <>
      <ArticleJsonLd seo={seo} />
      {faqItems?.length ? <FAQJsonLd items={faqItems} /> : null}
      {videoSchema ? (
        <VideoJsonLd
          name={videoSchema.name}
          description={videoSchema.description}
          thumbnailUrl={videoSchema.thumbnailUrl}
          contentUrl={videoSchema.contentUrl}
          uploadDate={videoSchema.uploadDate}
          duration={videoSchema.duration}
        />
      ) : null}
      {howToSchema ? (
        <HowToJsonLd
          name={howToSchema.name}
          description={howToSchema.description}
          steps={howToSchema.steps}
        />
      ) : null}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: SITE_URL },
          {
            name: seo.category.name,
            item: `${SITE_URL}/categoria/${seo.category.slug}`,
          },
          { name: seo.title, item: seo.url },
        ]}
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
            <div className="relative aspect-[1200/630] rounded-xl overflow-hidden mb-8">
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
                  <Link
                    key={tag.id}
                    href={`/tag/${tag.slug}`}
                    className="text-xs text-muted bg-surface-2 px-2.5 py-1 rounded border border-border hover:border-violet-500 hover:text-violet-400 transition-colors"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground leading-tight mb-4">
                {post.title}
              </h1>

              <p className="text-muted text-lg leading-relaxed mb-6">
                {post.excerpt}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted pb-6 border-b border-border">
                <span>✍️ {post.author?.name ?? "Dredeco Plays"}</span>
                <span>·</span>
                <time dateTime={post.createdAt}>
                  📅 {formatDate(post.createdAt)}
                </time>
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

            <ContentRenderer
              segments={contentSegments}
              inlineProducts={inlineProducts}
              postId={post.id}
            />

            <PostLinkedProducts
              products={linkedProductsList}
              postId={post.id}
            />

            {post.author && (
              <AuthorBio
                author={{
                  name: post.author.name,
                  avatar: post.author.avatar,
                  bio: post.author.bio,
                }}
              />
            )}

            <ShareButtons
              title={post.title}
              url={`${SITE_URL}/blog/${post.slug}`}
            />

            {!hasLinkedProducts && (
              <ProductsGridAd className="my-12" postId={post.id} />
            )}

            <RelatedPosts posts={relatedPosts} />

            <NewsletterBanner />

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
