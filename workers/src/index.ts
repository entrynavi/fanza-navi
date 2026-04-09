export interface Env {
  DB: D1Database;
  DMM_API_ID: string;
  DMM_AFFILIATE_ID: string;
  CORS_ORIGIN: string;
  SITE_URL: string;
  X_BEARER_TOKEN?: string;
  VAPID_PUBLIC_KEY?: string;
  VAPID_PRIVATE_KEY?: string;
}

interface DmmItem {
  content_id?: string;
  title?: string;
  URL?: string;
  affiliateURL?: string;
  imageURL?: {
    list?: string;
    small?: string;
    large?: string;
  };
  prices?: {
    price?: string;
    deliveries?: Array<{ type?: string; price?: string }>;
  };
  date?: string;
  review?: {
    count?: number | string;
    average?: number | string;
  };
  iteminfo?: {
    genre?: Array<{ id?: number | string; name?: string }>;
    maker?: Array<{ id?: number | string; name?: string }>;
    actress?: Array<{ id?: number | string; name?: string }>;
    label?: Array<{ id?: number | string; name?: string }>;
    series?: Array<{ id?: number | string; name?: string }>;
  };
}

type SearchSort = "popular" | "price-asc" | "price-desc" | "rating" | "new";

const DMM_API_BASE = "https://api.dmm.com/affiliate/v3/ItemList";
const CANONICAL_GENRE_ALIASES: Record<string, string> = {
  popular: "popular",
  "人気": "popular",
  "人気作品": "popular",
  "動画": "popular",
  "new-release": "new-release",
  newrelease: "new-release",
  "新作": "new-release",
  sale: "sale",
  "セール": "sale",
  "high-rated": "high-rated",
  highrated: "high-rated",
  "高評価": "high-rated",
  amateur: "amateur",
  "素人": "amateur",
  vr: "vr",
  "VR": "vr",
  mature: "mature",
  "熟女": "mature",
  "熟女・人妻": "mature",
  busty: "busty",
  "巨乳": "busty",
  "爆乳": "busty",
  planning: "planning",
  "企画": "planning",
  "企画もの": "planning",
  drama: "drama",
  "ドラマ": "drama",
  cosplay: "cosplay",
  "コスプレ": "cosplay",
  idol: "idol",
  "アイドル": "idol",
  "アイドル・芸能人": "idol",
};

function json(data: unknown, corsHeaders: Record<string, string>, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function clampInt(value: number, min: number, max: number, fallback: number) {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, Math.floor(value)));
}

function cleanText(value: unknown, maxLength: number) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function cleanMultilineText(value: unknown, maxLength: number) {
  return String(value ?? "")
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n")
    .slice(0, maxLength);
}

function normalizeImageUrl(url?: string): string {
  const value = url?.trim();

  if (!value) {
    return "";
  }

  if (value.startsWith("//")) {
    return `https:${value}`;
  }

  return value.replace(/^http:\/\//i, "https://");
}

function mapGenreLabelToKey(label?: string): string {
  const normalized = label?.trim() ?? "";

  if (!normalized) {
    return "popular";
  }

  return (
    CANONICAL_GENRE_ALIASES[normalized] ||
    CANONICAL_GENRE_ALIASES[normalized.toLowerCase()] ||
    normalized
  );
}

function parsePrice(prices: Record<string, unknown> | undefined): number {
  if (!prices) return 0;
  if (typeof prices.price === "string") {
    return parseInt(prices.price.replace(/[^0-9]/g, ""), 10) || 0;
  }
  const deliveries = prices.deliveries as Array<{ price?: string }> | undefined;
  if (deliveries?.[0]?.price) {
    return parseInt(deliveries[0].price.replace(/[^0-9]/g, ""), 10) || 0;
  }
  return 0;
}

function parseSalePrice(item: Record<string, unknown>): number | null {
  const title = item.title as string | undefined;
  const match = title?.match(/(\d+)%\s*OFF/i);
  if (match) {
    const pct = parseInt(match[1], 10);
    const price = parsePrice(item.prices as Record<string, unknown> | undefined);
    if (price > 0) return Math.round(price * (1 - pct / 100));
  }
  return null;
}

function extractDiscount(title: string): number {
  const match = title?.match(/(\d+)%\s*OFF/i);
  return match ? parseInt(match[1], 10) : 0;
}

function isNewRelease(dateStr?: string): boolean {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  return diff < 7 * 24 * 60 * 60 * 1000;
}

function parseTags(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .filter((entry): entry is string => typeof entry === "string")
        .map((entry) => cleanText(entry, 24))
        .filter(Boolean)
    )
  ).slice(0, 4);
}

