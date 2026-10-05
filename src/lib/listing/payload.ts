import type { ListingPayload, ListingPageInfo } from "@/lib/catalog/listing-query";
import type { ListingResult } from "@/lib/storefront/contract/listing";

export function toListingPayload(result: ListingResult): ListingPayload {
	const pageInfo: ListingPageInfo =
		result.page.mode === "cursor"
			? {
					hasNextPage: result.page.hasNextPage,
					hasPreviousPage: result.page.hasPreviousPage,
					startCursor: result.page.startCursor,
					endCursor: result.page.endCursor,
				}
			: {
					hasNextPage: result.page.hasNextPage,
					hasPreviousPage: result.page.hasPreviousPage,
				};
	return {
		products: result.items,
		pageInfo,
		totalCount: result.total.value,
		resolvedCategories: result.resolvedCategories ?? [],
		facets: result.facets,
		sorts: result.sorts,
		page: result.page,
		totalExact: result.total.exact,
	};
}
