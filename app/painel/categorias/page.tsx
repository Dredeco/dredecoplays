"use client";

import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/api";
import { getToken } from "@/lib/auth";
import { slugify } from "@/lib/posts";
import type { Category } from "@/lib/types";

export default function CategoriasPage() {
  const token = getToken();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", description: "", color: "#8B5CF6" });

  useEffect(() => {
    if (!token) return;
    getCategories()
      .then(setCategories)
      .finally(() => setLoading(false));
  }, [token]);

  function handleNameChange(name: string) {
    setForm((f) => ({ ...f, name, slug: creating || editingId ? f.slug : slugify(name) }));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    try {
      const cat = await createCategory(
        {
          name: form.name,
          slug: form.slug || slugify(form.name),
          description: form.description || undefined,
          color: form.color,
        },
        token
      );
      setCategories((c) => [...c, cat]);
      setCreating(false);
      setForm({ name: "", slug: "", description: "", color: "#8B5CF6" });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao criar");
    }
  }

  async function handleUpdate(e: React.FormEvent, id: number) {
    e.preventDefault();
    if (!token) return;
    try {
      const cat = await updateCategory(
        id,
        {
          name: form.name,
          slug: form.slug,
          description: form.description,
          color: form.color,
        },
        token
      );
      setCategories((c) => c.map((x) => (x.id === id ? cat : x)));
      setEditingId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao atualizar");
    }
  }

  async function handleDelete(cat: Category) {
    if (!confirm(`Excluir categoria "${cat.name}"?`)) return;
    if (!token) return;
    try {
      await deleteCategory(cat.id, token);
      setCategories((c) => c.filter((x) => x.id !== cat.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao excluir");
    }
  }

  if (!token) return null;
  if (loading) return <div className="text-muted">Carregando...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-6">Categorias</h2>

      {creating ? (
        <form
          onSubmit={handleCreate}
          className="p-4 rounded-xl bg-surface border border-border mb-4 space-y-3"
        >
          <input
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Nome"
            required
            className="w-full px-4 py-2 rounded-lg bg-bg border border-border text-foreground"
          />
          <input
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            placeholder="Slug"
            className="w-full px-4 py-2 rounded-lg bg-bg border border-border text-foreground"
          />
          <input
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Descrição"
            className="w-full px-4 py-2 rounded-lg bg-bg border border-border text-foreground"
          />
          <div className="flex gap-2">
            <input
              type="color"
              value={form.color}
              onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
              className="w-10 h-10 rounded cursor-pointer"
            />
            <input
              value={form.color}
              onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
              className="flex-1 px-4 py-2 rounded-lg bg-bg border border-border text-foreground"
            />
          </div>
          <div className="flex gap-2">
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
          </div>
        </form>
      ) : (
        <button
          onClick={() => setCreating(true)}
          className="mb-6 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium"
        >
          Nova categoria
        </button>
      )}

      <div className="space-y-2">
        {categories.map((cat) =>
          editingId === cat.id ? (
            <form
              key={cat.id}
              onSubmit={(e) => handleUpdate(e, cat.id)}
              className="p-4 rounded-xl bg-surface border border-border space-y-3"
            >
              <input
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Nome"
                required
                className="w-full px-4 py-2 rounded-lg bg-bg border border-border text-foreground"
              />
              <input
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="Slug"
                className="w-full px-4 py-2 rounded-lg bg-bg border border-border text-foreground"
              />
              <input
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Descrição"
                className="w-full px-4 py-2 rounded-lg bg-bg border border-border text-foreground"
              />
              <div className="flex gap-2">
                <input
                  type="color"
                  value={form.color}
                  onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <input
                  value={form.color}
                  onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                  className="flex-1 px-4 py-2 rounded-lg bg-bg border border-border text-foreground"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-violet-600 text-white font-medium"
                >
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="px-4 py-2 rounded-lg bg-surface-2 text-muted"
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <div
              key={cat.id}
              className="flex items-center justify-between p-4 rounded-xl bg-surface border border-border"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-foreground font-medium">{cat.name}</span>
                <span className="text-muted text-sm">/{cat.slug}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingId(cat.id);
                    setForm({
                      name: cat.name,
                      slug: cat.slug,
                      description: cat.description ?? "",
                      color: cat.color,
                    });
                  }}
                  className="text-sm text-violet-400 hover:text-violet-300"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(cat)}
                  className="text-sm text-red-400 hover:text-red-300"
                >
                  Excluir
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
