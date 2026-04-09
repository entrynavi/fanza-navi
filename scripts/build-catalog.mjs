#!/usr/bin/env node
/**
 * build-catalog.mjs — ビルド時に FANZA GraphQL から全カタログを取得し、
 * 静的 JSON シャードとして public/catalog/ に保存する。
 * Workers リクエストを消費せずにフロントエンドから直接読める。
 *
 * Usage:  node scripts/build-catalog.mjs [--target 100000] [--concurrency 8]
 */

import { writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const EP = "https://api.video.dmm.co.jp/graphql";
const MAX_OFFSET = 50000;
const BATCH_SIZE = 120;
const SHARD_SIZE = 500;

const QUERY = `query W($limit:Int!,$offset:Int!,$sort:ContentSearchPPVSort!,$queryWord:String,$filter:ContentSearchPPVFilterInput){
  legacySearchPPV(limit:$limit,offset:$offset,floor:AV,sort:$sort,queryWord:$queryWord,filter:$filter,facetLimit:1,includeExplicit:true,excludeUndelivered:false){
    result{
      contents{
        id title
        packageImage{mediumUrl largeUrl}
        review{average count}
        salesInfo{
          lowestPrice{productId price discountPrice legacyProductType}
          campaign{name endAt}
          pointRewardCampaign{name}
          hasMultiplePrices
        }
        isOnSale deliveryStartAt contentType
        actresses{id name}
        maker{id name}
      }
      pageInfo{offset limit hasNext totalCount}
    }
  }
}`;

// ── helpers ───────────────────────────────────────────────────────
function normalizeImageUrl(url) {
  if (!url) return "";
  try {
    const parsed = new URL(url.startsWith("//") ? `https:${url}` : url);
    if (parsed.hostname === "awsimgsrc.dmm.co.jp" && parsed.pathname.startsWith("/pics_dig/")) {
      return `https://pics.dmm.co.jp${parsed.pathname.replace(/^\/pics_dig/, "")}${parsed.search}`;
    }
    return parsed.toString().replace(/^http:\/\//i, "https://");
  } catch {
    return url.startsWith("//") ? `https:${url}` : url;
  }
}

function isNewRelease(dateStr) {
  if (!dateStr) return false;
  return Date.now() - new Date(dateStr).getTime() < 7 * 86400000;
}

function inferGenre(title, contentType, isSale, isNew, rating, reviewCount) {
  if (contentType === "VR" || /\bVR\b/i.test(title)) return "vr";
  if (/素人/u.test(title)) return "amateur";
  if (/熟女|人妻/u.test(title)) return "mature";
  if (/巨乳|爆乳|[GHIJKLＭN]カップ/u.test(title)) return "busty";
  if (/コスプレ|制服|ランジェリー/u.test(title)) return "cosplay";
  if (/アイドル|芸能人|グラビア/u.test(title)) return "idol";
  if (/企画|モニタリング|検証|ナンパ|ドキュメント/u.test(title)) return "planning";
  if (/ドラマ|寝取られ|NTR|物語|義母|純愛/u.test(title)) return "drama";
  if (isNew) return "new-release";
  if (isSale) return "sale";
  if (rating >= 4.5 && reviewCount >= 20) return "high-rated";
  return "popular";
}

function buildTags(title, contentType, maker, actresses, isSale, isNew, rating, reviewCount, campaignName) {
  const tags = [];
  const g = inferGenre(title, contentType, isSale, isNew, rating, reviewCount);
  const genreLabels = { vr: "VR", amateur: "素人", mature: "熟女", busty: "巨乳", cosplay: "コスプレ", idol: "アイドル", planning: "企画", drama: "ドラマ" };
  if (genreLabels[g]) tags.push(genreLabels[g]);
  if (isNew) tags.push("新作");
  if (isSale) tags.push("セール");
  if (rating >= 4.5 && reviewCount >= 20) tags.push("高評価");
  if (campaignName) tags.push(campaignName.slice(0, 24));
  if (actresses[0]) tags.push(actresses[0].slice(0, 24));
  if (maker) tags.push(maker.slice(0, 24));
  return [...new Set(tags.filter(Boolean))].slice(0, 4);
}

function mapProduct(item) {
  const actresses = (item.actresses || []).map(a => a.name).filter(Boolean);
  const maker = item.maker?.name || "";
  const pi = item.salesInfo?.lowestPrice;
  const basePrice = Number(pi?.price ?? 0) || 0;
  const discountPrice = Number(pi?.discountPrice ?? 0) || 0;
  const price = basePrice > 0 ? basePrice : discountPrice;
  const salePrice = discountPrice > 0 && discountPrice < basePrice ? discountPrice : undefined;
  const rating = Number(item.review?.average ?? 0) || 0;
  const reviewCount = Number(item.review?.count ?? 0) || 0;
  const isSale = Boolean(item.isOnSale || (discountPrice > 0 && discountPrice < basePrice));
  const releaseDate = item.deliveryStartAt || "";
  const isNew = isNewRelease(releaseDate);
  const title = (item.title || "").replace(/\s+/g, " ").trim().slice(0, 240);
  const genre = inferGenre(title, item.contentType, isSale, isNew, rating, reviewCount);
  const campaignName = item.salesInfo?.campaign?.name || item.salesInfo?.pointRewardCampaign?.name || "";
  const tags = buildTags(title, item.contentType, maker, actresses, isSale, isNew, rating, reviewCount, campaignName);
  const desc = [genre === "vr" ? "VR作品" : "", campaignName, maker, actresses[0] || ""].filter(Boolean).join(" / ");

  return {
    id: (item.id || "").trim(),
    title,
    description: desc || "FANZA作品",
    imageUrl: normalizeImageUrl(item.packageImage?.largeUrl || item.packageImage?.mediumUrl),
    price,
    salePrice,
    rating,
    reviewCount,
    genre,
    tags,
    maker,
    actresses,
    isNew,
    isSale,
    releaseDate,
  };
}

// ── fetch with retry ──────────────────────────────────────────────
async function fetchBatch(sort, offset, queryWord = null, filter = {}) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(EP, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: "https://video.dmm.co.jp",
          Referer: "https://video.dmm.co.jp/av/list/",
        },
        body: JSON.stringify({
          operationName: "W",
          query: QUERY,
          variables: {
            limit: BATCH_SIZE,
            offset: Math.min(offset, MAX_OFFSET),
            sort,
            queryWord,
            filter,
          },
        }),
      });
      const data = await res.json();
      if (data.errors?.length) throw new Error(data.errors[0].message);
      const result = data?.data?.legacySearchPPV?.result;
      return {
        items: result?.contents || [],
        totalCount: result?.pageInfo?.totalCount ?? 0,
        hasNext: Boolean(result?.pageInfo?.hasNext),
      };
    } catch (err) {
      if (attempt === 2) throw err;
      await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
}

