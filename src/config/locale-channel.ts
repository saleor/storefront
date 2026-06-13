import { getStorefrontLocaleSlugs, isLocaleSlug, type LocaleSlug } from "@/config/locale";
import { getStaticStorefrontChannelSlugs } from "@/config/channels";

export type LocaleChannelPair = {
	locale: LocaleSlug;
	channel: string;
};

function parseEnvLocaleChannelPairs(raw: string | undefined): LocaleChannelPair[] | null {
	if (!raw?.trim()) return null;

	const pairs: LocaleChannelPair[] = [];

	for (const segment of raw.split(",")) {
		const trimmed = segment.trim();
		if (!trimmed) continue;

		const [localePart, channelPart] = trimmed.split(":");
		const locale = localePart?.trim().toLowerCase();
		const channel = channelPart?.trim();

		if (!locale || !channel || !isLocaleSlug(locale)) continue;

		pairs.push({ locale, channel });
	}

	const unique = [...new Map(pairs.map((pair) => [`${pair.locale}:${pair.channel}`, pair])).values()];
	return unique.length > 0 ? unique : null;
}

/** Optional allowlist — `STOREFRONT_LOCALE_CHANNELS` as `en:default-channel,pl:channel-pln`. */
export function getConfiguredLocaleChannelPairs(): readonly LocaleChannelPair[] | null {
	return parseEnvLocaleChannelPairs(process.env.STOREFRONT_LOCALE_CHANNELS);
}

/** When pairs are configured, reject locale×channel combinations outside the matrix. */
export function isAllowedLocaleChannelPair(locale: string, channel: string): boolean {
	const pairs = getConfiguredLocaleChannelPairs();
	if (!pairs) return true;
	return pairs.some((pair) => pair.locale === locale && pair.channel === channel);
}

/** Static params for `[locale]/[channel]` when a pair matrix is configured. */
export function getLocaleChannelStaticParams(): Array<{ locale: string; channel: string }> {
	const pairs = getConfiguredLocaleChannelPairs();
	if (pairs) {
		return pairs.map(({ locale, channel }) => ({ locale, channel }));
	}

	const locales = getStorefrontLocaleSlugs();
	const channels = getStaticStorefrontChannelSlugs();
	return locales.flatMap((locale) => channels.map((channel) => ({ locale, channel })));
}
