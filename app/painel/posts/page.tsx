"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  getPosts,
  deletePost,
  publishPost,
} from "@/lib/api";
import { getToken } from "@/lib/auth";
import type { Post } from "@/lib/types";

export default function PostsListPage() {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page") || "1";
  const statusParam = searchParams.get("status") || "published";
  const searchQuery = searchParams.get("search") || "";

  const [posts, setPosts] = useState<Post[]>([]);
  const [meta, setMeta] = useState<{ total: number; page: number; totalPages: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchQuery);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const token = getToken();
  const page = Math.max(1, parseInt(pageParam, 10));

  useEffect(() => {
    if (!token) return;

    async function load() {
      setLoading(true);
      try {
        const res = await getPosts(
          {
            page,
            limit: 10,
            status: statusParam as "draft" | "published",
            search: searchQuery || undefined,
          },
          token
        );
        setPosts(res.data);
        setMeta(res.meta);
      } catch {
        setPosts([]);
        setMeta(null);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [token, page, statusParam, searchQuery]);

  async function handleDelete(post: Post) {
    if (!confirm(`Excluir "${post.title}"?`)) return;
    if (!token) return;
    setActionLoading(post.id);
    try {
      await deletePost(post.id, token);
      setPosts((p) => p.filter((x) => x.id !== post.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao excluir");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleTogglePublish(post: Post) {
    if (!token) return;
    setActionLoading(post.id);
    try {
      const updated = await publishPost(post.id, post.status !== "published", token);
      setPosts((p) => p.map((x) => (x.id === post.id ? updated : x)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao atualizar");
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-white">Posts</h2>
        <Link
          href="/painel/posts/novo"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium w-fit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo post
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <Link
          href="/painel/posts?status=published"
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            statusParam === "published"
              ? "bg-violet-600 text-white"
              : "bg-[#13131a] text-gray-400 hover:bg-[#1c1c28] border border-[#2a2a3a]"
          }`}
        >
          Publicados
        </Link>
        <Link
          href="/painel/posts?status=draft"
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            statusParam === "draft"
              ? "bg-violet-600 text-white"
              : "bg-[#13131a] text-gray-400 hover:bg-[#1c1c28] border border-[#2a2a3a]"
          }`}
        >
          Rascunhos
        </Link>
      </div>

      <form
        className="mb-6"
        onSubmit={(e) => {
          e.preventDefault();
          const params = new URLSearchParams();
          params.set("status", statusParam);
          if (search) params.set("search", search);
          window.location.href = `/painel/posts?${params.toString()}`;
        }}
      >
        <div className="flex gap-2">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título..."
            className="flex-1 px-4 py-2 rounded-lg bg-[#13131a] border border-[#2a2a3a] text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-600"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium"
          >
            Buscar
          </button>
        </div>
      </form>

      {loading ? (
        <div className="text-gray-500 py-8">Carregando...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-[#13131a] rounded-xl border border-[#2a2a3a]">
          Nenhum post encontrado.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-400 border-b border-[#2a2a3a]">
                <th className="py-3 px-2">Título</th>
                <th className="py-3 px-2">Categoria</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2">Data</th>
                <th className="py-3 px-2 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-[#2a2a3a]">
                  <td className="py-3 px-2">
                    <Link
                      href={`/painel/posts/${post.slug}/editar`}
                      className="text-white hover:text-violet-400 font-medium"
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="py-3 px-2 text-gray-400 text-sm">
                    {post.category?.name ?? "-"}
                  </td>
                  <td className="py-3 px-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        post.status === "published"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-amber-500/20 text-amber-400"
                      }`}
                    >
                      {post.status === "published" ? "Publicado" : "Rascunho"}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-gray-500 text-sm">
                    {new Date(post.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="py-3 px-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="text-sm text-gray-400 hover:text-white"
                      >
                        Ver
                      </Link>
                      <button
                        onClick={() => handleTogglePublish(post)}
                        disabled={actionLoading === post.id}
                        className="text-sm text-violet-400 hover:text-violet-300 disabled:opacity-50"
                      >
                        {post.status === "published" ? "Despublicar" : "Publicar"}
                      </button>
                      <Link
                        href={`/painel/posts/${post.slug}/editar`}
                        className="text-sm text-gray-400 hover:text-white"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(post)}
                        disabled={actionLoading === post.id}
                        className="text-sm text-red-400 hover:text-red-300 disabled:opacity-50"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="flex gap-2 mt-6 justify-center">
          {page > 1 && (
            <Link
              href={`/painel/posts?page=${page - 1}&status=${statusParam}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ""}`}
              className="px-4 py-2 rounded-lg bg-[#13131a] text-gray-400 hover:bg-violet-900/40 border border-[#2a2a3a]"
            >
              Anterior
            </Link>
          )}
          <span className="px-4 py-2 text-gray-400">
            Página {page} de {meta.totalPages}
          </span>
          {page < meta.totalPages && (
            <Link
              href={`/painel/posts?page=${page + 1}&status=${statusParam}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ""}`}
              className="px-4 py-2 rounded-lg bg-[#13131a] text-gray-400 hover:bg-violet-900/40 border border-[#2a2a3a]"
            >
              Próxima
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
