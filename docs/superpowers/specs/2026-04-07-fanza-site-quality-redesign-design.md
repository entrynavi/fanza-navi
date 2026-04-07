# FANZA Site Quality Redesign Design

## Objective

Raise the existing static Next.js FANZA affiliate site from "functional" to "publishable and commercially persuasive" without doing a framework rewrite. The target is a site that feels editorial, trustworthy, and intentionally designed for comparison and click-through, while remaining compatible with static export and Cloudflare Pages.

## Project Context

### Technical Stack

- Framework: Next.js 16 App Router
- Rendering model: static export via `output: "export"`
- Styling: Tailwind CSS v4 with typography plugin
- Motion: Framer Motion
- Testing: Vitest + Testing Library
- Data sources:
  - DMM/FANZA API at build time when credentials exist
  - curated local fallback data when API data is unavailable

### Local Run / Build / Deploy

- Local development: `npm run dev`
- Verification test suite: `npm test`
- Static build/export: `npm run build`
- Static output directory: `out/`
- Target deployment: Cloudflare Pages with:
  - Build command: `npm run build`
  - Output directory: `out`

### Cloudflare Pages Suitability

The current project is already suitable for Cloudflare Pages because:

- it uses static export
- it avoids server-only runtime requirements
- route generation for genre and review pages is static via `generateStaticParams`
- image handling is already `unoptimized`

Cloudflare Pages compatibility should be preserved as a hard constraint during redesign.

### Tooling Availability For This Pass

- `affiliate-blog-builder` skill is available and will inform copy quality, review structure, and CTA language
- A browser-style brainstorming companion was available through the local brainstorming server, not through a dedicated browser MCP
- No MCP resource servers were available in this session
- No Figma MCP was available in this session

## Current-State Audit

### UI / UX Audit

#### Priority 0

- The global top disclosure is too weak. It currently states PR usage, but it does not carry the stronger DMM/FANZA-specific trust language required for this site.
- The header looks like an app shell rather than a premium editorial discovery site. It lacks hierarchy, secondary trust cues, and clear orientation for first-time visitors.
- The homepage modules are functional but visually too uniform. Important blocks do not dominate enough, and scanning behavior on mobile is flatter than it should be.
- Ranking and sale pages are usable but not persuasive enough. They read like content sections rather than high-intent conversion pages.

#### Priority 1

- Product cards are consistent but too generic. They need better visual hierarchy, clearer ranking cues, and more deliberate CTA treatment.
- The age gate works functionally, but the experience still feels like a blocker rather than a branded first step.
- Typography is cleaner than before but still not yet strong enough to signal an editorial product rather than a utility site.
- Footer density and hierarchy are acceptable, but the visual finish still feels slightly "template-ish".

#### Priority 2

- Breadcrumbs are functional but visually underpowered.
- Supporting guide content is useful, but the UI does not yet clearly separate "buying intent" from "supporting education".

### Content / CV Audit

#### Priority 0

- Review pages still lack enough narrative weight. They need a stronger opening, more specific decision support, and better CTA role separation.
- CTA language is serviceable but too repetitive. Different surfaces should express different intent:
  - ranking: compare what is moving now
  - sale: check discounted candidates now
  - review: confirm fit before opening FANZA
- The flow from list pages to detail pages is present but not yet emotionally persuasive enough. Users can click, but the page does not consistently create a clear "why this next step matters now".

#### Priority 1

- Genre pages need stronger editorial framing so they do more than act as route wrappers around product grids.
- Sale pages need a clearer "why now" layer that strengthens time-sensitive exploration without resorting to spammy urgency.
- The homepage should present one obvious primary action, one strong secondary action, and several supporting exploration paths. It currently still behaves too much like a sequence of equal blocks.

### SEO / Technical Audit

#### Strengths

- canonical metadata exists for key routes
- review and genre pages already generate static metadata
- base structured data already exists
- static export works
- robots and sitemap exist

#### Gaps

- metadata tone is still generic on several surfaces and needs stronger editorial positioning
- review pages should emit richer `Review` structured data
- ranking pages should emit `ItemList`
- breadcrumb structured data is not yet consistently modeled
- environment-variable strategy is incomplete for long-term ops
- README is out of date versus the current route structure and build reality

### Maintainability Audit

- The codebase is still small enough to improve in place
- The current split between data, route templates, and shared components is workable
- The biggest maintainability risk is not file size, but duplicated tone and duplicated CTA patterns across pages
- A shared commercial UI language is needed so future additions do not drift

