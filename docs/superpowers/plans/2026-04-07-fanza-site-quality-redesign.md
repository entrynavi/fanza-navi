# FANZA Site Quality Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rework the existing Next.js static-export FANZA site into a premium, conversion-oriented editorial experience that remains Cloudflare Pages compatible.

**Architecture:** Keep Next.js App Router and static export intact, but replace the weak shell, flat module hierarchy, and generic commerce patterns with a stronger editorial system. Centralize env-backed site config, unify CTA behavior, redesign high-intent pages first, and rewrite review content so list pages, detail pages, and outbound FANZA clicks form one coherent funnel.

**Tech Stack:** Next.js 16 App Router, static export, Tailwind CSS v4, Framer Motion, Vitest, Testing Library, DMM/FANZA API + curated fallback data.

---

## File Structure

### Existing files to modify

- `package.json`
  - verify scripts remain compatible; no framework change
- `.gitignore`
  - ignore `.superpowers/`, local env files, and editor/runtime noise needed for GitLab hygiene
- `README.md`
  - replace stale route/build/docs with current setup, env strategy, Cloudflare Pages settings, and GitLab-first workflow notes
- `src/app/layout.tsx`
  - global disclosure, metadata defaults, shell ordering, global schema hooks
- `src/app/globals.css`
  - typography, spacing, editorial surfaces, mobile layout polish, disclosure/header/footer primitives
- `src/app/page.tsx`
  - server data loader for homepage modules
- `src/app/ranking/RankingPage.tsx`
  - podium/highlight treatment and stronger conversion structure
- `src/app/sale/SalePage.tsx`
  - “why now” framing and improved product emphasis
- `src/app/new/NewReleasesPage.tsx`
  - align new-release page with redesigned discovery system
- `src/app/search/SearchPage.tsx`
  - align search-entry page with new navigation hierarchy
- `src/app/genre/[slug]/page.tsx`
  - add stronger editorial framing and related navigation
- `src/app/reviews/page.tsx`
  - reposition review index as an editorial decision hub
- `src/app/reviews/[slug]/page.tsx`
  - rewrite review layout and CTA flow
- `src/app/about/page.tsx`
  - tighten trust cues and operator information presentation
- `src/app/contact/page.tsx`
  - ensure metadata and page framing match redesigned shell
- `src/components/Header.tsx`
  - premium navigation, primary vs secondary routes, mobile-first visibility
- `src/components/Footer.tsx`
  - calmer legal/trust section and site mission
- `src/components/AgeGate.tsx`
  - branded entrance experience
- `src/components/HeroSection.tsx`
  - stronger above-the-fold promise and route priority
- `src/components/HomePageView.tsx`
  - overall homepage module hierarchy and editorial rhythm
- `src/components/ProductCard.tsx`
  - stronger visual hierarchy, CTA language flexibility, better mobile scanning
- `src/components/ProductGridSection.tsx`
  - reusable section scaffolding and density controls
- `src/components/ReviewCard.tsx`
  - stronger teaser and clearer intent
- `src/components/StickyCTA.tsx`
  - less noisy, more context-aware bottom CTA
- `src/components/JsonLd.tsx`
  - keep `WebSite` schema aligned with updated site positioning
- `src/data/reviews.ts`
  - rewrite review bodies, caution notes, CTA labels, and editorial structure
- `src/data/genres.ts`
  - strengthen genre framing copy and neighbor navigation metadata
- `src/data/products.ts`
  - ensure curated fallback titles/genres stay aligned with redesigned surfacing
- `src/lib/site.ts`
  - centralize `SITE_URL` and route helpers under env-aware strategy
- `src/lib/affiliate.ts`
  - align link helpers with new env variables and fallback behavior
- `src/lib/catalog.ts`
  - keep data loading stable while exposing helpers needed by redesigned sections
- `src/lib/dmm-api.ts`
  - centralize API credential reads through env helpers instead of direct `process.env` access
- `public/robots.txt`
  - remove once metadata-route generation becomes canonical
- `public/sitemap.xml`
  - remove once metadata-route generation becomes canonical

### New files to create

- `.env.example`
  - required/optional env documentation and placeholder values
