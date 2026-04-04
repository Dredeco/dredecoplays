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
  getPublicProducts,
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
  injectStructuralAdsAndAffiliates,
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
import { shuffle } from "@/lib/utils";
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
  const [post, seo, postsList, catalogProducts] = await Promise.all([
    getPostBySlug(slug),
    getPostSeo(slug),
    getPosts({ limit: 250, status: "published" }),
    getPublicProducts(),
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

  const linkedProductsList =
    post.linkedProducts ??
    (post as { linked_products?: Product[] }).linked_products ??
    [];
  const hasLinkedProducts = linkedProductsList.length > 0;

  const afterYoutube = splitContentForYouTube(htmlWithShortcodes);
  const contentSegments = injectStructuralAdsAndAffiliates(afterYoutube, {
    includeAffiliate: !hasLinkedProducts,
  });

  const affiliateProductsInline = !hasLinkedProducts
    ? shuffle(catalogProducts).slice(0, 3)
    : [];

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

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
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

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-8 xl:gap-10">
          <article className="min-w-0 flex-1">
            <div className="relative mb-6 aspect-video overflow-hidden rounded-xl">
              <Image
                src={coverUrl}
                alt={post.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 70vw"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"
                aria-hidden
              />
              <div className="absolute bottom-4 left-4 right-4 z-[1]">
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
                  asLink={false}
                />
              </div>
            </div>

            <header className="mb-4 md:mb-6">
              <div className="mb-4 flex flex-wrap items-center gap-3">
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

              <h1 className="mb-3 text-2xl font-extrabold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-foreground line-clamp-4 sm:mb-4 sm:text-3xl md:text-3xl lg:text-4xl xl:text-[2.125rem]">
                {post.title}
              </h1>

              <p className="mb-4 text-base leading-relaxed text-[var(--color-text-secondary)] sm:mb-5 sm:text-[length:var(--text-lg)]">
                {post.excerpt}
              </p>

              <div className="flex flex-wrap items-center gap-4 border-b border-border pb-4 text-sm text-[var(--color-text-muted)]">
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
              affiliateProducts={affiliateProductsInline}
              postId={post.id}
              className="article-body prose prose-invert prose-lg max-w-none !mt-0 [&_.prose]:!mt-0 [&_*]:!my-0 [&_hr]:!my-6 [&_p:empty]:!my-4 [&_p:first-child]:!mt-0"
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

            <RelatedPosts posts={relatedPosts} />

            <NewsletterBanner />

            <AdSlot position="footer" className="mt-12" />
          </article>

          <aside className="hidden w-full shrink-0 flex-col gap-5 lg:sticky lg:top-24 lg:z-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:self-start lg:flex lg:w-64 xl:w-72">
            {headings.length > 0 ? <TableOfContents headings={headings} /> : null}
          </aside>
        </div>
      </div>
    </>
  );
}
