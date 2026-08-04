---
name: product-high-cardinality
description: High-cardinality catalogs on Paper — PDP_VARIANT_CAP, per-group control ladder, buy-box strategies, ?variant=/?sku= deep links, selection-index, PLP_FACETS alias OR. Use when products have many variants/options, over-cap PDPs, or facet config.
---

# High-Cardinality Attributes

Paper treats large option matrices as a first-class shape: **degrade by attribute-group shape**, never fetch unpaginated variant lists, and keep LCP on the static PDP shell.

Budgets and thresholds live in one fork override point: `src/config/variants.ts` (+ `src/config/facets.ts` for PLP).

## Caps (do not scatter magic numbers)

| Constant                            | Default | Role                                                                     |
| ----------------------------------- | ------- | ------------------------------------------------------------------------ |
| `SALEOR_VARIANT_PAGE_SIZE`          | 100     | Saleor `productVariants(first:)` page size                               |
| `PDP_VARIANT_CAP`                   | 200     | Max variants hydrated for the matrix picker                              |
| `PLP_VARIANT_SAMPLE`                | 50      | Card swatches / facet **option hints** only (not filter truth)           |
| `VARIANT_CHIP_MAX_OPTIONS`          | 10      | Text/numeric groups stay chips                                           |
| `VARIANT_SWATCH_CHIP_MAX_OPTIONS`   | 12      | Swatch groups stay chip grid; then combobox (Select can't show swatches) |
| `VARIANT_NATIVE_SELECT_MAX_OPTIONS` | 24      | Text groups: select, then combobox                                       |

**Stock freshness:** PDP variant payloads (incl. `quantityAvailable`) use the same `product:{slug}` + `catalog` cache profile as the product shell (~5 min TTL, PRODUCT\_\* webhooks). Cart/checkout always re-fetch live.

## Data layer (never the firehose)

- **Product shell** (`ProductDetails`): no unpaginated `Product.variants`. Probe with `productVariants(first: 1) { totalCount }` + `productType`.
- **Matrix path**: paginated `ProductVariantsForPdp` only inside dynamic islands, and only when `totalCount ≤ PDP_VARIANT_CAP`.
- **Lint**: `src/graphql/*.graphql` must not use deprecated `variants {` — enforced in `verify`.
- **PLP cards**: `productVariants(first:)` capped at `PLP_VARIANT_SAMPLE` for swatches; keep the GraphQL `first` arg in sync with that constant.

## Buy-box strategies (`src/lib/catalog/buy-box-strategy.ts`)

Resolve **only inside dynamic islands** — never in the static shell (PPR / LCP).

| Strategy      | When                                                      | Buy box                                            |
| ------------- | --------------------------------------------------------- | -------------------------------------------------- |
| `matrix`      | `totalCount ≤ PDP_VARIANT_CAP` (default)                  | Attribute picker + selection index                 |
| `over_budget` | `totalCount > PDP_VARIANT_CAP`                            | No matrix; ATC via deep link only                  |
| `external`    | Product-type slug in `EXTERNAL_BUYBOX_PRODUCT_TYPE_SLUGS` | Fork picker (seat map, CPQ, …); same deep-link ATC |

`guided` (stepped `attribute.choices`) is **deferred**.

### Deep-link contract (public)

- `?variant=<Saleor global id>` — preferred
- `?sku=<variant sku>` — when the id is unknown (feeds, email, POS)
- When both present, **`variant` wins**
- Resolved buy box: selection summary + ATC enabled **without** loading sibling variants

## Per-group control ladder

Each attribute group picks its own control (`resolveVariantGroupControl`):

| Shape                 | Control                        |
| --------------------- | ------------------------------ |
| Swatches, ≤12 options | Chip / swatch grid             |
| Swatches, >12         | Lazy combobox (swatch leading) |
| Text/numeric, ≤10     | Chips                          |
| Text/numeric, 11–24   | Lazy `<Select>`                |
| Text/numeric, ≥25     | Lazy searchable combobox       |

Select/combobox load via `next/dynamic` (`ssr: false`) so the common chips path stays lean.

## Merchant order + natural sort

- Preserve Saleor's `selectionAttributes` order (product-type assignment order). **Do not** re-sort groups with a fashion “swatch first” heuristic.
- Sort option **values** with `compareOptionLabels` / `sortByOptionLabel` (S before L; Row 10 after Row 2).

## Selection-index performance

Hot paths live in `selection-index.ts`. Build **once** per product payload (`useMemo` in `VariantSelectionSection`):

- `variantById`
- `variantsByAttrValue` (attr → value → variant ids)
- `variantBySelectionKey` (complete fingerprint → variant id)
- Cached `groupSlugs` + `implicitSelections`

Public wrappers in `utils.ts` rebuild an index per call (compat/tests). The picker must use `*FromIndex` helpers.

## PLP facets (server-side)

See [`product-filtering.md`](product-filtering.md). Facets are configured in `src/config/facets.ts` (`PLP_FACETS`). Colors/sizes are presets — not hardcoded Saleor special cases. Listing filters OR attribute slug **aliases** (`size` | `shoe-size` | …) via `ProductWhereInput` (Saleor forbids combining `filter` + `where`).

## Quick-add / over-cap

- `hasVariants` still gates one-click add when multiple variants exist.
- `isOverVariantCap` (`variantTotalCount > PDP_VARIANT_CAP`): never open a variant sheet from PLP — route to the PDP.

## Perf gates (testable invariants)

1. Strategy / `searchParams` / uncached variant fetches stay **inside** Suspense islands — gate with `pnpm run build` on PPR-sensitive changes.
2. Facet toggles use `useOptimistic` + `useTransition` so chips acknowledge instantly while RSC results stream.
3. Unfiltered first-load PLP remains static-friendly; filtered views are soft navigations (combinatorial cache dilution is expected).
4. Common-path PDP client bundle: chips path must not pull Select/cmdk.

## Ceilings (product guidance)

| Scale                        | Approach                                         |
| ---------------------------- | ------------------------------------------------ |
| Matrix ≤ `PDP_VARIANT_CAP`   | Full attribute picker                            |
| SKU lookup / deep link ~2–3k | `over_budget` / external + `?variant=` / `?sku=` |
| Beyond that                  | Split products, or keep inventory outside Saleor |

Dashboard bulk ops / Configurator: prefer commerce-as-code and paginated APIs; never teach the storefront to dump all variants into RSC payloads.

## Anti-patterns

❌ Fetching deprecated unpaginated `Product.variants`  
❌ Resolving buy-box strategy or reading `?variant=` in the static shell  
❌ Shipping a **partial** attribute matrix when over cap  
❌ Client-only color/size filtering against the PLP sample (sample ≠ truth)  
❌ Filtering only the primary attribute slug when aliases exist (`size` without `shoe-size`)  
❌ Rebuilding the selection index on every click in the picker