- `src/lib/env.ts`
  - single source of truth for env-backed config and defaults
- `src/components/DisclosureBar.tsx`
  - required DMM/FANZA disclosure surface
- `src/components/SectionIntro.tsx`
  - shared editorial section heading + support copy block
- `src/components/PrimaryCta.tsx`
  - shared CTA component with route-specific variants
- `src/components/RankingPodium.tsx`
  - top-3 ranking emphasis
- `src/components/GenreRail.tsx`
  - reusable genre navigation strip/grid
- `src/components/RelatedNavigation.tsx`
  - reusable related works / related genres / supporting guides block
- `src/components/ReviewBody.tsx`
  - structured rendering for review sections, cautions, and mid-article CTA
- `src/__tests__/env.test.ts`
  - env parsing and default behavior
- `src/__tests__/disclosure-shell.test.tsx`
  - disclosure/header shell assertions
- `src/__tests__/ranking-page.test.tsx`
  - podium, CTA, and route hierarchy assertions
- `src/__tests__/sale-page.test.tsx`
  - “why now” framing and CTA assertions
- `src/__tests__/review-body.test.tsx`
  - review section rendering and CTA placement assertions
- `src/app/robots.ts`
  - env-aware robots generation for static output
- `src/app/sitemap.ts`
  - env-aware sitemap generation for static output

### Task 1: Environment, Disclosure, and Global Shell Foundation

**Files:**
- Create: `.env.example`
- Create: `src/lib/env.ts`
- Create: `src/components/DisclosureBar.tsx`
- Modify: `.gitignore`
- Modify: `src/app/layout.tsx`
- Modify: `src/lib/site.ts`
- Modify: `src/lib/affiliate.ts`
- Modify: `src/lib/dmm-api.ts`
- Test: `src/__tests__/env.test.ts`
- Test: `src/__tests__/disclosure-shell.test.tsx`

- [ ] **Step 1: Write failing env and disclosure tests**

```ts
it("reads SITE_URL and DMM defaults from env with safe fallbacks", async () => {
  vi.stubEnv("SITE_URL", "https://example.pages.dev");
  const { getSiteConfig } = await import("@/lib/env");
  expect(getSiteConfig().siteUrl).toBe("https://example.pages.dev");
});

it("renders the required DMM disclosure in the global shell", () => {
  render(<RootLayout><div>child</div></RootLayout>);
  expect(screen.getByText(/当サイトはDMMアフィリエイトを利用しています/)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/__tests__/env.test.ts src/__tests__/disclosure-shell.test.tsx`

Expected: FAIL because `env.ts` and `DisclosureBar.tsx` do not exist yet.

- [ ] **Step 3: Add env config module and example env file**

```ts
// src/lib/env.ts
export function getSiteConfig() {
  return {
    siteUrl: process.env.SITE_URL?.trim() || "https://fragrant-thunder-2202.chidori0543.workers.dev",
    dmmAffiliateLink: process.env.DMM_AFFILIATE_LINK?.trim() || "https://www.dmm.co.jp/digital/videoa/",
    dmmApiId: process.env.DMM_API_ID?.trim() || "",
    dmmAffiliateId: process.env.DMM_AFFILIATE_ID?.trim() || "",
    fanzaFloor: process.env.FANZA_FLOOR?.trim() || "videoa",
    fanzaDefaultGenre: process.env.FANZA_DEFAULT_GENRE?.trim() || "popular",
    analyticsId: process.env.ANALYTICS_ID?.trim() || "",
    gtmId: process.env.GTM_ID?.trim() || "",
  };
}
```

`.env.example` should include:

```bash
SITE_URL=https://your-site.pages.dev
DMM_AFFILIATE_LINK=https://www.dmm.co.jp/digital/videoa/
DMM_API_ID=
DMM_AFFILIATE_ID=
FANZA_FLOOR=videoa
FANZA_DEFAULT_GENRE=popular
ANALYTICS_ID=
GTM_ID=
```

- [ ] **Step 4: Replace the short PR bar with a dedicated disclosure component**

Disclosure bar text must be exactly:

