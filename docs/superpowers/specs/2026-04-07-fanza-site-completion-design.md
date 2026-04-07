# FANZA Site Completion Design

## Objective

Complete the existing Next.js static-export FANZA affiliate site without rebuilding it from scratch. Prioritize revenue-driving improvements over preserving every current implementation detail, while still reusing the existing layout, styling system, API client, and content where those assets accelerate delivery.

## Constraints

- Keep the project on Next.js static export for Cloudflare Pages.
- Do not migrate to Astro.
- Prefer extending or replacing weak existing pieces over introducing a new UI framework.
- DMM affiliate links must be generated through environment-variable-aware helpers.
- The site must keep working as a static export (`npm run build`).
- GitLab is now the primary Git remote; GitHub is legacy only.

## Current State

### Reusable Assets

- Shared site layout, header, footer, PR disclosure banner, metadata, and JSON-LD wiring already exist.
- Tailwind-based visual system and reusable card styling already exist.
- DMM API client exists and already reads `DMM_API_ID` and `DMM_AFFILIATE_ID`.
- Existing guide articles provide real editorial content that can support conversion paths.
- Static export and Cloudflare-compatible build already pass.

### Gaps

- `/ranking`, `/sale`, `/new`, and `/search` are placeholder pages.
- There is no genre route template.
- There is no reusable review template with static params.
- The age-check is only a banner, not an actual gate.
- Affiliate links are inconsistent: some come from API responses, others are hard-coded to generic DMM URLs.
- `RelatedProducts` uses sample data with empty affiliate URLs, producing dead links.
- The homepage is still more "guide media" than "conversion hub".

### Revenue Risks In Current Build

- High-intent users landing on ranking/sale/search do not immediately reach product cards.
- Dead or generic CTA links lower click-through value.
- There is no reusable editorial review funnel from list page to review page to product CTA.
- The site underuses genre landings, which are useful both for SEO and for affiliate intent matching.

## Product Direction

The site should behave like a static FANZA discovery and review hub with three core conversion paths:

1. **Demand capture:** ranking, sale, new releases, search, and genre pages expose browsable product cards with working affiliate links.
2. **Intent shaping:** editorial review pages convert uncertain users by adding context, trust, and recommendation framing.
3. **Retention and compliance:** age gate, persistent PR disclosure, and real internal linking keep the experience compliant while pushing readers deeper into monetizable routes.

## Recommended Architecture

### 1. Centralize content and link generation

Create small data/helper modules that become the single source of truth for:

- genre definitions used by the homepage and `/genre/[slug]`
- review entry definitions used by `/reviews/[slug]` and a review index section
- manual fallback affiliate targets when API data is unavailable
- generic affiliate-capable route helpers

This avoids scattering hard-coded DMM URLs and lets static pages remain useful even when API responses are empty at build time.

### 2. Convert placeholder routes into real commercial landing pages

Replace the placeholder pages for ranking, sale, new releases, and search with pages that:

- fetch DMM products when credentials are present
- fall back to curated local product data when credentials or API responses fail
- always render real product cards and real CTAs
- surface genre and review links near product grids

### 3. Add static templates for genre and review funnels

Add:

- `src/app/genre/[slug]/page.tsx`
- `src/app/reviews/[slug]/page.tsx`

Both use `generateStaticParams` so they work with static export.

Genres become scalable SEO/commercial landings.
Reviews become trust-building conversion content with direct CTA placement.

### 4. Add a client-side age gate compatible with static export

Use a client component mounted near the root layout that:

- blocks the site on first visit
- stores acceptance in `localStorage`
- offers an exit path for under-18 users
- does not rely on middleware or SSR-only behavior

This satisfies the age-confirmation requirement without breaking static export.

### 5. Reposition the homepage as a monetization hub

Keep the current visual language, but shift the page structure to emphasize:

- monthly ranking preview
- active sale preview
- genre shortcuts
- featured reviews
- supporting guide articles

The homepage should guide users toward product discovery first and informational content second.

## UI / UX Approach

### Keep

- existing Tailwind variables
- glass-card treatment where it helps visual hierarchy
- current header/footer structure
- current article cards and visual palette

### Improve

- typography on long-form review/article bodies using `@tailwindcss/typography`
- clearer product sections with stronger headings and CTA density
- homepage information hierarchy so high-intent commerce sections appear above softer editorial sections
- review pages so they look intentionally editorial rather than generic app pages

### Avoid

