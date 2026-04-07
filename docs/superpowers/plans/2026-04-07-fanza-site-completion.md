# FANZA Site Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the existing Next.js static-export FANZA affiliate site into a monetizable Cloudflare-ready build with working ranking, sale, genre, review, age-gate, and affiliate-link flows.

**Architecture:** Keep the existing Next.js static-export stack and current visual language, but add centralized affiliate/catalog/review data helpers, static genre/review routes, a client-side age gate, and conversion-first page rewrites. All product surfaces must render real clickable CTAs using API data when available and curated fallback data when not.

**Tech Stack:** Next.js static export, TypeScript, React 19, Tailwind CSS v4, Vitest, React Testing Library, Cloudflare Pages

---

## File Structure

- Modify: `package.json`
  Add typography support if needed for long-form review/article styling.
- Modify: `src/app/globals.css`
  Add prose styling hooks and any age-gate/homepage utility styles.
- Create: `src/lib/affiliate.ts`
  Centralize affiliate URL generation and fallback outbound links.
- Create: `src/lib/catalog.ts`
  Load ranking/sale/new/genre product sets from API or curated fallback data.
- Create: `src/data/reviews.ts`
  Store static review entries and lookup helpers for `/reviews/[slug]`.
- Modify: `src/data/products.ts`
  Expand curated fallback products so they have valid affiliate-ready outbound links and richer metadata.
- Modify: `src/lib/dmm-api.ts`
  Reuse current API client but align conversion helpers with shared affiliate/catalog logic where needed.
- Create: `src/components/AgeGate.tsx`
  Add client-side 18+ confirmation compatible with static export.
- Create: `src/components/ReviewCard.tsx`
  Reusable teaser card for review lists and homepage review modules.
- Create: `src/components/ProductGridSection.tsx`
  Shared wrapper for ranking/sale/new/genre product grids.
- Modify: `src/components/ProductCard.tsx`
  Ensure cards use real images when present and never emit dead CTA states for core monetized paths.
- Modify: `src/components/RelatedProducts.tsx`
  Replace dead sample-link behavior with curated valid related products.
- Modify: `src/components/HeroSection.tsx`
  Shift hero CTA emphasis toward ranking/sale/reviews instead of generic guides only.
- Modify: `src/components/StickyCTA.tsx`
  Point sticky CTA toward the highest-intent conversion route.
- Modify: `src/app/layout.tsx`
  Mount the age gate and keep PR disclosure intact.
- Modify: `src/app/page.tsx`
  Rebuild homepage modules around ranking preview, sale preview, genres, and featured reviews.
- Modify: `src/app/ranking/RankingPage.tsx`
  Implement monthly ranking with real product cards.
- Modify: `src/app/sale/SalePage.tsx`
  Implement real sale listings with real CTAs.
- Modify: `src/app/new/NewReleasesPage.tsx`
  Replace placeholder with real new-release grid.
- Modify: `src/app/search/SearchPage.tsx`
  Replace placeholder with static-export-safe curated discovery/search landing.
- Create: `src/app/genre/[slug]/page.tsx`
  Add static genre landing pages with metadata and product grids.
- Create: `src/app/reviews/[slug]/page.tsx`
  Add static review template with metadata, JSON-LD, product CTA, and related products.
- Modify: `src/app/articles/ArticlesPage.tsx`
  Add discovery links into the new review funnel where appropriate.
- Create: `src/__tests__/affiliate.test.ts`
  Cover affiliate helper behavior.
- Create: `src/__tests__/catalog.test.ts`
  Cover API/fallback catalog behavior.
- Create: `src/__tests__/reviews.test.ts`
  Cover review dataset integrity and static route assumptions.
- Create: `src/__tests__/age-gate.test.tsx`
  Cover first-visit gating and persistence.
- Modify: `src/__tests__/product-card.test.tsx`
  Align CTA expectations with the new conversion behavior.
- Modify: `src/__tests__/products.test.ts`
  Align curated product expectations with real affiliate-ready fallback data.
- Optional Modify: `README.md`
  Update deployment wording from GitHub-centric to GitLab + Cloudflare Pages if touched during implementation.

