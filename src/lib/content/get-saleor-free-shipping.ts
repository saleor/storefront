import "server-only";

import { ChannelShippingMethodsDocument, type CountryCode } from "@/gql/graphql";
import { getCachedChannelsList } from "@/lib/channels/get-channels-data";
import { freeShippingThresholdFromMethods } from "@/lib/content/free-shipping";
import { CACHE_PROFILES, cachedQuery } from "@/lib/saleor";

/**
 * Free-shipping threshold Saleor applies in the channel's default country, in the channel
 * currency. `null` when Saleor offers no free method there, or when the default country
 * is unknown (it needs `SALEOR_APP_TOKEN`).
 *
 * Shoppers in another country can have a different threshold; the storefront knows the
 * destination only at checkout, where the shipping step shows Saleor's own methods.
 *
 * Cached with the storefront content it feeds. No shipping webhook busts it: a changed
 * shipping price shows after the profile's hourly revalidate.
 */
export async function getSaleorFreeShippingThreshold(channel: string, bcp47: string): Promise<number | null> {
	"use cache";

	const channels = await getCachedChannelsList();
	const country = channels?.channels?.find((candidate) => candidate.slug === channel)?.defaultCountry.code;
	if (!country) {
		return null;
	}

	const data = await cachedQuery(ChannelShippingMethodsDocument, {
		profile: CACHE_PROFILES.storefrontContent,
		tag: { channel, locale: bcp47 },
		// `Channel.defaultCountry.code` is typed as a string; it is one of Saleor's country codes.
		variables: { channel, country: country as CountryCode },
	});

	return freeShippingThresholdFromMethods(data.shop.availableShippingMethods);
}