```tsx
<p>
  当サイトはDMMアフィリエイトを利用しています。商品情報・価格は記事執筆時点のものです。最新の価格・配信状況はFANZA公式サイトでご確認ください。
</p>
```

Add `DisclosureBar` above the header in `src/app/layout.tsx`.

- [ ] **Step 5: Make site config consumers read from `env.ts`**

Update these modules to source config from `getSiteConfig()` instead of direct `process.env` reads:

- `src/lib/site.ts`
- `src/lib/affiliate.ts`
- `src/lib/dmm-api.ts`

Expected implementation shape:

```ts
const { dmmAffiliateId, dmmApiId, dmmAffiliateLink } = getSiteConfig();
```

- [ ] **Step 6: Update `.gitignore` for GitLab hygiene**

Ensure it contains:

```gitignore
.superpowers/
.env.local
.env
.DS_Store
out/
```

- [ ] **Step 7: Run focused tests**

Run: `npx vitest run src/__tests__/env.test.ts src/__tests__/disclosure-shell.test.tsx`

Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add .env.example .gitignore src/lib/env.ts src/components/DisclosureBar.tsx src/app/layout.tsx src/lib/site.ts src/lib/affiliate.ts src/lib/dmm-api.ts src/__tests__/env.test.ts src/__tests__/disclosure-shell.test.tsx
git commit -m "feat: add env-backed shell and disclosure foundation"
```

---

### Task 2: Editorial Design System and Shared Commerce Components

**Files:**
- Create: `src/components/SectionIntro.tsx`
- Create: `src/components/PrimaryCta.tsx`
- Create: `src/components/GenreRail.tsx`
- Create: `src/components/RelatedNavigation.tsx`
- Create: `src/components/RankingPodium.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/components/Header.tsx`
- Modify: `src/components/Footer.tsx`
- Modify: `src/components/ProductCard.tsx`
- Modify: `src/components/ProductGridSection.tsx`
- Modify: `src/components/ReviewCard.tsx`
- Modify: `src/components/StickyCTA.tsx`
- Test: `src/__tests__/product-card.test.tsx`
- Test: `src/__tests__/disclosure-shell.test.tsx`
- Test: `src/__tests__/ranking-page.test.tsx`

- [ ] **Step 1: Extend or add tests for shared UI expectations**

Add assertions for:
- header contains primary routes: `ランキング`, `セール`, `ジャンル`, `レビュー`
- header exposes secondary utility routes: `新作`, `ガイド`, `検索入口`
- product cards render context-sensitive CTA copy
- ranking podium component can render top 3 with emphasized positions

- [ ] **Step 2: Run focused tests to confirm failure**

Run: `npx vitest run src/__tests__/product-card.test.tsx src/__tests__/disclosure-shell.test.tsx src/__tests__/ranking-page.test.tsx`

Expected: FAIL because the new shared components and navigation patterns are not implemented yet.

- [ ] **Step 3: Rework global CSS toward a premium editorial surface**

Key CSS changes:
- reduce noisy glass shadows
- use stronger borders and paper-like layering
- improve typography scale on mobile
- add stable section spacing primitives
- add disclosure/header/footer tokens

Add utility classes such as:

```css
.surface-panel { /* calmer panel treatment */ }
.section-shell { /* responsive vertical rhythm */ }
.eyebrow { /* small uppercase section lead */ }
.copy-muted { /* shared muted body copy */ }
```

- [ ] **Step 4: Implement shared section and CTA components**

`PrimaryCta.tsx` should support:

```ts
type PrimaryCtaVariant = "ranking" | "sale" | "review" | "genre";
```

and map to labels like:

- ranking: `FANZAで掲載作品を確認する`
- sale: `セール対象をFANZAで確認する`
- review: `FANZAで詳細を見る`
- genre: `このジャンルの作品を見る`

- [ ] **Step 5: Rebuild `Header` and `Footer` using the new system**

Header requirements:
- logo + short site promise
- visible primary routes
- visible secondary utility routes: `新作`, `ガイド`, `検索入口`
- mobile-safe condensed navigation that still exposes the four primaries without hiding all of them behind a single menu tap

Footer requirements:
- mission copy
- legal links
- age reminder
- DMM/FANZA summary note

- [ ] **Step 6: Upgrade card components**

`ProductCard`:
- stronger hierarchy for title / price / rank
- cleaner CTA treatment
- better spacing on small screens

`ReviewCard`:
- stronger editorial teaser
- clearer path into review and genre

`ProductGridSection`:
- optional intro and density props

- [ ] **Step 7: Run focused tests**

Run: `npx vitest run src/__tests__/product-card.test.tsx src/__tests__/disclosure-shell.test.tsx src/__tests__/ranking-page.test.tsx`

Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add src/app/globals.css src/components/Header.tsx src/components/Footer.tsx src/components/ProductCard.tsx src/components/ProductGridSection.tsx src/components/ReviewCard.tsx src/components/StickyCTA.tsx src/components/SectionIntro.tsx src/components/PrimaryCta.tsx src/components/GenreRail.tsx src/components/RelatedNavigation.tsx src/components/RankingPodium.tsx src/__tests__/product-card.test.tsx src/__tests__/disclosure-shell.test.tsx src/__tests__/ranking-page.test.tsx
git commit -m "feat: establish editorial commerce design system"
```