async function hashString(str: string): Promise<string> {
  const encoded = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 16);
}

async function getRequesterHash(request: Request) {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const ua = request.headers.get("User-Agent") || "unknown";
  return hashString(`${ip}:${ua}`);
}

function toSearchProduct(item: DmmItem, rank?: number) {
  const rawPrice = parsePrice(item.prices as Record<string, unknown> | undefined);
  const genres = item.iteminfo?.genre?.map((genre) => genre.name || "").filter(Boolean) || [];
  const genreKey = mapGenreLabelToKey(genres[0]);
  const rating = Number(item.review?.average ?? 0) || 0;
  const reviewCount = Number(item.review?.count ?? 0) || 0;
  const actresses = item.iteminfo?.actress?.map((entry) => entry.name || "").filter(Boolean) || [];
  const maker = item.iteminfo?.maker?.[0]?.name || "";
  const label = item.iteminfo?.label?.[0]?.name || "";
  const series = item.iteminfo?.series?.[0]?.name || label;
  const discount = extractDiscount(item.title || "");
  const isSale = discount > 0;

  let price = rawPrice;
  let salePrice: number | undefined;

  if (discount > 0 && rawPrice > 0) {
    salePrice = rawPrice;
    price = Math.round(rawPrice / (1 - discount / 100));
  }

  return {
    id: item.content_id || "",
    title: item.title || "",
    description: genres.join(" / ") || "FANZA作品",
    imageUrl: normalizeImageUrl(item.imageURL?.large || item.imageURL?.small || item.imageURL?.list),
    affiliateUrl: cleanText(item.affiliateURL || item.URL || "", 500),
    price,
    salePrice,
    rating,
    reviewCount,
    genre: genreKey,
    tags: genres.slice(0, 4),
    maker,
    label,
    series,
    actresses,
    rank,
    isNew: isNewRelease(item.date),
    isSale,
    releaseDate: item.date || "",
  };
}

function mapSearchSortToDmm(sort: SearchSort) {
  switch (sort) {
    case "new":
      return "date";
    case "price-asc":
      return "price";
    case "price-desc":
      return "-price";
    case "rating":
      return "review";
    case "popular":
    default:
      return "rank";
  }
}

