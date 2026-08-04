import { Suspense, type ReactNode } from "react";
import { notFound } from "next/navigation";
import { isStorefrontLocaleSlug } from "@/config/locale";
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

/**
 * Validate locale/channel, then render children.
 *
 * Must wrap `{children}` so invalid routes never fetch/render before `notFound()`.
 * Must NOT use `fallback={children}` — that re-renders the browse tree as the Suspense
 * fallback while this guard awaits `params`, and instant-shell validation then treats
 * nested chrome `await params` as outside Suspense. `fallback={null}` keeps the params
 * read inside the boundary without leaking children into the fallback slot.
 */
async function ChannelRouteGuard({
	children,
	params,
}: {
	children: ReactNode;
	params: Promise<{ locale: string; channel: string }>;
}) {
	const { locale, channel } = await params;
	const allowedSlugs = await getStorefrontChannelSlugs();

	if (
		!isStorefrontLocaleSlug(locale) ||
		!isAllowedStorefrontChannel(channel, allowedSlugs) ||
		!isAllowedLocaleChannelPair(locale, channel)
	) {
		notFound();
	}

	return children;
}

export default function ChannelLayout({
	children,
	params,
}: {
	children: ReactNode;
	params: Promise<{ locale: string; channel: string }>;
}) {
	return (
		<Suspense fallback={null}>
			<ChannelRouteGuard params={params}>{children}</ChannelRouteGuard>
		</Suspense>
	);
}
