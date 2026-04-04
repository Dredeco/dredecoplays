import { API_URL, isApiClientError, request } from "./http-resource";
import type {
  Post,
  Category,
  Tag,
  User,
  Product,
  PaginatedResponse,
  SingleResponse,
  AuthResponse,
  ApiError,
  CreatePostDto,
  UpdatePostDto,
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateTagDto,
  UpdateTagDto,
  CreateUserDto,
  UpdateUserDto,
  CreateProductDto,
  UpdateProductDto,
  PostSeoData,
  HubPage,
} from "./types";

export { isApiClientError };
export type { ApiClientError } from "./http-resource";

export type GetPostsParams = {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  search?: string;
  status?: "draft" | "published";
};

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await request<
    AuthResponse & {
      data?: { token?: string; user?: User };
    }
  >("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  const token = (res.token ?? res.data?.token) as string;
  const user =
    res.user ?? res.data?.user ?? {
      id: 0,
      name: email.split("@")[0],
      avatar: null,
      email,
    };
  return { token, user };
}

export async function getMe(token: string): Promise<User> {
  const res = await request<{ user: User }>("/api/auth/me", { token });
  const user = res.user;
  if (!user) throw new Error("Resposta inválida da API: user ausente");
  return user;
}

export async function getPosts(
  params: GetPostsParams = {},
  token?: string | null,
): Promise<PaginatedResponse<Post>> {
  const search = new URLSearchParams();
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  if (params.category) search.set("category", params.category);
  if (params.tag) search.set("tag", params.tag);
  if (params.search) search.set("search", params.search);
  if (params.status) search.set("status", params.status);
  const qs = search.toString();
  const res = await request<PaginatedResponse<Post>>(
    `/api/posts${qs ? `?${qs}` : ""}`,
    token ? { token: token as string } : {},
  );
  const data = Array.isArray(res.data) ? res.data : [];
  const meta =
    res.meta && typeof res.meta === "object"
      ? res.meta
      : {
          total: data.length,
          page: params.page ?? 1,
          limit: params.limit ?? data.length,
          totalPages: 1,
        };
  return { data, meta };
}

export async function getFeaturedPost(): Promise<Post | null> {
  try {
    const res = await request<SingleResponse<Post>>("/api/posts/featured");
    return (res as unknown as SingleResponse<Post>).data ?? null;
  } catch {
    return null;
  }
}

export async function getPopularPosts(): Promise<Post[]> {
  try {
    const res = await request<{ data: Post[] }>("/api/posts/popular");
    return res.data ?? [];
  } catch {
    return [];
  }
}

export async function getRecentPosts(): Promise<Post[]> {
  try {
    const res = await request<{ data: Post[] }>("/api/posts/recent");
    return res.data ?? [];
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const res = await request<SingleResponse<Post>>(
      `/api/posts/${encodeURIComponent(slug)}`,
    );
    return (res as unknown as SingleResponse<Post>).data ?? null;
  } catch (err) {
    if (isApiClientError(err) && err.status === 404) return null;
    throw err;
  }
}

export async function getPostSeo(slug: string): Promise<PostSeoData | null> {
  try {
    const res = await request<SingleResponse<PostSeoData> | PostSeoData>(
      `/api/posts/${encodeURIComponent(slug)}/seo`,
    );
    if (res && typeof res === "object" && "data" in res && res.data) {
      return res.data;
    }
    if (res && typeof res === "object" && "title" in res && "url" in res) {
      return res as PostSeoData;
    }
    return null;
  } catch (err) {
    if (isApiClientError(err) && err.status === 404) return null;
    throw err;
  }
}

export async function getRelatedPosts(
  currentSlug: string,
  categorySlug: string,
  limit = 3,
): Promise<Post[]> {
  try {
    const res = await getCategoryPosts(categorySlug, { limit: limit + 5 });
    const posts = Array.isArray(res.data) ? res.data : [];
    return posts.filter((p) => p.slug !== currentSlug).slice(0, limit);
  } catch {
    return [];
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await request<{ data: Category[] }>("/api/categories");
    return res.data ?? [];
  } catch {
    return [];
  }
}

export async function getCategoryPosts(
  slug: string,
  params?: { page?: number; limit?: number },
): Promise<PaginatedResponse<Post> | { data: Post[] }> {
  const search = new URLSearchParams();
  if (params?.page) search.set("page", String(params.page));
  if (params?.limit) search.set("limit", String(params.limit));
  const qs = search.toString();
  try {
    return await request(
      `/api/categories/${encodeURIComponent(slug)}/posts${qs ? `?${qs}` : ""}`,
    );
  } catch {
    return { data: [] };
  }
}

export async function getTags(): Promise<Tag[]> {
  try {
    const res = await request<{ data: Tag[] }>("/api/tags");
    return res.data ?? [];
  } catch {
    return [];
  }
}

export async function createPost(dto: CreatePostDto, token: string): Promise<Post> {
  const res = await request<SingleResponse<Post>>("/api/posts", {
    method: "POST",
    body: JSON.stringify(dto),
    token,
  });
  return (res as unknown as SingleResponse<Post>).data;
}

export async function updatePost(id: number, dto: UpdatePostDto, token: string): Promise<Post> {
  const res = await request<SingleResponse<Post>>(`/api/posts/${id}`, {
    method: "PUT",
    body: JSON.stringify(dto),
    token,
  });
  return (res as unknown as SingleResponse<Post>).data;
}

export async function deletePost(id: number, token: string): Promise<void> {
  await request(`/api/posts/${id}`, { method: "DELETE", token });
}

