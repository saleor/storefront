import "server-only";

import { ChannelsListDocument, type ChannelsListQuery } from "@/gql/graphql";
import { CACHE_PROFILES, cachedQuery } from "@/lib/saleor";

export async function getCachedChannelsList(): Promise<ChannelsListQuery | null> {
	// Outside `"use cache"`. A missing token must not be stored as the channel list
	// for the channels TTL (revalidate 1 day, expire 1 week).
	if (!process.env.SALEOR_APP_TOKEN) {
		return null;
	}

	return readChannelsList();
}

async function readChannelsList(): Promise<ChannelsListQuery> {
	"use cache";
	return cachedQuery(ChannelsListDocument, { profile: CACHE_PROFILES.channels });
}
