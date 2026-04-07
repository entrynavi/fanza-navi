# Homepage Hero Reframe Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the homepage hero feel like a useful FANZA discovery entrance instead of an explanation of the site's intentions.

**Architecture:** Keep the existing homepage structure and data flow, but replace explanation-heavy hero copy and route framing with shorter action-first messaging. Limit changes to the homepage hero and nearby entry copy so verification stays fast.

**Tech Stack:** Next.js App Router, React, Tailwind CSS, Vitest, Testing Library

---

### Task 1: Rewrite Hero Content

**Files:**
- Modify: `src/components/HeroSection.tsx`
- Test: `src/__tests__/home-page.test.tsx`

- [ ] Replace the explanation-first hero headline with a user-first discovery headline.
- [ ] Rewrite the supporting paragraph so it explains what the visitor can do next in one short block.
- [ ] Rename the primary CTAs to direct actions.
- [ ] Add compact reassurance support text for `18+ / affiliate disclosure / latest pricing on FANZA`.
- [ ] Make the left side own only ranking and sale CTAs.
- [ ] Make the right-side chooser own the three entry paths: ranking, sale, and genre.
- [ ] Demote reviews to a smaller support link instead of a competing hero primary action.
- [ ] Remove duplicated hero route cards if they repeat the chooser.
- [ ] Update tests to assert the new hero messaging.

### Task 2: Tighten Nearby Homepage Framing

**Files:**
- Modify: `src/components/HomePageView.tsx`
- Test: `src/__tests__/home-page.test.tsx`

- [ ] Remove any nearby section copy that repeats "まずは" or over-explains the site's structure.
- [ ] Keep ranking/sale/review sections action-oriented and shorter.
- [ ] Update tests for any changed labels.

### Task 3: Verify

**Files:**
- Test: `src/__tests__/home-page.test.tsx`

- [ ] Run `npm test`
- [ ] Run `npm run build`
- [ ] Check that the homepage still reads coherently in the local build output.