## Approaches Considered

### Approach A: Polish The Current UI

Keep the current black/glass direction and mostly adjust spacing, copy, and small components.

#### Pros

- Lowest disruption
- Fastest path to incremental improvement

#### Cons

- Leaves too much "app-like" feel intact
- Caps upside on trust and first-impression quality
- Does not go far enough to change how users scan and move through the site

### Approach B: Partial Rebuild Around A Commerce-First Editorial System

Keep Next.js/static export/data foundations, but redesign the global shell, homepage hierarchy, listing hierarchy, review structure, CTA system, and age gate experience.

#### Pros

- Best balance of risk and upside
- Keeps working technical foundations
- Addresses the actual bottleneck: presentation, persuasion, and flow
- Preserves Cloudflare Pages compatibility

#### Cons

- Requires meaningful changes to shared UI and copy
- Higher implementation effort than simple polish

### Approach C: Major Replatform-Oriented Rewrite

Rework the entire experience more radically, including route behavior and deeper component model changes.

#### Pros

- Maximum freedom

#### Cons

- Too much risk for limited additional benefit
- Unnecessarily threatens build/export stability
- Violates the goal of improving quality without meaningless full rewrites

## Recommended Direction

Use **Approach B: Partial Rebuild Around A Commerce-First Editorial System**.

The current technical base is good enough. The problem is not lack of routes; it is lack of premium information design. The redesign should therefore keep the existing static export and route scaffolding, while deliberately reworking how the site looks, reads, and moves users toward FANZA.

## Design Principles

- Premium editorial look over neon app aesthetics
- Mobile-first hierarchy over desktop-first density
- Trust cues before aggressive monetization cues
- One clear next action per section
- Review specificity over generic praise
- CTA clarity without hype or spam language
- Consistent visual system across top, lists, reviews, ranking, and sale pages

## Experience Redesign

### 1. Global Shell

#### Required Disclosure

Replace the current short PR notice with the required long-form disclosure:

> 当サイトはDMMアフィリエイトを利用しています。商品情報・価格は記事執筆時点のものです。最新の価格・配信状況はFANZA公式サイトでご確認ください。

This must appear in the site header or immediately above it as a persistent top disclosure bar.

#### Header

The header should become a premium navigation frame, not just a utility bar:

- logo + short site promise
- primary navigation:
  - ランキング
  - セール
  - ジャンル
  - レビュー
- secondary utility:
  - 新作
  - ガイド
  - 検索入口

On mobile, the header must keep the primary actions visible without forcing discovery through the menu.

#### Footer

The footer should feel calmer and more editorial:

- legal / operator links
- DMM/FANZA disclaimer summary
- age restriction reminder
- short site mission copy

### 2. Homepage

The homepage should become a cover page that quickly answers:

- what this site helps with
- what to click first
- why this site is trustworthy

#### Target structure

1. Disclosure + branded header
2. Hero with:
   - ranking-first promise
   - sale as secondary route
   - review and genre as supporting routes
3. A premium "editor's desk" style strip highlighting:
   - monthly ranking
   - current sale value
   - first-time viewing guidance
4. Ranking module with strong first three positions
5. Sale module with "why now" framing
6. Genre navigation module
7. Featured reviews module
8. Supporting guide module

The homepage should feel more like a publication front page than a feature list.

### 3. Ranking Page

The ranking page should become the strongest conversion page.

#### Target structure

- ranking hero with editorial framing
- emphasized top 1-3 entries
- supporting explanation for ranking criteria
- grid for positions after the top group
- adjacent review links
- adjacent genre links

#### UX intent

Users should feel that the page is curated, not merely sorted.

### 4. Sale Page

The sale page should lead with practical reasons to open FANZA now, without spam urgency.

#### Target structure

- sale hero with concise editorial explanation
- a "what to compare first" checklist
- highlighted discounted entries with clearer pricing contrast
- links to relevant reviews and guide content
- supporting genre routes

#### UX intent

The page should answer "why bother checking sale candidates now?" in a calm, credible way.

### 5. Genre Pages

Genre pages should become discovery landing pages, not just grids.

#### Target structure

- genre-specific intro
- short explanation of the genre's appeal and tradeoffs
- matching reviews
- curated products
- adjacent genre suggestions

### 6. Review Pages

Review pages should shift from "summary page" to "decision support page".

#### Required content blocks

