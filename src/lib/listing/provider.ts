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
	/** `null` means the category or collection slug does not exist. Transport failures throw. */
	load(query: ListingQuery): Promise<ListingResult | null>;
};

export function assertSupportedSort(provider: ListingProvider, query: ListingQuery): void {
	if (!query.sort) return;
	const allowed = provider.capabilities.sorts[query.surface.kind] ?? [];
	if (!allowed.includes(query.sort)) {
		throw new Error(
			`Listing provider "${provider.id}" does not support sort "${query.sort}" on ${query.surface.kind}.`,
		);
	}
}

export function assertProviderSupportsSurface(provider: ListingProvider, kind: ListingSurfaceKind): void {
	if (!provider.capabilities.surfaces.includes(kind)) {
		throw new Error(
			`Listing provider "${provider.id}" does not serve "${kind}". Its capabilities.surfaces list must include that surface. Change src/config/listing-providers.ts.`,
		);
	}
}
