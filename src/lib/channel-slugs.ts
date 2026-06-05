import { cache } from "react";
import {
	getConfiguredStorefrontChannelSlugs,
	getStaticStorefrontChannelSlugs,
	needsAsyncChannelDiscovery,
} from "@/config/channels";
import { ChannelsListDocument } from "@/gql/graphql";
import { executePublicGraphQL } from "@/lib/graphql";

async function discoverActiveChannelsFromApi(): Promise<string[]> {
	const result = await executePublicGraphQL(ChannelsListDocument, {
		headers: {
			Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
		},
	});

	if (!result.ok) {
		console.warn("[Channels] Failed to discover channels from API:", result.error.message);
		return getStaticStorefrontChannelSlugs();
	}

	const slugs: string[] = [];
	for (const channel of result.data.channels ?? []) {
		if (channel.isActive && !slugs.includes(channel.slug)) {
			slugs.push(channel.slug);
		}
	}

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
