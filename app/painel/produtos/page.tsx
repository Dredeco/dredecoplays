"use client";

import { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/api";
import { getToken } from "@/lib/auth";
import type { Product, CreateProductDto, UpdateProductDto } from "@/lib/types";

const emptyCreateForm: CreateProductDto & { image?: string } = {
  name: "",
  price: 0,
  affiliate_url: "",
  image: "",
  original_price: undefined,
  rating: undefined,
};

export default function ProdutosPage() {
  const token = getToken();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState(emptyCreateForm);
  const [editForm, setEditForm] = useState<Record<number, UpdateProductDto>>({});
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    if (!token) return;
    getProducts(token)
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [token]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    try {
      const dto: CreateProductDto = {
        name: createForm.name.trim(),
        price: Number(createForm.price),
        affiliate_url: createForm.affiliate_url.trim(),
      };
      if (createForm.image?.trim()) dto.image = createForm.image.trim();
      if (createForm.original_price != null)
        dto.original_price = Number(createForm.original_price);
      if (createForm.rating != null)
        dto.rating = Math.min(5, Math.max(0, Number(createForm.rating)));

      const product = await createProduct(dto, token);
      setProducts((p) => [product, ...p]);
      setCreating(false);
      setCreateForm(emptyCreateForm);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao criar");
    }
  }

  async function handleUpdate(e: React.FormEvent, id: number) {
    e.preventDefault();
    if (!token) return;
    const dto = editForm[id];
    if (!dto || Object.keys(dto).length === 0) {
      setEditingId(null);
      return;
    }
    setActionLoading(id);
    try {
      const updated = await updateProduct(id, dto, token);
      setProducts((p) => p.map((x) => (x.id === id ? updated : x)));
      setEditingId(null);
      setEditForm((f) => {
        const next = { ...f };
        delete next[id];
        return next;
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao atualizar");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleToggleActive(product: Product) {
    if (!token) return;
    setActionLoading(product.id);
    try {
      const updated = await updateProduct(
        product.id,
        { active: !product.active },
        token
      );
      setProducts((p) => p.map((x) => (x.id === product.id ? updated : x)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao atualizar");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDelete(product: Product) {
    if (!confirm(`Excluir produto "${product.name}"?`)) return;
    if (!token) return;
    setActionLoading(product.id);
    try {
      await deleteProduct(product.id, token);
      setProducts((p) => p.filter((x) => x.id !== product.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao excluir");
    } finally {
      setActionLoading(null);
    }
  }

  function setEditField(id: number, field: keyof UpdateProductDto, value: string | number | boolean | undefined) {
    setEditForm((f) => {
      const current = f[id] ?? {};
      const next = { ...current, [field]: value };
      if (value === "" || value === undefined) delete next[field];
      return { ...f, [id]: next };
    });
  }

  if (!token) return null;
  if (loading) return <div className="text-gray-500">Carregando...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Produtos Afiliados</h2>

      {creating ? (
        <form
          onSubmit={handleCreate}
          className="p-4 rounded-xl bg-[#13131a] border border-[#2a2a3a] mb-6 space-y-3"
        >
          <input
            value={createForm.name}
            onChange={(e) => setCreateForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Nome *"
            required
            maxLength={200}
            className="w-full px-4 py-2 rounded-lg bg-[#0a0a0f] border border-[#2a2a3a] text-white"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="number"
              step="0.01"
              min={0}
              value={createForm.price || ""}
              onChange={(e) => setCreateForm((f) => ({ ...f, price: e.target.value ? Number(e.target.value) : 0 }))}
              placeholder="Preço *"
              required
              className="w-full px-4 py-2 rounded-lg bg-[#0a0a0f] border border-[#2a2a3a] text-white"
            />
            <input
              type="number"
              step="0.01"
              min={0}
              value={createForm.original_price ?? ""}
              onChange={(e) =>
                setCreateForm((f) => ({
                  ...f,
                  original_price: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
              placeholder="Preço original"
              className="w-full px-4 py-2 rounded-lg bg-[#0a0a0f] border border-[#2a2a3a] text-white"
            />
          </div>
          <input
            type="url"
            value={createForm.affiliate_url}
            onChange={(e) => setCreateForm((f) => ({ ...f, affiliate_url: e.target.value }))}
            placeholder="URL de afiliado *"
            required
            className="w-full px-4 py-2 rounded-lg bg-[#0a0a0f] border border-[#2a2a3a] text-white"
          />
          <input
            value={createForm.image ?? ""}
            onChange={(e) => setCreateForm((f) => ({ ...f, image: e.target.value }))}
            placeholder="URL ou path da imagem"
            maxLength={255}
            className="w-full px-4 py-2 rounded-lg bg-[#0a0a0f] border border-[#2a2a3a] text-white"
          />
          <input
            type="number"
            step="0.1"
            min={0}
            max={5}
            value={createForm.rating ?? ""}
            onChange={(e) =>
              setCreateForm((f) => ({
                ...f,
                rating: e.target.value ? Number(e.target.value) : undefined,
              }))
            }
            placeholder="Avaliação (0-5)"
            className="w-full px-4 py-2 rounded-lg bg-[#0a0a0f] border border-[#2a2a3a] text-white max-w-[120px]"
          />
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
              className="px-4 py-2 rounded-lg bg-[#1c1c28] text-gray-400"
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
          Novo produto
        </button>
      )}

      {products.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-[#13131a] rounded-xl border border-[#2a2a3a]">
          Nenhum produto cadastrado.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-400 border-b border-[#2a2a3a]">
                <th className="py-3 px-2 w-14">Imagem</th>
                <th className="py-3 px-2">Nome</th>
                <th className="py-3 px-2">Preço</th>
                <th className="py-3 px-2">Preço Orig.</th>
                <th className="py-3 px-2">Avaliação</th>
                <th className="py-3 px-2">Ativo</th>
                <th className="py-3 px-2 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) =>
                editingId === product.id ? (
                  <tr key={product.id} className="border-b border-[#2a2a3a]">
                    <td colSpan={7} className="py-4 px-2">
                      <form
                        onSubmit={(e) => handleUpdate(e, product.id)}
                        className="p-4 rounded-xl bg-[#13131a] border border-[#2a2a3a] space-y-3"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          <input
                            value={(editForm[product.id]?.name as string) ?? product.name}
                            onChange={(e) => setEditField(product.id, "name", e.target.value)}
                            placeholder="Nome"
                            maxLength={200}
                            className="px-4 py-2 rounded-lg bg-[#0a0a0f] border border-[#2a2a3a] text-white"
                          />
                          <input
                            type="number"
                            step="0.01"
                            min={0}
                            value={
                              (editForm[product.id]?.price as number) ?? product.price ?? ""
                            }
                            onChange={(e) =>
                              setEditField(
                                product.id,
                                "price",
                                e.target.value ? Number(e.target.value) : undefined
                              )
                            }
                            placeholder="Preço"
                            className="px-4 py-2 rounded-lg bg-[#0a0a0f] border border-[#2a2a3a] text-white"
                          />
                          <input
                            type="number"
                            step="0.01"
                            min={0}
                            value={
                              (editForm[product.id]?.original_price as number) ??
                              product.original_price ??
                              ""
                            }
                            onChange={(e) =>
                              setEditField(
                                product.id,
                                "original_price",
                                e.target.value ? Number(e.target.value) : undefined
                              )
                            }
                            placeholder="Preço original"
                            className="px-4 py-2 rounded-lg bg-[#0a0a0f] border border-[#2a2a3a] text-white"
                          />
                          <input
                            type="url"
                            value={
                              (editForm[product.id]?.affiliate_url as string) ??
                              product.affiliate_url ??
                              ""
                            }
                            onChange={(e) =>
                              setEditField(product.id, "affiliate_url", e.target.value)
                            }
                            placeholder="URL de afiliado"
                            className="px-4 py-2 rounded-lg bg-[#0a0a0f] border border-[#2a2a3a] text-white sm:col-span-2"
                          />
                          <input
                            value={
                              (editForm[product.id]?.image as string) ??
                              product.image ??
                              ""
                            }
                            onChange={(e) =>
                              setEditField(product.id, "image", e.target.value || undefined)
                            }
                            placeholder="URL da imagem"
                            maxLength={255}
                            className="px-4 py-2 rounded-lg bg-[#0a0a0f] border border-[#2a2a3a] text-white"
                          />
                          <input
                            type="number"
                            step="0.1"
                            min={0}
                            max={5}
                            value={
                              (editForm[product.id]?.rating as number) ??
                              product.rating ??
                              ""
                            }
                            onChange={(e) =>
                              setEditField(
                                product.id,
                                "rating",
                                e.target.value ? Number(e.target.value) : undefined
                              )
                            }
                            placeholder="Avaliação (0-5)"
                            className="px-4 py-2 rounded-lg bg-[#0a0a0f] border border-[#2a2a3a] text-white"
                          />
                          <label className="flex items-center gap-2 text-gray-400">
                            <input
                              type="checkbox"
                              checked={
                                (editForm[product.id]?.active as boolean) ?? product.active
                              }
                              onChange={(e) =>
                                setEditField(product.id, "active", e.target.checked)
                              }
                              className="rounded border-[#2a2a3a] text-violet-600"
                            />
                            Ativo
                          </label>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            disabled={actionLoading === product.id}
                            className="px-4 py-2 rounded-lg bg-violet-600 text-white font-medium disabled:opacity-50"
                          >
                            Salvar
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(null);
                              setEditForm((f) => {
                                const next = { ...f };
                                delete next[product.id];
                                return next;
                              });
                            }}
                            className="px-4 py-2 rounded-lg bg-[#1c1c28] text-gray-400"
                          >
                            Cancelar
                          </button>
                        </div>
                      </form>
                    </td>
                  </tr>
                ) : (
                  <tr key={product.id} className="border-b border-[#2a2a3a]">
                    <td className="py-3 px-2">
                      {product.image ? (
                        <div className="relative w-10 h-10 rounded overflow-hidden bg-[#1c1c28]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded bg-[#1c1c28] border border-[#2a2a3a] flex items-center justify-center text-gray-500 text-xs">
                          -
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-2">
                      {product.affiliate_url ? (
                        <a
                          href={product.affiliate_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white font-medium text-violet-400 hover:text-violet-300 underline decoration-violet-500/50 hover:decoration-violet-400 transition-colors"
                        >
                          {product.name}
                        </a>
                      ) : (
                        <span className="text-white font-medium">{product.name}</span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-violet-400">
                      R$ {Number(product.price).toFixed(2).replace(".", ",")}
                    </td>
                    <td className="py-3 px-2 text-gray-500 text-sm">
                      {product.original_price != null
                        ? `R$ ${Number(product.original_price).toFixed(2).replace(".", ",")}`
                        : "-"}
                    </td>
                    <td className="py-3 px-2 text-gray-400 text-sm">
                      {product.rating != null
                        ? Number(product.rating).toFixed(1)
                        : "-"}
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          product.active
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-amber-500/20 text-amber-400"
                        }`}
                      >
                        {product.active ? "Sim" : "Não"}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleActive(product)}
                          disabled={actionLoading === product.id}
                          className="text-sm text-violet-400 hover:text-violet-300 disabled:opacity-50"
                        >
                          {product.active ? "Desativar" : "Ativar"}
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(product.id);
                            setEditForm((f) => ({ ...f, [product.id]: {} }));
                          }}
                          className="text-sm text-gray-400 hover:text-white"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          disabled={actionLoading === product.id}
                          className="text-sm text-red-400 hover:text-red-300 disabled:opacity-50"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
