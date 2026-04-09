import type { Product } from "@/data/products";

export const WORKERS_API_BASE = process.env.NEXT_PUBLIC_WORKERS_API?.trim() ?? "";

export function hasWorkersApi() {
  return WORKERS_API_BASE.length > 0;
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const data = (await response.json()) as T & { error?: string };

  if (!response.ok) {
    const message =
      typeof data === "object" && data && "error" in data && typeof data.error === "string"
        ? data.error
        : `API request failed: ${response.status}`;
    throw new Error(message);
  }

  return data;
}

async function fetchWorkersJson<T>(path: string, init?: RequestInit): Promise<T> {
  if (!WORKERS_API_BASE) {
    throw new Error("Workers API is not configured");
  }

  const response = await fetch(`${WORKERS_API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  return parseJsonResponse<T>(response);
}

export interface SharedReview {
  id: string;
  productId: string;
  productTitle: string;
  productImageUrl: string;
  productAffiliateUrl: string;
  rating: number;
  title: string;
  body: string;
  tags: string[];
  createdAt: string;
  helpfulCount: number;
  helpfulByMe: boolean;
  isOwn: boolean;
}

export interface SharedReviewListResponse {
  reviews: SharedReview[];
  total: number | null;
  page: number;
  pageSize: number;
  hasMore: boolean;
  source: "remote";
}

export interface SharedReviewCreateInput {
  productId: string;
  productTitle: string;
  productImageUrl?: string;
  productAffiliateUrl?: string;
  rating: number;
  title: string;
  body: string;
  tags: string[];
}

export interface SharedReviewCreateResponse {
  ok: true;
  review: SharedReview;
}

export interface SharedReviewHelpfulResponse {
  ok: true;
  reviewId: string;
  helpful: boolean;
  helpfulCount: number;
}

export interface SharedReviewDeleteResponse {
  ok: true;
  deleted: boolean;
}

export interface ContactSubmissionInput {
  name?: string;
  email?: string;
  subject: string;
  message: string;
}

export interface ContactSubmissionResponse {
  ok: true;
  id: string;
  createdAt: string;
}

export interface WorkersSearchParams {
  keyword?: string;
  genre?: string | null;
  sort?: "popular" | "price-asc" | "price-desc" | "rating" | "new";
  page?: number;
  pageSize?: number;
  saleOnly?: boolean;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  minReviewCount?: number;
}

export interface WorkersSearchResponse {
  items: Product[];
  total: number | null;
  page: number;
  pageSize: number;
  hasMore: boolean;
  scannedCount: number;
  source: "remote";
}

export async function fetchSharedReviews(options: {
  query?: string;
  ratingMin?: number;
  page?: number;
  pageSize?: number;
  signal?: AbortSignal;
}) {
  const params = new URLSearchParams();

  if (options.query?.trim()) {
    params.set("query", options.query.trim());
  }
  if (options.ratingMin && options.ratingMin > 0) {
    params.set("rating_min", String(options.ratingMin));
  }
  if (options.page && options.page > 1) {
    params.set("page", String(options.page));
  }
  if (options.pageSize && options.pageSize > 0) {
    params.set("page_size", String(options.pageSize));
  }

  const queryString = params.toString();
  return fetchWorkersJson<SharedReviewListResponse>(`/api/reviews${queryString ? `?${queryString}` : ""}`, {
    signal: options.signal,
  });
}

export async function createSharedReview(payload: SharedReviewCreateInput) {
  return fetchWorkersJson<SharedReviewCreateResponse>("/api/reviews", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function toggleSharedReviewHelpful(reviewId: string) {
  return fetchWorkersJson<SharedReviewHelpfulResponse>("/api/reviews/helpful", {
    method: "POST",
    body: JSON.stringify({ review_id: reviewId }),
  });
}

export async function deleteSharedReview(reviewId: string) {
  return fetchWorkersJson<SharedReviewDeleteResponse>("/api/reviews/delete", {
    method: "POST",
    body: JSON.stringify({ review_id: reviewId }),
  });
}

export async function createContactSubmission(payload: ContactSubmissionInput) {
  return fetchWorkersJson<ContactSubmissionResponse>("/api/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function searchWorkersCatalog(options: WorkersSearchParams & { signal?: AbortSignal }) {
  const params = new URLSearchParams();

  if (options.keyword?.trim()) {
    params.set("keyword", options.keyword.trim());
  }
  if (options.genre?.trim()) {
    params.set("genre", options.genre.trim());
  }
  if (options.sort) {
    params.set("sort", options.sort);
  }
  if (options.page && options.page > 1) {
    params.set("page", String(options.page));
  }
  if (options.pageSize && options.pageSize > 0) {
    params.set("page_size", String(options.pageSize));
  }
  if (options.saleOnly) {
    params.set("sale_only", "1");
  }
  if (typeof options.minPrice === "number" && options.minPrice > 0) {
    params.set("min_price", String(Math.max(0, Math.floor(options.minPrice))));
  }
  if (typeof options.maxPrice === "number" && Number.isFinite(options.maxPrice)) {
    params.set("max_price", String(Math.max(0, Math.floor(options.maxPrice))));
  }
  if (typeof options.minRating === "number" && options.minRating > 0) {
    params.set("min_rating", String(options.minRating));
  }
  if (typeof options.minReviewCount === "number" && options.minReviewCount > 0) {
    params.set("min_review_count", String(Math.floor(options.minReviewCount)));
  }

  return fetchWorkersJson<WorkersSearchResponse>(`/api/search?${params.toString()}`, {
    signal: options.signal,
  });
}
