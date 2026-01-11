import type { ProductCardData } from "./ProductCard";
import type { FilterOption, ActiveFilter } from "./FilterBar";

export interface CategoryOption {
	id: string;
	name: string;
	slug: string;
	count: number;
}

/**
 * Extract unique category options from products with counts
 */
export function extractCategoryOptions(products: ProductCardData[]): CategoryOption[] {
	const categoryMap = new Map<string, { id: string; name: string; slug: string; count: number }>();

	products.forEach((product) => {
		if (product.category) {
			const existing = categoryMap.get(product.category.slug);
			if (existing) {
				existing.count++;
			} else {
				categoryMap.set(product.category.slug, {
					id: product.category.id,
					name: product.category.name,
					slug: product.category.slug,
					count: 1,
				});
			}
		}
	});

	return Array.from(categoryMap.values()).sort((a, b) => b.count - a.count);
}

/**
 * Extract unique color options from products with counts.
 * If selectedColors is provided, ensures those are always included
 * (with count 0) so users can deselect them even when no products match.
 */
export function extractColorOptions(products: ProductCardData[], selectedColors?: string[]): FilterOption[] {
	const colorMap = new Map<string, { count: number; hex?: string }>();

	products.forEach((product) => {
		product.colors?.forEach((color) => {
			const existing = colorMap.get(color.name);
			if (existing) {
				existing.count++;
			} else {
				colorMap.set(color.name, { count: 1, hex: color.hex });
			}
		});
	});

	// Ensure selected colors are always included so they can be deselected
	selectedColors?.forEach((color) => {
		if (!colorMap.has(color)) {
			colorMap.set(color, { count: 0 });
		}
	});

	return Array.from(colorMap.entries())
		.map(([name, { count, hex }]) => ({ name, count, hex }))
		.sort((a, b) => b.count - a.count);
}

/**
 * Extract unique size options from products with counts.
 * If selectedSizes is provided, ensures those are always included
 * (with count 0) so users can deselect them even when no products match.
 */
export function extractSizeOptions(products: ProductCardData[], selectedSizes?: string[]): FilterOption[] {
	const sizeMap = new Map<string, number>();

	products.forEach((product) => {
		product.sizes?.forEach((size) => {
			sizeMap.set(size, (sizeMap.get(size) || 0) + 1);
		});
	});

	// Ensure selected sizes are always included so they can be deselected
	selectedSizes?.forEach((size) => {
		if (!sizeMap.has(size)) {
			sizeMap.set(size, 0);
		}
	});

	// Sort sizes in logical order
	const sizeOrder: Record<string, number> = {
		XXS: 1,
		XS: 2,
		S: 3,
		M: 4,
		L: 5,
		XL: 6,
		XXL: 7,
		XXXL: 8,
	};

	return Array.from(sizeMap.entries())
		.map(([name, count]) => ({ name, count }))
		.sort((a, b) => {
			const aOrder = sizeOrder[a.name.toUpperCase()] ?? (parseInt(a.name) || 100);
			const bOrder = sizeOrder[b.name.toUpperCase()] ?? (parseInt(b.name) || 100);
			return aOrder - bOrder;
		});
}

/**
 * Static price ranges for server-side filtering.
 * These are fixed and don't depend on the current products,
 * so they remain stable when price filtering is applied.
 */
export const STATIC_PRICE_RANGES: readonly { label: string; value: string }[] = [
	{ label: "Under $50", value: "0-50" },
	{ label: "$50 - $100", value: "50-100" },
	{ label: "$100 - $200", value: "100-200" },
	{ label: "$200+", value: "200-" },
] as const;

/**
 * Static price ranges with count field for FilterBar compatibility.
 * Count is 0 since these are server-side filtered.
 */
export const STATIC_PRICE_RANGES_WITH_COUNT: readonly { label: string; value: string; count: number }[] =
	STATIC_PRICE_RANGES.map((range) => ({ ...range, count: 0 }));

/**
 * Get static price ranges for filtering.
 * @deprecated Use STATIC_PRICE_RANGES_WITH_COUNT constant instead
 */
export function getStaticPriceRanges(): { label: string; value: string; count: number }[] {
	return [...STATIC_PRICE_RANGES_WITH_COUNT];
}

/**
 * Generate price range options based on product prices.
 * Use this for client-side filtering only.
 * For server-side filtering, use getStaticPriceRanges() instead.
 */
