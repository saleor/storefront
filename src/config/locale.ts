/**
 * Locale settings for display formatting. Currency comes from Saleor channels, not here.
 *
 * URL browse routes use lowercase **locale slugs** (`en`, `pl`) under `/{locale}/{channel}/…`.
 * Cache tags and GraphQL use BCP 47 / Saleor `LanguageCodeEnum` from {@link LOCALE_DEFINITIONS}.
 */

export type LocaleSlug = keyof typeof LOCALE_DEFINITIONS;

export type LocaleDefinition = {
	/** BCP 47 — Intl APIs, content cache tags */
	bcp47: string;
	/** Saleor GraphQL translations (`LanguageCodeEnum` string) */
	graphqlLanguageCode: string;
	htmlLang: string;
	ogLocale: string;
};

/**
 * URL slug → runtime locale settings. Extend when adding languages.
 *
 * `graphqlLanguageCode` uses Saleor's base language enum (e.g. `PL`), not regional
 * variants (`PL_PL`). Dashboard translations are stored under the base code — see
 * `/translations/PL/…` in Saleor admin.
 */
export const LOCALE_DEFINITIONS = {
	en: {
		bcp47: "en-US",
		graphqlLanguageCode: "EN",
		htmlLang: "en",
		ogLocale: "en_US",
	},
	pl: {
		bcp47: "pl-PL",
		graphqlLanguageCode: "PL",
		htmlLang: "pl",
		ogLocale: "pl_PL",
	},
	de: {
		bcp47: "de-DE",
		graphqlLanguageCode: "DE",
		htmlLang: "de",
		ogLocale: "de_DE",
	},
	fr: {
		bcp47: "fr-FR",
		graphqlLanguageCode: "FR",
		htmlLang: "fr",
		ogLocale: "fr_FR",
	},
	fi: {
		bcp47: "fi-FI",
		graphqlLanguageCode: "FI",
		htmlLang: "fi",
		ogLocale: "fi_FI",
	},
	/** Norwegian Bokmål — slug `nb`, not `no` (avoids collision with channel navigation / ISO ambiguity). */
	nb: {
		bcp47: "nb-NO",
		/** Saleor `LanguageCodeEnum` is `NB` (Bokmål), not `NO`. */
		graphqlLanguageCode: "NB",
		htmlLang: "nb",
		ogLocale: "nb_NO",
	},
	ja: {
		bcp47: "ja-JP",
		graphqlLanguageCode: "JA",
		htmlLang: "ja",
		ogLocale: "ja_JP",
	},
	ko: {
		bcp47: "ko-KR",
		graphqlLanguageCode: "KO",
		htmlLang: "ko",
		ogLocale: "ko_KR",
	},
} as const satisfies Record<string, LocaleDefinition>;

function parseEnvLocaleList(raw: string | undefined): LocaleSlug[] | null {
	if (!raw?.trim()) return null;

	const slugs = raw
		.split(",")
		.map((slug) => slug.trim().toLowerCase())
		.filter(Boolean);

	const unique = [...new Set(slugs)] as LocaleSlug[];
	return unique.length > 0 ? unique : null;
}

/** Default URL locale slug — `NEXT_PUBLIC_DEFAULT_LOCALE` (e.g. `en`). */
export function getDefaultLocaleSlug(): LocaleSlug {
	const fromEnv = process.env.NEXT_PUBLIC_DEFAULT_LOCALE?.trim().toLowerCase();
	if (fromEnv && isLocaleSlug(fromEnv)) {
		return fromEnv;
	}
	return "en";
}

/**
 * Configured storefront locale slugs (`NEXT_PUBLIC_STOREFRONT_LOCALES`).
 *
 * Must be a `NEXT_PUBLIC_*` var so the allowlist is identical on the server and in the
 * browser — client components (locale links, checkout) validate slugs too.
 */
export function getStorefrontLocaleSlugs(): readonly LocaleSlug[] {
	const configured = parseEnvLocaleList(process.env.NEXT_PUBLIC_STOREFRONT_LOCALES);
	if (configured) {
		return configured.filter(isLocaleSlug);
	}
	return [getDefaultLocaleSlug()];
}

export function isLocaleSlug(value: string): value is LocaleSlug {
	return value in LOCALE_DEFINITIONS;
}

/** Locale slug enabled for this deployment (`NEXT_PUBLIC_STOREFRONT_LOCALES` allowlist). */
export function isStorefrontLocaleSlug(value: string): value is LocaleSlug {
	return isLocaleSlug(value) && (getStorefrontLocaleSlugs() as readonly string[]).includes(value);
}

export function getLocaleDefinition(slug: string): LocaleDefinition | null {
	if (!isLocaleSlug(slug)) return null;
	return LOCALE_DEFINITIONS[slug];
}

/** BCP 47 locales for content cache tags (all configured storefront locales). */
export function getLocaleBcp47List(): readonly string[] {
	return getStorefrontLocaleSlugs().map((slug) => LOCALE_DEFINITIONS[slug].bcp47);
}

/** @deprecated Prefer {@link getLocaleDefinition}(slug) from the URL segment. */
export const localeConfig = {
	default: LOCALE_DEFINITIONS.en.bcp47,
	graphqlLanguageCode: LOCALE_DEFINITIONS.en.graphqlLanguageCode,
	htmlLang: LOCALE_DEFINITIONS.en.htmlLang,
	ogLocale: LOCALE_DEFINITIONS.en.ogLocale,
	available: getLocaleBcp47List(),
	fallbackCurrency: "USD",
} as const;

export function resolveLocaleFromSlug(slug: string): LocaleDefinition {
	return getLocaleDefinition(slug) ?? LOCALE_DEFINITIONS[getDefaultLocaleSlug()];
}

/** Saleor `LanguageCodeEnum` for GraphQL variables from a URL locale slug. */
export function getGraphqlLanguageCode(slug: string): string {
	return resolveLocaleFromSlug(slug).graphqlLanguageCode;
}

/**
 * Format a price with the configured locale.
 */
export function formatPrice(amount: number, currency: string, locale: string = localeConfig.default): string {
	return new Intl.NumberFormat(locale, {
		style: "currency",
		currency: currency,
	}).format(amount);
}

/**
 * Format a date with the configured locale.
 */
export function formatDate(
	date: Date | number,
	options?: Intl.DateTimeFormatOptions,
	locale: string = localeConfig.default,
): string {
	return new Intl.DateTimeFormat(locale, {
		dateStyle: "medium",
		...options,
	}).format(date);
}

/**
 * Format a number with the configured locale.
 */
export function formatNumber(
	value: number,
	options?: Intl.NumberFormatOptions,
	locale = localeConfig.default,
): string {
	return new Intl.NumberFormat(locale, options).format(value);
}
