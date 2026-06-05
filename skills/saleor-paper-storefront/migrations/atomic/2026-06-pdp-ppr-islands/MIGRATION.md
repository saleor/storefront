# Migration: PDP PPR islands

## Intent

Stop awaiting `searchParams` at PDP page top level (which collapses the whole page into a dynamic hole). Split into static **ProductShell** (params only, cached product data) and dynamic islands for gallery + variant section.

## Upstream reference

- **Commit:** [`651f7dd0`](https://github.com/saleor/storefront/commit/651f7dd0)

## Prerequisites

None (independent; complements cache-life batch)

## Out of scope

- Product gallery styling, sticky bar visuals
- Variant selector button/swatch styling (preserve fork renderers)

## Discovery

Search PDP `page.tsx` for `await props.searchParams` or `await searchParams` at top of page/shell component.

## Steps

### 1. ProductShell `[architecture]`

In `products/[slug]/page.tsx`:

- Shell reads `params` only
- Calls `getProductData(slug, channel)` inside `"use cache"` path
- Renders: breadcrumbs, h1, attributes, JSON-LD, LCP preload — **no searchParams**

### 2. VariantGalleryDynamic `[architecture]`

New file `src/ui/components/pdp/variant-gallery-dynamic.tsx`:

- Reads `searchParams` inside nested Suspense
- Uses shared `gallery-utils.ts` for image resolution

### 3. GallerySkeleton `[presentation-default]`

Port skeleton **structure**; keep fork classes if customized.

### 4. VariantSectionDynamic `[architecture]`

Ensure variant section remains in its own Suspense; reads searchParams there only.

### 5. gallery-utils.ts `[architecture]`

Extract shared helpers from page if duplicated.

## Target shape

```
ProductPage (sync)
└── Suspense
    └── ProductShell (params only)
        ├── static product info
        ├── Suspense → VariantGalleryDynamic
        └── Suspense → VariantSectionDynamic
```

## Verify

[`verify.md`](verify.md)

## Record

`651f7dd0`
