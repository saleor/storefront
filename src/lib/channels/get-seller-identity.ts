import "server-only";

import { ShopSellerIdentityDocument } from "@/gql/graphql";
import { CACHE_PROFILES, cachedQuery } from "@/lib/saleor";
import { type SellerIdentity, toSellerIdentity } from "./seller-identity";

/**
 * The seller's public details (see `SellerIdentity`). `null` when the shop names no seller.
 *
 * Busted by `shop_metadata_updated`. A company address edit has no Saleor event and shows
 * after the profile's hourly revalidate.
 */
export async function getSellerIdentity(): Promise<SellerIdentity | null> {
	"use cache";

	const data = await cachedQuery(ShopSellerIdentityDocument, { profile: CACHE_PROFILES.shop });
	return toSellerIdentity(data.shop);
}
