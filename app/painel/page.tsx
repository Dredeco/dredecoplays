"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPosts, getCategories, getTags } from "@/lib/api";
import { getToken } from "@/lib/auth";

export default function DashboardPage() {
  const [stats, setStats] = useState<{
    totalPosts: number;
    publishedPosts: number;
    draftPosts: number;
    categories: number;
    tags: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    async function load() {
      if (!token) return;
      try {
        const [postsRes, draftRes, categories, tags] = await Promise.all([
          getPosts({ limit: 1, status: "published" }, token),
          getPosts({ limit: 1, status: "draft" }, token).catch(() => ({ meta: { total: 0 } })),
          getCategories(),
          getTags(),
        ]);

        setStats({
          totalPosts: postsRes.meta.total + draftRes.meta.total,
          publishedPosts: postsRes.meta.total,
          draftPosts: draftRes.meta.total,
          categories: categories.length,
          tags: tags.length,
        });
      } catch {
        setStats({
          totalPosts: 0,
          publishedPosts: 0,
          draftPosts: 0,
          categories: 0,
          tags: 0,
        });
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse text-gray-500">Carregando métricas...</div>
    );
  }

  const cards = [
    {
      label: "Posts publicados",
      value: stats?.publishedPosts ?? 0,
      href: "/painel/posts?status=published",
      color: "violet",
    },
    {
      label: "Rascunhos",
      value: stats?.draftPosts ?? 0,
      href: "/painel/posts?status=draft",
      color: "amber",
    },
    {
      label: "Categorias",
      value: stats?.categories ?? 0,
      href: "/painel/categorias",
      color: "emerald",
    },
    {
      label: "Tags",
      value: stats?.tags ?? 0,
      href: "/painel/tags",
      color: "blue",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="block p-6 rounded-xl bg-[#13131a] border border-[#2a2a3a] hover:border-violet-700/50 transition-colors"
          >
            <p className="text-gray-400 text-sm font-medium">{card.label}</p>
            <p className="text-3xl font-bold text-white mt-1">{card.value}</p>
          </Link>
        ))}
      </div>
      <div className="mt-8">
        <Link
          href="/painel/posts/novo"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo post
        </Link>
      </div>
    </div>
  );
}
