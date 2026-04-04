export type User = {
  id: number;
  name: string;
  avatar: string | null;
  email?: string;
  role?: "admin" | "editor";
  createdAt?: string;
  updatedAt?: string;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  color: string;
  createdAt: string;
  updatedAt: string;
};

export type Tag = {
  id: number;
  name: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
};

export type PostAuthor = {
  id: number;
  name: string;
  avatar: string | null;
  bio?: string;
};

export type PostCategory = {
  id: number;
  name: string;
  slug: string;
  color: string;
};

export type PostSeoImage = {
  url: string;
  width: number;
  height: number;
  alt: string;
};

export type PostSeoAuthor = {
  name: string;
  url?: string;
};

export type PostSeoCategory = {
  name: string;
  slug: string;
};

export type PostSeoData = {
  title: string;
  description: string;
  canonicalUrl: string;
  url: string;
  publishedAt: string;
  updatedAt: string;
  author: PostSeoAuthor;
  category: PostSeoCategory;
  image: PostSeoImage;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  original_price?: number | null;
  rating?: number | null;
  affiliate_url: string;
  image?: string | null;
  active: boolean;
  category?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Post = {
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
  faq_json?: string | null;
  video_json?: string | null;
  howto_json?: string | null;
  linkedProducts?: Product[];
};

export type PaginatedMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: PaginatedMeta;
};

export type SingleResponse<T> = {
  data: T;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type ApiValidationDetail = {
  field: string;
  message: string;
};

export type ApiError = {
  error: string;
  details?: ApiValidationDetail[];
};

export type CreatePostDto = {
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
};

export type UpdatePostDto = Partial<CreatePostDto>;

export type CreateCategoryDto = {
  name: string;
  slug: string;
  description?: string;
  color: string;
};

export type UpdateCategoryDto = Partial<CreateCategoryDto>;

export type CreateTagDto = {
  name: string;
  slug: string;
};

export type UpdateTagDto = Partial<CreateTagDto>;

export type CreateUserDto = {
  name: string;
  email: string;
  password: string;
  role?: "admin" | "editor";
};

export type UpdateUserDto = {
  name?: string;
  email?: string;
  password?: string;
  role?: "admin" | "editor";
};

export type HubPage = {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  meta_description: string | null;
  posts?: Post[];
};

export type CreateProductDto = {
  name: string;
  price: number;
  affiliate_url: string;
  image?: string;
  original_price?: number;
  rating?: number;
  category?: string;
};

export type UpdateProductDto = {
  name?: string;
  price?: number;
  original_price?: number;
  rating?: number;
  affiliate_url?: string;
  image?: string;
  active?: boolean;
  category?: string;
};