---

### Task 3: Rebuild the Homepage as a Premium Cover Page

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/HeroSection.tsx`
- Modify: `src/components/HomePageView.tsx`
- Modify: `src/components/SocialProof.tsx`
- Modify: `src/components/StickyCTA.tsx`
- Reuse: `src/components/SectionIntro.tsx`
- Reuse: `src/components/GenreRail.tsx`
- Reuse: `src/components/PrimaryCta.tsx`
- Test: `src/__tests__/home-page.test.tsx`

- [ ] **Step 1: Expand homepage tests before implementation**

Add assertions for:
- disclosure + header + hero ordering
- first CTA points to `/ranking`
- secondary CTA points to `/sale`
- homepage includes editorial trust strip
- homepage includes genre and review rails
- homepage includes at least one monetized product CTA in first viewport section

- [ ] **Step 2: Run homepage test to confirm failure**

Run: `npx vitest run src/__tests__/home-page.test.tsx`

Expected: FAIL because the redesigned homepage hierarchy does not exist yet.

- [ ] **Step 3: Refactor `HomePageView` into cover-page sections**

Required order:
1. disclosure/header handled globally
2. hero
3. editor’s desk strip
4. monthly ranking feature
5. sale feature
6. genre rail
7. featured reviews
8. supporting guides

- [ ] **Step 4: Rework `HeroSection`**

Hero must communicate:
- what the site helps with
- what to click first
- why the site feels curated and trustworthy

Avoid hype language. Use one strong ranking CTA, one sale CTA, and one review/genre support line.

- [ ] **Step 5: Make sticky CTA calmer and more context-aware**

The sticky CTA should reinforce sale exploration without feeling like a cheap banner. Reduce noise and align visual language to the new shell.

- [ ] **Step 6: Run homepage test**

Run: `npx vitest run src/__tests__/home-page.test.tsx`

Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/app/page.tsx src/components/HeroSection.tsx src/components/HomePageView.tsx src/components/SocialProof.tsx src/components/StickyCTA.tsx src/__tests__/home-page.test.tsx
git commit -m "feat: redesign homepage as editorial conversion cover"
```

---

### Task 4: Turn Ranking and Sale into High-Intent Conversion Pages

**Files:**
- Modify: `src/app/ranking/RankingPage.tsx`
- Modify: `src/app/ranking/page.tsx`
- Modify: `src/app/sale/SalePage.tsx`
- Modify: `src/app/sale/page.tsx`
- Modify: `src/lib/catalog.ts`
- Modify: `src/data/products.ts`
- Reuse: `src/components/RankingPodium.tsx`
- Reuse: `src/components/PrimaryCta.tsx`
- Reuse: `src/components/RelatedNavigation.tsx`
- Test: `src/__tests__/ranking-page.test.tsx`
- Test: `src/__tests__/sale-page.test.tsx`
- Test: `src/__tests__/site-routes.test.ts`

- [ ] **Step 1: Add ranking and sale page tests for the new structure**

