import type { Product } from "@/data/products";
import { getReviewByProductId } from "@/data/reviews";
import type { ActressRankingEntry } from "@/lib/actress-ranking";
import { buildMakerCandidates, buildSeriesCandidates } from "@/lib/entity-ranking";
import { getActressRoute, getGenreRoute, getReviewRoute } from "@/lib/site";

type DiscoveryItem = {
  label: string;
  href: string;
  meta: string;
};

type DiscoveryGroup = {
  title: string;
  items: DiscoveryItem[];
};

function normalizeEntityLabel(value: string | undefined): string | null {
  const normalized = (value ?? "").replace(/\s+/g, " ").trim();
  return normalized.length > 0 ? normalized : null;
}

function getEntityHref(product: Product): string {
  const review = getReviewByProductId(product.id);

  if (review) {
    return getReviewRoute(review.slug);
  }

  if (product.affiliateUrl.trim()) {
    return product.affiliateUrl;
  }

  return getGenreRoute(product.genre);
}

function findRepresentativeProduct(
  products: Product[],
  key: "maker" | "label",
  candidateName: string
): Product | null {
  const normalizedName = normalizeEntityLabel(candidateName);

  if (!normalizedName) {
    return null;
  }

  const matched = products.filter((product) =>
    normalizeEntityLabel(key === "maker" ? product.maker : product.label) === normalizedName
  );

  if (!matched.length) {
    return null;
  }

  return [...matched].sort((left, right) => {
    if (right.reviewCount !== left.reviewCount) {
      return right.reviewCount - left.reviewCount;
    }

    if (right.rating !== left.rating) {
      return right.rating - left.rating;
    }

    return left.title.localeCompare(right.title, "ja");
  })[0];
}

function buildActressItems(entries: ActressRankingEntry[], limit: number): DiscoveryItem[] {
  return entries.slice(0, limit).map((entry) => ({
    label: entry.name,
    href: getActressRoute(entry.name),
    meta: `${entry.appearanceCount}作品`,
  }));
}

function buildEntityItems(
  products: Product[],
  key: "maker" | "label",
  limit: number
): DiscoveryItem[] {
  const candidates =
    key === "maker" ? buildMakerCandidates(products, limit) : buildSeriesCandidates(products, limit);

  return candidates.flatMap((candidate) => {
    const representative = findRepresentativeProduct(products, key, candidate.name);

    if (!representative) {
      return [];
    }

    return [
      {
        label: candidate.name,
        href: getEntityHref(representative),
        meta: `${candidate.productCount}作品`,
      },
    ];
  });
}

export default function EntityDiscoveryBand({
  title,
  description,
  products,
  topActresses,
  compact = false,
}: {
  title: string;
  description?: string;
  products: Product[];
  topActresses: ActressRankingEntry[];
  compact?: boolean;
}) {
  const groups: DiscoveryGroup[] = [
    { title: "人気女優", items: buildActressItems(topActresses, 4) },
    { title: "メーカー", items: buildEntityItems(products, "maker", 4) },
    { title: "レーベル", items: buildEntityItems(products, "label", 4) },
  ].filter((group) => group.items.length > 0);

  if (!groups.length) {
    return null;
  }

  return (
    <section className={compact ? "editorial-surface p-4 md:p-5" : "editorial-surface p-5 md:p-6"}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="section-eyebrow">作品を発見</p>
          <h2 className="mt-1.5 text-[1.35rem] font-semibold leading-tight text-[var(--color-text-primary)] md:text-[1.55rem]">
            {title}
          </h2>
          {description ? (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-text-secondary)]">
              {description}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        {groups.map((group) => (
          <article
            key={group.title}
            className="rounded-[22px] border border-[var(--color-border)] bg-[rgba(255,255,255,0.03)] p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{group.title}</h3>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-[var(--color-text-muted)]">
                {group.items.length}件
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <a
                  key={`${group.title}-${item.label}`}
                  href={item.href}
                  className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-border-strong)] hover:text-white"
                >
                  <span className="block max-w-[8rem] truncate">{item.label}</span>
                  <span className="block text-[10px] text-[var(--color-text-muted)]">{item.meta}</span>
                </a>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
