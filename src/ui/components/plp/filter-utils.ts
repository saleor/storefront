/**
 * Product filtering and sorting utilities.
 *
 * Server-side filters (handled by Saleor GraphQL):
 * - categories / price: `ProductFilterInput` when no attribute facets are selected
 * - attribute facets (colors/sizes/…): `ProductWhereInput` with OR across configured
 *   attribute slug aliases (`size` | `shoe-size` | …). Saleor rejects combining
 *   `filter` and `where`, so attribute queries move the whole constraint set into `where`.
 *
 * Client-side:
 * - Option lists for the filter bar are still derived from the current page's
 *   card samples (Saleor does not return facet aggregations here).
 * - Color/size *matching* is server-side; do not re-filter the page locally.
 *
 * Note: Server-only functions (like resolveCategorySlugsToIds) are in filter-utils.server.ts
 */

import type {
	AttributeInput,
	ProductOrder,
	ProductOrderField,
	OrderDirection,
	ProductFilterInput,
	ProductWhereInput,
} from "@/gql/graphql";
import { PLP_FACETS, normalizeFacetValueSlug, parseFacetParam } from "@/config/facets";
import { compareSizes } from "@/lib/sizes";
import type { ProductCardData } from "./product-card-data";
import type { FilterOption, ActiveFilter, SortOption } from "./filter-bar";

// ============================================================================
// Types
// ============================================================================

export interface CategoryOption {
	id: string;
	name: string;
	slug: string;
	count: number;
}

export type AttributeFacetSelections = {
	/** Facet URL param → selected value slugs */
	[param: string]: string[] | undefined;
};

export type ProductListingConstraints = {
	/** Mutually exclusive with `where` — Saleor allows only one. */
	filter?: ProductFilterInput;
	where?: ProductWhereInput;
};

type ListingFilterParams = {
	priceRange?: string | null;
	categoryIds?: string[];
	/** Selected facet value slugs keyed by URL param (`colors`, `sizes`, …). */
	facets?: AttributeFacetSelections;
	/** Convenience: `?colors=` tokens (normalized to slugs). */
	colors?: string[] | string | null;
	/** Convenience: `?sizes=` tokens (normalized to slugs). */
	sizes?: string[] | string | null;
};

// ============================================================================
// Static Price Ranges (for server-side filtering)
// ============================================================================

export const STATIC_PRICE_RANGES = [
	{ label: "Under $50", value: "0-50" },
	{ label: "$50 - $100", value: "50-100" },
	{ label: "$100 - $200", value: "100-200" },
	{ label: "$200+", value: "200-" },
] as const;

/** Price ranges with count=0 for FilterBar compatibility */
export const STATIC_PRICE_RANGES_WITH_COUNT = STATIC_PRICE_RANGES.map((r) => ({ ...r, count: 0 }));

// ============================================================================
// Server-side: Saleor GraphQL Filters
// ============================================================================

function resolveFacetSelections(params: ListingFilterParams): AttributeFacetSelections {
	const facetSelections: AttributeFacetSelections = { ...params.facets };
	if (params.colors != null) {
		facetSelections.colors = Array.isArray(params.colors) ? params.colors : parseFacetParam(params.colors);
	}
	if (params.sizes != null) {
		facetSelections.sizes = Array.isArray(params.sizes) ? params.sizes : parseFacetParam(params.sizes);
	}
	return facetSelections;
}

function parsePriceRange(priceRange: string): { gte: number; lte?: number } {
	const [minStr, maxStr] = priceRange.split("-");
	const min = parseFloat(minStr) || 0;
	const max = maxStr ? parseFloat(maxStr) : undefined;
	return { gte: min, ...(max !== undefined && !Number.isNaN(max) ? { lte: max } : {}) };
}

function facetAttributeSlugs(facet: (typeof PLP_FACETS)[number]): string[] {
	return [facet.attributeSlug, ...facet.attributeAliases];
}

/**
 * Build `AttributeInput[]` for a single primary slug (no alias OR).
 * Prefer {@link buildProductListingConstraints} for live queries.
 */
export function buildAttributeFilterInputs(
	facets: AttributeFacetSelections | undefined,
): AttributeInput[] | undefined {
	if (!facets) return undefined;

	const attributes: AttributeInput[] = [];

	for (const facet of PLP_FACETS) {
		const raw = facets[facet.param];
		if (!raw?.length) continue;

		const values = [...new Set(raw.map(normalizeFacetValueSlug).filter(Boolean))].sort();
		if (values.length === 0) continue;

		attributes.push({
			slug: facet.attributeSlug,
			values,
		});
	}

	return attributes.length > 0 ? attributes : undefined;
}

function hasSelectedFacets(facets: AttributeFacetSelections): boolean {
	return PLP_FACETS.some((facet) => (facets[facet.param]?.length ?? 0) > 0);
}

