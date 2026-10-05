/**
 * Client-side filter option lists.
 *
 * Matching is server-side. These helpers only build chips from the current
 * page sample (Saleor has no facet aggregations). Constraint builders live in
 * `src/lib/listing/providers/saleor/constraints.ts`.
 */

import { STATIC_PRICE_RANGES, normalizeFacetValueSlug } from "@/config/facets";
import { compareSizes } from "@/lib/sizes";
import type { ProductCardData } from "./product-card-data";
import type { FilterOption, ActiveFilter, SortOption } from "./filter-bar";

export { STATIC_PRICE_RANGES };

export interface CategoryOption {
	id: string;
	name: string;
	slug: string;
	count: number;
}

/** Price ranges with count=0 for FilterBar compatibility */
export const STATIC_PRICE_RANGES_WITH_COUNT = STATIC_PRICE_RANGES.map((range) => ({ ...range, count: 0 }));

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

/** @deprecated Color/size matching is server-side. Kept for unit tests. */
export function filterProducts(
	products: ProductCardData[],
	filters: { colors?: string[]; sizes?: string[] },
): ProductCardData[] {
	let filtered = products;
	if (filters.colors?.length) {
		const wanted = new Set(filters.colors.map(normalizeFacetValueSlug));
		filtered = filtered.filter((product) =>
			product.colors?.some(
				(color) => wanted.has(colorIdentity(color)) || wanted.has(normalizeFacetValueSlug(color.name)),
			),
		);
	}
	if (filters.sizes?.length) {
		const wanted = new Set(filters.sizes.map(normalizeFacetValueSlug));
		filtered = filtered.filter((product) =>
			product.sizes?.some((size) => {
				const { value, name } = sizeIdentity(size);
				return wanted.has(value) || wanted.has(normalizeFacetValueSlug(name));
			}),
		);
	}
	return filtered;
}

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