async function fetchDmmBatch(
  env: Env,
  options: {
    keyword?: string;
    genre?: string;
    sort: SearchSort;
    hits: number;
    offset: number;
  }
) {
  const params = new URLSearchParams({
    api_id: env.DMM_API_ID,
    affiliate_id: env.DMM_AFFILIATE_ID,
    site: "FANZA",
    service: "digital",
    floor: "videoa",
    output: "json",
    hits: String(options.hits),
    offset: String(options.offset),
    sort: mapSearchSortToDmm(options.sort),
  });

  if (options.keyword) {
    params.set("keyword", options.keyword);
  }

  if (options.genre) {
    params.set("article", "genre");
    params.set("article_id", options.genre);
  }

  const response = await fetch(`${DMM_API_BASE}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`DMM API error: ${response.status}`);
  }

  const data = (await response.json()) as {
    result?: {
      items?: DmmItem[];
      total_count?: number;
    };
  };

  return {
    items: data.result?.items ?? [],
    totalCount: typeof data.result?.total_count === "number" ? data.result.total_count : null,
  };
}

function matchesSearchFilters(
  product: ReturnType<typeof toSearchProduct>,
  filters: {
    genre?: string;
    saleOnly: boolean;
    minPrice: number;
    maxPrice: number | null;
    minRating: number;
    minReviewCount: number;
  }
) {
  const effectivePrice = product.salePrice ?? product.price;

  if (filters.genre && product.genre !== filters.genre) {
    return false;
  }
  if (filters.saleOnly && !product.isSale) {
    return false;
  }
  if (effectivePrice < filters.minPrice) {
    return false;
  }
  if (filters.maxPrice !== null && effectivePrice > filters.maxPrice) {
    return false;
  }
  if (product.rating < filters.minRating) {
    return false;
  }
  if (product.reviewCount < filters.minReviewCount) {
    return false;
  }

  return Boolean(product.id && product.title && product.affiliateUrl);
}

// ─── Price Tracker ──────────────────────────────────────────────────────────

async function recordPrices(env: Env) {
  const params = new URLSearchParams({
    api_id: env.DMM_API_ID,
    affiliate_id: env.DMM_AFFILIATE_ID,
    site: "FANZA",
    service: "digital",
    floor: "videoa",
    hits: "100",
    sort: "rank",
    output: "json",
  });

  const response = await fetch(`${DMM_API_BASE}?${params}`);
  const data = (await response.json()) as {
    result?: {
      items?: Array<Record<string, unknown>>;
    };
  };

  if (data?.result?.items) {
    const statement = env.DB.prepare(
      "INSERT OR IGNORE INTO price_history (content_id, title, price, sale_price, discount_pct, recorded_at) VALUES (?, ?, ?, ?, ?, ?)"
    );
    const now = new Date().toISOString().split("T")[0];
    const batch = data.result.items.map((item) => {
      const price = parsePrice(item.prices as Record<string, unknown> | undefined);
      const salePrice = parseSalePrice(item);
      const discountPct = salePrice ? Math.round((1 - salePrice / price) * 100) : 0;
      return statement.bind(
        item.content_id as string,
        item.title as string,
        price,
        salePrice,
        discountPct,
        now
      );
    });
    await env.DB.batch(batch);
  }
}

async function handlePriceHistory(url: URL, env: Env, headers: Record<string, string>) {
  const contentId = url.searchParams.get("content_id");
  if (!contentId) return json({ error: "content_id required" }, headers, 400);

  const history = await env.DB.prepare(
    "SELECT price, sale_price, discount_pct, recorded_at FROM price_history WHERE content_id = ? ORDER BY recorded_at ASC LIMIT 90"
  )
    .bind(contentId)
    .all();

  return json({ content_id: contentId, history: history.results }, headers);
}

// ─── Shared Reviews ─────────────────────────────────────────────────────────

function formatReviewRow(row: Record<string, unknown>) {
  return {
    id: String(row.id ?? ""),
    productId: String(row.product_id ?? ""),
    productTitle: String(row.product_title ?? ""),
    productImageUrl: String(row.product_image_url ?? ""),
    productAffiliateUrl: String(row.product_affiliate_url ?? ""),
    rating: Number(row.rating ?? 0) || 0,
    title: String(row.title ?? ""),
    body: String(row.body ?? ""),
    tags: parseTags(JSON.parse(String(row.tags ?? "[]"))),
    createdAt: String(row.created_at ?? ""),
    helpfulCount: Number(row.helpful_count ?? 0) || 0,
    helpfulByMe: Boolean(Number(row.helpful_by_me ?? 0)),
    isOwn: Boolean(Number(row.is_own ?? 0)),
  };
}

async function handleReviewList(request: Request, url: URL, env: Env, headers: Record<string, string>) {
  const viewerHash = await getRequesterHash(request);
  const query = cleanText(url.searchParams.get("query"), 80).toLowerCase();
  const ratingMin = clampInt(parseInt(url.searchParams.get("rating_min") || "0", 10), 0, 5, 0);
  const page = clampInt(parseInt(url.searchParams.get("page") || "1", 10), 1, 50, 1);
  const pageSize = clampInt(parseInt(url.searchParams.get("page_size") || "12", 10), 6, 24, 12);
  const offset = (page - 1) * pageSize;
  const likeQuery = `%${query}%`;

  const whereClause = query
    ? "WHERE r.rating >= ? AND (lower(r.title) LIKE ? OR lower(r.body) LIKE ? OR lower(r.product_title) LIKE ? OR lower(r.tags) LIKE ?)"
    : "WHERE r.rating >= ?";
  const whereBindings = query
    ? [ratingMin, likeQuery, likeQuery, likeQuery, likeQuery]
    : [ratingMin];

  const totalRow = await env.DB.prepare(
    `SELECT COUNT(*) AS total
     FROM reviews r
     ${whereClause}`
  )
    .bind(...whereBindings)
    .first<Record<string, unknown>>();

  const rows = await env.DB.prepare(
    `SELECT
        r.id,
        r.product_id,
        r.product_title,
        r.product_image_url,
        r.product_affiliate_url,
        r.rating,
        r.title,
        r.body,
        r.tags,
        r.created_at,
        (SELECT COUNT(*) FROM review_helpful_votes hv WHERE hv.review_id = r.id) AS helpful_count,
        EXISTS(SELECT 1 FROM review_helpful_votes hv WHERE hv.review_id = r.id AND hv.voter_hash = ?) AS helpful_by_me,
        CASE WHEN r.author_hash = ? THEN 1 ELSE 0 END AS is_own
      FROM reviews r
      ${whereClause}
      ORDER BY datetime(r.created_at) DESC
      LIMIT ? OFFSET ?`
  )
    .bind(viewerHash, viewerHash, ...whereBindings, pageSize, offset)
    .all<Record<string, unknown>>();

  const total = Number(totalRow?.total ?? 0) || 0;

  return json(
    {
      reviews: rows.results.map(formatReviewRow),
      total,
      page,
      pageSize,
      hasMore: offset + rows.results.length < total,
      source: "remote",
    },
    headers
  );
}

async function handleReviewCreate(request: Request, env: Env, headers: Record<string, string>) {
  const body = (await request.json()) as Record<string, unknown>;
  const productId = cleanText(body.productId, 64);
  const productTitle = cleanText(body.productTitle, 140);
  const productImageUrl = normalizeImageUrl(cleanText(body.productImageUrl, 500));
  const productAffiliateUrl = cleanText(body.productAffiliateUrl, 500);
  const rating = clampInt(Number(body.rating), 1, 5, 0);
  const title = cleanText(body.title, 60);
  const reviewBody = cleanMultilineText(body.body, 800);
  const tags = parseTags(body.tags);

  if (!productId || !productTitle || !title || !reviewBody || rating < 1) {
    return json({ error: "invalid review payload" }, headers, 400);
  }

  const id = crypto.randomUUID();
  const authorHash = await getRequesterHash(request);
  const createdAt = new Date().toISOString();

  await env.DB.prepare(
    `INSERT INTO reviews (
      id, product_id, product_title, product_image_url, product_affiliate_url,
      rating, title, body, tags, author_hash, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      id,
      productId,
      productTitle,
      productImageUrl,
      productAffiliateUrl,
      rating,
      title,
      reviewBody,
      JSON.stringify(tags),
      authorHash,
      createdAt
    )
    .run();

  return json(
    {
      ok: true,
      review: {
        id,
        productId,
        productTitle,
        productImageUrl,
        productAffiliateUrl,
        rating,
        title,
        body: reviewBody,
        tags,
        createdAt,
        helpfulCount: 0,
        helpfulByMe: false,
        isOwn: true,
      },
    },
    headers
  );
}

async function handleReviewHelpful(request: Request, env: Env, headers: Record<string, string>) {
  const body = (await request.json()) as Record<string, unknown>;
  const reviewId = cleanText(body.review_id, 64);

  if (!reviewId) {
    return json({ error: "review_id required" }, headers, 400);
  }

  const voterHash = await getRequesterHash(request);
  const existing = await env.DB.prepare(
    "SELECT id FROM review_helpful_votes WHERE review_id = ? AND voter_hash = ?"
  )
    .bind(reviewId, voterHash)
    .first();

  let helpful = false;

  if (existing) {
    await env.DB.prepare("DELETE FROM review_helpful_votes WHERE review_id = ? AND voter_hash = ?")
      .bind(reviewId, voterHash)
      .run();
  } else {
    await env.DB.prepare("INSERT INTO review_helpful_votes (review_id, voter_hash) VALUES (?, ?)")
      .bind(reviewId, voterHash)
      .run();
    helpful = true;
  }

  const countRow = await env.DB.prepare(
    "SELECT COUNT(*) AS total FROM review_helpful_votes WHERE review_id = ?"
  )
    .bind(reviewId)
    .first<Record<string, unknown>>();

  return json(
    {
      ok: true,
      reviewId,
      helpful,
      helpfulCount: Number(countRow?.total ?? 0) || 0,
    },
    headers
  );
}

async function handleReviewDelete(request: Request, env: Env, headers: Record<string, string>) {
  const body = (await request.json()) as Record<string, unknown>;
  const reviewId = cleanText(body.review_id, 64);

  if (!reviewId) {
    return json({ error: "review_id required" }, headers, 400);
  }

  const authorHash = await getRequesterHash(request);
  const ownReview = await env.DB.prepare(
    "SELECT id FROM reviews WHERE id = ? AND author_hash = ?"
  )
    .bind(reviewId, authorHash)
    .first();

  if (!ownReview) {
    return json({ ok: true, deleted: false }, headers);
  }

  await env.DB.prepare("DELETE FROM review_helpful_votes WHERE review_id = ?")
    .bind(reviewId)
    .run();
  await env.DB.prepare("DELETE FROM reviews WHERE id = ? AND author_hash = ?")
    .bind(reviewId, authorHash)
    .run();

  return json({ ok: true, deleted: true }, headers);
}

// ─── Contact Form ────────────────────────────────────────────────────────────

async function handleContactCreate(request: Request, env: Env, headers: Record<string, string>) {
  const body = (await request.json()) as Record<string, unknown>;
  const name = cleanText(body.name, 80);
  const email = cleanText(body.email, 160).toLowerCase();
  const subject = cleanText(body.subject, 120);
  const message = cleanMultilineText(body.message, 4000);

  if (!subject || !message) {
    return json({ error: "subject and message are required" }, headers, 400);
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "invalid email address" }, headers, 400);
  }

  const id = crypto.randomUUID();
  const requesterHash = await getRequesterHash(request);
  const createdAt = new Date().toISOString();

  await env.DB.prepare(
    `INSERT INTO contact_messages (
      id, name, email, subject, message, requester_hash, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, 'new', ?)`
  )
    .bind(id, name, email, subject, message, requesterHash, createdAt)
    .run();

  return json({ ok: true, id, createdAt }, headers);
}

