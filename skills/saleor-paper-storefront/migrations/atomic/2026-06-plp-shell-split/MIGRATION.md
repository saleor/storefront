# Migration: PLP shell split

## Intent

Split category/collection pages into cached hero shell (name, description, breadcrumbs) and dynamic product grid (searchParams). Hero no longer waits behind filter/pagination fetches.

## Upstream reference

- **Commit:** [`3be1d7e6`](https://github.com/saleor/storefront/commit/3be1d7e6)

## Prerequisites

- [`2026-06-cache-life-profiles`](../2026-06-cache-life-profiles/MIGRATION.md)

## Out of scope

- Filter bar styling, product grid card design
- PLP hero typography/colors

## Steps

### 1. Catalog data layer `[architecture]`

Create:

- `src/lib/catalog/get-category-data.ts`
- `src/lib/catalog/get-collection-data.ts`

Each: `"use cache"`, appropriate `cacheTag`, no fetch `revalidate`.

### 2. Page structure `[architecture]`

For `categories/[slug]/page.tsx` and `collections/[slug]/page.tsx`:

```
Page (async, params for hero)
├── Hero section ← getCategoryData / getCollectionData
└── Suspense → Products grid (searchParams)
```

Remove single outer Suspense wrapping hero + grid together.

### 3. ProductsGridSkeleton `[presentation-default]`

Shared grid skeleton — structure only; preserve fork classes if present.

### 4. Remove revalidate from dynamic grid queries `[architecture]`

Product list inside grid uses fresh/searchParams-driven fetch without redundant ISR revalidate.

## Verify

[`verify.md`](verify.md)

## Record

`3be1d7e6`
