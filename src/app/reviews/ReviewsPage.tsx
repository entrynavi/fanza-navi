"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FaArrowRight, FaPen, FaSearch, FaStar, FaThumbsUp, FaTrash, FaTimes } from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumb";
import PrimaryCta from "@/components/PrimaryCta";
import SectionIntro from "@/components/SectionIntro";
import type { Product } from "@/data/products";
import { ROUTES } from "@/lib/site";
import {
  createSharedReview,
  deleteSharedReview,
  fetchSharedReviews,
  hasWorkersApi,
  searchWorkersCatalog,
  toggleSharedReviewHelpful,
  type SharedReview,
} from "@/lib/workers-api";

const REVIEWS_KEY = "fanza-navi-reviews";
const HELPFUL_KEY = "fanza-navi-review-helpful";
const REVIEWS_EVENT = "fanza-navi:reviews-changed";
const PAGE_SIZE = 12;

interface LocalStoredReview {
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
}

const REVIEW_TAGS = [
  "ストーリー重視",
  "演技力",
  "コスパ良し",
  "画質が良い",
  "リピート確定",
  "初心者向け",
  "マニア向け",
  "VR映え",
  "長時間で満足",
  "シリーズ物",
  "期待以上",
  "セール推奨",
  "女優買い向け",
  "寝る前向け",
];

function normalizeLocalReview(review: Partial<LocalStoredReview>): LocalStoredReview | null {
  const id = String(review.id ?? "").trim();
  const productId = String(review.productId ?? "").trim();
  const productTitle = String(review.productTitle ?? "").trim();
  const title = String(review.title ?? "").trim();
  const body = String(review.body ?? "").trim();
  const createdAt = String(review.createdAt ?? "").trim();
  const rating = Number(review.rating ?? 0) || 0;

  if (!id || !productId || !productTitle || !title || !body || !createdAt || rating < 1 || rating > 5) {
    return null;
  }

  return {
    id,
    productId,
    productTitle,
    productImageUrl: String(review.productImageUrl ?? "").trim(),
    productAffiliateUrl: String(review.productAffiliateUrl ?? "").trim(),
    rating,
    title,
    body,
    tags: Array.isArray(review.tags)
      ? Array.from(
          new Set(
            review.tags
              .filter((tag): tag is string => typeof tag === "string")
              .map((tag) => tag.trim())
              .filter(Boolean)
          )
        ).slice(0, 4)
      : [],
    createdAt,
  };
}

function readLocalReviews() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const parsed = JSON.parse(localStorage.getItem(REVIEWS_KEY) ?? "[]");
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map(normalizeLocalReview)
      .filter((review): review is LocalStoredReview => review !== null)
      .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());
  } catch {
    return [];
  }
}

function writeLocalReviews(reviews: LocalStoredReview[]) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
  } catch {
    // Fall back to in-memory state only when storage is unavailable.
  }
  window.dispatchEvent(new Event(REVIEWS_EVENT));
}

function readLocalHelpfulIds() {
  if (typeof window === "undefined") {
    return new Set<string>();
  }

  try {
    const parsed = JSON.parse(localStorage.getItem(HELPFUL_KEY) ?? "[]");
    if (!Array.isArray(parsed)) {
      return new Set<string>();
    }

    return new Set(
      parsed
        .filter((value): value is string => typeof value === "string")
        .map((value) => value.trim())
        .filter(Boolean)
    );
  } catch {
    return new Set<string>();
  }
}

function writeLocalHelpfulIds(ids: Set<string>) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(HELPFUL_KEY, JSON.stringify(Array.from(ids)));
  } catch {
    // Keep the optimistic UI when storage is temporarily unavailable.
  }
  window.dispatchEvent(new Event(REVIEWS_EVENT));
}

