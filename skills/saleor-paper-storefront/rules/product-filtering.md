---
name: product-filtering
description: PLP filtering/sorting — server-side categories/price/sort plus attribute facets via PLP_FACETS and ProductWhereInput alias OR. Use when changing product list filters, facet config, or sort.
---

# Product Filtering

Product list filtering and sorting. Attribute facets (colors/sizes/…) are **server-side** via Saleor; the PLP variant sample is only for card swatches and option-list hints.

> **Source**: [Saleor API - ProductFilterInput](https://docs.saleor.io/api-reference/products/inputs/product-filter-input) / `ProductWhereInput`  
> **High-cardinality context**: [`product-high-cardinality.md`](product-high-cardinality.md)

## Filter Architecture

| Filter         | Processing     | Mechanism                                                                |
| -------------- | -------------- | ------------------------------------------------------------------------ |
| **Categories** | ✅ Server-side | `ProductFilterInput.categories` (IDs) or `where.category` when facets on |
| **Price**      | ✅ Server-side | `filter.price` or `where.price.range`                                    |
| **Sort**       | ✅ Server-side | `ProductOrder`                                                           |
| **Colors**     | ✅ Server-side | Facet config → `where` OR across `color` / `colour` value slugs          |
| **Sizes**      | ✅ Server-side | Facet config → `where` OR across `size` / `shoe-size` / `clothing-size`  |

Saleor allows **only one** of `filter` or `where` per products query. When any attribute facet is selected, Paper puts the whole constraint set into `where` so aliases can OR correctly.

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

| File                                           | Purpose                                             |
| ---------------------------------------------- | --------------------------------------------------- |
| `src/config/facets.ts`                         | Which attributes are facets + slug aliases          |
| `src/ui/components/plp/filter-utils.ts`        | `buildProductListingConstraints`, option extractors |
| `src/ui/components/plp/filter-utils.server.ts` | `resolveCategorySlugsToIds`                         |
| `src/ui/components/plp/use-product-filters.ts` | URL sync, optimistic chips, `useTransition`         |
| `src/ui/components/plp/filter-bar.tsx`         | Filter UI                                           |

## Building listing constraints

```typescript
import { buildProductListingConstraints } from "@/ui/components/plp/filter-utils";
import { resolveCategorySlugsToIds } from "@/ui/components/plp/filter-utils.server";

const categoryMap = await resolveCategorySlugsToIds(categorySlugs);
const categoryIds = Array.from(categoryMap.values()).map((c) => c.id);

const { filter, where } = buildProductListingConstraints({
	priceRange: searchParams.price,
	categoryIds,
	colors: searchParams.colors,
	sizes: searchParams.sizes,
});

// Pass exactly one of filter / where (the other is undefined)
await executePublicGraphQL(ProductListPaginatedDocument, {
	variables: { channel, sortBy, filter, where, ... },
});
```

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
import { STATIC_PRICE_RANGES_WITH_COUNT } from "@/ui/components/plp/filter-utils";
```

## Adding a New Attribute Facet

1. Add a row to `PLP_FACETS` (`param`, `attributeSlug`, `attributeAliases`, `control`).
2. Ensure listing pages pass `searchParams[param]` into `buildProductListingConstraints` (extend the helper’s convenience fields or `facets` map).
3. Wire FilterBar / `useProductFilters` for that param if it needs a dedicated control.
4. Prefer value **slugs** in the URL.

## Anti-patterns

❌ **Don't filter categories client-side** — resolve slugs → IDs server-side  
❌ **Don't generate dynamic price ranges** — use static ranges  
❌ **Don't hide selected filters** — always show so users can deselect  
❌ **Don't treat the PLP variant sample as filter truth** — sample is for swatches/hints  
❌ **Don't filter only `size` when sneakers use `shoe-size`** — configure aliases  
❌ **Don't pass both `filter` and `where`** — Saleor rejects the combination