// ─── Catalog Search ─────────────────────────────────────────────────────────

async function handleCatalogSearch(url: URL, env: Env, headers: Record<string, string>) {
  if (!env.DMM_API_ID || !env.DMM_AFFILIATE_ID) {
    return json({ error: "search api credentials missing" }, headers, 503);
  }

  const keyword = cleanText(url.searchParams.get("keyword"), 120);
  const genre = cleanText(url.searchParams.get("genre"), 48);
  const sort = (url.searchParams.get("sort") as SearchSort | null) || "popular";
  const page = clampInt(parseInt(url.searchParams.get("page") || "1", 10), 1, 40, 1);
  const pageSize = clampInt(parseInt(url.searchParams.get("page_size") || "24", 10), 12, 36, 24);
  const saleOnly = url.searchParams.get("sale_only") === "1";
  const minPrice = clampInt(parseInt(url.searchParams.get("min_price") || "0", 10), 0, 100000, 0);
  const maxPriceValue = parseInt(url.searchParams.get("max_price") || "", 10);
  const maxPrice =
    Number.isFinite(maxPriceValue) && maxPriceValue > 0
      ? clampInt(maxPriceValue, 1, 100000, 100000)
      : null;
  const minRating = Math.min(Math.max(Number(url.searchParams.get("min_rating") || "0") || 0, 0), 5);
  const minReviewCount = clampInt(
    parseInt(url.searchParams.get("min_review_count") || "0", 10),
    0,
    50000,
    0
  );

  const hasPostFilters =
    saleOnly || minPrice > 0 || maxPrice !== null || minRating > 0 || minReviewCount > 0;

  const filters = {
    genre: genre || undefined,
    saleOnly,
    minPrice,
    maxPrice,
    minRating,
    minReviewCount,
  };

  const requiredCount = page * pageSize;
  const seenIds = new Set<string>();
  const collected: Array<ReturnType<typeof toSearchProduct>> = [];
  const batchSize = 100;
  const maxBatches = keyword ? 8 : 12;
  let offset = 1;
  let scannedCount = 0;
  let totalCount: number | null = null;
  let exhausted = false;

  for (let batchIndex = 0; batchIndex < maxBatches; batchIndex += 1) {
    const batch = await fetchDmmBatch(env, {
      keyword: keyword || undefined,
      genre: genre || undefined,
      sort,
      hits: batchSize,
      offset,
    });

    totalCount = batch.totalCount;
    scannedCount += batch.items.length;

    if (batch.items.length === 0) {
      exhausted = true;
      break;
    }

    batch.items.forEach((item, itemIndex) => {
      const product = toSearchProduct(item, offset + itemIndex);

      if (!product.id || seenIds.has(product.id)) {
        return;
      }
      if (!matchesSearchFilters(product, filters)) {
        return;
      }

      seenIds.add(product.id);
      collected.push(product);
    });

    if (collected.length >= requiredCount + pageSize) {
      break;
    }
    if (batch.items.length < batchSize) {
      exhausted = true;
      break;
    }
    if (typeof totalCount === "number" && offset + batchSize > totalCount) {
      exhausted = true;
      break;
    }

    offset += batchSize;
  }

  const start = (page - 1) * pageSize;
  const items = collected.slice(start, start + pageSize);

  return json(
    {
      items,
      total: hasPostFilters ? null : totalCount,
      page,
      pageSize,
      hasMore: !exhausted || collected.length > start + pageSize,
      scannedCount,
      source: "remote",
    },
    headers
  );
}

