"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createPost, getCategories, getTags, getMe } from "@/lib/api";
import { getToken, getUser, setUser } from "@/lib/auth";
import PostForm from "@/components/admin/PostForm";
import type { CreatePostDto } from "@/lib/types";
import type { User } from "@/lib/types";

export default function NovoPostPage() {
  const router = useRouter();
  const token = getToken();
  const [categories, setCategories] = useState<Awaited<ReturnType<typeof getCategories>>>([]);
  const [tags, setTags] = useState<Awaited<ReturnType<typeof getTags>>>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    const loadUser = (): Promise<User | null> => {
      const stored = getUser();
      if (stored) return Promise.resolve(stored);
      return getMe(token).then((user) => {
        setUser(user);
        return user;
      }).catch(() => null);
    };
    Promise.all([getCategories(), getTags(), loadUser()])
      .then(([cats, tgs, user]) => {
        setCategories(cats);
        setTags(tgs);
        setCurrentUser(user ?? null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  async function handleSubmit(dto: CreatePostDto) {
    if (!token) return;
    await createPost(dto, token);
    router.push("/painel/posts");
  }

  if (!token) return null;
  if (loading || !currentUser) return <div className="text-muted">Carregando...</div>;

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/painel/posts"
          className="text-muted hover:text-foreground"
        >
          ← Voltar
        </Link>
        <h2 className="text-2xl font-bold text-foreground">Novo post</h2>
      </div>
      <PostForm
        categories={categories}
        tags={tags}
        token={token}
        currentUser={currentUser}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
