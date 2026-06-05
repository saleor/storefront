import { cache } from "react";
import {
	getConfiguredStorefrontChannelSlugs,
	getStaticStorefrontChannelSlugs,
	needsAsyncChannelDiscovery,
} from "@/config/channels";
import { getCachedChannelsList } from "@/lib/channels/get-channels-data";

/** Active channel slugs from a ChannelsList query result. */
export function activeChannelSlugsFromList(
	channels: ReadonlyArray<{ slug: string; isActive?: boolean | null }> | null | undefined,
): string[] {
	const slugs: string[] = [];
	for (const channel of channels ?? []) {
		if (channel.isActive !== false && !slugs.includes(channel.slug)) {
			slugs.push(channel.slug);
		}
	}
	return slugs;
}

async function discoverActiveChannelsFromApi(): Promise<string[]> {
	// Reuse "use cache" ChannelsList fetch — safe during PPR (unlike raw executePublicGraphQL in layout).
	const data = await getCachedChannelsList();

	if (!data?.channels) {
		console.warn("[Channels] Failed to discover channels from API (no cached list)");
		return getStaticStorefrontChannelSlugs();
	}

	const slugs = activeChannelSlugsFromList(data.channels);
	return slugs.length > 0 ? slugs : getStaticStorefrontChannelSlugs();
}

async function resolveStorefrontChannelSlugs(): Promise<string[]> {
	if (getConfiguredStorefrontChannelSlugs()) {
		return getStaticStorefrontChannelSlugs();
	}

	if (needsAsyncChannelDiscovery()) {
		return discoverActiveChannelsFromApi();
	}

	return getStaticStorefrontChannelSlugs();
}

/**
 * Channel slugs exposed in this storefront (routes, cache invalidation, selector filter).
 * Deduplicated per request via React.cache().
 */
export const getStorefrontChannelSlugs = cache(resolveStorefrontChannelSlugs);
