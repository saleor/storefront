---
name: product-filtering
description: PLP filtering/sorting — server-side categories/price/sort plus attribute facets via PLP_FACETS and ProductWhereInput alias OR. Use when changing product list filters, facet config, or sort.
---

# Product Filtering

Product list filtering and sorting. Attribute facets (colors/sizes/…) are **server-side** via Saleor; the PLP variant sample is only for card swatches and option-list hints.

> **Source**: [Saleor API - ProductFilterInput](https://docs.saleor.io/api-reference/products/inputs/product-filter-input) / `ProductWhereInput`  
> **High-cardinality context**: [`product-high-cardinality.md`](product-high-cardinality.md)

## Filter Architecture

| Filter          | Processing     | Mechanism                                                                |
| --------------- | -------------- | ------------------------------------------------------------------------ |
| **Categories**  | ✅ Server-side | `ProductFilterInput.categories` (IDs) or `where.category` when facets on |
| **Price**       | ✅ Server-side | `filter.price` or `where.price.range`                                    |
| **Sort**        | ✅ Server-side | `ProductOrder` (search "relevance" = `RANK`)                             |
| **Search text** | ✅ Server-side | Top-level `search` argument — combines with `where`                      |
| **Colors**      | ✅ Server-side | Facet config → `where` OR across `color` / `colour` value slugs          |
| **Sizes**       | ✅ Server-side | Facet config → `where` OR across `size` / `shoe-size` / `clothing-size`  |

Saleor allows **only one** of `filter` or `where` per products query. When any attribute facet is selected, Paper puts the whole constraint set into `where` so aliases can OR correctly.

Search text is the top-level `search` argument, not `filter.search`. It combines with `where`, so the search surface uses the same constraints (and the same alias OR) as category grids. "Relevance" sorts by `RANK`, which Saleor allows only together with search text.

> The old claim “Saleor needs attribute IDs” is **false** for modern schemas — `AttributeInput` filters by attribute slug + value slugs.

## Facet config (`src/config/facets.ts`)

```ts
export const PLP_FACETS = [
	{ param: "colors", attributeSlug: "color", attributeAliases: ["colour"], control: "swatch" },
	{
		param: "sizes",
		attributeSlug: "size",
		attributeAliases: ["shoe-size", "clothing-size"],
		control: "chip",
	},
] as const;
```

- **URL tokens** = normalized **value slugs** (`?sizes=43`, not display names).
- Forks add/reorder facets here — colors/sizes are presets, not GraphQL special cases.
- Option chips in the filter bar are still derived from the **current page sample** (`PLP_VARIANT_SAMPLE`); that list can be incomplete. Matching itself is exhaustive against all variants.

## Key Files

| File                                              | Purpose                                                      |
| ------------------------------------------------- | ------------------------------------------------------------ |
| `src/config/facets.ts`                            | Facet ids, URL params, per-provider `source`                 |
| `src/lib/listing/providers/saleor/constraints.ts` | `buildProductListingConstraints` (Saleor `filter` / `where`) |
| `src/lib/listing/load.ts`                         | `loadListingView` — codec, cache policy, active provider     |
| `src/config/listing-providers.ts`                 | Which provider serves each surface                           |
| `src/app/api/listing/route.ts`                    | Public listing JSON (pages stay params-only)                 |
| `src/ui/components/plp/filter-bar.tsx`            | Filter UI                                                    |
| `src/ui/components/plp/use-listing-query.ts`      | Canonical grid vs `GET /api/listing`                         |

## Building listing constraints

Only the Saleor listing provider (`src/lib/listing/providers/saleor/`) builds Saleor listing variables. Pages and UI hand it a `ListingQuery`; `loadListing` decides whether the read is cached.

```typescript
// Inside src/lib/listing/providers/saleor/
import { buildProductListingConstraints } from "./constraints";

const { filter, where } = buildProductListingConstraints({
	priceRange,
	categoryIds, // resolved from slugs with resolveCategorySlugsToIds
	facets: query.selections,
});

// Exactly one of filter / where is set. Search text rides in the top-level `search` argument.
const result = await liveQuery(ProductListPaginatedDocument, {
	variables: { channel, first, sortBy, filter, where, ...(search ? { search } : {}) },
});
```

A cacheable first page goes through `cachedQuery` with the listing profile instead. The provider gets that decision from core; it does not make it.

`buildFilterVariables` remains for **category/price only** — do not hang attribute facets on it (single-slug `filter.attributes` cannot OR `shoe-size`).

## Client UX (not client matching)

```tsx
const {
	filteredProducts, // server-already-filtered page
	colorOptions,
	selectedColors,
	isPending,
	resultCount, // prefers server totalCount
	handleColorToggle,
} = useProductFilters({ products, totalCount, enableCategoryFilter: true });
```

- Toggles write sorted slug lists to the URL and use `useOptimistic` + `useTransition`.
- Do **not** re-apply `filterProducts` for colors/sizes on the live PLP (kept only for tests / hybrid experiments).

## Static Price Ranges

Price ranges are static to avoid UI flicker:

```typescript
import { STATIC_PRICE_RANGES } from "@/config/facets";
```

## Adding a New Attribute Facet

1. Add a row to `PLP_FACETS` (`param`, `id`, `attributeSlug`, `attributeAliases`, `control`, `source`).
2. The Saleor provider reads `query.selections` from the URL codec. Listing pages stay params-only — the query is read by `GET /api/listing`, not the page.
3. Wire FilterBar / `useProductFilters` for that param if it needs a dedicated control.
4. Prefer value **slugs** in the URL.
5. A non-Saleor provider maps `source.<id>` itself. See `rules/plp-listing.md`.

## Anti-patterns

❌ **Don't filter categories client-side** — resolve slugs → IDs server-side  
❌ **Don't generate dynamic price ranges** — use static ranges  
❌ **Don't hide selected filters** — always show so users can deselect  
❌ **Don't treat the PLP variant sample as filter truth** — sample is for swatches/hints  
❌ **Don't filter only `size` when sneakers use `shoe-size`** — configure aliases  
❌ **Don't pass both `filter` and `where`** — Saleor rejects the combination  
❌ **Don't put search text in `filter.search`** — the top-level `search` argument combines with `where`, so facet aliases still OR  
❌ **Don't sort relevance by `RATING`** — it is deprecated and is not relevance; use `RANK` with search text
