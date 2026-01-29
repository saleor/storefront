---
name: filtering-system
description: Product list filtering and sorting architecture. Use when modifying filters, adding new filter types, working on category/collection pages, or understanding server-side vs client-side filtering.
---

# Product Filtering System

> **Source**: [Saleor API - ProductFilterInput](https://docs.saleor.io/api-reference/products/inputs/product-filter-input) - Available server-side filter options

## When to Use

Use this skill when:

- Modifying product list filtering or sorting
- Adding new filter types
- Working on category, collection, or products pages
- Understanding server-side vs client-side filtering

## Instructions

### Filter Architecture

| Filter         | Processing     | Why                                           |
| -------------- | -------------- | --------------------------------------------- |
| **Categories** | ✅ Server-side | Uses Saleor's `ProductFilterInput.categories` |
| **Price**      | ✅ Server-side | Uses Saleor's `ProductFilterInput.price`      |
| **Sort**       | ✅ Server-side | Uses Saleor's `ProductOrder`                  |
| **Colors**     | ❌ Client-side | Saleor needs attribute IDs                    |
| **Sizes**      | ❌ Client-side | Same as colors                                |

### Key Files

| File                                         | Purpose                                |
| -------------------------------------------- | -------------------------------------- |
| `src/ui/components/plp/filter-utils.ts`      | All filter utilities (server + client) |
| `src/ui/components/plp/FilterBar.tsx`        | Filter UI (dropdowns, mobile sheet)    |
| `src/ui/components/plp/useProductFilters.ts` | Hook consolidating filter logic        |

### Server-Side Filtering

Category slugs in URL are resolved to IDs:

```typescript
// In page.tsx (server component)
import { resolveCategorySlugsToIds, buildFilterVariables } from "@/ui/components/plp/filter-utils";

const categorySlugs = searchParams.categories?.split(",") || [];
const categoryMap = await resolveCategorySlugsToIds(categorySlugs);
const categoryIds = Array.from(categoryMap.values()).map((c) => c.id);

const filter = buildFilterVariables({
	priceRange: searchParams.price,
	categoryIds,
});

// Pass to GraphQL query
const { products } = await executePublicGraphQL(ProductListDocument, {
	variables: { channel, filter },
});
```

### Client-Side Filtering

Colors and sizes are filtered after fetch:

```typescript
import { filterProducts, extractColorOptions } from "@/ui/components/plp/filter-utils";

// Extract available options
const colorOptions = extractColorOptions(products, selectedColors);

// Apply filters
const filtered = filterProducts(products, {
	colors: selectedColors,
	sizes: selectedSizes,
});
```

### Using the Hook

The `useProductFilters` hook consolidates all filter logic:

```tsx
"use client";
import { useProductFilters } from "@/ui/components/plp/useProductFilters";

function ProductsClient({ products, resolvedCategories }) {
	const {
		filteredProducts,
		colorOptions,
		sizeOptions,
		selectedColors,
		handleColorToggle,
		handleSortChange,
		activeFilters,
	} = useProductFilters({
		products,
		resolvedCategories,
		enableCategoryFilter: true,
	});

	return (
		<FilterBar
			colorOptions={colorOptions}
			selectedColors={selectedColors}
			onColorToggle={handleColorToggle}
			// ...
		/>
	);
}
```

### Static Price Ranges

Price ranges are static to avoid UI flicker when filtering:

```typescript
import { STATIC_PRICE_RANGES_WITH_COUNT } from "@/ui/components/plp/filter-utils";

// Returns: [
//   { label: "Under $50", value: "0-50", count: 0 },
//   { label: "$50 - $100", value: "50-100", count: 0 },
//   ...
// ]
```

## Examples

### Adding a New Server-Side Filter

1. Update `buildFilterVariables` in `filter-utils.ts`:

```typescript
export function buildFilterVariables(params: {
	priceRange?: string | null;
	categoryIds?: string[];
	inStock?: boolean; // New filter
}): ProductFilterInput | undefined {
	// ... existing code ...

	if (params.inStock) {
		filter.stockAvailability = "IN_STOCK";
		hasFilter = true;
	}
}
```

2. Parse from URL in page.tsx and pass to the function.

## Anti-patterns

❌ **Don't filter categories client-side** - Use server-side with IDs  
❌ **Don't generate dynamic price ranges** - Use static ranges  
❌ **Don't hide selected filters** - Always show so users can deselect
