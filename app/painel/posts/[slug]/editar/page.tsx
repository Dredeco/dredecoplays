"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  getPostBySlug,
  updatePost,
  getCategories,
  getTags,
  getMe,
} from "@/lib/api";
import { getToken, getUser, setUser } from "@/lib/auth";
import PostForm from "@/components/admin/PostForm";
import type { Post } from "@/lib/types";
import type { UpdatePostDto } from "@/lib/types";
import type { User } from "@/lib/types";

export default function EditarPostPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const token = getToken();
  const [post, setPost] = useState<Post | null>(null);
  const [categories, setCategories] = useState<Awaited<ReturnType<typeof getCategories>>>([]);
  const [tags, setTags] = useState<Awaited<ReturnType<typeof getTags>>>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !slug) return;
    const loadUser = (): Promise<User | null> => {
      const stored = getUser();
      if (stored) return Promise.resolve(stored);
      return getMe(token).then((user) => {
        setUser(user);
        return user;
      }).catch(() => null);
    };
    Promise.all([getPostBySlug(slug), getCategories(), getTags(), loadUser()])
      .then(([p, cats, tgs, user]) => {
        setPost(p ?? null);
        setCategories(cats);
        setTags(tgs);
        setCurrentUser(user ?? null);
      })
      .finally(() => setLoading(false));
  }, [token, slug]);

  async function handleSubmit(dto: UpdatePostDto) {
    if (!token || !post) return;
    await updatePost(post.id, dto, token);
    router.push("/painel/posts");
  }

  if (!token) return null;
  if (loading || !currentUser) return <div className="text-gray-500">Carregando...</div>;
  if (!post) return <div className="text-red-400">Post não encontrado.</div>;

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/painel/posts"
          className="text-gray-400 hover:text-white"
        >
          ← Voltar
        </Link>
        <h2 className="text-2xl font-bold text-white">Editar: {post.title}</h2>
      </div>
      <PostForm
        post={post}
        categories={categories}
        tags={tags}
        token={token}
        currentUser={currentUser}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
