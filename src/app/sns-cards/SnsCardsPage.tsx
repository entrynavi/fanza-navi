"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaShareAlt,
  FaPalette,
  FaStar,
  FaCheck,
  FaSearch,
  FaStarHalfAlt,
  FaRegStar,
  FaFire,
  FaBolt,
  FaGem,
  FaThumbsUp,
} from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumb";
import ProductPoolToolbar from "@/components/ProductPoolToolbar";
import ShareMenu from "@/components/ShareMenu";
import { useFavorites } from "@/hooks/useFavorites";
import { ROUTES } from "@/lib/site";
import type { Product } from "@/data/products";
import {
  filterProductPool,
  getProductPoolOptions,
  type ProductPoolSource,
} from "@/lib/product-pool";
import { getRarity } from "@/lib/share-utils";

/* ------------------------------------------------------------------ */
/*  Card Templates                                                     */
/* ------------------------------------------------------------------ */

interface CardTemplate {
  id: string;
  label: string;
  color: string;
  bgGradient: string;
  accentColor: string;
  icon: React.ReactNode;
}

const TEMPLATES: CardTemplate[] = [
  {
    id: "recommend",
    label: "おすすめ",
    color: "#e53e3e",
    bgGradient: "linear-gradient(135deg, #1a0a0a 0%, #2d1111 50%, #1a0a0a 100%)",
    accentColor: "#e53e3e",
    icon: <FaFire />,
  },
  {
    id: "sale",
    label: "セール",
    color: "#d3af6f",
    bgGradient: "linear-gradient(135deg, #1a1508 0%, #2d2511 50%, #1a1508 100%)",
    accentColor: "#d3af6f",
    icon: <FaBolt />,
  },
  {
    id: "new",
    label: "新作",
    color: "#3182ce",
    bgGradient: "linear-gradient(135deg, #0a0f1a 0%, #111d2d 50%, #0a0f1a 100%)",
    accentColor: "#3182ce",
    icon: <FaGem />,
  },
  {
    id: "review",
    label: "レビュー",
    color: "#38a169",
    bgGradient: "linear-gradient(135deg, #0a1a0f 0%, #112d18 50%, #0a1a0f 100%)",
    accentColor: "#38a169",
    icon: <FaThumbsUp />,
  },
];

/* ------------------------------------------------------------------ */
/*  Rating Stars                                                       */
/* ------------------------------------------------------------------ */

function RatingStars({ rating, color }: { rating: number; color: string }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<FaStar key={i} size={12} style={{ color }} />);
    } else if (rating >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} size={12} style={{ color }} />);
    } else {
      stars.push(<FaRegStar key={i} size={12} style={{ color, opacity: 0.3 }} />);
    }
  }
  return <div className="flex items-center gap-0.5">{stars}</div>;
}

/* ------------------------------------------------------------------ */
/*  Card Preview Component                                             */
/* ------------------------------------------------------------------ */

