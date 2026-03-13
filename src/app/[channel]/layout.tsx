import { type ReactNode } from "react";
import { executePublicGraphQL } from "@/lib/graphql";
import { ChannelsListDocument } from "@/gql/graphql";
import { DefaultChannelSlug } from "@/app/config";

/**
 * Generate static params for channel routes.
 *
 * Uses NEXT_PUBLIC_DEFAULT_CHANNEL as the primary channel.
 * Optionally discovers additional channels via SALEOR_APP_TOKEN (for multi-channel builds).
 */
export const generateStaticParams = async () => {
	const channels: string[] = [];

	// 1. Add default channel (required)
	if (DefaultChannelSlug) {
		channels.push(DefaultChannelSlug);
	}

	// 2. Optionally discover additional channels via API (for multi-channel setups)
	if (process.env.SALEOR_APP_TOKEN) {
		const result = await executePublicGraphQL(ChannelsListDocument, {
			headers: {
				Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
			},
		});

		if (result.ok && result.data.channels) {
			const activeChannelSlugs = result.data.channels.filter((ch) => ch.isActive).map((ch) => ch.slug);

			// Add channels not already in the list
			for (const slug of activeChannelSlugs) {
				if (!channels.includes(slug)) {
					channels.push(slug);
				}
			}
		} else if (!result.ok) {
			console.warn("[Channels] Failed to fetch additional channels from API:", result.error.message);
		}
	}

	// Return channels (or empty if none configured - will show setup page)
	if (channels.length === 0) {
		console.warn("[Channels] No channels configured. Set NEXT_PUBLIC_DEFAULT_CHANNEL.");
		return [];
	}

	return channels.map((channel) => ({ channel }));
};

export default function ChannelLayout({ children }: { children: ReactNode }) {
	return children;
}
