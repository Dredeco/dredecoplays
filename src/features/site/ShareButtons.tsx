"use client";

import { useEffect, useId, useRef, useState } from "react";
import { toast } from "sonner";
import {
  buildInstagramCaption,
  buildTikTokCaption,
  SHARE_LINKS,
  type InstagramShareKind,
  type TikTokShareKind,
} from "./share-captions";

type Props = {
  title: string;
  url: string;
  excerpt?: string;
};

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ShareButtons({ title, url, excerpt }: Props) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState<"ig" | "tt" | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const igBtnId = useId();
  const ttBtnId = useId();

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(null);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyInstagram = async (kind: InstagramShareKind) => {
    const text = buildInstagramCaption(kind, title, url, excerpt);
    await navigator.clipboard.writeText(text);
    setOpen(null);
    toast.success("Legenda do Instagram copiada", {
      description:
        "Abra o app ou o Instagram no navegador e cole na publicação, nos Stories ou na descrição do Reels.",
      action: {
        label: "Perfil no Instagram",
        onClick: () =>
          window.open(
            SHARE_LINKS.instagramProfile,
            "_blank",
            "noopener,noreferrer",
          ),
      },
      duration: 6500,
    });
  };

  const copyTikTok = async (kind: TikTokShareKind) => {
    const text = buildTikTokCaption(kind, title, url, excerpt);
    await navigator.clipboard.writeText(text);
    setOpen(null);
    toast.success("Legenda do TikTok copiada", {
      description:
        "No TikTok, a publicação é sempre em vídeo ou foto pelo app. Cole a legenda no campo de descrição.",
      action: {
        label: "Abrir upload",
        onClick: () =>
          window.open(SHARE_LINKS.tiktokUpload, "_blank", "noopener,noreferrer"),
      },
      duration: 6500,
    });
  };

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`;

  const menuItem =
    "flex w-full flex-col gap-0.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-surface-2 focus:bg-surface-2 focus:outline-none focus:ring-2 focus:ring-violet-500/40";

  return (
    <div ref={wrapRef} className="relative mt-10 border-t border-border pt-6">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <span className="text-sm font-medium text-muted">Compartilhar:</span>

        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full bg-zinc-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
        >
          <span aria-hidden>𝕏</span> Twitter
        </a>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full bg-green-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600"
        >
          <span aria-hidden>💬</span> WhatsApp
        </a>

        <div className="relative inline-block">
          <button
            type="button"
            id={igBtnId}
            aria-haspopup="menu"
            aria-expanded={open === "ig"}
            aria-controls={`${igBtnId}-menu`}
            onClick={() => setOpen((v) => (v === "ig" ? null : "ig"))}
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-95"
          >
            <span aria-hidden>📷</span>
            Instagram
            <ChevronDown
              className={`opacity-90 transition-transform ${open === "ig" ? "rotate-180" : ""}`}
            />
          </button>
          {open === "ig" ? (
            <div
              id={`${igBtnId}-menu`}
              role="menu"
              aria-labelledby={igBtnId}
              className="absolute left-0 top-full z-50 mt-2 w-[min(100vw-2rem,20rem)] rounded-xl border border-border bg-bg p-1.5 shadow-xl"
            >
              <p className="border-b border-border px-3 py-2 text-xs text-muted">
                O Instagram não permite abrir o editor já preenchido pelo site. Escolha o
                formato e cole a legenda no app.
              </p>
              <button
                type="button"
                role="menuitem"
                className={menuItem}
                onClick={() => void copyInstagram("feed")}
              >
                <span className="font-medium text-foreground">Post no feed</span>
                <span className="text-xs text-muted">Título, hashtags e link do artigo</span>
              </button>
              <button
                type="button"
                role="menuitem"
                className={menuItem}
                onClick={() => void copyInstagram("stories")}
              >
                <span className="font-medium text-foreground">Stories</span>
                <span className="text-xs text-muted">Texto curto para sticker / tela</span>
              </button>
              <button
                type="button"
                role="menuitem"
                className={menuItem}
                onClick={() => void copyInstagram("reels")}
              >
                <span className="font-medium text-foreground">Reels</span>
                <span className="text-xs text-muted">Gancho + legenda estilo vertical</span>
              </button>
            </div>
          ) : null}
        </div>

        <div className="relative inline-block">
          <button
            type="button"
            id={ttBtnId}
            aria-haspopup="menu"
            aria-expanded={open === "tt"}
            aria-controls={`${ttBtnId}-menu`}
            onClick={() => setOpen((v) => (v === "tt" ? null : "tt"))}
            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-600 bg-[#010101] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:border-zinc-500"
          >
            <span className="select-none font-black leading-none" aria-hidden>
              <span className="text-[#25F4EE]">T</span>
              <span className="text-[#FE2C55]">T</span>
            </span>
            TikTok
            <ChevronDown
              className={`opacity-90 transition-transform ${open === "tt" ? "rotate-180" : ""}`}
            />
          </button>
          {open === "tt" ? (
            <div
              id={`${ttBtnId}-menu`}
              role="menu"
              aria-labelledby={ttBtnId}
              className="absolute left-0 top-full z-50 mt-2 w-[min(100vw-2rem,20rem)] rounded-xl border border-border bg-bg p-1.5 shadow-xl"
            >
              <p className="border-b border-border px-3 py-2 text-xs text-muted">
                O TikTok não oferece link de compartilhamento com legenda como o Twitter. Copie
                o texto e use na descrição do vídeo ou da foto.
              </p>
              <button
                type="button"
                role="menuitem"
                className={menuItem}
                onClick={() => void copyTikTok("feed")}
              >
                <span className="font-medium text-foreground">Vídeo no feed</span>
                <span className="text-xs text-muted">Legenda completa, hashtags e link</span>
              </button>
              <button
                type="button"
                role="menuitem"
                className={menuItem}
                onClick={() => void copyTikTok("story")}
              >
                <span className="font-medium text-foreground">Story</span>
                <span className="text-xs text-muted">Linhas curtas para story (24h)</span>
              </button>
              <button
                type="button"
                role="menuitem"
                className={menuItem}
                onClick={() => void copyTikTok("clip")}
              >
                <span className="font-medium text-foreground">Clip vertical</span>
                <span className="text-xs text-muted">Gancho estilo Reels + CTA</span>
              </button>
            </div>
          ) : null}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-2 rounded-full border border-border bg-surface-2 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-border"
        >
          {copied ? "✓ Copiado!" : "🔗 Copiar link"}
        </button>
      </div>
    </div>
  );
}
