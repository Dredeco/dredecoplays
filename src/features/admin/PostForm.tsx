"use client";

import { useState, useEffect } from "react";
import type { Post, Category, Tag, CreatePostDto } from "@core/types";
import { slugify } from "@features/posts/post-content";
import { uploadImage, publishPostOnInstagram } from "@core/api-client";
import RichTextEditor from "./RichTextEditor";
import Image from "next/image";

function isDataUri(url: string): boolean {
  return typeof url === "string" && url.startsWith("data:");
}

interface Props {
  post?: Post | null;
  categories: Category[];
  tags: Tag[];
  token: string;
  currentUser: { id: number; role?: "admin" | "editor" } | null;
  onSubmit: (dto: CreatePostDto) => Promise<void>;
  /** Após publicar no Instagram, recarregar o post (ex.: slug na página de edição). */
  onPostRefresh?: () => Promise<void>;
}

export default function PostForm({
  post,
  categories,
  tags,
  token,
  currentUser,
  onSubmit,
  onPostRefresh,
}: Props) {
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [categoryId, setCategoryId] = useState(
    post?.category_id ?? categories[0]?.id ?? 0,
  );
  const [status, setStatus] = useState<"draft" | "published">(
    post?.status ?? "draft",
  );
  const [featured, setFeatured] = useState(post?.featured ?? false);
  const [tagIds, setTagIds] = useState<number[]>(
    post?.tags?.map((t) => t.id) ?? [],
  );
  const [thumbnail, setThumbnail] = useState(post?.thumbnail ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [igPublishing, setIgPublishing] = useState(false);

  useEffect(() => {
    if (!post && title) {
      setSlug(slugify(title));
    }
  }, [title, post]);

  function toggleTag(id: number) {
    setTagIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadImage(file, token);
      setThumbnail(url);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro no upload");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUser) {
      alert("Você precisa estar logado para criar ou editar posts.");
      return;
    }
    setSaving(true);
    try {
      await onSubmit({
        title,
        slug,
        excerpt,
        content,
        user_id: currentUser.id,
        category_id: categoryId,
        status,
        featured,
        thumbnail: thumbnail || undefined,
        tags: tagIds,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Título
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-lg bg-surface border border-border text-foreground focus:outline-none focus:border-violet-600"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Slug (URL)
        </label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-lg bg-surface border border-border text-foreground focus:outline-none focus:border-violet-600"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Resumo (excerpt)
        </label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 rounded-lg bg-surface border border-border text-foreground focus:outline-none focus:border-violet-600"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Conteúdo
        </label>
        <RichTextEditor value={content} onChange={setContent} token={token} />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Categoria
        </label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(Number(e.target.value))}
          className="w-full px-4 py-2 rounded-lg bg-surface border border-border text-foreground focus:outline-none focus:border-violet-600"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggleTag(tag.id)}
              className={`px-3 py-1 rounded-full text-sm ${
                tagIds.includes(tag.id)
                  ? "bg-violet-600 text-white"
                  : "bg-surface-2 text-muted border border-border hover:border-violet-600"
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Thumbnail
        </label>
        <div className="flex gap-4 items-start">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="text-sm text-muted"
          />
          {uploading && (
            <span className="text-amber-400 text-sm">Enviando...</span>
          )}
        </div>
        {thumbnail && (
          <div className="mt-2">
            {isDataUri(thumbnail) ? (
              <img
                src={thumbnail}
                alt="Thumbnail"
                className="w-40 h-24 object-cover rounded-lg"
              />
            ) : (
              <Image
                src={thumbnail}
                alt="Thumbnail"
                className="w-40 h-24 object-cover rounded-lg"
                width={160}
                height={96}
              />
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="rounded bg-surface border-border text-violet-600 focus:ring-violet-600"
          />
          <span className="text-foreground">Em destaque</span>
        </label>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "draft" | "published")}
            className="px-4 py-2 rounded-lg bg-surface border border-border text-foreground"
          >
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
          </select>
        </div>
      </div>

      {post && currentUser?.role === "admin" && post.status === "published" && (
        <div className="rounded-lg border border-border bg-surface-2 p-4 space-y-3">
          <p className="text-sm font-medium text-foreground">Instagram</p>
          {post.instagram_media_id ? (
            <p className="text-sm text-muted">
              Publicado no Instagram
              {post.instagram_published_at
                ? ` em ${new Date(post.instagram_published_at).toLocaleString("pt-BR")}`
                : ""}
              .
            </p>
          ) : (
            <>
              {post.instagram_last_error ? (
                <p className="text-sm text-red-400 break-words">{post.instagram_last_error}</p>
              ) : null}
              <button
                type="button"
                disabled={igPublishing}
                onClick={async () => {
                  if (!post?.id) return;
                  setIgPublishing(true);
                  try {
                    await publishPostOnInstagram(post.id, token);
                    await onPostRefresh?.();
                  } catch (err) {
                    alert(err instanceof Error ? err.message : "Erro ao publicar no Instagram");
                  } finally {
                    setIgPublishing(false);
                  }
                }}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white text-sm font-medium disabled:opacity-50"
              >
                {igPublishing ? "Enviando…" : "Publicar no Instagram"}
              </button>
              <p className="text-xs text-muted">
                Envia uma vez por artigo (feed com thumbnail ou Reels se houver vídeo em video_json).
              </p>
            </>
          )}
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium disabled:opacity-50"
        >
          {saving ? "Salvando..." : post ? "Atualizar" : "Criar post"}
        </button>
      </div>
    </form>
  );
}
