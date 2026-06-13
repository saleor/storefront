import { type ReactNode } from "react";
import { notFound } from "next/navigation";
import { isAllowedStorefrontChannel } from "@/config/channels";
import { getConfiguredLocaleChannelPairs, isAllowedLocaleChannelPair } from "@/config/locale-channel";
import { getStorefrontChannelSlugs } from "@/lib/channel-slugs";

/**
 * Generate static params for channel routes.
 *
 * Uses NEXT_PUBLIC_DEFAULT_CHANNEL as fallback.
 * Prefer STOREFRONT_CHANNELS allowlist; API discovery is opt-in via STOREFRONT_DISCOVER_CHANNELS.
 */
export const generateStaticParams = async () => {
	const configuredPairs = getConfiguredLocaleChannelPairs();
	if (configuredPairs) {
		const channels = [...new Set(configuredPairs.map((pair) => pair.channel))];
		return channels.map((channel) => ({ channel }));
	}

	const channels = await getStorefrontChannelSlugs();

	if (channels.length === 0) {
		console.warn(
			"[Channels] No channels configured. Set NEXT_PUBLIC_DEFAULT_CHANNEL or STOREFRONT_CHANNELS.",
		);
		return [];
	}

	return channels.map((channel) => ({ channel }));
};

export default async function ChannelLayout({
	children,
	params,
}: {
	children: ReactNode;
	params: Promise<{ locale: string; channel: string }>;
}) {
	const { locale, channel } = await params;
	const allowedSlugs = await getStorefrontChannelSlugs();

	if (!isAllowedStorefrontChannel(channel, allowedSlugs) || !isAllowedLocaleChannelPair(locale, channel)) {
		notFound();
	}

	return children;
}