### Task 1: Add typography support and affiliate/review/genre data foundations

**Files:**
- Modify: `package.json`
- Modify: `src/app/globals.css`
- Create: `src/lib/affiliate.ts`
- Create: `src/data/reviews.ts`
- Modify: `src/data/products.ts`
- Create: `src/__tests__/affiliate.test.ts`
- Create: `src/__tests__/reviews.test.ts`
- Modify: `src/__tests__/products.test.ts`

- [ ] **Step 1: Write the failing tests for affiliate helpers and review data**

```ts
import { describe, expect, it, vi } from "vitest";
import { buildAffiliateFallbackUrl, resolveAffiliateUrl } from "@/lib/affiliate";
import { reviewEntries } from "@/data/reviews";

describe("affiliate helpers", () => {
  it("builds a fallback affiliate-aware outbound URL when env vars exist", () => {
    vi.stubEnv("DMM_AFFILIATE_ID", "algernon17-990");
    expect(buildAffiliateFallbackUrl("/digital/videoa/-/list/=/")).toContain("algernon17-990");
  });
});

describe("review data", () => {
  it("includes at least 3 statically generated review entries", () => {
    expect(reviewEntries.length).toBeGreaterThanOrEqual(3);
  });
});
```

- [ ] **Step 2: Run the focused tests to verify they fail**

Run: `npm test -- src/__tests__/affiliate.test.ts src/__tests__/reviews.test.ts`
Expected: FAIL because the helper and review data modules do not exist yet.

- [ ] **Step 3: Add minimal implementation**

```ts
// src/lib/affiliate.ts
export function resolveAffiliateUrl(primary?: string, fallbackPath = "/") {
  return primary || buildAffiliateFallbackUrl(fallbackPath);
}
```

Create review entries with slugs, titles, descriptions, ratings, body sections, and valid affiliate-aware fallback URLs.

Update curated fallback products so monetized surfaces have valid outbound URLs instead of empty strings.

- [ ] **Step 4: Add typography support**

Install and wire `@tailwindcss/typography`, then add `.prose` styling in `src/app/globals.css` so review/article bodies are readable without introducing a UI kit.

Run: `npm install @tailwindcss/typography`
Expected: dependency added to `package.json` and `package-lock.json`

- [ ] **Step 5: Run the focused tests to verify they pass**

Run: `npm test -- src/__tests__/affiliate.test.ts src/__tests__/reviews.test.ts src/__tests__/products.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json src/app/globals.css src/lib/affiliate.ts src/data/reviews.ts src/data/products.ts src/__tests__/affiliate.test.ts src/__tests__/reviews.test.ts src/__tests__/products.test.ts
git commit -m "feat: add affiliate helpers and review data foundations"
```

### Task 2: Add shared catalog loading and remove dead-link behavior

**Files:**
- Create: `src/lib/catalog.ts`
- Modify: `src/lib/dmm-api.ts`
- Modify: `src/components/ProductCard.tsx`
- Modify: `src/components/RelatedProducts.tsx`
- Create: `src/components/ProductGridSection.tsx`
- Create: `src/__tests__/catalog.test.ts`
- Modify: `src/__tests__/product-card.test.tsx`

- [ ] **Step 1: Write failing tests for catalog fallback behavior**

```ts
import { describe, expect, it, vi } from "vitest";
import { loadRankingProducts } from "@/lib/catalog";

describe("catalog loader", () => {
  it("falls back to curated products when API results are empty", async () => {
    vi.stubEnv("DMM_API_ID", "");
    const items = await loadRankingProducts();
    expect(items.length).toBeGreaterThan(0);
    expect(items.every((item) => item.affiliateUrl)).toBe(true);
  });
});
```

- [ ] **Step 2: Run the focused tests to verify they fail**

Run: `npm test -- src/__tests__/catalog.test.ts src/__tests__/product-card.test.tsx`
Expected: FAIL because the catalog module does not exist and product card expectations still assume "準備中".

- [ ] **Step 3: Implement minimal shared catalog loaders**

Create loaders such as:

