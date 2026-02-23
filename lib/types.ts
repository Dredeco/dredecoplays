// Tipos baseados na API https://api.dredecoplays.com.br

export interface User {
  id: number;
  name: string;
  avatar: string | null;
  email?: string;
  role?: "admin" | "editor";
  createdAt?: string;
  updatedAt?: string;
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
  user_id: number;
  category_id: number;
  status?: "draft" | "published";
  featured?: boolean;
  thumbnail?: string;
  tags?: number[];
}

export type UpdatePostDto = Partial<CreatePostDto>;

export interface CreateCategoryDto {
  name: string;
  slug: string;
  description?: string;
  color: string;
}

export type UpdateCategoryDto = Partial<CreateCategoryDto>;

export interface CreateTagDto {
  name: string;
  slug: string;
}

export type UpdateTagDto = Partial<CreateTagDto>;

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role?: "admin" | "editor";
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  role?: "admin" | "editor";
}

export interface Product {
  id: number;
  name: string;
  price: number;
  original_price?: number | null;
  rating?: number | null;
  affiliate_url: string;
  image?: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  price: number;
  affiliate_url: string;
  image?: string;
  original_price?: number;
  rating?: number;
}

export interface UpdateProductDto {
  name?: string;
  price?: number;
  original_price?: number;
  rating?: number;
  affiliate_url?: string;
  image?: string;
  active?: boolean;
}
