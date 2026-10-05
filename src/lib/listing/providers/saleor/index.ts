import "server-only";

import { OrderDirection, ProductOrderField } from "@/gql/graphql";
import {
	ProductListByCategoryProductsDocument,
	ProductListByCollectionProductsDocument,
	ProductListPaginatedDocument,
	type ProductListItemFragment,
} from "@/gql/graphql";
import { graphqlLanguageCodeVariables } from "@/lib/graphql-locale";
import { CACHE_PROFILES, cachedQuery, liveQuery, type CacheProfile } from "@/lib/saleor";
import { resolveCategorySlugsToIds } from "@/lib/catalog/resolve-category-slugs";
import { isCacheableListingQuery } from "@/lib/listing/cacheability";
import { listingQueryWithSupportedSort, type ListingProvider } from "@/lib/listing/provider";
import type { ListingQuery, ListingResult, SortId } from "@/lib/storefront/contract/listing";
import { buildProductListingConstraints, buildSearchFilter, buildSortVariables } from "./constraints";
import { sampleFacets } from "./sample-facets";
import { toProductCardData } from "./to-card";

const LISTING_SORTS = [
	"featured",
	"newest",
	"price_asc",
	"price_desc",
	"bestselling",
] as const satisfies readonly SortId[];
const SEARCH_SORTS = [
	"relevance",
	"newest",
	"price_asc",
	"price_desc",
	"name",
] as const satisfies readonly SortId[];

type Connection = {
	edges: Array<{ node: ProductListItemFragment }>;
	pageInfo: {
		hasNextPage: boolean;
		hasPreviousPage: boolean;
		startCursor?: string | null;
		endCursor?: string | null;
	};
	totalCount?: number | null;
};

export type SaleorTransportData = {
	products?: Connection | null;
	category?: { products?: Connection | null } | null;
	collection?: { products?: Connection | null } | null;
};

export type SaleorListingTransport = (input: {
	kind: ListingQuery["surface"]["kind"];
	variables: Record<string, unknown>;
	cached: boolean;
	profile?: CacheProfile;
	tag?: { channel: string; slug?: string };
}) => Promise<SaleorTransportData>;

function priceToken(range?: { min?: number; max?: number }): string | undefined {
	if (!range) return undefined;
	const min = range.min ?? 0;
	return range.max != null ? `${min}-${range.max}` : `${min}-`;
}

function paginationVariables(query: ListingQuery): {
	first?: number;
	after?: string | null;
	last?: number;
	before?: string;
} {
	if (query.page.mode !== "cursor") {
		// `?page=1` is the first page. Deeper offset pages are a search-engine shape.
		if (query.page.number <= 1) return { first: query.pageSize, after: null };
		throw new Error('Listing provider "saleor" does not support offset pagination.');
	}
	if (query.page.direction === "prev" && query.page.cursor) {
		return { last: query.pageSize, before: query.page.cursor };
	}
	return { first: query.pageSize, after: query.page.cursor ?? null };
}

function saleorSort(query: ListingQuery) {
	if (query.surface.kind === "search" && (!query.sort || query.sort === "relevance")) {
		return { field: ProductOrderField.Rating, direction: OrderDirection.Desc };
	}
	const fromUrl = buildSortVariables(query.sort);
	if (fromUrl) return fromUrl;
	if (query.surface.kind === "collection") {
		return { field: ProductOrderField.Collection, direction: OrderDirection.Asc };
	}
	return undefined;
}

function unwrap(kind: ListingQuery["surface"]["kind"], data: SaleorTransportData): Connection | null {
	if (kind === "category") return data.category?.products ?? null;
	if (kind === "collection") return data.collection?.products ?? null;
	return data.products ?? null;
}