export async function publishPost(id: number, publish: boolean, token: string): Promise<Post> {
  const res = await request<SingleResponse<Post>>(`/api/posts/${id}/publish`, {
    method: "PATCH",
    body: JSON.stringify({ publish }),
    token,
  });
  return (res as unknown as SingleResponse<Post>).data;
}

export async function createCategory(dto: CreateCategoryDto, token: string): Promise<Category> {
  const res = await request<SingleResponse<Category>>("/api/categories", {
    method: "POST",
    body: JSON.stringify(dto),
    token,
  });
  return (res as unknown as SingleResponse<Category>).data;
}

export async function updateCategory(id: number, dto: UpdateCategoryDto, token: string): Promise<Category> {
  const res = await request<SingleResponse<Category>>(`/api/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(dto),
    token,
  });
  return (res as unknown as SingleResponse<Category>).data;
}

export async function deleteCategory(id: number, token: string): Promise<void> {
  await request(`/api/categories/${id}`, { method: "DELETE", token });
}

export async function createTag(dto: CreateTagDto, token: string): Promise<Tag> {
  const res = await request<SingleResponse<Tag>>("/api/tags", {
    method: "POST",
    body: JSON.stringify(dto),
    token,
  });
  return (res as unknown as SingleResponse<Tag>).data;
}

export async function updateTag(id: number, dto: UpdateTagDto, token: string): Promise<Tag> {
  const res = await request<SingleResponse<Tag>>(`/api/tags/${id}`, {
    method: "PUT",
    body: JSON.stringify(dto),
    token,
  });
  return (res as unknown as SingleResponse<Tag>).data;
}

export async function deleteTag(id: number, token: string): Promise<void> {
  await request(`/api/tags/${id}`, { method: "DELETE", token });
}

export async function getUsers(token: string): Promise<User[]> {
  const res = await request<{ data: User[] } | User[]>("/api/users", { token });
  return Array.isArray(res) ? res : (res as { data: User[] }).data ?? [];
}

export async function getUser(id: number, token: string): Promise<User> {
  const res = await request<SingleResponse<User>>(`/api/users/${id}`, { token });
  return (res as unknown as SingleResponse<User>).data;
}

export async function createUser(dto: CreateUserDto, token: string): Promise<User> {
  const res = await request<SingleResponse<User>>("/api/users", {
    method: "POST",
    body: JSON.stringify(dto),
    token,
  });
  return (res as unknown as SingleResponse<User>).data;
}

export async function updateUser(id: number, dto: UpdateUserDto, token: string): Promise<User> {
  const res = await request<SingleResponse<User>>(`/api/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(dto),
    token,
  });
  return (res as unknown as SingleResponse<User>).data;
}

export async function deleteUser(id: number, token: string): Promise<void> {
  await request(`/api/users/${id}`, { method: "DELETE", token });
}

export async function getProducts(token: string): Promise<Product[]> {
  const res = await request<{ data: Product[] } | Product[]>("/api/products", { token });
  return Array.isArray(res) ? res : (res as { data: Product[] }).data ?? [];
}

export async function createProduct(dto: CreateProductDto, token: string): Promise<Product> {
  const res = await request<SingleResponse<Product>>("/api/products", {
    method: "POST",
    body: JSON.stringify(dto),
    token,
  });
  return (res as unknown as SingleResponse<Product>).data;
}

export async function updateProduct(id: number, dto: UpdateProductDto, token: string): Promise<Product> {
  const res = await request<SingleResponse<Product>>(`/api/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(dto),
    token,
  });
  return (res as unknown as SingleResponse<Product>).data;
}

export async function deleteProduct(id: number, token: string): Promise<void> {
  await request(`/api/products/${id}`, { method: "DELETE", token });
}

export async function getProductById(id: number): Promise<Product | null> {
  try {
    const res = await request<SingleResponse<Product>>(`/api/products/${id}`);
    return (res as unknown as SingleResponse<Product>).data ?? null;
  } catch (err) {
    if (isApiClientError(err) && err.status === 404) return null;
    return null;
  }
}

export async function getPublicProducts(params?: {
  category?: string;
  sort?: "discount" | "price_asc" | "price_desc";
}): Promise<Product[]> {
  try {
    const search = new URLSearchParams();
    if (params?.category) search.set("category", params.category);
    if (params?.sort) search.set("sort", params.sort);
    const qs = search.toString();
    const res = await request<{ data: Product[] } | Product[]>(
      `/api/products${qs ? `?${qs}` : ""}`,
    );
    const all = Array.isArray(res)
      ? res
      : (res as { data: Product[] }).data ?? [];
    return all.filter((p) => p.active !== false);
  } catch {
    return [];
  }
}

export async function getHubs(): Promise<HubPage[]> {
  try {
    const res = await request<{ data: HubPage[] }>("/api/hubs");
    return res.data ?? [];
  } catch {
    return [];
  }
}

export async function getHubBySlug(slug: string): Promise<HubPage | null> {
  try {
    const res = await request<{ data: HubPage }>(
      `/api/hubs/${encodeURIComponent(slug)}`,
    );
    return res.data ?? null;
  } catch (err) {
    if (isApiClientError(err) && err.status === 404) return null;
    throw err;
  }
}

export async function uploadImage(
  file: File,
  token: string,
): Promise<{ url: string; path: string }> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${API_URL}/api/upload/image`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      (json as ApiError).error ||
        (json as { message?: string }).message ||
        `HTTP ${res.status}`,
    );
  }

  const data =
    (json as { data?: { url: string; path: string } }).data ??
    (json as { url: string; path: string });
  return { url: data.url, path: data.path };
}
