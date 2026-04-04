import {
  getCategories,
  getCategoryPosts,
  getFeaturedPost,
  getHubBySlug,
  getHubs,
  getMe,
  getPopularPosts,
  getPostBySlug,
  getPostSeo,
  getPosts,
  getProductById,
  getProducts,
  getPublicProducts,
  getRecentPosts,
  getRelatedPosts,
  getTags,
  getUsers,
  type GetPostsParams,
} from "./api-client";
import { queryKeys } from "./keys";

export function postsListQueryOptions(params: GetPostsParams = {}, token?: string | null) {
  return {
    queryKey: queryKeys.posts.list(params),
    queryFn: () => getPosts(params, token),
  };
}

export function featuredPostQueryOptions() {
  return {
    queryKey: queryKeys.posts.featured(),
    queryFn: () => getFeaturedPost(),
  };
}

export function popularPostsQueryOptions() {
  return {
    queryKey: queryKeys.posts.popular(),
    queryFn: () => getPopularPosts(),
  };
}

export function recentPostsQueryOptions() {
  return {
    queryKey: queryKeys.posts.recent(),
    queryFn: () => getRecentPosts(),
  };
}

export function postBySlugQueryOptions(slug: string) {
  return {
    queryKey: queryKeys.posts.detail(slug),
    queryFn: () => getPostBySlug(slug),
  };
}

export function postSeoQueryOptions(slug: string) {
  return {
    queryKey: queryKeys.posts.seo(slug),
    queryFn: () => getPostSeo(slug),
  };
}

export function relatedPostsQueryOptions(
  currentSlug: string,
  categorySlug: string,
  limit = 3,
) {
  return {
    queryKey: queryKeys.posts.related(currentSlug, categorySlug, limit),
    queryFn: () => getRelatedPosts(currentSlug, categorySlug, limit),
  };
}

export function categoriesQueryOptions() {
  return {
    queryKey: queryKeys.categories.all,
    queryFn: () => getCategories(),
  };
}

export function categoryPostsQueryOptions(
  slug: string,
  params?: { page?: number; limit?: number },
) {
  return {
    queryKey: queryKeys.categories.posts(slug, params?.page, params?.limit),
    queryFn: () => getCategoryPosts(slug, params),
  };
}

export function tagsQueryOptions() {
  return {
    queryKey: queryKeys.tags.all,
    queryFn: () => getTags(),
  };
}

export function publicProductsQueryOptions(params?: {
  category?: string;
  sort?: "discount" | "price_asc" | "price_desc";
}) {
  return {
    queryKey: queryKeys.products.public(params),
    queryFn: () => getPublicProducts(params),
  };
}

export function productByIdQueryOptions(id: number) {
  return {
    queryKey: queryKeys.products.detail(id),
    queryFn: () => getProductById(id),
  };
}

export function hubsQueryOptions() {
  return {
    queryKey: queryKeys.hubs.all,
    queryFn: () => getHubs(),
  };
}

export function hubBySlugQueryOptions(slug: string) {
  return {
    queryKey: queryKeys.hubs.detail(slug),
    queryFn: () => getHubBySlug(slug),
  };
}

export function authMeQueryOptions(token: string | null) {
  return {
    queryKey: queryKeys.auth.me(token),
    queryFn: () => {
      if (!token) throw new Error("Token ausente");
      return getMe(token);
    },
    enabled: Boolean(token),
  };
}

export function adminUsersQueryOptions(token: string | null) {
  return {
    queryKey: queryKeys.users.admin(token),
    queryFn: () => {
      if (!token) throw new Error("Token ausente");
      return getUsers(token);
    },
    enabled: Boolean(token),
  };
}

export function adminProductsQueryOptions(token: string | null) {
  return {
    queryKey: queryKeys.products.admin(token),
    queryFn: () => {
      if (!token) throw new Error("Token ausente");
      return getProducts(token);
    },
    enabled: Boolean(token),
  };
}