async function kernelTransport(input: Parameters<SaleorListingTransport>[0]): Promise<SaleorTransportData> {
	const variables = input.variables as never;
	if (input.kind === "category") {
		if (input.cached && input.profile && input.tag) {
			return cachedQuery(ProductListByCategoryProductsDocument, {
				profile: input.profile,
				tag: input.tag,
				variables,
			});
		}
		const result = await liveQuery(ProductListByCategoryProductsDocument, { variables });
		if (!result.ok) throw new Error(`[listing:saleor] category: ${result.error.message}`);
		return result.data;
	}
	if (input.kind === "collection") {
		if (input.cached && input.profile && input.tag) {
			return cachedQuery(ProductListByCollectionProductsDocument, {
				profile: input.profile,
				tag: input.tag,
				variables,
			});
		}
		const result = await liveQuery(ProductListByCollectionProductsDocument, { variables });
		if (!result.ok) throw new Error(`[listing:saleor] collection: ${result.error.message}`);
		return result.data;
	}
	if (input.cached && input.profile && input.tag) {
		return cachedQuery(ProductListPaginatedDocument, {
			profile: input.profile,
			tag: input.tag,
			variables,
		});
	}
	const result = await liveQuery(ProductListPaginatedDocument, { variables });
	if (!result.ok) throw new Error(`[listing:saleor] ${input.kind}: ${result.error.message}`);
	return result.data;
}

export function createSaleorListingProvider(
	transport: SaleorListingTransport = kernelTransport,
): ListingProvider {
	const provider: ListingProvider = {
		id: "saleor",
		capabilities: {
			surfaces: ["all", "category", "collection", "search"],
			facetCounts: false,
			pagination: "cursor",
			sorts: {
				all: LISTING_SORTS,
				category: LISTING_SORTS,
				collection: LISTING_SORTS,
				search: SEARCH_SORTS,
			},
		},
		freshness: { kind: "saleor-webhooks" },
		async load(input) {
			const query = listingQueryWithSupportedSort(provider, input);
			const kind = query.surface.kind;
			const slug = kind === "category" || kind === "collection" ? query.surface.slug : undefined;

			const resolvedCategories =
				kind === "all" && query.selections.categories?.length
					? await resolveCategories(query.selections.categories)
					: [];
			const categoryIds = resolvedCategories.map((category) => category.id);
			const priceRange = priceToken(query.range?.price);
			const constraintInput = {
				priceRange,
				categoryIds: kind === "all" ? categoryIds : undefined,
				facets: query.selections,
			};
			const constraints =
				kind === "search" && query.surface.kind === "search"
					? {
							filter: buildSearchFilter({ ...constraintInput, search: query.surface.text }),
							where: undefined,
						}
					: buildProductListingConstraints(constraintInput);

			const cached = isCacheableListingQuery(query);
			const profile =
				kind === "category"
					? CACHE_PROFILES.listingCategory
					: kind === "collection"
						? CACHE_PROFILES.listingCollection
						: CACHE_PROFILES.listingAll;
			const tag = slug ? { channel: query.channel, slug } : { channel: query.channel };

			const data = await transport({
				kind,
				cached,
				profile,
				tag,
				variables: {
					...paginationVariables(query),
					...(slug ? { slug } : {}),
					channel: query.channel,
					sortBy: saleorSort(query),
					...(constraints.filter ? { filter: constraints.filter } : {}),
					...(constraints.where ? { where: constraints.where } : {}),
					...graphqlLanguageCodeVariables(query.locale),
				},
			});

			const connection = unwrap(kind, data);
			if (!connection && kind !== "search") return null;
			const edges = connection?.edges ?? [];
			const items = edges.map((edge) => toProductCardData(edge.node, query.locale, query.channel));
			const sorts = provider.capabilities.sorts[kind] ?? [];
			return {
				items,
				facets: sampleFacets(items, query, resolvedCategories),
				sorts: [...sorts],
				page: {
					mode: "cursor",
					hasNextPage: connection?.pageInfo.hasNextPage ?? false,
					hasPreviousPage: connection?.pageInfo.hasPreviousPage ?? false,
					startCursor: connection?.pageInfo.startCursor,
					endCursor: connection?.pageInfo.endCursor,
				},
				total: { value: connection?.totalCount ?? items.length, exact: true },
				resolvedCategories,
			} satisfies ListingResult;
		},
	};
	return provider;
}

async function resolveCategories(slugs: string[]) {
	const categoryMap = await resolveCategorySlugsToIds(slugs);
	return slugs.flatMap((slug) => {
		const category = categoryMap.get(slug);
		return category ? [{ slug, id: category.id, name: category.name }] : [];
	});
}

export const saleorListingProvider = createSaleorListingProvider();
