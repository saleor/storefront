import "server-only";

import {
	PRIOR_PRICE_COUNTRIES,
	priceReductionReferenceByChannel,
	type PriceReductionReference,
} from "@/config/pricing";
import { ChannelPriceDisplayDocument } from "@/gql/graphql";
import { getCachedChannelsList } from "@/lib/channels/get-channels-data";
import { resolvePriceReductionReference } from "@/lib/pricing";
import { CACHE_PROFILES, cachedQuery } from "@/lib/saleor";

type ChannelPriceDisplay = {
	/**
	 * Saleor says the channel shows prices with tax included. `true` when no product tells:
	 * Paper always renders gross amounts, so "incl. VAT" describes what the shopper sees.
	 */
	pricesIncludeTax: boolean;
	/** Country codes the channel ships to (from its shipping zones). */
	shippingCountries: string[];
};

/**
 * How a channel shows prices, in one cached read. Tagged like the all-products listing:
 * the first product created in a channel busts it. A changed shipping zone shows after
 * the profile's hourly revalidate.
 */
async function getChannelPriceDisplay(channel: string): Promise<ChannelPriceDisplay> {
	"use cache";

	// Optional read with safe fallbacks (notice shown, stricter reduction rule), so a field
	// error must not take down every page that shows a price.
	const data = await cachedQuery(ChannelPriceDisplayDocument, {
		profile: CACHE_PROFILES.listingAll,
		tag: { channel },
		variables: { channel },
		allowPartialData: true,
	});

	const displayGrossPrices = data.products?.edges
		.map((edge) => edge.node.pricing?.displayGrossPrices)
		.find((value): value is boolean => typeof value === "boolean");

	return {
		pricesIncludeTax: displayGrossPrices ?? true,
		shippingCountries: (data.channel?.countries ?? []).map((country) => country.code),
	};
}

/**
 * True when the channel shows prices with tax included, which is when a storefront may
 * say "incl. VAT" next to them. False only when Saleor says prices are shown net.
 */
export async function getPricesIncludeTax(channel: string): Promise<boolean> {
	return (await getChannelPriceDisplay(channel)).pricesIncludeTax;
}

/**
 * Which price the channel measures reductions against: the override in
 * `src/config/pricing.ts`, else `"prior-price"` for a channel that ships to the EU/EEA and
 * `"list-price"` for the rest. See `resolvePriceReductionReference`.
 */
export async function getPriceReductionReference(channel: string): Promise<PriceReductionReference> {
	const override = priceReductionReferenceByChannel[channel];
	if (override) {
		return override;
	}

	const { shippingCountries } = await getChannelPriceDisplay(channel);
	// Only a channel without shipping countries needs the default country (app token).
	const defaultCountry =
		shippingCountries.length === 0
			? (await getCachedChannelsList())?.channels?.find((candidate) => candidate.slug === channel)
					?.defaultCountry.code
			: null;

	return resolvePriceReductionReference({
		shippingCountries,
		defaultCountry,
		priorPriceCountries: PRIOR_PRICE_COUNTRIES,
	});
}