/**
 * Build `ProductWhereInput` that ORs every configured attribute slug alias per facet.
 * Required for catalogs that use `shoe-size` alongside `size` (or `colour` / `color`).
 */
export function buildAttributeWhereInput(facets: AttributeFacetSelections): ProductWhereInput | undefined {
	const facetClauses: ProductWhereInput[] = [];

	for (const facet of PLP_FACETS) {
		const raw = facets[facet.param];
		if (!raw?.length) continue;

		const values = [...new Set(raw.map(normalizeFacetValueSlug).filter(Boolean))].sort();
		if (values.length === 0) continue;

		const slugs = facetAttributeSlugs(facet);
		facetClauses.push({
			OR: slugs.map((slug) => ({
				attributes: [{ slug, values }],
			})),
		});
	}

	if (facetClauses.length === 0) return undefined;
	if (facetClauses.length === 1) return facetClauses[0];
	return { AND: facetClauses };
}

function buildWhereConstraints(
	params: ListingFilterParams,
	facets: AttributeFacetSelections,
): ProductWhereInput {
	const clauses: ProductWhereInput[] = [];

	if (params.categoryIds?.length) {
		clauses.push({ category: { oneOf: params.categoryIds } });
	}

	if (params.priceRange) {
		const { gte, lte } = parsePriceRange(params.priceRange);
		clauses.push({
			price: { range: { gte, ...(lte !== undefined ? { lte } : {}) } },
		});
	}

	const attributeWhere = buildAttributeWhereInput(facets);
	if (attributeWhere) {
		clauses.push(attributeWhere);
	}

	if (clauses.length === 1) return clauses[0]!;
	return { AND: clauses };
}

/**
 * Build Saleor listing constraints from URL params.
 *
 * Returns **either** `filter` **or** `where` (never both) — Saleor rejects combining them.
 * Attribute facets always use `where` so size aliases (`shoe-size`, …) OR correctly.
 */
export function buildProductListingConstraints(params: ListingFilterParams): ProductListingConstraints {
	const facets = resolveFacetSelections(params);

	if (hasSelectedFacets(facets)) {
		return { where: buildWhereConstraints(params, facets) };
	}

	const filter = buildFilterVariables({
		priceRange: params.priceRange,
		categoryIds: params.categoryIds,
	});
	return filter ? { filter } : {};
}

/**
 * Build Saleor ProductFilterInput for category/price only.
 *
 * Do **not** put attribute facets here — a single `attributes[].slug` cannot OR
 * aliases like `shoe-size` vs `size`. Use {@link buildProductListingConstraints}.
 */
export function buildFilterVariables(params: {
	priceRange?: string | null;
	categoryIds?: string[];
}): ProductFilterInput | undefined {
	const filter: ProductFilterInput = {};
	let hasFilter = false;

	if (params.categoryIds?.length) {
		filter.categories = params.categoryIds;
		hasFilter = true;
	}

	if (params.priceRange) {
		const { gte, lte } = parsePriceRange(params.priceRange);
		filter.price = { gte, ...(lte !== undefined ? { lte } : {}) };
		hasFilter = true;
	}

	return hasFilter ? filter : undefined;
}

/**
 * Build Saleor ProductOrder from sort option.
 */
export function buildSortVariables(sort: SortOption | string | undefined): ProductOrder | undefined {
	if (!sort || sort === "featured") return undefined;

	const sortMap: Record<string, { field: ProductOrderField; direction: OrderDirection }> = {
		newest: { field: "DATE" as ProductOrderField, direction: "DESC" as OrderDirection },
		price_asc: { field: "PRICE" as ProductOrderField, direction: "ASC" as OrderDirection },
		price_desc: { field: "PRICE" as ProductOrderField, direction: "DESC" as OrderDirection },
		bestselling: { field: "RATING" as ProductOrderField, direction: "DESC" as OrderDirection },
	};

	return sortMap[sort];
}

// ============================================================================
// Client-side: Extract Filter Options from Products
// ============================================================================

/**
 * Extract unique category options from products with counts.
 */
