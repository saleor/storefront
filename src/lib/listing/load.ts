import "server-only";

import type { ListingPayload, ListingSurface } from "@/lib/catalog/listing-query";
import type { ListingViewParams } from "@/lib/catalog/listing-view";
import { loadListing } from "@/lib/listing/policy";
import { toListingPayload } from "@/lib/listing/payload";
import { listingQueryFromInput } from "@/lib/listing/query";

export async function loadListingView(input: {
	surface: ListingSurface;
	locale: string;
	channel: string;
	slug?: string;
	view: ListingViewParams;
}): Promise<ListingPayload | null> {
	const query = listingQueryFromInput(input);
	if (!query) return null;
	const result = await loadListing(query);
	return result ? toListingPayload(result) : null;
}
