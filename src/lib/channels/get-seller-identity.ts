import "server-only";

import { ShopSellerIdentityDocument } from "@/gql/graphql";
import { CACHE_PROFILES, cachedQuery } from "@/lib/saleor";
import { type SellerIdentity, toSellerIdentity } from "./seller-identity";

/**
 * The seller's public details (see `SellerIdentity`). `null` when the shop names no seller.
 *
 * Refreshed by the profile's hourly revalidate. `shop_metadata_updated` also busts it when
 * a setup sends that webhook; the Paper app does not (the event needs MANAGE_SETTINGS).
 */
export async function getSellerIdentity(): Promise<SellerIdentity | null> {
	"use cache";

	const data = await cachedQuery(ShopSellerIdentityDocument, { profile: CACHE_PROFILES.shop });
	return toSellerIdentity(data.shop);
}
