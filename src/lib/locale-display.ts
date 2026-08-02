import { getStorefrontLocaleSlugs, LOCALE_DEFINITIONS, type LocaleSlug } from "@/config/locale";

export type LocaleSelectOption = {
	slug: LocaleSlug;
	/** Language name in its own language (endonym) — e.g. Deutsch, Polski, English */
	label: string;
};

/**
 * Endonym for a locale slug — each language shown in its own language (W3C / global UX norm).
 * Uses `htmlLang` (ISO 639-1) so "en" → English, not "American English".
 */
export function getLocaleEndonym(slug: LocaleSlug): string {
	const { htmlLang } = LOCALE_DEFINITIONS[slug];
	const displayNames = new Intl.DisplayNames([htmlLang], { type: "language" });
	return displayNames.of(htmlLang) ?? slug;
}

/** Configured storefront locales with display labels for pickers. */
export function getStorefrontLocaleOptions(): LocaleSelectOption[] {
	return getStorefrontLocaleSlugs().map((slug) => ({
		slug,
		label: getLocaleEndonym(slug),
	}));
}
