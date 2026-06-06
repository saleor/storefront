import { ChannelsListDocument, type ChannelsListQuery } from "@/gql/graphql";
import { executeAppGraphQL } from "@/lib/graphql";
import { CACHE_PROFILES, applyCacheProfile } from "@/lib/cache-manifest";

export async function getCachedChannelsList(): Promise<ChannelsListQuery | null> {
	"use cache";
	applyCacheProfile(CACHE_PROFILES.channels);

	if (!process.env.SALEOR_APP_TOKEN) {
		return null;
	}

	const result = await executeAppGraphQL(ChannelsListDocument, {});

	return result.ok ? result.data : null;
}