Ranking should assert:
- top-3 emphasis exists
- ItemList-ready structure is identifiable
- review and genre routes remain present

Sale should assert:
- “why now” section exists
- discounted candidates include clearer price contrast
- review and guide links remain present

- [ ] **Step 2: Run focused tests to confirm failure**

Run: `npx vitest run src/__tests__/ranking-page.test.tsx src/__tests__/sale-page.test.tsx src/__tests__/site-routes.test.ts`

Expected: FAIL because podium and sale framing do not yet exist.

- [ ] **Step 3: Rebuild `/ranking` around a podium + grid structure**

Implementation shape:

```tsx
<RankingPodium products={products.slice(0, 3)} />
<ProductGridSection products={products.slice(3)} />
<RelatedNavigation ... />
```

Also include short explanation of what the ranking is emphasizing.

- [ ] **Step 4: Rebuild `/sale` around “why now” and comparison guidance**

Add:
- concise editorial opening
- checklist or compact comparison note
- stronger sale CTA language
- clean supporting links to review and guide content

Adjust `src/lib/catalog.ts` and `src/data/products.ts` only as needed to support:
- stable top-3 ranking slices
- cleaner sale-specific ordering or badges
- fallback copy/tags that match the redesigned visual treatment

- [ ] **Step 5: Update metadata tone**

Ranking metadata should feel curated, not generic.
Sale metadata should emphasize discounted comparison without hype.

- [ ] **Step 6: Run focused tests**

Run: `npx vitest run src/__tests__/ranking-page.test.tsx src/__tests__/sale-page.test.tsx src/__tests__/site-routes.test.ts`

Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/app/ranking/RankingPage.tsx src/app/ranking/page.tsx src/app/sale/SalePage.tsx src/app/sale/page.tsx src/__tests__/ranking-page.test.tsx src/__tests__/sale-page.test.tsx src/__tests__/site-routes.test.ts
git commit -m "feat: upgrade ranking and sale into conversion pages"
```

---

### Task 5: Tighten Discovery Pages and Genre Landings

**Files:**
- Modify: `src/app/new/NewReleasesPage.tsx`
- Modify: `src/app/new/page.tsx`
- Modify: `src/app/search/SearchPage.tsx`
- Modify: `src/app/search/page.tsx`
- Modify: `src/app/genre/[slug]/page.tsx`
- Modify: `src/data/genres.ts`
- Reuse: `src/components/GenreRail.tsx`
- Reuse: `src/components/RelatedNavigation.tsx`
- Test: `src/__tests__/site-routes.test.ts`

- [ ] **Step 1: Extend route tests for new/search/genre editorial framing**

Add assertions for:
- `/new` feels like a discovery route, not a placeholder grid
- `/search` remains static-export-safe but offers strong route choices
- genre pages include stronger editorial explanation and adjacent navigation

- [ ] **Step 2: Run focused route tests**

Run: `npx vitest run src/__tests__/site-routes.test.ts`

Expected: FAIL once the new expectations are added.

- [ ] **Step 3: Rework genre copy and related navigation metadata**

Strengthen each genre entry with:
- cleaner intro
- tradeoff or fit guidance
- neighbor genre suggestions where useful

- [ ] **Step 4: Align `/new` and `/search` with the new shell**

`/new`:
- emphasize fresh discovery
- link to reviews and genre rails

`/search`:
- present curated entry points
- explicitly avoid pretending to be a dynamic live search

- [ ] **Step 5: Upgrade `/genre/[slug]`**

Required:
- stronger intro
- short “good fit / may not fit” guidance
- reviews first when available
- works grid second
- related navigation at the bottom

- [ ] **Step 6: Run route tests**

Run: `npx vitest run src/__tests__/site-routes.test.ts`

Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/app/new/NewReleasesPage.tsx src/app/new/page.tsx src/app/search/SearchPage.tsx src/app/search/page.tsx src/app/genre/[slug]/page.tsx src/data/genres.ts src/__tests__/site-routes.test.ts
git commit -m "feat: strengthen discovery and genre landing pages"
```

---

### Task 6: Rebuild Review Experience and Rewrite Review Copy