- introducing a large component framework such as shadcn/ui or Radix for this pass
- replacing the entire visual system
- overusing synthetic urgency patterns that weaken trust

## Data Strategy

### Product Data

Use a two-tier product strategy:

- **Primary:** DMM API data transformed through the existing `toProduct()` path
- **Fallback:** curated local product records with valid affiliate links so build output remains monetizable

This keeps the site functional even if API results are empty during a build.

### Review Data

Introduce a structured review dataset with fields such as:

- `slug`
- `title`
- `description`
- `productId`
- `affiliateUrl`
- `imageUrl`
- `rating`
- `summary`
- `intro`
- `highlights`
- `bestFor`
- `cautions`
- `bodySections`
- `relatedProductIds`

This allows the first 1-3 real review pages to be statically generated without inventing a CMS.

### Genre Data

Expand the current genre definitions so each genre also has:

- slug
- page title
- SEO description
- optional DMM genre/article id
- short editorial intro

## SEO Plan

### Reuse

- root metadata pattern
- `SITE_URL`
- existing `JsonLd` helper pattern
- `robots.txt` and `sitemap.xml`

### Extend

- per-route metadata for `/genre/[slug]` and `/reviews/[slug]`
- review-specific JSON-LD using `Article` or `Review`
- richer internal linking between homepage, ranking, sale, genre pages, and reviews
- review cards on listing pages to increase crawlable depth

## File-Level Design

### New modules

- `src/lib/affiliate.ts`
  - central affiliate link helpers
  - fallback root affiliate URL generation
- `src/lib/catalog.ts`
  - shared product loading helpers for ranking/sale/new/search/genre
- `src/data/reviews.ts`
  - static review definitions and lookup helpers
- `src/data/genres.ts` or an expanded existing data module
  - genre metadata for routes and navigation
- `src/components/AgeGate.tsx`
  - client-side 18+ gate
- `src/components/ProductGridSection.tsx`
  - optional shared section wrapper for repeated product grids
- `src/components/ReviewCard.tsx`
  - reusable review list/teaser card

### Route changes

- `src/app/page.tsx`
  - reorganize into conversion-first homepage
- `src/app/ranking/RankingPage.tsx`
  - monthly ranking implementation
- `src/app/sale/SalePage.tsx`
  - real sale grid implementation
- `src/app/new/NewReleasesPage.tsx`
  - real new-release grid implementation
- `src/app/search/SearchPage.tsx`
  - static export-safe search entry plus curated sections
- `src/app/genre/[slug]/page.tsx`
  - new genre landing route
- `src/app/reviews/[slug]/page.tsx`
  - new review template route

### Existing component changes

- `src/components/RelatedProducts.tsx`
  - consume valid related product data instead of dead sample links
- `src/components/ProductCard.tsx`
  - ensure image rendering and CTA behavior work for both API and fallback products
- `src/app/layout.tsx`
  - mount age gate while preserving PR disclosure

## Testing Strategy

Use TDD for new behavior and route helpers.

### Add tests for

- affiliate helper behavior
- review dataset integrity
- genre dataset integrity
- age gate acceptance persistence
- route metadata helpers where practical
- `RelatedProducts` rendering only valid CTAs
- fallback behavior when API data is unavailable

### Keep verifying

- `npm test`
- `npm run build`

## Non-Goals

- No Astro migration
- No CMS integration
- No server-only dynamic search experience
- No external design-system rewrite
- No analytics overhaul in this pass

## Risks

### Static export vs live search

Real user-entered search cannot become a fully dynamic search app under pure static export without introducing client-side fetch logic to external APIs. For this pass, the search page should become a useful curated/search-entry route rather than a fully interactive live catalog search.

### DMM API build-time variability

Builds should not fail or ship empty key pages when the API is unavailable. Fallback content must always exist for ranking, sale, new, genre, and related-product surfaces.

### Review realism

Review copy should be intentionally structured and specific enough to feel editorial rather than generic template filler. This is solved with richer review content fields, not with extra libraries.

## Success Criteria

The feature is complete when:

- `/ranking` is a real monthly ranking page with clickable product cards
- `/sale` is a real sale page with clickable product cards
- `/new` is no longer a placeholder
- `/search` no longer dead-ends users
- `/genre/[slug]` works as static genre landing pages
- `/reviews/[slug]` exists with at least 1 real review page, ideally 3
- the site shows a real 18+ gate on first visit
- affiliate links are routed through helper logic and no core CTA uses dead links
- `RelatedProducts` no longer renders dead outbound links
- `npm run build` passes in the worktree

