import { getDefaultLocaleSlug, getLocaleDefinition, getStorefrontLocaleSlugs } from "@/config/locale";
import { getConfiguredLocaleChannelPairs } from "@/config/locale-channel";
import { getStaticStorefrontChannelSlugs } from "@/config/channels";
import { buildStorefrontPath } from "@/lib/storefront-path";

type LocaleChannelTarget = { locale: string; channel: string };

function getHreflangTargets(fallbackChannel: string): LocaleChannelTarget[] {
	const pairs = getConfiguredLocaleChannelPairs();
	if (pairs) {
		return pairs.map(({ locale, channel }) => ({ locale, channel }));
	}

	return getStorefrontLocaleSlugs().map((locale) => ({ locale, channel: fallbackChannel }));
}

function getXDefaultTarget(fallbackChannel: string): LocaleChannelTarget {
	const pairs = getConfiguredLocaleChannelPairs();
	const defaultLocale = getDefaultLocaleSlug();

	if (pairs) {
		const defaultPair = pairs.find((pair) => pair.locale === defaultLocale) ?? pairs[0];
		if (defaultPair) return defaultPair;
	}

	const defaultChannel = getStaticStorefrontChannelSlugs()[0] ?? fallbackChannel;
	return { locale: defaultLocale, channel: defaultChannel };
}

/**
 * hreflang alternates for the same path suffix.
 * When `STOREFRONT_LOCALE_CHANNELS` is set, each locale uses its paired channel.
 * Includes `x-default` pointing at default locale + its channel.
 */
export function buildLocaleHreflangAlternates(channel: string, pathSuffix: string): Record<string, string> {
	const languages: Record<string, string> = {};

	for (const { locale, channel: targetChannel } of getHreflangTargets(channel)) {
		const definition = getLocaleDefinition(locale);
		if (!definition) continue;
		languages[definition.htmlLang] = buildStorefrontPath(locale, targetChannel, pathSuffix);
	}

	const xDefault = getXDefaultTarget(channel);
	languages["x-default"] = buildStorefrontPath(xDefault.locale, xDefault.channel, pathSuffix);

	return languages;
}
