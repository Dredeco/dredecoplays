import type { Post } from "./types";

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

/** Segmento de conteúdo: HTML, vídeo YouTube, anúncio in-article ou faixa de afiliados no meio do texto. */
export type ContentSegment =
  | { type: "html"; html: string }
  | { type: "youtube"; videoId: string; title: string }
  | { type: "ad"; position: "inline" }
  | { type: "affiliate-inline" };

function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function extractIframeTitle(iframeTag: string): string {
  const m = iframeTag.match(/\btitle\s*=\s*["']([^"']*)["']/i);
  const t = m?.[1]?.trim();
  return t && t.length > 0 ? t : "Vídeo do YouTube";
}

/** Extrai o ID do vídeo a partir de URLs /embed/VIDEO_ID do YouTube. */
export function extractYoutubeVideoIdFromSrc(src: string): string | null {
  try {
    const normalized = src.startsWith("//") ? `https:${src}` : src;
    const url = new URL(
      normalized.startsWith("http") ? normalized : `https:${normalized}`,
    );
    if (
      !/youtube\.com$/i.test(url.hostname) &&
      !/youtube-nocookie\.com$/i.test(url.hostname) &&
      !/youtu\.be$/i.test(url.hostname)
    ) {
      return null;
    }
    const pathMatch = url.pathname.match(/\/embed\/([^/?]+)/);
    if (pathMatch) return pathMatch[1];
    if (/youtu\.be$/i.test(url.hostname)) {
      const seg = url.pathname.replace(/^\//, "").split("/")[0];
      return seg || null;
    }
    return null;
  } catch {
    return null;
  }
}

function mergeAdjacentHtml(segments: ContentSegment[]): ContentSegment[] {
  const out: ContentSegment[] = [];
  for (const p of segments) {
    if (p.type === "html" && p.html === "") continue;
    const last = out[out.length - 1];
    if (last?.type === "html" && p.type === "html") {
      last.html += p.html;
    } else {
      out.push({ ...p });
    }
  }
  return out;
}

const MAX_STRUCTURAL_ANCHORS = 6;

export interface StructuralInjectOptions {
  /** Se false, só insere anúncios (ex.: post já tem produtos vinculados). */
  includeAffiliate: boolean;
}

/**
 * Insere anúncio **antes** de cada h2/h3/hr e afiliado **depois** (alternando o par),
 * até `MAX_STRUCTURAL_ANCHORS` ocorrências. Sem âncoras, o HTML não é alterado.
 * Deve rodar após {@link splitContentForYouTube}.
 */
export function injectStructuralAdsAndAffiliates(
  segments: ContentSegment[],
  options: StructuralInjectOptions,
): ContentSegment[] {
  const out: ContentSegment[] = [];
  for (const seg of segments) {
    if (seg.type !== "html") {
      out.push(seg);
      continue;
    }
    out.push(...expandHtmlStructuralInjections(seg.html, options));
  }
  return mergeAdjacentHtml(out);
}

function expandHtmlStructuralInjections(
  html: string,
  { includeAffiliate }: StructuralInjectOptions,
): ContentSegment[] {
  const anchors: { start: number; end: number }[] = [];
  const re = /<h[23][^>]*>[\s\S]*?<\/h[23]>|<hr\b[^>]*\/?>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    anchors.push({ start: m.index, end: m.index + m[0].length });
  }

  if (anchors.length === 0) {
    return [{ type: "html", html }];
  }

  const parts: ContentSegment[] = [];
  let pos = 0;
  const limit = Math.min(anchors.length, MAX_STRUCTURAL_ANCHORS);

  for (let i = 0; i < limit; i++) {
    const a = anchors[i];
    parts.push({ type: "html", html: html.slice(pos, a.start) });
    parts.push({ type: "ad", position: "inline" });
    parts.push({ type: "html", html: html.slice(a.start, a.end) });
    if (includeAffiliate) {
      parts.push({ type: "affiliate-inline" });
    }
    pos = a.end;
  }

  parts.push({ type: "html", html: html.slice(pos) });
  return mergeAdjacentHtml(parts);
}

/**
 * Divide o HTML em blocos HTML e entradas YouTube para renderização com facade (lazy).
 */
export function splitContentForYouTube(html: string): ContentSegment[] {
  const segments: ContentSegment[] = [];
  let lastIndex = 0;
  const re =
    /<iframe\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>\s*<\/iframe>/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html)) !== null) {
    const fullMatch = match[0];
    const src = match[1];
    const before = html.slice(lastIndex, match.index);
    segments.push({ type: "html", html: before });
    lastIndex = match.index + fullMatch.length;

    const videoId = extractYoutubeVideoIdFromSrc(src);
    if (videoId) {
      segments.push({
        type: "youtube",
        videoId,
        title: extractIframeTitle(fullMatch),
      });
    } else {
      segments.push({ type: "html", html: fullMatch });
    }
  }
  segments.push({ type: "html", html: html.slice(lastIndex) });
  return mergeAdjacentHtml(segments);
}

