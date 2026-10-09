import { PLP_FACETS, STATIC_PRICE_RANGES } from "@/config/facets";
import type { FacetView, ListingQuery, ProductCardView } from "@/lib/storefront/contract/listing";

function selected(query: ListingQuery, id: string): Set<string> {
	return new Set(query.selections[id] ?? []);
}

function priceToken(range?: { min?: number; max?: number }): string | undefined {
	if (!range) return undefined;
	const min = range.min ?? 0;
	return range.max != null ? `${min}-${range.max}` : `${min}-`;
}

/**
 * Facets from the current page sample. Saleor does not return aggregations,
 * so these values have no `count`. Selected values stay visible even when the
 * page no longer contains them.
 */
export function sampleFacets(
	items: ProductCardView[],
	query: ListingQuery,
	resolvedCategories: Array<{ slug: string; id: string; name: string }> = [],
): FacetView[] {
	const colorSelected = selected(query, "colors");
	const sizeSelected = selected(query, "sizes");
	const colors = new Map<string, { label: string; hex?: string }>();
	const sizes = new Map<string, string>();
	for (const item of items) {
		for (const color of item.colors ?? []) {
			if (!colors.has(color.slug)) colors.set(color.slug, { label: color.name, hex: color.hex });
		}
		for (const size of item.sizes ?? []) {
			if (!sizes.has(size.slug)) sizes.set(size.slug, size.name);
		}
	}
	for (const value of colorSelected) {
		if (!colors.has(value)) colors.set(value, { label: value });
	}
	for (const value of sizeSelected) {
		if (!sizes.has(value)) sizes.set(value, value);
	}

	const chosenPrice = priceToken(query.range?.price);
	const facets: FacetView[] = [
		{
			id: "colors",
			labelKey: PLP_FACETS.find((facet) => facet.id === "colors")?.labelKey ?? "colors",
			control: "swatch",
			values: [...colors.entries()].map(([value, meta]) => ({
				value,
				label: meta.label,
				selected: colorSelected.has(value),
				...(meta.hex ? { hex: meta.hex } : {}),
			})),
		},
		{
			id: "sizes",
			labelKey: "sizes",
			control: "chip",
			values: [...sizes.entries()].map(([value, label]) => ({
				value,
				label,
				selected: sizeSelected.has(value),
			})),
		},
		{
			id: "price",
			labelKey: "price",
			control: "range",
			values: STATIC_PRICE_RANGES.map((range) => ({
				value: range.value,
				label: range.label,
				selected: range.value === chosenPrice,
			})),
		},
	];

	if (query.surface.kind === "all") {
		const categorySelected = selected(query, "categories");
		const categories = new Map<string, string>();
		for (const item of items) {
			if (item.category) categories.set(item.category.slug, item.category.name);
		}
		for (const category of resolvedCategories) categories.set(category.slug, category.name);
		for (const value of categorySelected) {
			if (!categories.has(value)) categories.set(value, value);
		}
		facets.push({
			id: "categories",
			labelKey: "categories",
			control: "chip",
			values: [...categories.entries()].map(([value, label]) => ({
				value,
				label,
				selected: categorySelected.has(value),
			})),
		});
	}

	return facets;
}
