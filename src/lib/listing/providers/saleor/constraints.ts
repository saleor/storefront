/**
 * Saleor listing constraints.
 *
 * Saleor allows only one of `filter` or `where`. Attribute facets use `where`
 * so aliases (`size` | `shoe-size`) can OR. Search text exists only on
 * `ProductFilterInput.search`, so the search surface stays on `filter` and
 * uses the primary attribute slug (no alias OR).
 */

import type { AttributeInput, ProductFilterInput, ProductOrder, ProductWhereInput } from "@/gql/graphql";
import { OrderDirection, ProductOrderField } from "@/gql/graphql";
import { PLP_FACETS, normalizeFacetValueSlug, parseFacetParam, type PlpFacetConfig } from "@/config/facets";

export type AttributeFacetSelections = {
	[param: string]: string[] | undefined;
};

export type ProductListingConstraints = {
	filter?: ProductFilterInput;
	where?: ProductWhereInput;
};

type ListingFilterParams = {
	priceRange?: string | null;
	categoryIds?: string[];
	facets?: AttributeFacetSelections;
	colors?: string[] | string | null;
	sizes?: string[] | string | null;
	search?: string | null;
};

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
	const min = parseFloat(minStr ?? "") || 0;
	const max = maxStr ? parseFloat(maxStr) : undefined;
	return { gte: min, ...(max !== undefined && !Number.isNaN(max) ? { lte: max } : {}) };
}

function facetAttributeSlugs(facet: PlpFacetConfig): string[] {
	return [...facet.source.saleor.attributes];
}

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
		attributes.push({ slug: facet.attributeSlug, values });
	}
	return attributes.length > 0 ? attributes : undefined;
}

function hasSelectedFacets(facets: AttributeFacetSelections): boolean {
	return PLP_FACETS.some((facet) => (facets[facet.param]?.length ?? 0) > 0);
}

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
	if (attributeWhere) clauses.push(attributeWhere);
	if (clauses.length === 1) return clauses[0]!;
	return { AND: clauses };
}

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
 * Search text cannot be combined with `where`. Keep the whole search constraint
 * set on `filter`, including attribute facets on their primary slug.
 */
export function buildSearchFilter(params: ListingFilterParams & { search: string }): ProductFilterInput {
	const facets = resolveFacetSelections(params);
	const filter: ProductFilterInput = { search: params.search };
	if (params.categoryIds?.length) filter.categories = params.categoryIds;
	if (params.priceRange) {
		const { gte, lte } = parsePriceRange(params.priceRange);
		filter.price = { gte, ...(lte !== undefined ? { lte } : {}) };
	}
	const attributes = buildAttributeFilterInputs(facets);
	if (attributes) filter.attributes = attributes;
	return filter;
}

export function buildSortVariables(sort: string | undefined): ProductOrder | undefined {
	if (!sort || sort === "featured" || sort === "relevance") return undefined;
	const sortMap: Record<string, ProductOrder> = {
		newest: { field: ProductOrderField.Date, direction: OrderDirection.Desc },
		price_asc: { field: ProductOrderField.Price, direction: OrderDirection.Asc },
		price_desc: { field: ProductOrderField.Price, direction: OrderDirection.Desc },
		bestselling: { field: ProductOrderField.Rating, direction: OrderDirection.Desc },
		name: { field: ProductOrderField.Name, direction: OrderDirection.Asc },
	};
	return sortMap[sort];
}
