"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createPost, getCategories, getTags } from "@/lib/api";
import { getToken } from "@/lib/auth";
import PostForm from "@/components/admin/PostForm";
import type { CreatePostDto } from "@/lib/types";

export default function NovoPostPage() {
  const router = useRouter();
  const token = getToken();
  const [categories, setCategories] = useState<Awaited<ReturnType<typeof getCategories>>>([]);
  const [tags, setTags] = useState<Awaited<ReturnType<typeof getTags>>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    Promise.all([getCategories(), getTags()])
      .then(([cats, tgs]) => {
        setCategories(cats);
        setTags(tgs);
      })
      .finally(() => setLoading(false));
  }, [token]);

  async function handleSubmit(dto: CreatePostDto) {
    if (!token) return;
    await createPost(dto, token);
    router.push("/painel/posts");
  }

  if (!token) return null;
  if (loading) return <div className="text-gray-500">Carregando...</div>;

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/painel/posts"
          className="text-gray-400 hover:text-white"
        >
          ← Voltar
        </Link>
        <h2 className="text-2xl font-bold text-white">Novo post</h2>
      </div>
      <PostForm
        categories={categories}
        tags={tags}
        token={token}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
