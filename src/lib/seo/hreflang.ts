import { getDefaultLocaleSlug, getLocaleDefinition, getStorefrontLocaleSlugs } from "@/config/locale";
import { getConfiguredLocaleChannelPairs } from "@/config/locale-channel";
import { getStaticStorefrontChannelSlugs } from "@/config/channels";
import { buildStorefrontPath } from "@/lib/storefront-path";

type LocaleChannelTarget = { locale: string; channel: string };

/** Same suffix for every locale, or a per-locale suffix map (translated catalog slugs). */
export type HreflangPathInput = string | Record<string, string>;

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

function resolvePathSuffix(pathInput: HreflangPathInput, locale: string, fallbackSuffix: string): string {
	if (typeof pathInput === "string") return pathInput;
	return pathInput[locale] ?? pathInput[getDefaultLocaleSlug()] ?? fallbackSuffix;
}

/**
 * hreflang alternates for browse URLs.
 * Pass a single path suffix, or a per-locale map when catalog slugs are translated (ADR 0004).
 * When `NEXT_PUBLIC_STOREFRONT_LOCALE_CHANNELS` is set, each locale uses its paired channel.
 * Includes `x-default` pointing at default locale + its channel.
 */
export function buildLocaleHreflangAlternates(
	channel: string,
	pathSuffix: HreflangPathInput,
): Record<string, string> {
	const languages: Record<string, string> = {};
	const fallbackSuffix = typeof pathSuffix === "string" ? pathSuffix : (Object.values(pathSuffix)[0] ?? "");

	for (const { locale, channel: targetChannel } of getHreflangTargets(channel)) {
		const definition = getLocaleDefinition(locale);
		if (!definition) continue;
		const suffix = resolvePathSuffix(pathSuffix, locale, fallbackSuffix);
		languages[definition.htmlLang] = buildStorefrontPath(locale, targetChannel, suffix);
	}

	const xDefault = getXDefaultTarget(channel);
	const xDefaultSuffix = resolvePathSuffix(pathSuffix, xDefault.locale, fallbackSuffix);
	languages["x-default"] = buildStorefrontPath(xDefault.locale, xDefault.channel, xDefaultSuffix);

	return languages;
}