**Files:**
- Create: `src/components/ReviewBody.tsx`
- Modify: `src/app/reviews/[slug]/page.tsx`
- Modify: `src/app/reviews/page.tsx`
- Modify: `src/components/ReviewCard.tsx`
- Modify: `src/components/RelatedProducts.tsx`
- Modify: `src/data/reviews.ts`
- Test: `src/__tests__/reviews.test.ts`
- Test: `src/__tests__/review-body.test.tsx`
- Test: `src/__tests__/site-routes.test.ts`

- [ ] **Step 1: Expand review tests for the new content structure**

Review data should support:
- opening summary
- good points
- cautions
- fit guidance
- mid-page CTA
- closing CTA framing

Example expected shape:

```ts
expect(review.highlights.length).toBeGreaterThan(0);
expect(review.cautions.length).toBeGreaterThan(0);
expect(review.bestFor.length).toBeGreaterThan(0);
```

- [ ] **Step 2: Run review tests to confirm failure**

Run: `npx vitest run src/__tests__/reviews.test.ts src/__tests__/review-body.test.tsx src/__tests__/site-routes.test.ts`

Expected: FAIL because the richer structure and renderer do not exist yet.

- [ ] **Step 3: Refactor review data into richer editorial fields**

Add fields such as:

```ts
highlights: string[];
cautions: string[];
bestFor: string[];
opening: string;
midCtaNote: string;
closingNote: string;
```

Rewrite the 3 seed reviews in natural Japanese using `自分` as the first-person voice.

- [ ] **Step 4: Build `ReviewBody` renderer**

Render:
- opening
- highlights
- cautions
- best fit
- body paragraphs
- mid-page CTA note

- [ ] **Step 5: Rework review detail page**

Requirements:
- stronger opening
- product snapshot image/details
- CTA near the top, in the middle, and at the end, with different supporting copy
- related products and related genres framed as “next comparisons”
- maintain `Review` schema output

- [ ] **Step 6: Upgrade review index page**

Make it feel like a review hub, not just a grid dump.

- [ ] **Step 7: Run focused review tests**

Run: `npx vitest run src/__tests__/reviews.test.ts src/__tests__/review-body.test.tsx src/__tests__/site-routes.test.ts`

Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add src/components/ReviewBody.tsx src/app/reviews/[slug]/page.tsx src/app/reviews/page.tsx src/components/ReviewCard.tsx src/components/RelatedProducts.tsx src/data/reviews.ts src/__tests__/reviews.test.ts src/__tests__/review-body.test.tsx src/__tests__/site-routes.test.ts
git commit -m "feat: redesign review pages and editorial copy"
```

---

### Task 7: Finish SEO, Structured Data, Age Gate Polish, and Ops Docs

**Files:**
- Modify: `src/components/AgeGate.tsx`
- Modify: `src/components/JsonLd.tsx`
- Create: `src/app/robots.ts`
- Create: `src/app/sitemap.ts`
- Delete: `public/robots.txt`
- Delete: `public/sitemap.xml`
- Modify: `src/app/ranking/page.tsx`
- Modify: `src/app/sale/page.tsx`
- Modify: `src/app/new/page.tsx`
- Modify: `src/app/search/page.tsx`
- Modify: `src/app/about/page.tsx`
- Modify: `src/app/contact/page.tsx`
- Modify: `README.md`
- Verify: `public/robots.txt`
- Verify: `public/sitemap.xml`
- Test: `src/__tests__/age-gate.test.tsx`
- Test: `src/__tests__/site-routes.test.ts`

- [ ] **Step 1: Extend tests for metadata and age gate polish**

Add checks for:
- route metadata improvements remain present
- age gate still blocks initial access, but with the new branded content
- README references static export, Cloudflare Pages, GitLab prep, and env setup accurately

- [ ] **Step 2: Run focused tests**

Run: `npx vitest run src/__tests__/age-gate.test.tsx src/__tests__/site-routes.test.ts`

Expected: FAIL if metadata or age-gate expectations were expanded.

- [ ] **Step 3: Polish age gate and metadata**

Age gate:
- match new shell visually
- clean accept/exit split
- preserve accessibility and localStorage behavior

Metadata:
- improve route descriptions
- preserve or improve route `title`, `description`, `canonical`, `openGraph`, and `twitter` metadata
- add `ItemList` schema for ranking where practical
- add `BreadcrumbList` schema on breadcrumbed routes where practical
- keep `Review` and `WebSite` schemas aligned

- [ ] **Step 4: Update README and GitLab/Cloudflare ops documentation**

README must include:
- tech stack summary
- current route set
- env variables with required vs optional usage
- local run/build commands
- Cloudflare Pages settings
- GitLab initial push guidance

GitLab prep section should explicitly define:
- `.gitignore` readiness
- local branch push flow
- no GitHub dependency required

Analytics note:
- treat `ANALYTICS_ID` and `GTM_ID` as optional alternatives; if both are empty, analytics stays off

README validation is manual, not automated. Confirm by checklist after editing:
- local run commands match `package.json`
- env variable table matches `.env.example`
- Cloudflare Pages settings match static export reality
- GitLab push steps do not mention GitHub

- [ ] **Step 5: Replace hard-coded robots/sitemap with env-aware generation**

Create metadata routes:

- `src/app/robots.ts`
- `src/app/sitemap.ts`

Both must read `SITE_URL` from `getSiteConfig()` so canonical and sitemap URLs stay aligned across workers.dev, pages.dev, and future custom domains.
These metadata routes become the single source of truth. Remove:

- `public/robots.txt`
- `public/sitemap.xml`

Example shape:

```ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${getSiteConfig().siteUrl}/sitemap.xml`,
  };
}
```

