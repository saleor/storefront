import type {
	ListingQuery,
	ListingResult,
	ListingSurfaceKind,
	SortId,
} from "@/lib/storefront/contract/listing";

/**
 * One backend for one or more listing surfaces.
 * Cache policy is not a provider concern — `load` only fetches.
 */
export type ListingProvider = {
	id: string;
	capabilities: {
		surfaces: ListingSurfaceKind[];
		facetCounts: boolean;
		pagination: "cursor" | "offset";
		sorts: Partial<Record<ListingSurfaceKind, readonly SortId[]>>;
	};
	freshness: { kind: "saleor-webhooks" } | { kind: "ttl"; profile: "listingTtl" };
	/**
	 * `query` is already normalized by core (`normalizeListingQuery`): the sort is one this
	 * provider declared for the surface, and the page is in its pagination mode.
	 * `null` means the category or collection slug does not exist. Transport failures throw.
	 */
	load(query: ListingQuery): Promise<ListingResult | null>;
};

/**
 * A shared URL can ask for a sort this provider does not offer (Bestselling on
 * search, Name on a category). Fall back to the surface default instead of
 * failing the page.
 */
export function listingQueryWithSupportedSort(provider: ListingProvider, query: ListingQuery): ListingQuery {
	if (!query.sort) return query;
	const allowed = provider.capabilities.sorts[query.surface.kind] ?? [];
	if (allowed.includes(query.sort)) return query;
	return { ...query, sort: undefined };
}

/**
 * A page request in the other pagination mode (`?page=2` from a search engine on a
 * cursor provider, or a Saleor cursor on an offset provider) cannot be honored.
 * Serve the first page instead of failing the page.
 */
export function listingQueryWithSupportedPage(provider: ListingProvider, query: ListingQuery): ListingQuery {
	const mode = provider.capabilities.pagination;
	if (query.page.mode === mode) return query;
	return {
		...query,
		page: mode === "offset" ? { mode: "offset", number: 1 } : { mode: "cursor", direction: "next" },
	};
}

/**
 * Fit a URL-derived query to what the provider declares. Core calls this before
 * choosing the cache key, so a provider never sees a query it cannot serve and an
 * unsupported sort does not create its own cache entry.
 */
export function normalizeListingQuery(provider: ListingProvider, query: ListingQuery): ListingQuery {
	return listingQueryWithSupportedPage(provider, listingQueryWithSupportedSort(provider, query));
}

export function assertProviderSupportsSurface(provider: ListingProvider, kind: ListingSurfaceKind): void {
	if (!provider.capabilities.surfaces.includes(kind)) {
		throw new Error(
			`Listing provider "${provider.id}" does not serve "${kind}". Its capabilities.surfaces list must include that surface. Change src/config/listing-providers.ts.`,
		);
	}
}
