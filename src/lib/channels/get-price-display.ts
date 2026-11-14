import "server-only";

import { ChannelPriceDisplayDocument } from "@/gql/graphql";
import { CACHE_PROFILES, cachedQuery } from "@/lib/saleor";

/**
 * True when the channel shows prices with tax included, which is when a storefront may
 * say "incl. VAT" next to them. False when Saleor says prices are shown net, and for a
 * channel without products (nothing to read the setting from).
 *
 * Tagged like the all-products listing: the first product created in a channel busts it.
 */
export async function getPricesIncludeTax(channel: string): Promise<boolean> {
	"use cache";

	const data = await cachedQuery(ChannelPriceDisplayDocument, {
		profile: CACHE_PROFILES.listingAll,
		tag: { channel },
		variables: { channel },
	});

	return data.products?.edges[0]?.node.pricing?.displayGrossPrices === true;
}