/**
 * Substitui iframes do YouTube por marcadores `data-yt-*` (útil para HTML estático).
 * Para a página de post, prefira `splitContentForYouTube` + `ContentRenderer`.
 */
/** Shortcodes `[[product:ID]]` no HTML do post — substituídos por placeholders no render */
export function extractProductShortcodeIds(html: string): number[] {
  const m = [...html.matchAll(/\[\[product:(\d+)\]\]/g)];
  return [
    ...new Set(
      m
        .map((x) => parseInt(x[1], 10))
        .filter((n) => Number.isFinite(n) && n > 0),
    ),
  ];
}

export function replaceProductShortcodesWithPlaceholders(html: string): string {
  return html.replace(
    /\[\[product:(\d+)\]\]/g,
    (_, id) =>
      `<div data-inline-product="${String(id)}" class="not-prose my-8 w-full max-w-xl mx-auto"></div>`,
  );
}

export function replaceYouTubeIframes(html: string): string {
  return splitContentForYouTube(html)
    .map((s) => {
      if (s.type === "html") return s.html;
      if (s.type === "youtube") {
        return `<div data-yt-facade data-yt-id="${escapeHtmlAttr(s.videoId)}" data-yt-title="${escapeHtmlAttr(s.title)}"></div>`;
      }
      return "";
    })
    .join("");
}

export interface InternalLinkCandidate {
  slug: string;
  title: string;
}

/**
 * Links internos automáticos: primeira ocorrência do título de outro post no texto
 * (fora de tags HTML), para distribuir autoridade e crawl.
 */
export function injectInternalLinks(
  html: string,
  candidates: InternalLinkCandidate[],
  currentSlug: string,
): string {
  const others = [...candidates]
    .filter((p) => p.slug !== currentSlug && p.title.trim().length >= 12)
    .sort((a, b) => b.title.length - a.title.length);
  const linkedSlugs = new Set<string>();
  let out = html;
  for (const p of others) {
    if (linkedSlugs.has(p.slug)) continue;
    const title = p.title.trim();
    out = replaceFirstInHtmlTextNodes(out, title, (match) => {
      linkedSlugs.add(p.slug);
      return `<a href="/blog/${p.slug}" class="text-violet-400 underline underline-offset-2 hover:text-violet-300">${match}</a>`;
    });
  }
  return out;
}

function replaceFirstInHtmlTextNodes(
  html: string,
  search: string,
  replacer: (match: string) => string,
): string {
  const parts = html.split(/(<[^>]+>)/g);
  let done = false;
  return parts
    .map((part) => {
      if (done || part.startsWith("<")) return part;
      const lower = part.toLowerCase();
      const s = search.toLowerCase();
      const idx = lower.indexOf(s);
      if (idx === -1) return part;
      done = true;
      const real = part.slice(idx, idx + search.length);
      const before = part.slice(0, idx);
      const after = part.slice(idx + search.length);
      return `${before}${replacer(real)}${after}`;
    })
    .join("");
}

export function calculateReadingTime(content: string): number {
  const stripHtml = content.replace(/<[^>]+>/g, " ");
  const wordCount = stripHtml.trim().split(/\s+/).filter(Boolean).length;
  const wordsPerMinute = 200;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

const PT_BR_MONTHS = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

/** Formata data em pt-BR sem depender de ICU do Node.js (evita hydration mismatch) */
export function formatDate(date: string): string {
  const d = new Date(date);
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = PT_BR_MONTHS[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  return `${day} de ${month} de ${year}`;
}

export const DEFAULT_COVER_IMAGE =
  "https://placehold.co/800x450/1a1a2e/6366f1?text=Blog";

/** Normaliza URL da API: http→https (evita mixed content) e trata paths relativos */
function normalizeThumbnailUrl(url: string): string {
  if (!url || url.startsWith("data:")) return url;
  const trimmed = url.trim();
  if (trimmed.startsWith("http://api.dredecoplays.com.br")) {
    return trimmed.replace("http://", "https://");
  }
  if (trimmed.startsWith("/")) {
    const base = process.env.NEXT_PUBLIC_API_URL || "https://api.dredecoplays.com.br";
    return `${base.replace(/\/$/, "")}${trimmed}`;
  }
  return trimmed;
}

export function getPostCoverUrl(post: Post): string {
  const url = post.thumbnail || DEFAULT_COVER_IMAGE;
  return url === DEFAULT_COVER_IMAGE ? url : normalizeThumbnailUrl(url);
}

export function getPostCategoryName(post: Post): string {
  return post.category?.name ?? "Sem categoria";
}

export function getPostCategorySlug(post: Post): string {
  return post.category?.slug ?? slugify(getPostCategoryName(post));
}