// ── concurrent fetcher ────────────────────────────────────────────
async function fetchAll(sort, concurrency, seenIds, queryWord = null) {
  const products = [];
  let offset = 0;
  let totalCount = null;

  while (offset <= MAX_OFFSET) {
    const batchOffsets = [];
    for (let i = 0; i < concurrency && offset <= MAX_OFFSET; i++) {
      batchOffsets.push(offset);
      offset += BATCH_SIZE;
    }

    const results = await Promise.all(
      batchOffsets.map(o => fetchBatch(sort, o, queryWord).catch(() => ({ items: [], totalCount: 0, hasNext: false })))
    );

    let anyNew = false;
    for (const r of results) {
      if (totalCount === null && r.totalCount > 0) totalCount = r.totalCount;
      for (const item of r.items) {
        if (item.id && !seenIds.has(item.id)) {
          seenIds.add(item.id);
          products.push(mapProduct(item));
          anyNew = true;
        }
      }
    }

    const lastResult = results[results.length - 1];
    if (!lastResult.hasNext && !anyNew) break;
    if (offset > Math.min(totalCount || MAX_OFFSET, MAX_OFFSET)) break;

    // progress
    process.stdout.write(`\r  [${sort}${queryWord ? ` "${queryWord}"` : ""}] ${products.length} unique / offset ${offset}`);
  }

  process.stdout.write(`\r  [${sort}${queryWord ? ` "${queryWord}"` : ""}] ${products.length} unique — done\n`);
  return { products, totalCount };
}

// ── main ──────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const targetIdx = args.indexOf("--target");
const TARGET = targetIdx >= 0 ? parseInt(args[targetIdx + 1], 10) : 100000;
const concIdx = args.indexOf("--concurrency");
const CONCURRENCY = concIdx >= 0 ? parseInt(args[concIdx + 1], 10) : 8;

const OUT_DIR = join(process.cwd(), "public", "catalog");

console.log(`\n🔎 Fetching catalog (target: ${TARGET.toLocaleString()}, concurrency: ${CONCURRENCY})\n`);

const seenIds = new Set();
let allProducts = [];

// Phase 1: four sort orders
const sorts = ["SALES_RANK_SCORE", "DELIVERY_START_DATE", "REVIEW_RANK_SCORE", "LOWEST_PRICE"];
for (const sort of sorts) {
  const { products } = await fetchAll(sort, CONCURRENCY, seenIds);
  allProducts.push(...products);
  console.log(`  → cumulative unique: ${seenIds.size.toLocaleString()}`);
  if (seenIds.size >= TARGET) break;
}

// Phase 2: keyword segmentation if still under target
if (seenIds.size < TARGET) {
  const keywords = [
    "素人", "熟女", "巨乳", "VR", "企画", "ドラマ", "コスプレ", "アイドル",
    "NTR", "OL", "ナース", "メイド", "水着", "女子校生", "人妻",
    "痴女", "レズ", "中出し", "3P", "温泉", "マッサージ",
    "オナニー", "フェラ", "パイズリ", "潮吹き", "縛り", "調教",
    "スレンダー", "ロリ", "お姉さん", "ギャル", "黒人",
    "時間停止", "催眠", "逆ナン", "露出", "盗撮風",
  ];
  for (const kw of keywords) {
    if (seenIds.size >= TARGET) break;
    const { products } = await fetchAll("SALES_RANK_SCORE", CONCURRENCY, seenIds, kw);
    allProducts.push(...products);
    console.log(`  → cumulative unique: ${seenIds.size.toLocaleString()}`);
  }
}