- [ ] **Step 6: Verify robots and sitemap output remain valid**

Run:

```bash
sed -n '1,120p' out/robots.txt
sed -n '1,200p' out/sitemap.xml
```

Expected: `SITE_URL`-aligned URLs and sitemap declaration remain present.

- [ ] **Step 7: Run local dev verification**

Run: `npm run dev`

Manual checklist:
- disclosure bar is visible above the header
- age gate opens on first visit and closes cleanly on acceptance
- primary nav remains discoverable on mobile
- homepage hero shows ranking-first CTA hierarchy

- [ ] **Step 8: Tighten `/about` and `/contact` trust framing**

`/about` must explicitly improve:
- operator identity / operation model presentation
- DMM/FANZA affiliate disclosure context
- trust-oriented explanation of how the site selects and presents works

`/contact` must explicitly improve:
- page intro quality and tone
- reassurance about correction requests / inquiries
- visual alignment with the redesigned editorial shell

- [ ] **Step 9: Run final verification**

Run:

```bash
npm test
npm run build
```

Expected:
- all tests PASS
- static build PASS
- output includes `/`, `/ranking`, `/sale`, `/new`, `/search`, `/genre/*`, `/reviews`, `/reviews/*`
- existing supporting routes like `/guide`, `/compare`, and `/articles/*` still build and remain reachable from the redesigned shell

- [ ] **Step 10: Commit**

```bash
git add .gitignore src/components/AgeGate.tsx src/components/JsonLd.tsx src/app/robots.ts src/app/sitemap.ts src/app/ranking/page.tsx src/app/sale/page.tsx src/app/new/page.tsx src/app/search/page.tsx src/app/about/page.tsx src/app/contact/page.tsx README.md src/__tests__/age-gate.test.tsx src/__tests__/site-routes.test.ts
git rm public/robots.txt public/sitemap.xml
git commit -m "feat: finalize seo, age gate, and deployment docs"
```

---

## Notes For Implementers

- Do not regress static export. If a component design suggests runtime-only behavior, redesign the component instead of introducing server dependencies.
- Keep mobile priority ahead of desktop embellishment.
- Avoid hype language in copy rewrites.
- Do not remove existing route coverage; elevate weak routes instead.
- `ANALYTICS_ID` and `GTM_ID` are optional alternatives. Supporting both is acceptable; requiring neither is required.
- Mobile header may use a condensed or horizontally scrollable treatment, but the four primary actions (`ランキング`, `セール`, `ジャンル`, `レビュー`) must remain immediately discoverable.