- strong opening paragraph
- product snapshot
- what stood out
- what may not work for everyone
- who the work suits
- mid-page CTA tied to the review's reasoning
- related products
- related genre path
- closing CTA with calmer decision framing

#### Copy requirements

- first-person voice: `自分`
- natural spoken rhythm
- no AI filler words
- avoid overstatement
- include at least one meaningful caution per review where appropriate

### 7. Age Gate

The age gate should remain brand-consistent and feel deliberate.

#### Changes

- stronger visual alignment with the site shell
- more confident typography
- gentler but clearer explanation
- cleaner split between accept and exit actions

The gate should feel like an entrance to a premium adult media guide, not a generic modal wall.

## Copy Strategy

### Tone

- calm
- direct
- natural
- recommendation-oriented
- non-hyped

### Avoid

- exaggerated promises
- spam urgency
- repetitive CTA formulas
- AI-like stock phrasing

### CTA System

CTA text should vary by page role:

- Ranking: `FANZAで掲載作品を確認する`
- Sale: `セール対象をFANZAで確認する`
- Review: `FANZAで詳細を見る`
- Genre: `このジャンルの作品を見る`

Use stronger wording only when the page context justifies it. Do not use exaggerated urgency.

## Environment Variable Strategy

Introduce and document these values:

- `DMM_API_ID`
- `DMM_AFFILIATE_ID`
- `DMM_AFFILIATE_LINK`
- `SITE_URL`
- `FANZA_FLOOR`
- `FANZA_DEFAULT_GENRE`
- `ANALYTICS_ID`
- `GTM_ID`

### Requirements

- create `.env.example`
- document which values are required for build, required for production, and optional
- centralize config access so routes do not read process env ad hoc

## SEO / Structured Data Strategy

### Required

- route-level meta titles and descriptions
- canonical URLs based on `SITE_URL`
- OGP and Twitter Card support
- `robots.txt`
- `sitemap.xml`

### Structured Data

- `WebSite` for the global shell
- `BreadcrumbList` for pages with breadcrumbs
- `Review` for review pages
- `ItemList` for ranking pages

Use only route-appropriate schema. Do not over-model.

## Implementation Shape

### Major files expected to change

- `src/app/layout.tsx`
- `src/app/globals.css`
- `src/components/Header.tsx`
- `src/components/Footer.tsx`
- `src/components/AgeGate.tsx`
- `src/components/ProductCard.tsx`
- `src/components/ProductGridSection.tsx`
- `src/components/ReviewCard.tsx`
- `src/components/StickyCTA.tsx`
- `src/components/HeroSection.tsx`
- `src/components/HomePageView.tsx`
- `src/app/page.tsx`
- `src/app/ranking/RankingPage.tsx`
- `src/app/sale/SalePage.tsx`
- `src/app/new/NewReleasesPage.tsx`
- `src/app/search/SearchPage.tsx`
- `src/app/genre/[slug]/page.tsx`
- `src/app/reviews/[slug]/page.tsx`
- `src/app/reviews/page.tsx`
- `src/data/reviews.ts`
- `src/lib/site.ts`
- `src/lib/affiliate.ts`
- `README.md`
- `.gitignore`
- `.env.example`

### Additional likely helpers

- shared disclosure copy/config helper
- shared CTA helper/component
- shared page intro / editorial note component
- shared ranking podium component

## Verification Requirements

Implementation is not complete unless all of the following pass:

- `npm run dev` works locally
- `npm test` passes
- `npm run build` passes
- output remains static-export compatible
- Cloudflare Pages config remains:
  - build command: `npm run build`
  - output directory: `out`
- required disclosure is visible in the site shell
- age gate works and preserves brand quality
- homepage clearly leads users to ranking, sale, genre, and review paths
- list pages lead naturally into detail pages
- review pages lead naturally into FANZA and additional site exploration
- `.env.example` exists and matches documented env usage
- README matches the actual project structure and deploy flow

## Non-Goals

- no Astro migration
- no CMS integration
- no server-side dynamic search
- no analytics overhaul beyond config cleanup
- no meaningless animation-heavy redesign

## Success Criteria

The redesign is successful when:

- the site feels premium and coherent instead of app-like or template-like
- the homepage creates a clear first-click path
- ranking and sale pages behave like persuasive conversion pages
- review pages feel authored and useful
- the DMM/FANZA disclosure is clear and trustworthy
- static export remains intact
- the site is ready for Cloudflare Pages deployment and GitLab migration prep