console.log(`\n✅ Total unique products: ${allProducts.length.toLocaleString()}\n`);

// ── Write shards ──────────────────────────────────────────────────
rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });

// 1) All-products shards (popularity order for progressive search)
const allDir = join(OUT_DIR, "all");
mkdirSync(allDir, { recursive: true });

const allShards = [];
for (let i = 0; i < allProducts.length; i += SHARD_SIZE) {
  const shardIndex = Math.floor(i / SHARD_SIZE);
  const shardName = `${String(shardIndex).padStart(4, "0")}.json`;
  const chunk = allProducts.slice(i, i + SHARD_SIZE);
  writeFileSync(join(allDir, shardName), JSON.stringify(chunk));
  allShards.push({ name: shardName, count: chunk.length });
}

// 2) Per-genre shards (each genre gets its own shard set, sorted by original rank)
const genreProducts = {};
for (const p of allProducts) {
  const g = p.genre || "popular";
  if (!genreProducts[g]) genreProducts[g] = [];
  genreProducts[g].push(p);
}

// Also build a "popular" genre = top products by original fetch order
if (!genreProducts["popular"]) genreProducts["popular"] = [];
// Add all high-rated as well
if (!genreProducts["high-rated"]) genreProducts["high-rated"] = [];
for (const p of allProducts) {
  if (p.rating >= 4.5 && p.reviewCount >= 20 && genreProducts["high-rated"].length < 10000) {
    genreProducts["high-rated"].push(p);
  }
}
// popular = first 10k from allProducts (already sorted by popularity)
genreProducts["popular"] = allProducts.slice(0, 10000);

const genreShardCounts = {};
for (const [genre, products] of Object.entries(genreProducts)) {
  const gDir = join(OUT_DIR, "genre", genre);
  mkdirSync(gDir, { recursive: true });
  const shards = [];
  for (let i = 0; i < products.length; i += SHARD_SIZE) {
    const si = Math.floor(i / SHARD_SIZE);
    const name = `${String(si).padStart(4, "0")}.json`;
    const chunk = products.slice(i, i + SHARD_SIZE);
    writeFileSync(join(gDir, name), JSON.stringify(chunk));
    shards.push({ name, count: chunk.length });
  }
  genreShardCounts[genre] = { shardCount: shards.length, totalProducts: products.length };
}

// 3) Compact keyword index: actress/maker names → shard indices in all/
const nameToShards = {};
for (let si = 0; si < allShards.length; si++) {
  const chunk = allProducts.slice(si * SHARD_SIZE, (si + 1) * SHARD_SIZE);
  for (const p of chunk) {
    for (const a of p.actresses || []) {
      const key = a.trim();
      if (key.length >= 2) {
        if (!nameToShards[key]) nameToShards[key] = new Set();
        nameToShards[key].add(si);
      }
    }
    if (p.maker && p.maker.trim().length >= 2) {
      const key = p.maker.trim();
      if (!nameToShards[key]) nameToShards[key] = new Set();
      nameToShards[key].add(si);
    }
  }
}
// Serialize, skip names in >50% of shards (too common to be useful)
const maxHit = Math.ceil(allShards.length * 0.5);
const keywordIndex = {};
for (const [name, shardSet] of Object.entries(nameToShards)) {
  if (shardSet.size <= maxHit) {
    keywordIndex[name] = [...shardSet].sort((a, b) => a - b);
  }
}
writeFileSync(join(OUT_DIR, "keyword-index.json"), JSON.stringify(keywordIndex));

// 4) Write manifest
const genres = Object.keys(genreShardCounts).sort();
const manifest = {
  version: 2,
  generatedAt: new Date().toISOString(),
  totalProducts: allProducts.length,
  shardSize: SHARD_SIZE,
  allShardCount: allShards.length,
  genres,
  genreStats: genreShardCounts,
  keywordEntries: Object.keys(keywordIndex).length,
};
writeFileSync(join(OUT_DIR, "manifest.json"), JSON.stringify(manifest, null, 2));

const totalGenreProducts = Object.values(genreShardCounts).reduce((s, g) => s + g.totalProducts, 0);
console.log(`📦 Written ${allShards.length} all-shards + ${Object.keys(genreShardCounts).length} genre sets`);
console.log(`📋 Manifest: ${manifest.totalProducts.toLocaleString()} products, ${genres.length} genres (${totalGenreProducts.toLocaleString()} genre entries)`);
console.log(`🔍 Keyword index: ${Object.keys(keywordIndex).length.toLocaleString()} entries`);
for (const [g, stats] of Object.entries(genreShardCounts)) {
  console.log(`   ${g}: ${stats.totalProducts.toLocaleString()} products, ${stats.shardCount} shards`);
}
console.log();