function CardPreview({
  product,
  template,
}: {
  product: Product;
  template: CardTemplate;
}) {
  const displayPrice = product.salePrice ?? product.price;
  const hasDiscount = product.salePrice != null && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;
  const rarity = getRarity(product.rating);

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-white/10 p-5"
      style={{ background: template.bgGradient, width: "100%", maxWidth: 420 }}
    >
      {/* Template + Rarity badges */}
      <div className="mb-3 flex items-center gap-2">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-white"
          style={{ background: template.accentColor }}
        >
          {template.icon}
          {template.label}
        </span>
        {product.rating > 0 && (
          <span
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black text-white"
            style={{ background: `${rarity.color}cc` }}
          >
            {rarity.emoji} {rarity.short}
          </span>
        )}
      </div>

      <div className="flex gap-4">
        {/* Thumbnail */}
        {product.imageUrl && (
          <div className="shrink-0 overflow-hidden rounded-lg" style={{ width: 90, height: 128 }}>
            <img
              src={product.imageUrl}
              alt=""
              className="h-full w-full object-cover"
              crossOrigin="anonymous"
            />
          </div>
        )}

        {/* Info */}
        <div className="min-w-0 flex-1">
          <h3 className="mb-2 line-clamp-2 text-sm font-bold text-white leading-snug">
            {product.title}
          </h3>

          {/* Rating */}
          {product.rating > 0 && (
            <div className="mb-2 flex items-center gap-2">
              <RatingStars rating={product.rating} color={template.accentColor} />
              <span className="text-xs text-white/60">{product.rating.toFixed(1)}</span>
            </div>
          )}

          {/* Price */}
          <div className="mb-2">
            {hasDiscount && (
              <span className="mr-2 text-xs text-white/40 line-through">
                ¥{product.price.toLocaleString()}
              </span>
            )}
            <span className="text-lg font-extrabold" style={{ color: template.accentColor }}>
              ¥{displayPrice.toLocaleString()}~
            </span>
            {hasDiscount && (
              <span
                className="ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                style={{ background: template.accentColor }}
              >
                {discountPercent}%OFF
              </span>
            )}
          </div>

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border px-2 py-0.5 text-[10px] text-white/60"
                  style={{ borderColor: `${template.accentColor}33` }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Branding */}
      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
        <span className="text-[10px] font-bold text-white/40">FANZAトクナビ</span>
        <span className="text-[10px] text-white/30">tokunavi.fanza</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

interface Props {
  products: Product[];
}

export default function SnsCardsPage({ products }: Props) {
  const { ids } = useFavorites();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<CardTemplate>(TEMPLATES[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [source, setSource] = useState<ProductPoolSource>("all");

  const sourceOptions = useMemo(
    () => getProductPoolOptions(products, ids),
    [ids, products]
  );
  const sourceProducts = useMemo(
    () =>
      filterProductPool(products, {
        source,
        query: searchQuery,
        favoriteIds: ids,
      }),
    [ids, products, searchQuery, source]
  );

  const filteredProducts = useMemo(() => {
    return sourceProducts;
  }, [sourceProducts]);

  useEffect(() => {
    if (!filteredProducts.some((product) => product.id === selectedProduct?.id)) {
      setSelectedProduct(filteredProducts[0] ?? null);
    }
  }, [filteredProducts, selectedProduct?.id]);

  const handleCopyText = useCallback(() => {
    if (!selectedProduct) return;
    const displayPrice = selectedProduct.salePrice ?? selectedProduct.price;
    const text = `${selectedProduct.title}\n¥${displayPrice.toLocaleString()}~\n${selectedProduct.affiliateUrl}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [selectedProduct]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Breadcrumb items={[{ label: "SNS共有カード生成" }]} />

      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
        <h1 className="mb-3 text-3xl font-extrabold md:text-4xl">
          <FaShareAlt className="mr-2 inline-block text-[var(--color-primary)]" />
          <span className="gradient-text">SNS共有カード生成</span>
        </h1>
        <p className="mx-auto max-w-2xl text-sm text-[var(--color-text-secondary)]">
          お気に入りの作品をSNS映えするカードに変換。テンプレートを選んでワンクリックでシェアできます。
        </p>
      </motion.div>

      <ProductPoolToolbar
        query={searchQuery}
        onQueryChange={setSearchQuery}
        source={source}
        onSourceChange={setSource}
        options={sourceOptions}
        placeholder="作品名・女優名・シリーズでカード化する作品を探す"
        summary={
          source === "favorites"
            ? "ウォッチリストだけでSNSカードを作れます。推したい候補だけを高速で回せます。"
            : `カード化できる候補は ${filteredProducts.length} 件。セール中や高評価に切り替えて投稿ネタを作りやすくしています。`
        }
      />

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left: Product selection */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          {/* Search */}
          <div className="glass-card mb-4 p-4">
            <div className="flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2">
              <FaSearch size={12} className="text-[var(--color-text-muted)]" />
              <input
                type="text"
                placeholder="作品を検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]"
              />
            </div>
          </div>

          {/* Product list */}
          <div className="glass-card max-h-[480px] overflow-y-auto p-4">
            <h2 className="mb-3 text-sm font-bold text-[var(--color-text-secondary)]">
              作品を選択 ({filteredProducts.length}件)
            </h2>
            <div className="space-y-2">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
                    selectedProduct?.id === product.id
                      ? "border-[var(--color-primary)] bg-[var(--color-surface-highlight)]"
                      : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-strong)]"
                  }`}
                >
                  {product.imageUrl && (
                    <img src={product.imageUrl} alt="" className="h-14 w-10 shrink-0 rounded-md object-cover" loading="lazy" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="line-clamp-1 text-xs font-bold text-[var(--color-text-primary)]">
                      {product.title}
                    </div>
                    <div className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                      ¥{(product.salePrice ?? product.price).toLocaleString()}~
                      {product.isSale && (
                        <span className="ml-1 text-[var(--color-primary-light)]">セール中</span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right: Card preview & controls */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
          {/* Template selector */}
          <div className="glass-card mb-4 p-4">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-[var(--color-text-secondary)]">
              <FaPalette size={12} />
              テンプレート選択
            </h2>
            <div className="grid grid-cols-4 gap-2">
              {TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl)}
                  className={`flex flex-col items-center gap-1 rounded-xl border p-3 text-center transition-colors ${
                    selectedTemplate.id === tpl.id
                      ? "border-[var(--color-primary)] bg-[var(--color-surface-highlight)]"
                      : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-strong)]"
                  }`}
                >
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full text-sm text-white"
                    style={{ background: tpl.color }}
                  >
                    {tpl.icon}
                  </span>
                  <span className="text-[10px] font-medium text-[var(--color-text-secondary)]">
                    {tpl.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Card preview */}
          <div className="glass-card mb-4 p-6">
            <h2 className="mb-4 text-sm font-bold text-[var(--color-text-secondary)]">プレビュー</h2>
            {selectedProduct ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedProduct.id}-${selectedTemplate.id}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="flex justify-center"
                >
                  <CardPreview product={selectedProduct} template={selectedTemplate} />
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)] py-16 text-center">
                <FaShareAlt className="mb-3 text-3xl text-[var(--color-text-muted)]" />
                <p className="text-sm text-[var(--color-text-muted)]">
                  左のリストから作品を選択してください
                </p>
              </div>
            )}
          </div>

          {/* Share buttons */}
          {selectedProduct && (
            <div className="mt-4">
              <ShareMenu
                product={selectedProduct}
                context="recommend"
                variant="full"
                siteUrl={typeof window !== "undefined" ? window.location.origin + "/sns-cards" : ""}
              />
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
