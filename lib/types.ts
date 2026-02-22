// Tipos baseados na API https://api.dredecoplays.com.br

export interface User {
  id: number;
  name: string;
  avatar: string | null;
  email?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PostAuthor {
  id: number;
  name: string;
  avatar: string | null;
}

export interface PostCategory {
  id: number;
  name: string;
  slug: string;
  color: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: string | null;
  status: "draft" | "published";
  featured: boolean;
  views: number;
  user_id: number;
  category_id: number;
  createdAt: string;
  updatedAt: string;
  author?: PostAuthor;
  category?: PostCategory;
  tags?: Tag[];
}

export interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedMeta;
}

export interface SingleResponse<T> {
  data: T;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  error: string;
}

// DTOs para criação/edição
export interface CreatePostDto {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category_id: number;
  status?: "draft" | "published";
  featured?: boolean;
  thumbnail?: string;
  tags?: number[];
}

export interface UpdatePostDto extends Partial<CreatePostDto> {}

export interface CreateCategoryDto {
  name: string;
  slug: string;
  description?: string;
  color: string;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}

export interface CreateTagDto {
  name: string;
  slug: string;
}

export interface UpdateTagDto extends Partial<CreateTagDto> {}