// ─── Sale Alert Bot ─────────────────────────────────────────────────────────

async function postTweet(env: Env, text: string) {
  await fetch("https://api.twitter.com/2/tweets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.X_BEARER_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
}

function formatTweet(item: Record<string, unknown>): string {
  const discount = extractDiscount(item.title as string);
  const cleanTitle = (item.title as string).replace(/【.*?】/g, "").trim().slice(0, 60);
  return `🔥 ${discount}%OFF セール中！\n\n${cleanTitle}\n\n👉 ${item.affiliateURL as string}\n\n#FANZA #セール #FANZAトクナビ`;
}

async function checkSaleAlerts(env: Env) {
  if (!env.X_BEARER_TOKEN) return;

  const params = new URLSearchParams({
    api_id: env.DMM_API_ID,
    affiliate_id: env.DMM_AFFILIATE_ID,
    site: "FANZA",
    service: "digital",
    floor: "videoa",
    hits: "50",
    sort: "rank",
    keyword: "セール",
    output: "json",
  });

  const response = await fetch(`${DMM_API_BASE}?${params}`);
  const data = (await response.json()) as {
    result?: {
      items?: Array<Record<string, unknown>>;
    };
  };

  if (!data?.result?.items) return;

  const today = new Date().toISOString().split("T")[0];
  const topDeals = data.result.items
    .filter((item) => extractDiscount(item.title as string) >= 30)
    .slice(0, 5);

  for (const item of topDeals) {
    const existing = await env.DB.prepare(
      "SELECT id FROM sale_alerts WHERE content_id = ? AND alerted_at = ?"
    )
      .bind(item.content_id as string, today)
      .first();

    if (!existing) {
      await env.DB.prepare(
        "INSERT OR IGNORE INTO sale_alerts (content_id, title, discount_pct, alerted_at) VALUES (?, ?, ?, ?)"
      )
        .bind(
          item.content_id as string,
          item.title as string,
          extractDiscount(item.title as string),
          today
        )
        .run();

      if (env.X_BEARER_TOKEN) {
        await postTweet(env, formatTweet(item));
      }
    }
  }
}

// ─── Push Notification Subscribe ────────────────────────────────────────────

interface PushSubscribeBody {
  subscription: {
    endpoint: string;
    keys: { p256dh: string; auth: string };
  };
  favorites?: string[];
}

async function handlePushSubscribe(request: Request, env: Env, headers: Record<string, string>) {
  const body = (await request.json()) as PushSubscribeBody;

  await env.DB.prepare(
    "INSERT OR REPLACE INTO push_subscriptions (endpoint, p256dh, auth, favorites) VALUES (?, ?, ?, ?)"
  )
    .bind(
      body.subscription.endpoint,
      body.subscription.keys.p256dh,
      body.subscription.keys.auth,
      JSON.stringify(body.favorites || [])
    )
    .run();

  return json({ ok: true }, headers);
}

// ─── Voting System ──────────────────────────────────────────────────────────

interface VoteBody {
  content_id: string;
  title: string;
  image_url?: string;
}

async function handleVote(request: Request, env: Env, headers: Record<string, string>) {
  const body = (await request.json()) as VoteBody;
  const voterHash = await getRequesterHash(request);

  try {
    await env.DB.prepare(
      "INSERT INTO votes (content_id, title, image_url, voter_hash) VALUES (?, ?, ?, ?)"
    )
      .bind(body.content_id, body.title, body.image_url || "", voterHash)
      .run();
    return json({ ok: true, voted: true }, headers);
  } catch {
    return json({ ok: true, voted: false, message: "Already voted" }, headers);
  }
}

async function handleVoteRanking(url: URL, env: Env, headers: Record<string, string>) {
  const period = url.searchParams.get("period") || "month";
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "20", 10), 50);

  let dateFilter = "";
  if (period === "week") {
    dateFilter = "AND voted_at >= date('now', '-7 days')";
  } else if (period === "month") {
    dateFilter = "AND voted_at >= date('now', '-30 days')";
  }

  const ranking = await env.DB.prepare(
    `SELECT content_id, title, image_url, COUNT(*) as vote_count
     FROM votes
     WHERE 1=1 ${dateFilter}
     GROUP BY content_id
     ORDER BY vote_count DESC
     LIMIT ?`
  )
    .bind(limit)
    .all();

  return json({ period, ranking: ranking.results }, headers);
}