export function generatePriceRanges(
	products: ProductCardData[],
	_currency: string = "USD",
): { label: string; value: string; count: number }[] {
	if (products.length === 0) return [];

	const prices = products.map((p) => p.price);
	const maxPrice = Math.max(...prices);

	// Create 4 price ranges
	const ranges: { min: number; max: number; label: string; value: string }[] = [];

	if (maxPrice <= 25) {
		ranges.push({ min: 0, max: 25, label: "Under $25", value: "0-25" });
	} else if (maxPrice <= 50) {
		ranges.push(
			{ min: 0, max: 25, label: "Under $25", value: "0-25" },
			{ min: 25, max: 50, label: "$25 - $50", value: "25-50" },
		);
	} else if (maxPrice <= 100) {
		ranges.push(
			{ min: 0, max: 25, label: "Under $25", value: "0-25" },
			{ min: 25, max: 50, label: "$25 - $50", value: "25-50" },
			{ min: 50, max: 100, label: "$50 - $100", value: "50-100" },
		);
	} else {
		ranges.push(
			{ min: 0, max: 50, label: "Under $50", value: "0-50" },
			{ min: 50, max: 100, label: "$50 - $100", value: "50-100" },
			{ min: 100, max: 200, label: "$100 - $200", value: "100-200" },
			{ min: 200, max: Infinity, label: "$200+", value: "200-" },
		);
	}

	// Count products in each range
	return ranges
		.map((range) => ({
			label: range.label,
			value: range.value,
			count: products.filter((p) => p.price >= range.min && p.price < range.max).length,
		}))
		.filter((r) => r.count > 0);
}

/**
 * Filter products based on selected filters (client-side).
 *
 * Server-side filters (handled by Saleor API before this runs):
 * - categories: Filtered via ProductFilterInput.categories
 * - priceRange: Filtered via ProductFilterInput.price
 *
 * Client-side filters (handled here):
 * - colors: Saleor doesn't support attribute filtering without IDs
 * - sizes: Same as colors
 */
export function filterProducts(
	products: ProductCardData[],
	filters: {
		colors?: string[];
		sizes?: string[];
	},
): ProductCardData[] {
	let filtered = products;

	// Filter by colors (client-side, OR logic)
	if (filters.colors && filters.colors.length > 0) {
		filtered = filtered.filter(
			(product) => product.colors?.some((color) => filters.colors!.includes(color.name)),
		);
	}

	// Filter by sizes (client-side, OR logic)
	if (filters.sizes && filters.sizes.length > 0) {
		filtered = filtered.filter((product) => product.sizes?.some((size) => filters.sizes!.includes(size)));
	}

	return filtered;
}

/**
 * Build active filters array for display.
 *
 * Note: Categories are now handled server-side and should be added
 * separately using the resolved category data from the server.
 */
export function buildActiveFilters(
	filters: {
		colors?: string[];
		sizes?: string[];
		priceRange?: string | null;
	},
	_categoryOptions?: CategoryOption[],
): ActiveFilter[] {
	const active: ActiveFilter[] = [];

	filters.colors?.forEach((color) => {
		active.push({ key: "color", label: "Color", value: color });
	});

	filters.sizes?.forEach((size) => {
		active.push({ key: "size", label: "Size", value: size });
	});

	if (filters.priceRange) {
		const [min, max] = filters.priceRange.split("-");
		const label = max ? `$${min} - $${max}` : `$${min}+`;
		active.push({ key: "price", label: "Price", value: label });
	}

	return active;
}

/**
 * Parse filters from URL search params
 */
export function parseFiltersFromUrl(searchParams: URLSearchParams): {
	colors: string[];
	sizes: string[];
	priceRange: string | null;
	sort: string;
} {
	const colors = searchParams.get("colors")?.split(",").filter(Boolean) || [];
	const sizes = searchParams.get("sizes")?.split(",").filter(Boolean) || [];
	const priceRange = searchParams.get("price") || null;
	const sort = searchParams.get("sort") || "featured";

	return { colors, sizes, priceRange, sort };
}

/**
 * Build URL search params from filters
 */
export function buildFilterUrl(
	baseUrl: string,
	filters: {
		colors?: string[];
		sizes?: string[];
		priceRange?: string | null;
		sort?: string;
	},
): string {
	const params = new URLSearchParams();

	if (filters.colors && filters.colors.length > 0) {
		params.set("colors", filters.colors.join(","));
	}
	if (filters.sizes && filters.sizes.length > 0) {
		params.set("sizes", filters.sizes.join(","));
	}
	if (filters.priceRange) {
		params.set("price", filters.priceRange);
	}
	if (filters.sort && filters.sort !== "featured") {
		params.set("sort", filters.sort);
	}

	const queryString = params.toString();
	return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}
