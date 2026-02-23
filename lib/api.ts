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
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.dredecoplays.com.br";

type RequestInitWithToken = RequestInit & { token?: string };

async function request<T>(
  path: string,
  options: RequestInitWithToken = {}
): Promise<T> {
  const { token, ...init } = options;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };
  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...init, headers });
  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = json as ApiError;
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return json as T;
}

// --- Auth ---

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await request<
    AuthResponse & {
      data?: { token?: string; user?: import("./types").User };
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

/** GET /api/auth/me - Retorna { user: User } */
export async function getMe(token: string): Promise<User> {
  const res = await request<{ user: User }>("/api/auth/me", { token });
  const user = res.user;
  if (!user) throw new Error("Resposta inválida da API: user ausente");
  return user;
}

// --- Posts (público) ---

export interface GetPostsParams {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  search?: string;
  status?: "draft" | "published";
}

export async function getPosts(
  params: GetPostsParams = {},
  token?: string | null
): Promise<PaginatedResponse<Post>> {
  const search = new URLSearchParams();
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  if (params.category) search.set("category", params.category);
  if (params.tag) search.set("tag", params.tag);
  if (params.search) search.set("search", params.search);
  if (params.status) search.set("status", params.status);
  const qs = search.toString();
  try {
    return await request<PaginatedResponse<Post>>(`/api/posts${qs ? `?${qs}` : ""}`, {
      ...(token ? { token: token as string } : {}),
    });
  } catch {
    return { data: [], meta: { total: 0, page: 1, limit: params.limit ?? 10, totalPages: 0 } };
  }
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
    const res = await request<SingleResponse<Post>>(`/api/posts/${encodeURIComponent(slug)}`);
    return (res as unknown as SingleResponse<Post>).data ?? null;
  } catch {
    return null;
  }
}

export async function getRelatedPosts(
  currentSlug: string,
  categorySlug: string,
  limit = 3
): Promise<Post[]> {
  try {
    const res = await getCategoryPosts(categorySlug, { limit: limit + 5 });
    const posts = Array.isArray(res.data) ? res.data : [];
    return posts.filter((p) => p.slug !== currentSlug).slice(0, limit);
  } catch {
    return [];
  }
}

// --- Categories (público) ---

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
  params?: { page?: number; limit?: number }
): Promise<PaginatedResponse<Post> | { data: Post[] }> {
  const search = new URLSearchParams();
  if (params?.page) search.set("page", String(params.page));
  if (params?.limit) search.set("limit", String(params.limit));
  const qs = search.toString();
  try {
    return await request(
      `/api/categories/${encodeURIComponent(slug)}/posts${qs ? `?${qs}` : ""}`
    );
  } catch {
    return { data: [] };
  }
}

// --- Tags (público) ---

export async function getTags(): Promise<Tag[]> {
  try {
    const res = await request<{ data: Tag[] }>("/api/tags");
    return res.data ?? [];
  } catch {
    return [];
  }
}

// --- Posts (admin, JWT) ---

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

// --- Categories (admin, JWT) ---

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

// --- Tags (admin, JWT) ---

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

// --- Users (admin, JWT) ---

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

// --- Products (admin, JWT) ---

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

/** GET /api/products (público, sem token) — retorna produtos ativos */
export async function getPublicProducts(): Promise<Product[]> {
  try {
    const res = await request<{ data: Product[] } | Product[]>("/api/products");
    const all = Array.isArray(res)
      ? res
      : (res as { data: Product[] }).data ?? [];
    return all.filter((p) => p.active !== false);
  } catch {
    return [];
  }
}

// --- Upload ---

export async function uploadImage(
  file: File,
  token: string
): Promise<{ url: string; path: string }> {
  const formData = new FormData();
  formData.append("image", file); // campo obrigatório: "image"

  // NÃO definir Content-Type — o browser adiciona o boundary do multipart/form-data
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
        `HTTP ${res.status}`
    );
  }

  // A API retorna { data: { url, path } }
  const data = (json as { data?: { url: string; path: string } }).data ?? (json as { url: string; path: string });
  return { url: data.url, path: data.path };
}
