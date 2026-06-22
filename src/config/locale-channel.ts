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

/**
 * Optional locale×channel allowlist as `en:default-channel,pl:channel-pln`.
 *
 * Must be public (`NEXT_PUBLIC_`): client consumers (region picker, nav hook) read the matrix
 * at build time, and server consumers (404 guard, hreflang) read the same value. The slugs are
 * already visible in URLs and the picker, so there is nothing sensitive to keep server-side.
 */
export function getConfiguredLocaleChannelPairs(): readonly LocaleChannelPair[] | null {
	return parseEnvLocaleChannelPairs(process.env.NEXT_PUBLIC_STOREFRONT_LOCALE_CHANNELS);
}

/** When a pair matrix is configured, return the channel bound to a locale; otherwise keep the current channel. */
export function getPairedChannelForLocale(locale: string, currentChannel: string): string {
	const pairs = getConfiguredLocaleChannelPairs();
	if (!pairs) return currentChannel;

	const match = pairs.find((pair) => pair.locale === locale);
	return match?.channel ?? currentChannel;
}

/** Locales valid for a channel when a pair matrix is configured; `null` means all locales are allowed. */
export function getLocalesForChannel(channel: string): readonly LocaleSlug[] | null {
	const pairs = getConfiguredLocaleChannelPairs();
	if (!pairs) return null;

	const locales = pairs.filter((pair) => pair.channel === channel).map((pair) => pair.locale);
	return locales.length > 0 ? locales : null;
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