// ─── Worker Entry Point ─────────────────────────────────────────────────────

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const corsHeaders: Record<string, string> = {
      "Access-Control-Allow-Origin": env.CORS_ORIGIN || "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      if (url.pathname === "/api/price-history" && request.method === "GET") {
        return handlePriceHistory(url, env, corsHeaders);
      }
      if (url.pathname === "/api/search" && request.method === "GET") {
        return handleCatalogSearch(url, env, corsHeaders);
      }
      if (url.pathname === "/api/reviews" && request.method === "GET") {
        return handleReviewList(request, url, env, corsHeaders);
      }
      if (url.pathname === "/api/reviews" && request.method === "POST") {
        return handleReviewCreate(request, env, corsHeaders);
      }
      if (url.pathname === "/api/reviews/helpful" && request.method === "POST") {
        return handleReviewHelpful(request, env, corsHeaders);
      }
      if (url.pathname === "/api/reviews/delete" && request.method === "POST") {
        return handleReviewDelete(request, env, corsHeaders);
      }
      if (url.pathname === "/api/contact" && request.method === "POST") {
        return handleContactCreate(request, env, corsHeaders);
      }
      if (url.pathname === "/api/push/subscribe" && request.method === "POST") {
        return handlePushSubscribe(request, env, corsHeaders);
      }
      if (url.pathname === "/api/vote" && request.method === "POST") {
        return handleVote(request, env, corsHeaders);
      }
      if (url.pathname === "/api/vote/ranking" && request.method === "GET") {
        return handleVoteRanking(url, env, corsHeaders);
      }
      if (url.pathname === "/api/health") {
        return json({ status: "ok", timestamp: new Date().toISOString() }, corsHeaders);
      }

      return new Response("Not Found", { status: 404, headers: corsHeaders });
    } catch (error) {
      console.error("[worker] request failed", error);
      return json({ error: "Internal Server Error" }, corsHeaders, 500);
    }
  },

  async scheduled(_event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(Promise.all([recordPrices(env), checkSaleAlerts(env)]));
  },
};
