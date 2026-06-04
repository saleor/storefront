import { DefaultChannelSlug } from "@/app/config";
import { ChannelsListDocument } from "@/gql/graphql";
import { executePublicGraphQL } from "@/lib/graphql";

/**
 * Channel slugs known to this storefront (default env + optional API discovery).
 * Used for static generation and channel-scoped cache invalidation.
 */
export async function getKnownChannelSlugs(): Promise<string[]> {
	const channels: string[] = [];

	if (DefaultChannelSlug) {
		channels.push(DefaultChannelSlug);
	}

	if (process.env.SALEOR_APP_TOKEN) {
		const result = await executePublicGraphQL(ChannelsListDocument, {
			headers: {
				Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
			},
		});

		if (result.ok && result.data.channels) {
			for (const ch of result.data.channels) {
				if (ch.isActive && !channels.includes(ch.slug)) {
					channels.push(ch.slug);
				}
			}
		} else if (!result.ok) {
			console.warn("[Channels] Failed to fetch additional channels from API:", result.error.message);
		}
	}

	return channels;
}