function mapLocalReview(review: LocalStoredReview, helpfulIds: Set<string>): SharedReview {
  const helpfulByMe = helpfulIds.has(review.id);

  return {
    id: review.id,
    productId: review.productId,
    productTitle: review.productTitle,
    productImageUrl: review.productImageUrl,
    productAffiliateUrl: review.productAffiliateUrl,
    rating: review.rating,
    title: review.title,
    body: review.body,
    tags: review.tags,
    createdAt: review.createdAt,
    helpfulCount: helpfulByMe ? 1 : 0,
    helpfulByMe,
    isOwn: true,
  };
}

function StarInput({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={`text-xl transition-colors ${
            star <= value ? "text-[#d3af6f]" : "text-[var(--color-text-muted)]/30"
          }`}
        >
          <FaStar />
        </button>
      ))}
    </div>
  );
}

function StarDisplay({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          size={size}
          className={star <= rating ? "text-[#d3af6f]" : "text-[var(--color-text-muted)]/20"}
        />
      ))}
    </span>
  );
}

function ReviewProductThumb({
  imageUrl,
  title,
  compact = false,
}: {
  imageUrl?: string;
  title: string;
  compact?: boolean;
}) {
  const [imgError, setImgError] = useState(false);
  const showImage = Boolean(imageUrl) && !imgError;
  const sizeClass = compact ? "h-10 w-8 rounded-lg" : "h-14 w-11 rounded-xl";

  if (!showImage) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center bg-[linear-gradient(135deg,rgba(227,74,110,0.18),rgba(211,175,111,0.1))] ${sizeClass}`}
      >
        <span className="text-[10px] font-semibold text-[var(--color-text-muted)]">FANZA</span>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={title}
      className={`${sizeClass} shrink-0 object-cover`}
      onError={() => setImgError(true)}
      loading="lazy"
    />
  );
}

export default function ReviewsPage({ allProducts }: { allProducts: Product[] }) {
  const initialRemoteAvailability = hasWorkersApi();
  const [remoteEnabled, setRemoteEnabled] = useState(initialRemoteAvailability);
  const [localReviews, setLocalReviews] = useState<LocalStoredReview[]>([]);
  const [localHelpfulIds, setLocalHelpfulIds] = useState<Set<string>>(new Set());
  const [remoteReviews, setRemoteReviews] = useState<SharedReview[]>([]);
  const [loading, setLoading] = useState(initialRemoteAvailability);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRating, setFilterRating] = useState<number>(0);
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewTotal, setReviewTotal] = useState<number | null>(null);
  const [reviewHasMore, setReviewHasMore] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [remoteProductResults, setRemoteProductResults] = useState<Product[]>([]);
  const [productSearchLoading, setProductSearchLoading] = useState(false);

  useEffect(() => {
    if (remoteEnabled) {
      return;
    }

    const syncLocal = () => {
      setLocalReviews(readLocalReviews());
      setLocalHelpfulIds(readLocalHelpfulIds());
    };

    syncLocal();
    window.addEventListener("storage", syncLocal);
    window.addEventListener(REVIEWS_EVENT, syncLocal);

    return () => {
      window.removeEventListener("storage", syncLocal);
      window.removeEventListener(REVIEWS_EVENT, syncLocal);
    };
  }, [remoteEnabled]);

  useEffect(() => {
    if (!remoteEnabled) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setErrorMessage("");

    fetchSharedReviews({
      query: searchQuery,
      ratingMin: filterRating,
      page: reviewPage,
      pageSize: PAGE_SIZE,
      signal: controller.signal,
    })
      .then((response) => {
        setRemoteReviews(response.reviews);
        setReviewTotal(response.total);
        setReviewHasMore(response.hasMore);
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        console.error("[reviews] remote fetch failed", error);
        setRemoteEnabled(false);
        setErrorMessage("共有レビューAPIに接続できなかったため、このブラウザ保存モードに切り替えました。");
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [filterRating, remoteEnabled, reviewPage, searchQuery]);

  useEffect(() => {
    if (!productSearch.trim()) {
      setRemoteProductResults([]);
      setProductSearchLoading(false);
      return;
    }

    if (!remoteEnabled || productSearch.trim().length < 2) {
      setRemoteProductResults([]);
      setProductSearchLoading(false);
      return;
    }

    const controller = new AbortController();
    setProductSearchLoading(true);

    searchWorkersCatalog({
      keyword: productSearch,
      page: 1,
      pageSize: 8,
      signal: controller.signal,
    })
      .then((response) => {
        setRemoteProductResults(response.items);
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        console.error("[reviews] remote product search failed", error);
        setRemoteProductResults([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setProductSearchLoading(false);
        }
      });

    return () => controller.abort();
  }, [productSearch, remoteEnabled]);

  const filteredLocalProducts = useMemo(() => {
    if (!productSearch.trim() || (remoteEnabled && productSearch.trim().length >= 2)) {
      return [];
    }

    const query = productSearch.toLowerCase();
    return allProducts
      .filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          product.actresses?.some((actress) => actress.toLowerCase().includes(query)) ||
          product.maker?.toLowerCase().includes(query) ||
          product.series?.toLowerCase().includes(query)
      )
      .slice(0, 8);
  }, [allProducts, productSearch, remoteEnabled]);

  const productResults = remoteEnabled ? remoteProductResults : filteredLocalProducts;
  const localDisplayReviews = useMemo(
    () => localReviews.map((review) => mapLocalReview(review, localHelpfulIds)),
    [localHelpfulIds, localReviews]
  );

  const filteredLocalReviews = useMemo(() => {
    let filtered = [...localDisplayReviews];

    if (filterRating > 0) {
      filtered = filtered.filter((review) => review.rating >= filterRating);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (review) =>
          review.title.toLowerCase().includes(query) ||
          review.body.toLowerCase().includes(query) ||
          review.productTitle.toLowerCase().includes(query) ||
          review.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return filtered.sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());
  }, [filterRating, localDisplayReviews, searchQuery]);

  const displayedReviews = remoteEnabled
    ? remoteReviews
    : filteredLocalReviews.slice((reviewPage - 1) * PAGE_SIZE, reviewPage * PAGE_SIZE);

  const totalReviews = remoteEnabled ? reviewTotal ?? remoteReviews.length : filteredLocalReviews.length;
  const hasNextPage = remoteEnabled
    ? reviewHasMore
    : reviewPage * PAGE_SIZE < filteredLocalReviews.length;
  const hasPrevPage = reviewPage > 1;

  const resetForm = useCallback(() => {
    setSelectedProduct(null);
    setRating(0);
    setTitle("");
    setBody("");
    setSelectedTags([]);
    setProductSearch("");
    setRemoteProductResults([]);
    setShowForm(false);
  }, []);

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      if (!selectedProduct || rating === 0 || !title.trim() || !body.trim()) {
        return;
      }

      setSaving(true);
      setErrorMessage("");

      const basePayload = {
        productId: selectedProduct.id,
        productTitle: selectedProduct.title,
        productImageUrl: selectedProduct.imageUrl,
        productAffiliateUrl: selectedProduct.affiliateUrl,
        rating,
        title: title.trim(),
        body: body.trim(),
        tags: selectedTags,
      };

      if (remoteEnabled) {
        try {
          const response = await createSharedReview(basePayload);
          setReviewPage(1);
          setRemoteReviews((current) => [response.review, ...current].slice(0, PAGE_SIZE));
          setReviewTotal((current) => (typeof current === "number" ? current + 1 : current));
          resetForm();
          return;
        } catch (error) {
          console.error("[reviews] remote submit failed", error);
          setRemoteEnabled(false);
          setErrorMessage("共有投稿に失敗したため、このブラウザ保存モードで続行します。");
        }
      }

      const newReview: LocalStoredReview = {
        id: `r-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        createdAt: new Date().toISOString(),
        ...basePayload,
      };

      const current = readLocalReviews();
      const updated = [newReview, ...current];
      writeLocalReviews(updated);
      setLocalReviews(updated);
      setReviewPage(1);
      resetForm();
    },
    [body, rating, remoteEnabled, resetForm, selectedProduct, selectedTags, title]
  );

  const handleHelpfulToggle = useCallback(
    async (reviewId: string) => {
      if (remoteEnabled) {
        try {
          const result = await toggleSharedReviewHelpful(reviewId);
          setRemoteReviews((current) =>
            current.map((review) =>
              review.id === result.reviewId
                ? {
                    ...review,
                    helpfulByMe: result.helpful,
                    helpfulCount: result.helpfulCount,
                  }
                : review
            )
          );
          return;
        } catch (error) {
          console.error("[reviews] remote helpful toggle failed", error);
          setRemoteEnabled(false);
          setErrorMessage("共有APIの応答が止まったため、このブラウザ保存モードに切り替えました。");
        }
      }

      const next = new Set(readLocalHelpfulIds());
      if (next.has(reviewId)) {
        next.delete(reviewId);
      } else {
        next.add(reviewId);
      }
      writeLocalHelpfulIds(next);
      setLocalHelpfulIds(next);
    },
    [remoteEnabled]
  );

  const handleDeleteReview = useCallback(
    async (reviewId: string) => {
      if (remoteEnabled) {
        try {
          const result = await deleteSharedReview(reviewId);
          if (!result.deleted) {
            setErrorMessage("このレビューは投稿した本人のブラウザからのみ削除できます。");
            return;
          }

          setRemoteReviews((current) => current.filter((review) => review.id !== reviewId));
          setReviewTotal((current) => (typeof current === "number" ? Math.max(0, current - 1) : current));
          return;
        } catch (error) {
          console.error("[reviews] remote delete failed", error);
          setErrorMessage("レビューの削除に失敗しました。少し時間を置いて再度お試しください。");
          return;
        }
      }

      const updated = readLocalReviews().filter((review) => review.id !== reviewId);
      writeLocalReviews(updated);
      setLocalReviews(updated);
    },
    [remoteEnabled]
  );

  const toggleTag = (tag: string) => {
    setSelectedTags((current) =>
      current.includes(tag) ? current.filter((entry) => entry !== tag) : [...current, tag].slice(0, 4)
    );
  };

  const modeBadge = remoteEnabled ? "全ユーザー共有レビュー" : "このブラウザ保存レビュー";

  return (
    <main className="content-shell px-4 py-8">
      <Breadcrumb items={[{ label: "みんなのおすすめ作品レビュー" }]} />

      <section className="editorial-surface p-6 md:p-8">
        <SectionIntro
          eyebrow="ユーザー投稿"
          title="みんなのおすすめ作品レビュー"
          description="公式レビューだけでは分からない、ユーザー目線の感想を横断して見られます。Workers接続時は全ユーザー共有、未接続時もこのブラウザに保存して継続利用できます。"
        />
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--color-text-secondary)]">
          <span className="chip">{modeBadge}</span>
          <span className="chip">参考になった投票</span>
          <span className="chip">評価別フィルター</span>
        </div>
        {errorMessage ? (
          <p className="mt-3 rounded-2xl border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/6 px-4 py-3 text-xs leading-6 text-[var(--color-text-secondary)]">
            {errorMessage}
          </p>
        ) : null}
        <div className="mt-4">
          <button
            onClick={() => setShowForm((current) => !current)}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[var(--color-primary)]/20 transition-all hover:shadow-xl"
          >
            <FaPen size={12} />
            {showForm ? "フォームを閉じる" : "レビューを書く"}
          </button>
        </div>
      </section>

      {showForm ? (
        <section className="mt-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <h2 className="text-lg font-bold text-[var(--color-text-primary)]">レビュー投稿</h2>
          <form onSubmit={handleSubmit} className="mt-4 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--color-text-primary)]">作品を選択</label>
              {selectedProduct ? (
                <div className="flex items-center gap-3 rounded-[18px] border border-[var(--color-primary)]/25 bg-[var(--color-primary)]/5 p-3">
                  <ReviewProductThumb imageUrl={selectedProduct.imageUrl} title={selectedProduct.title} />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-semibold text-[var(--color-text-primary)]">
                      {selectedProduct.title}
                    </p>
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      {selectedProduct.actresses?.slice(0, 2).join(", ") || selectedProduct.maker || "FANZA作品"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(null)}
                    className="text-[var(--color-text-muted)]"
                  >
                    <FaTimes size={14} />
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5">
                    <FaSearch size={12} className="text-[var(--color-text-muted)]" />
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(event) => setProductSearch(event.target.value)}
                      placeholder={remoteEnabled ? "作品名・女優名・メーカーでFANZA全体から検索..." : "作品名・女優名で検索..."}
                      className="flex-1 bg-transparent text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]"
                    />
                  </div>
                  {productSearchLoading ? (
                    <p className="mt-2 text-xs text-[var(--color-text-muted)]">候補を検索中です…</p>
                  ) : null}
                  {productResults.length > 0 ? (
                    <div className="mt-2 max-h-60 overflow-y-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                      {productResults.map((product) => (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => {
                            setSelectedProduct(product);
                            setProductSearch("");
                            setRemoteProductResults([]);
                          }}
                          className="flex w-full items-center gap-3 border-b border-[var(--color-border)] px-4 py-2.5 text-left transition-colors hover:bg-white/5 last:border-0"
                        >
                          <ReviewProductThumb imageUrl={product.imageUrl} title={product.title} compact />
                          <div className="min-w-0">
                            <p className="line-clamp-1 text-xs font-semibold text-[var(--color-text-primary)]">
                              {product.title}
                            </p>
                            <p className="text-[10px] text-[var(--color-text-muted)]">
                              {product.actresses?.slice(0, 2).join(", ") || product.maker || "FANZA作品"}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--color-text-primary)]">評価</label>
              <StarInput value={rating} onChange={setRating} />
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[var(--color-text-primary)]">タイトル</span>
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="一言でまとめると..."
                maxLength={60}
                className="w-full rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-border-strong)]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[var(--color-text-primary)]">レビュー本文</span>
              <textarea
                value={body}
                onChange={(event) => setBody(event.target.value)}
                rows={5}
                placeholder="良かった点、気になった点、おすすめポイントなど..."
                className="w-full rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm leading-7 text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-border-strong)]"
              />
            </label>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--color-text-primary)]">タグ（最大4つ）</label>
              <div className="flex flex-wrap gap-2">
                {REVIEW_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      selectedTags.includes(tag)
                        ? "border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/15 text-[var(--color-accent)]"
                        : "border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)]"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={!selectedProduct || rating === 0 || !title.trim() || !body.trim() || saving}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] px-5 py-3.5 text-sm font-semibold text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaPen size={12} />
              {saving ? "投稿中..." : "レビューを投稿する"}
            </button>
          </form>
        </section>
      ) : null}

      <section className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2">
          <FaSearch size={12} className="text-[var(--color-text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setReviewPage(1);
            }}
            placeholder="レビュー・作品名・タグを検索..."
            className="flex-1 bg-transparent text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]"
          />
        </div>
        <div className="flex gap-1.5">
          {[0, 3, 4, 5].map((minimum) => (
            <button
              key={minimum}
              onClick={() => {
                setFilterRating(minimum);
                setReviewPage(1);
              }}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                filterRating === minimum
                  ? "border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/12 text-[var(--color-accent)]"
                  : "border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)]"
              }`}
            >
              {minimum === 0 ? "全て" : `${minimum}+`}
            </button>
          ))}
        </div>
      </section>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-[var(--color-text-muted)]">
        <span className="font-semibold text-[var(--color-text-primary)]">{totalReviews}</span>
        <span>件のレビュー</span>
        {searchQuery ? (
          <span>
            「<span className="text-[var(--color-accent)]">{searchQuery}</span>」の検索結果
          </span>
        ) : null}
      </div>

      <section className="mt-6 space-y-4">
        {loading ? (
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center text-sm text-[var(--color-text-secondary)]">
            レビューを読み込み中です…
          </div>
        ) : displayedReviews.length === 0 ? (
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center">
            <p className="text-[var(--color-text-secondary)]">
              {totalReviews === 0
                ? "まだレビューがありません。最初のレビューを投稿してみましょう！"
                : "条件に合うレビューが見つかりませんでした。"}
            </p>
          </div>
        ) : (
          displayedReviews.map((review) => (
            <article
              key={review.id}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-all hover:border-[var(--color-border-strong)]"
            >
              <a
                href={review.productAffiliateUrl || ROUTES.search}
                target={review.productAffiliateUrl ? "_blank" : undefined}
                rel={review.productAffiliateUrl ? "noopener noreferrer" : undefined}
                className="mb-4 flex items-center gap-3 rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-highlight)] p-3 transition-colors hover:border-[var(--color-border-strong)]"
              >
                <ReviewProductThumb imageUrl={review.productImageUrl} title={review.productTitle} />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-xs font-semibold text-[var(--color-text-primary)]">
                    {review.productTitle}
                  </p>
                  <p className="text-[10px] text-[var(--color-text-muted)]">{modeBadge}</p>
                </div>
                <span className="text-[10px] font-semibold text-[var(--color-primary-light)]">
                  FANZAで見る <FaArrowRight size={8} className="inline" />
                </span>
              </a>

              <div className="flex items-start justify-between gap-3">
                <div>
                  <StarDisplay rating={review.rating} />
                  <h3 className="mt-2 text-sm font-bold text-[var(--color-text-primary)]">{review.title}</h3>
                </div>
                {review.isOwn ? (
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="shrink-0 text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)]"
                    title="削除"
                  >
                    <FaTrash size={12} />
                  </button>
                ) : null}
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-[var(--color-text-secondary)]">
                {review.body}
              </p>

              {review.tags.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {review.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[var(--color-border)] px-2.5 py-1 text-[10px] font-medium text-[var(--color-text-secondary)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mt-3 flex items-center justify-between gap-3">
                <button
                  onClick={() => handleHelpfulToggle(review.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                    review.helpfulByMe
                      ? "border border-[var(--color-primary)]/25 bg-[var(--color-primary)]/10 text-[var(--color-accent)]"
                      : "border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)]"
                  }`}
                >
                  <FaThumbsUp size={10} />
                  {review.helpfulByMe ? "参考になった" : "参考になった？"}
                  <span className="opacity-70">{review.helpfulCount}</span>
                </button>
                <span className="text-[10px] text-[var(--color-text-muted)]">
                  {new Date(review.createdAt).toLocaleDateString("ja-JP")}
                </span>
              </div>
            </article>
          ))
        )}
      </section>

      {!loading && totalReviews > 0 ? (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setReviewPage((current) => Math.max(1, current - 1))}
            disabled={!hasPrevPage}
            className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm text-[var(--color-text-secondary)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            前へ
          </button>
          <span className="text-xs text-[var(--color-text-muted)]">
            {reviewPage} / {Math.max(1, Math.ceil(totalReviews / PAGE_SIZE))}
          </span>
          <button
            type="button"
            onClick={() => setReviewPage((current) => current + 1)}
            disabled={!hasNextPage}
            className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm text-[var(--color-text-secondary)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            次へ
          </button>
        </div>
      ) : null}

      <section className="mt-10 rounded-2xl border border-[var(--color-primary)]/20 bg-gradient-to-r from-[var(--color-primary)]/8 to-[var(--color-accent)]/5 p-6 text-center">
        <h2 className="text-lg font-bold text-[var(--color-text-primary)]">気になる作品のレビューを書いてみよう</h2>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          レビューを書いておくと、次に似た作品を探す時の判断材料としても使いやすくなります。
        </p>
        <div className="mt-4 flex justify-center gap-3">
          <PrimaryCta href={ROUTES.ranking} size="md">
            ランキングから選ぶ
          </PrimaryCta>
          <PrimaryCta href={ROUTES.search} size="md" variant="outline">
            FANZA全体から探す
          </PrimaryCta>
        </div>
      </section>
    </main>
  );
}
