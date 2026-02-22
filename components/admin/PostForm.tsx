"use client";

import { useState, useEffect } from "react";
import type { Post, Category, Tag, CreatePostDto } from "@/lib/types";
import { slugify } from "@/lib/posts";
import { uploadImage } from "@/lib/api";

interface Props {
  post?: Post | null;
  categories: Category[];
  tags: Tag[];
  token: string;
  onSubmit: (dto: CreatePostDto) => Promise<void>;
}

export default function PostForm({
  post,
  categories,
  tags,
  token,
  onSubmit,
}: Props) {
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [categoryId, setCategoryId] = useState(post?.category_id ?? categories[0]?.id ?? 0);
  const [status, setStatus] = useState<"draft" | "published">(post?.status ?? "draft");
  const [featured, setFeatured] = useState(post?.featured ?? false);
  const [tagIds, setTagIds] = useState<number[]>(post?.tags?.map((t) => t.id) ?? []);
  const [thumbnail, setThumbnail] = useState(post?.thumbnail ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!post && title) {
      setSlug(slugify(title));
    }
  }, [title, post]);

  function toggleTag(id: number) {
    setTagIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
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
    setSaving(true);
    try {
      await onSubmit({
        title,
        slug,
        excerpt,
        content,
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
        <label className="block text-sm font-medium text-gray-300 mb-1">Título</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-lg bg-[#13131a] border border-[#2a2a3a] text-white focus:outline-none focus:border-violet-600"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Slug (URL)</label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-lg bg-[#13131a] border border-[#2a2a3a] text-white focus:outline-none focus:border-violet-600"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Resumo (excerpt)</label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 rounded-lg bg-[#13131a] border border-[#2a2a3a] text-white focus:outline-none focus:border-violet-600"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Conteúdo (HTML)</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={15}
          className="w-full px-4 py-2 rounded-lg bg-[#13131a] border border-[#2a2a3a] text-white focus:outline-none focus:border-violet-600 font-mono text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Categoria</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(Number(e.target.value))}
          className="w-full px-4 py-2 rounded-lg bg-[#13131a] border border-[#2a2a3a] text-white focus:outline-none focus:border-violet-600"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggleTag(tag.id)}
              className={`px-3 py-1 rounded-full text-sm ${
                tagIds.includes(tag.id)
                  ? "bg-violet-600 text-white"
                  : "bg-[#1c1c28] text-gray-400 border border-[#2a2a3a] hover:border-violet-600"
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Thumbnail</label>
        <div className="flex gap-4 items-start">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="text-sm text-gray-400"
          />
          {uploading && <span className="text-amber-400 text-sm">Enviando...</span>}
        </div>
        {thumbnail && (
          <div className="mt-2">
            <img
              src={thumbnail}
              alt="Thumbnail"
              className="w-40 h-24 object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="rounded bg-[#13131a] border-[#2a2a3a] text-violet-600 focus:ring-violet-600"
          />
          <span className="text-gray-300">Em destaque</span>
        </label>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "draft" | "published")}
            className="px-4 py-2 rounded-lg bg-[#13131a] border border-[#2a2a3a] text-white"
          >
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
          </select>
        </div>
      </div>

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
