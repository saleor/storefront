/**
 * Saleor listing constraints.
 *
 * Saleor allows only one of `filter` or `where`. Attribute facets use `where`
 * so aliases (`size` | `shoe-size`) can OR. Search text is the top-level
 * `products(search:)` argument, which combines with either, so every surface
 * (search included) uses the same constraints.
 */

import type { ProductFilterInput, ProductOrder, ProductWhereInput } from "@/gql/graphql";
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
