import { type ReactNode } from "react";
import { executeGraphQL } from "@/lib/graphql";
import { ChannelsListDocument } from "@/gql/graphql";
import { DefaultChannelSlug } from "@/app/config";
import { getStaticChannels } from "@/config/static-pages";

export const generateStaticParams = async () => {
	// Option 1: Use channels from config (no API call, no token needed)
	const configuredChannels = getStaticChannels();
	if (configuredChannels && configuredChannels.length > 0) {
		return configuredChannels.map((channel) => ({ channel }));
	}

	// Option 2: Fetch from Saleor API (requires SALEOR_APP_TOKEN)
	if (process.env.SALEOR_APP_TOKEN) {
		try {
			const channels = await executeGraphQL(ChannelsListDocument, {
				withAuth: false,
				headers: {
					Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
				},
			});
			return (
				channels.channels
					?.filter((channel) => channel.isActive)
					.map((channel) => ({ channel: channel.slug })) ?? []
			);
		} catch (error) {
			// If API is unreachable, fall back to default channel
			console.warn("[generateStaticParams] Failed to fetch channels:", error);
		}
	}

	// Option 3: Fallback to default channel
	return [{ channel: DefaultChannelSlug }];
};

export default function ChannelLayout({ children }: { children: ReactNode }) {
	return children;
}
