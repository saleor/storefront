# Migration: Homepage featured products data layer

## Intent

Extract homepage featured collection fetch to `src/lib/catalog/get-featured-products.ts` with sync page shell + inner Suspense for the grid. Matches catalog data-boundary pattern.

## Upstream reference

- **Commit:** [`b0e1b869`](https://github.com/saleor/storefront/commit/b0e1b869)

## Prerequisites

- [`2026-06-cache-life-profiles`](../2026-06-cache-life-profiles/MIGRATION.md)

## Out of scope

- Homepage hero/marketing layout styling
- Product card visual design (preserve fork `ProductElement` styling)

## Steps

### 1. Create get-featured-products.ts `[architecture]`

Cached fetch with `cacheTag` for featured collection slug.

### 2. Sync page shell `[architecture]`

`src/app/[channel]/(main)/page.tsx`:

- Default export sync; wraps async content in `<Suspense>`
- Pass `channel` to product list (server `Link`, not client link wrapper)

### 3. FeaturedProductsSkeleton `[architecture]` + `[presentation-default]`

Extract skeleton component; port **structure** (grid placeholders); preserve fork classes if skeleton already customized.

## Verify

[`verify.md`](verify.md)

## Record

`b0e1b869`
