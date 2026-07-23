import { LOCALE_DEFINITIONS, getStorefrontLocaleSlugs, type LocaleSlug } from "@/config/locale";
import type { CatalogSlugKind } from "@/lib/catalog/catalog-identity";
import { pickTranslatedField } from "@/lib/saleor-translations";

/**
 * Shape produced by `*LocaleSlugTranslations` GraphQL fragments.
 * Keys are `slug` + LanguageCodeEnum (`slugEN`, `slugPL`, …).
 */
export type LocaleSlugTranslationFields = {
	slug: string;
	slugEN?: { slug?: string | null } | null;
	slugPL?: { slug?: string | null } | null;
	slugDE?: { slug?: string | null } | null;
	slugFR?: { slug?: string | null } | null;
	slugFI?: { slug?: string | null } | null;
	slugNB?: { slug?: string | null } | null;
	slugJA?: { slug?: string | null } | null;
};

function slugAliasForLocale(locale: LocaleSlug): keyof LocaleSlugTranslationFields {
	const code = LOCALE_DEFINITIONS[locale].graphqlLanguageCode;
	return `slug${code}` as keyof LocaleSlugTranslationFields;
}

/**
 * Map of storefront locale slug → canonical catalog URL slug for that language.
 * Falls back to the primary Saleor slug when a translation slug is absent.
 */
export function buildLocaleSlugMap(entity: LocaleSlugTranslationFields): Record<string, string> {
	const map: Record<string, string> = {};

	for (const locale of getStorefrontLocaleSlugs()) {
		const alias = slugAliasForLocale(locale);
		const translation = entity[alias];
		const translated =
			translation && typeof translation === "object"
				? pickTranslatedField(translation, "slug", entity.slug)
				: entity.slug;
		map[locale] = translated ?? entity.slug;
	}

	return map;
}

/** `/{kind}/{slug}` per locale for hreflang / language-switch targets. */
export function buildCatalogPathSuffixByLocale(
	kind: CatalogSlugKind,
	localeSlugMap: Record<string, string>,
): Record<string, string> {
	const suffixes: Record<string, string> = {};
	for (const [locale, slug] of Object.entries(localeSlugMap)) {
		suffixes[locale] = `/${kind}/${encodeURIComponent(slug)}`;
	}
	return suffixes;
}
