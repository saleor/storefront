import "server-only";

import { ShopCountriesDocument } from "@/gql/graphql";
import { CACHE_PROFILES, cachedQuery } from "@/lib/saleor";

/** Codes of every country Saleor knows. Store-wide and static, so cached for days. */
export async function getShopCountryCodes(): Promise<string[]> {
	"use cache";

	const data = await cachedQuery(ShopCountriesDocument, { profile: CACHE_PROFILES.channels });
	return data.shop.countries.map((country) => country.code);
}
