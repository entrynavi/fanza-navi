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

// ─── Helpers ────────────────────────────────────────────────────────────────

function json(data: unknown, corsHeaders: Record<string, string>, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
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

async function hashString(str: string): Promise<string> {
  const encoded = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 16);
}

// ─── Price Tracker ──────────────────────────────────────────────────────────

async function recordPrices(env: Env) {
  const apiBase = "https://api.dmm.com/affiliate/v3/ItemList";
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

  const res = await fetch(`${apiBase}?${params}`);
  const data = (await res.json()) as {
    result?: {
      items?: Array<Record<string, unknown>>;
    };
  };

  if (data?.result?.items) {
    const stmt = env.DB.prepare(
      "INSERT OR IGNORE INTO price_history (content_id, title, price, sale_price, discount_pct, recorded_at) VALUES (?, ?, ?, ?, ?, ?)",
    );
    const now = new Date().toISOString().split("T")[0];
    const batch = data.result.items.map((item) => {
      const price = parsePrice(item.prices as Record<string, unknown> | undefined);
      const salePrice = parseSalePrice(item);
      const discountPct = salePrice ? Math.round((1 - salePrice / price) * 100) : 0;
      return stmt.bind(item.content_id as string, item.title as string, price, salePrice, discountPct, now);
    });
    await env.DB.batch(batch);
  }
}

async function handlePriceHistory(url: URL, env: Env, headers: Record<string, string>) {
  const contentId = url.searchParams.get("content_id");
  if (!contentId) return json({ error: "content_id required" }, headers, 400);

  const history = await env.DB.prepare(
    "SELECT price, sale_price, discount_pct, recorded_at FROM price_history WHERE content_id = ? ORDER BY recorded_at ASC LIMIT 90",
  )
    .bind(contentId)
    .all();

  return json({ content_id: contentId, history: history.results }, headers);
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
  return `🔥 ${discount}%OFF セール中！\n\n${cleanTitle}\n\n👉 ${item.affiliateURL as string}\n\n#FANZA #セール #FANZAオトナビ`;
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

  const res = await fetch(`https://api.dmm.com/affiliate/v3/ItemList?${params}`);
  const data = (await res.json()) as {
    result?: {
      items?: Array<Record<string, unknown>>;
    };
  };

  if (!data?.result?.items) return;

  const today = new Date().toISOString().split("T")[0];
  const topDeals = data.result.items
    .filter((item) => {
      const pct = extractDiscount(item.title as string);
      return pct >= 30;
    })
    .slice(0, 5);

  for (const item of topDeals) {
    const existing = await env.DB.prepare("SELECT id FROM sale_alerts WHERE content_id = ? AND alerted_at = ?")
      .bind(item.content_id as string, today)
      .first();

    if (!existing) {
      await env.DB.prepare(
        "INSERT OR IGNORE INTO sale_alerts (content_id, title, discount_pct, alerted_at) VALUES (?, ?, ?, ?)",
      )
        .bind(item.content_id as string, item.title as string, extractDiscount(item.title as string), today)
        .run();

      // Post to X when bearer token is configured
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

  await env.DB.prepare("INSERT OR REPLACE INTO push_subscriptions (endpoint, p256dh, auth, favorites) VALUES (?, ?, ?, ?)")
    .bind(body.subscription.endpoint, body.subscription.keys.p256dh, body.subscription.keys.auth, JSON.stringify(body.favorites || []))
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

  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const ua = request.headers.get("User-Agent") || "unknown";
  const voterHash = await hashString(`${ip}:${ua}`);

  try {
    await env.DB.prepare("INSERT INTO votes (content_id, title, image_url, voter_hash) VALUES (?, ?, ?, ?)")
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
     LIMIT ?`,
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
    } catch {
      return json({ error: "Internal Server Error" }, corsHeaders, 500);
    }
  },

  async scheduled(_event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(Promise.all([recordPrices(env), checkSaleAlerts(env)]));
  },
};
