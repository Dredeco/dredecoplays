const HASHTAGS_MAIN = "#DredecoPlays #games #gaming";
const HASHTAGS_EXTRA = "#videogames #jogos";

export type InstagramShareKind = "feed" | "stories" | "reels";
export type TikTokShareKind = "feed" | "story" | "clip";

function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function excerptSnippet(excerpt: string | undefined, maxLen: number): string {
  if (!excerpt?.trim()) return "";
  const plain = stripHtml(excerpt);
  if (plain.length <= maxLen) return plain;
  return `${plain.slice(0, maxLen).trim()}…`;
}

function hookFromTitle(title: string): string {
  const t = title.trim();
  if (t.length <= 72) return t;
  return `${t.slice(0, 72).trim()}…`;
}

/**
 * Instagram não expõe URL pública tipo twitter.com/intent para postar.
 * Estas legendas são otimizadas para colar no app (feed, sticker de Stories ou descrição de Reels).
 */
export function buildInstagramCaption(
  kind: InstagramShareKind,
  title: string,
  url: string,
  excerpt?: string,
): string {
  const site = "dredecoplays.com.br";
  const shortExcerpt = excerptSnippet(excerpt, 220);

  switch (kind) {
    case "feed":
      return [
        `📰 ${title}`,
        "",
        shortExcerpt ? `${shortExcerpt}\n` : "",
        `${HASHTAGS_MAIN} ${HASHTAGS_EXTRA}`,
        "",
        `🔗 Leia na íntegra:`,
        url,
        "",
        `📲 ${site}`,
      ]
        .filter(Boolean)
        .join("\n");

    case "stories":
      return [
        `✨ Novo artigo`,
        "",
        title.length > 90 ? `${title.slice(0, 88)}…` : title,
        "",
        `🔗 ${url}`,
        "",
        `Toque e segue @dredecoplays 💜`,
      ].join("\n");

    case "reels":
      return [
        `🔥 ${hookFromTitle(title)}`,
        "",
        `▶️ ${title}`,
        "",
        `${HASHTAGS_MAIN}`,
        "",
        `🔗 Link na bio`,
        url,
      ].join("\n");

    default:
      return `${title}\n${url}`;
  }
}

/**
 * TikTok também não oferece intent web universal; upload em tiktok.com/upload.
 * Formatos: feed (legenda longa), story (curta), clip (gancho estilo Reels).
 */
export function buildTikTokCaption(
  kind: TikTokShareKind,
  title: string,
  url: string,
  excerpt?: string,
): string {
  const shortExcerpt = excerptSnippet(excerpt, 180);

  switch (kind) {
    case "feed":
      return [
        `🎮 ${title}`,
        "",
        shortExcerpt ? `${shortExcerpt}\n` : "",
        `${HASHTAGS_MAIN} #fyp #foryou`,
        "",
        url,
      ]
        .filter(Boolean)
        .join("\n");

    case "story":
      return [`📰 ${title}`, "", url].join("\n");

    case "clip":
      return [
        `POV: você ama games e ainda não leu isso 👇`,
        "",
        title,
        "",
        `${HASHTAGS_MAIN}`,
        "",
        `🔗 ${url}`,
      ].join("\n");

    default:
      return `${title}\n${url}`;
  }
}

export const SHARE_LINKS = {
  instagramProfile: "https://www.instagram.com/dredecoplays/",
  tiktokUpload: "https://www.tiktok.com/upload",
} as const;
