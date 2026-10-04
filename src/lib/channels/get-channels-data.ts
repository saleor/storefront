import "server-only";

import { ChannelsListDocument, type ChannelsListQuery } from "@/gql/graphql";
import { CACHE_PROFILES, cachedQuery } from "@/lib/saleor";

export async function getCachedChannelsList(): Promise<ChannelsListQuery | null> {
	"use cache";

	if (!process.env.SALEOR_APP_TOKEN) {
		return null;
	}

	return cachedQuery(ChannelsListDocument, { profile: CACHE_PROFILES.channels });
}
