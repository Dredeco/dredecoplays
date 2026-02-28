"use client";

import { useEffect, useState } from "react";
import {
  getTags,
  createTag,
  updateTag,
  deleteTag,
} from "@/lib/api";
import { getToken } from "@/lib/auth";
import { slugify } from "@/lib/posts";
import type { Tag } from "@/lib/types";

export default function TagsPage() {
  const token = getToken();
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "" });

  useEffect(() => {
    if (!token) return;
    getTags()
      .then(setTags)
      .finally(() => setLoading(false));
  }, [token]);

  function handleNameChange(name: string) {
    setForm((f) => ({ ...f, name, slug: creating || editingId ? f.slug : slugify(name) }));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    try {
      const tag = await createTag(
        { name: form.name, slug: form.slug || slugify(form.name) },
        token
      );
      setTags((t) => [...t, tag]);
      setCreating(false);
      setForm({ name: "", slug: "" });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao criar");
    }
  }

  async function handleUpdate(e: React.FormEvent, id: number) {
    e.preventDefault();
    if (!token) return;
    try {
      const tag = await updateTag(id, { name: form.name, slug: form.slug }, token);
      setTags((t) => t.map((x) => (x.id === id ? tag : x)));
      setEditingId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao atualizar");
    }
  }

  async function handleDelete(tag: Tag) {
    if (!confirm(`Excluir tag "${tag.name}"?`)) return;
    if (!token) return;
    try {
      await deleteTag(tag.id, token);
      setTags((t) => t.filter((x) => x.id !== tag.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao excluir");
    }
  }

  if (!token) return null;
  if (loading) return <div className="text-muted">Carregando...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-6">Tags</h2>

      {creating ? (
        <form
          onSubmit={handleCreate}
          className="p-4 rounded-xl bg-surface border border-border mb-4 flex gap-2"
        >
          <input
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Nome"
            required
            className="flex-1 px-4 py-2 rounded-lg bg-bg border border-border text-foreground"
          />
          <input
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            placeholder="Slug"
            className="flex-1 px-4 py-2 rounded-lg bg-bg border border-border text-foreground"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-violet-600 text-white font-medium"
          >
            Criar
          </button>
          <button
            type="button"
            onClick={() => setCreating(false)}
            className="px-4 py-2 rounded-lg bg-surface-2 text-muted"
          >
            Cancelar
          </button>
        </form>
      ) : (
        <button
          onClick={() => setCreating(true)}
          className="mb-6 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium"
        >
          Nova tag
        </button>
      )}

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) =>
          editingId === tag.id ? (
            <form
              key={tag.id}
              onSubmit={(e) => handleUpdate(e, tag.id)}
              className="flex gap-2 p-2 rounded-lg bg-surface border border-border"
            >
              <input
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Nome"
                required
                className="px-3 py-1 rounded bg-bg border border-border text-foreground text-sm"
              />
              <input
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="Slug"
                className="px-3 py-1 rounded bg-bg border border-border text-foreground text-sm"
              />
              <button
                type="submit"
                className="px-2 py-1 rounded bg-violet-600 text-white text-sm"
              >
                Salvar
              </button>
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="px-2 py-1 rounded bg-surface-2 text-muted text-sm"
              >
                Cancelar
              </button>
            </form>
          ) : (
            <div
              key={tag.id}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-border"
            >
              <span className="text-foreground text-sm">{tag.name}</span>
              <span className="text-muted text-xs">/{tag.slug}</span>
              <button
                onClick={() => {
                  setEditingId(tag.id);
                  setForm({ name: tag.name, slug: tag.slug });
                }}
                className="text-xs text-violet-400 hover:text-violet-300"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(tag)}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Excluir
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}