export function extractCategoryOptions(products: ProductCardData[]): CategoryOption[] {
	const map = new Map<string, CategoryOption>();

	for (const product of products) {
		if (product.category) {
			const existing = map.get(product.category.slug);
			if (existing) {
				existing.count++;
			} else {
				map.set(product.category.slug, {
					id: product.category.id,
					name: product.category.name,
					slug: product.category.slug,
					count: 1,
				});
			}
		}
	}

	return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

function colorIdentity(color: { name: string; slug?: string }): string {
	return color.slug || normalizeFacetValueSlug(color.name);
}

function sizeIdentity(size: string | { name: string; slug?: string }): { value: string; name: string } {
	if (typeof size === "string") {
		return { value: normalizeFacetValueSlug(size), name: size };
	}
	return { value: size.slug || normalizeFacetValueSlug(size.name), name: size.name };
}

/**
 * Extract unique color options from products.
 * Selected colors are always included (with count 0) so users can deselect them.
 * `FilterOption.value` is the URL/Saleor slug; `name` is the display label.
 */
export function extractColorOptions(products: ProductCardData[], selectedColors?: string[]): FilterOption[] {
	const map = new Map<string, { name: string; count: number; hex?: string }>();

	for (const product of products) {
		product.colors?.forEach((color) => {
			const value = colorIdentity(color);
			const existing = map.get(value);
			if (existing) {
				existing.count++;
			} else {
				map.set(value, { name: color.name, count: 1, hex: color.hex });
			}
		});
	}

	selectedColors?.forEach((token) => {
		const value = normalizeFacetValueSlug(token);
		if (!map.has(value)) map.set(value, { name: token, count: 0 });
	});

	return Array.from(map.entries())
		.map(([value, { name, count, hex }]) => ({ name, value, count, hex }))
		.sort((a, b) => b.count - a.count);
}

/**
 * Extract unique size options from products.
 * Selected sizes are always included (with count 0) so users can deselect them.
 */
export function extractSizeOptions(products: ProductCardData[], selectedSizes?: string[]): FilterOption[] {
	const map = new Map<string, { name: string; count: number }>();

	for (const product of products) {
		product.sizes?.forEach((size) => {
			const { value, name } = sizeIdentity(size);
			const existing = map.get(value);
			if (existing) {
				existing.count++;
			} else {
				map.set(value, { name, count: 1 });
			}
		});
	}

	selectedSizes?.forEach((token) => {
		const value = normalizeFacetValueSlug(token);
		if (!map.has(value)) map.set(value, { name: token, count: 0 });
	});

	return Array.from(map.entries())
		.map(([value, { name, count }]) => ({ name, value, count }))
		.sort((a, b) => compareSizes(a.name, b.name));
}

// ============================================================================
// Client-side: Apply Filters & Sort
// ============================================================================

/**
 * @deprecated Color/size matching is server-side via `buildFilterVariables`.
 * Kept for unit tests and hybrid escape-hatch experiments.
 */
export function filterProducts(
	products: ProductCardData[],
	filters: { colors?: string[]; sizes?: string[] },
): ProductCardData[] {
	let filtered = products;

	if (filters.colors?.length) {
		const wanted = new Set(filters.colors.map(normalizeFacetValueSlug));
		filtered = filtered.filter((p) =>
			p.colors?.some((c) => wanted.has(colorIdentity(c)) || wanted.has(normalizeFacetValueSlug(c.name))),
		);
	}

	if (filters.sizes?.length) {
		const wanted = new Set(filters.sizes.map(normalizeFacetValueSlug));
		filtered = filtered.filter((p) =>
			p.sizes?.some((s) => {
				const { value, name } = sizeIdentity(s);
				return wanted.has(value) || wanted.has(normalizeFacetValueSlug(name));
			}),
		);
	}

	return filtered;
}

/**
 * Sort products client-side (fallback when server sort not applied).
 */
export function sortProductsClientSide<T extends { price: number; createdAt?: string | null }>(
	products: T[],
	sort: SortOption | string,
): T[] {
	const sorted = [...products];

	switch (sort) {
		case "price_asc":
			return sorted.sort((a, b) => a.price - b.price);
		case "price_desc":
			return sorted.sort((a, b) => b.price - a.price);
		case "newest":
			return sorted.sort((a, b) => {
				const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
				const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
				return dateB - dateA;
			});
		default:
			return sorted;
	}
}

// ============================================================================
// Active Filters Display
// ============================================================================

/**
 * Build active filters array for display.
 * Note: Categories are added separately from resolved server data.
 * `value` is the slug identity used for removal; `displayValue` is shown in the chip.
 */
export function buildActiveFilters(filters: {
	colors?: string[];
	sizes?: string[];
	priceRange?: string | null;
	colorLabels?: Record<string, string>;
	sizeLabels?: Record<string, string>;
}): ActiveFilter[] {
	const active: ActiveFilter[] = [];

	filters.colors?.forEach((color) => {
		const value = normalizeFacetValueSlug(color);
		active.push({
			key: "color",
			label: "Color",
			value,
			displayValue: filters.colorLabels?.[value] ?? color,
		});
	});

	filters.sizes?.forEach((size) => {
		const value = normalizeFacetValueSlug(size);
		active.push({
			key: "size",
			label: "Size",
			value,
			displayValue: filters.sizeLabels?.[value] ?? size,
		});
	});

	if (filters.priceRange) {
		const [min, max] = filters.priceRange.split("-");
		const label = max ? `$${min} - $${max}` : `$${min}+`;
		active.push({ key: "price", label: "Price", value: label });
	}

	return active;
}