```ts
export async function loadRankingProducts() {}
export async function loadSaleProducts() {}
export async function loadNewProducts() {}
export async function loadGenreProducts(slug: string) {}
export function loadRelatedProducts(productIds: string[]) {}
```

Rules:
- use API data first
- fall back to curated products
- always return affiliate-ready product records

- [ ] **Step 4: Remove dead CTA expectations**

Update `ProductCard` and `RelatedProducts` so core catalog surfaces do not render unusable outbound links. If a fallback URL exists, cards should render a real CTA.

- [ ] **Step 5: Run focused verification**

Run: `npm test -- src/__tests__/catalog.test.ts src/__tests__/product-card.test.tsx`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/lib/catalog.ts src/lib/dmm-api.ts src/components/ProductCard.tsx src/components/RelatedProducts.tsx src/components/ProductGridSection.tsx src/__tests__/catalog.test.ts src/__tests__/product-card.test.tsx
git commit -m "feat: add catalog loaders and fix dead product links"
```

### Task 3: Add the client-side 18+ gate

**Files:**
- Create: `src/components/AgeGate.tsx`
- Modify: `src/app/layout.tsx`
- Create: `src/__tests__/age-gate.test.tsx`

- [ ] **Step 1: Write the failing age-gate test**

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import AgeGate from "@/components/AgeGate";

it("blocks content until the user confirms they are 18+", () => {
  render(<AgeGate />);
  expect(screen.getByText(/18歳以上/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /18歳以上です/ }));
});
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm test -- src/__tests__/age-gate.test.tsx`
Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement the gate**

Requirements:
- use `localStorage`
- lock scroll while open
- provide an under-18 exit link
- preserve static export compatibility

- [ ] **Step 4: Mount the gate in layout**

Render it near the root so all routes are covered while keeping the existing PR disclosure visible beneath the gate once accepted.

- [ ] **Step 5: Run focused verification**

Run: `npm test -- src/__tests__/age-gate.test.tsx`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/AgeGate.tsx src/app/layout.tsx src/__tests__/age-gate.test.tsx
git commit -m "feat: add client-side age gate"
```

### Task 4: Build static genre and review route templates

**Files:**
- Create: `src/components/ReviewCard.tsx`
- Create: `src/app/genre/[slug]/page.tsx`
- Create: `src/app/reviews/[slug]/page.tsx`
- Modify: `src/lib/site.ts`
- Modify: `src/components/JsonLd.tsx` if route-specific helpers are needed
- Modify: `src/app/articles/ArticlesPage.tsx`
- Create: `src/__tests__/site-routes.test.ts`

- [ ] **Step 1: Write failing route/data tests**

```ts
import { describe, expect, it } from "vitest";
import { reviewEntries } from "@/data/reviews";

describe("static route data", () => {
  it("can statically generate genre and review slugs", () => {
    expect(reviewEntries.map((entry) => entry.slug)).toContain("fanza-vr-starter-pick");
  });
});
```

- [ ] **Step 2: Run the focused tests to verify they fail**

Run: `npm test -- src/__tests__/site-routes.test.ts`
Expected: FAIL until the new route helpers/pages exist.

- [ ] **Step 3: Implement genre pages**

Add `generateStaticParams`, `generateMetadata`, intro copy, and product grids for genre pages using shared catalog loaders.

- [ ] **Step 4: Implement review pages**

Add at least 3 review entries and one shared review template with:
- title
- image
- rating
- long-form body
- affiliate CTA
- related products
- metadata
- review/article JSON-LD if practical

- [ ] **Step 5: Add navigation into the review funnel**

Use `ReviewCard` teasers from existing article/discovery surfaces so users can reach `/reviews/[slug]`.

- [ ] **Step 6: Run focused verification**

Run: `npm test -- src/__tests__/reviews.test.ts src/__tests__/site-routes.test.ts`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/components/ReviewCard.tsx src/app/genre src/app/reviews src/lib/site.ts src/components/JsonLd.tsx src/app/articles/ArticlesPage.tsx src/__tests__/site-routes.test.ts
git commit -m "feat: add genre and review templates"
```

