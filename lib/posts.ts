import type { Post, PostCategory } from "./types";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[/\\]/g, "-")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export interface Heading {
  id: string;
  text: string;
  level: number;
}

export function extractHeadingsFromHtml(html: string): Heading[] {
  const headingRegex = /<h([2-3])[^>]*>([^<]+)<\/h[2-3]>/gi;
  const headings: Heading[] = [];
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(html)) !== null) {
    const level = parseInt(match[1], 10);
    const text = match[2].trim().replace(/<[^>]+>/g, "");
    const id = slugify(text);
    headings.push({ id, text, level });
  }

  return headings;
}

/** Adiciona IDs aos headings no HTML para permitir âncoras do ToC */
export function injectHeadingIds(html: string): string {
  return html.replace(
    /<h([2-3])([^>]*)>([^<]+)<\/h[2-3]>/gi,
    (_, level, attrs, text) => {
      const id = slugify(text.trim().replace(/<[^>]+>/g, ""));
      const hasId = /id\s*=/i.test(attrs);
      if (hasId) return `<h${level}${attrs}>${text}</h${level}>`;
      return `<h${level}${attrs} id="${id}">${text}</h${level}>`;
    }
  );
}

export function calculateReadingTime(content: string): number {
  const stripHtml = content.replace(/<[^>]+>/g, " ");
  const wordCount = stripHtml.trim().split(/\s+/).filter(Boolean).length;
  const wordsPerMinute = 200;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export const DEFAULT_COVER_IMAGE =
  "https://placehold.co/800x450/1a1a2e/6366f1?text=Blog";

export function getPostCoverUrl(post: Post): string {
  return post.thumbnail || DEFAULT_COVER_IMAGE;
}

export function getPostCategoryName(post: Post): string {
  return post.category?.name ?? "Sem categoria";
}

export function getPostCategorySlug(post: Post): string {
  return post.category?.slug ?? slugify(getPostCategoryName(post));
}
