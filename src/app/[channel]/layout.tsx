import { type ReactNode } from "react";
import { getKnownChannelSlugs } from "@/lib/channel-slugs";

/**
 * Generate static params for channel routes.
 *
 * Uses NEXT_PUBLIC_DEFAULT_CHANNEL as the primary channel.
 * Optionally discovers additional channels via SALEOR_APP_TOKEN (for multi-channel builds).
 */
export const generateStaticParams = async () => {
	const channels = await getKnownChannelSlugs();

	if (channels.length === 0) {
		console.warn("[Channels] No channels configured. Set NEXT_PUBLIC_DEFAULT_CHANNEL.");
		return [];
	}

	return channels.map((channel) => ({ channel }));
};

export default function ChannelLayout({ children }: { children: ReactNode }) {
	return children;
}