### Task 5: Replace placeholder ranking, sale, new, and search pages with real discovery pages

**Files:**
- Modify: `src/app/ranking/RankingPage.tsx`
- Modify: `src/app/sale/SalePage.tsx`
- Modify: `src/app/new/NewReleasesPage.tsx`
- Modify: `src/app/search/SearchPage.tsx`
- Modify: `src/app/ranking/page.tsx`
- Modify: `src/app/sale/page.tsx`
- Modify: `src/app/new/page.tsx`
- Modify: `src/app/search/page.tsx`

- [ ] **Step 1: Add failing assertions for the old placeholder copy**

Update route tests or component tests so they assert the new pages render real product sections instead of `準備中`.

```ts
expect(screen.queryByText(/準備中/)).not.toBeInTheDocument();
expect(screen.getByText(/人気ランキング/)).toBeInTheDocument();
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm test -- src/__tests__/site-routes.test.ts`
Expected: FAIL because placeholder pages still contain the old copy.

- [ ] **Step 3: Implement real route bodies**

Requirements:
- `/ranking` = monthly ranking page
- `/sale` = real sale listings
- `/new` = real new-release listings
- `/search` = curated discovery/search-entry route that still monetizes under static export

Each page should:
- show product cards
- link to related genres/reviews
- keep existing visual language

- [ ] **Step 4: Verify route metadata**

Update each route metadata description so it matches the new real page intent and improves CTR from search.

- [ ] **Step 5: Run focused verification**

Run: `npm test -- src/__tests__/site-routes.test.ts src/__tests__/catalog.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/app/ranking src/app/sale src/app/new src/app/search src/__tests__/site-routes.test.ts src/__tests__/catalog.test.ts
git commit -m "feat: replace placeholder discovery pages"
```

### Task 6: Rebuild the homepage into a conversion-first landing page

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/HeroSection.tsx`
- Modify: `src/components/StickyCTA.tsx`
- Modify: `src/components/SocialProof.tsx`
- Modify: `src/components/Footer.tsx` if cross-linking needs expansion

- [ ] **Step 1: Add a failing expectation for homepage conversion modules**

```ts
expect(screen.getByText(/月間ランキング/)).toBeInTheDocument();
expect(screen.getByText(/注目レビュー/)).toBeInTheDocument();
```

Add a homepage test if needed.

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm test -- src/__tests__/footer.test.tsx`
Expected: FAIL or remain insufficient until homepage-specific coverage exists.

- [ ] **Step 3: Implement homepage restructuring**

Order sections roughly as:
- hero
- monthly ranking preview
- sale preview
- genre shortcuts
- featured reviews
- supporting guides

Shift sticky CTA toward the best-performing route, likely monthly ranking or sale.

- [ ] **Step 4: Run focused verification**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx src/components/HeroSection.tsx src/components/StickyCTA.tsx src/components/SocialProof.tsx src/components/Footer.tsx src/__tests__
git commit -m "feat: rebuild homepage for conversion"
```

### Task 7: Final verification, deployment hygiene, and reporting prep

**Files:**
- Modify: `README.md` if deployment wording is touched
- Modify: `.github/workflows/deploy.yml` only if removing obsolete GitHub Pages deployment is in scope

- [ ] **Step 1: Run the full verification suite**

Run: `npm test`
Expected: PASS

Run: `npm run build`
Expected: PASS and generate the expanded static routes

- [ ] **Step 2: Inspect generated routes**

Confirm static output includes:
- `/ranking`
- `/sale`
- `/new`
- `/genre/[slug]` routes
- `/reviews/[slug]` routes

- [ ] **Step 3: Update any deployment docs if necessary**

If README still points at GitHub-centric deployment flow, align it with GitLab + Cloudflare Pages.

- [ ] **Step 4: Commit**

```bash
git add README.md .github/workflows/deploy.yml src public package.json package-lock.json
git commit -m "chore: finalize fanza site completion"
```

- [ ] **Step 5: Prepare final delivery report**

The final response must include:
- commands executed
- changed files
- implemented routes
- unresolved items
- `npm run build` result

