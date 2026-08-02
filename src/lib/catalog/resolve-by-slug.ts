import { getGraphqlLanguageCode } from "@/config/locale";
import type { LanguageCodeEnum } from "@/gql/graphql";

/**
 * Resolve a catalog entity by URL slug, honoring Saleor translated slugs.
 *
 * Saleor does not fall back between primary and translated slug lookups — the
 * client must try both. Prefer the translated match (SEO / locale-canonical URLs),
 * then primary. Applies to every locale, including the default: link helpers may
 * emit `translation.slug` whenever merchants set one.
 *
 * @see docs/adr/0004-translatable-slugs.md
 */
export async function resolveByPossiblyTranslatedSlug<T>(options: {
	localeSlug: string;
	urlSlug: string;
	fetchByPrimarySlug: (slug: string) => Promise<T | null>;
	fetchByTranslatedSlug: (slug: string, slugLanguageCode: LanguageCodeEnum) => Promise<T | null>;
}): Promise<T | null> {
	const { localeSlug, urlSlug, fetchByPrimarySlug, fetchByTranslatedSlug } = options;
	const languageCode = getGraphqlLanguageCode(localeSlug) as LanguageCodeEnum;

	const translated = await fetchByTranslatedSlug(urlSlug, languageCode);
	if (translated) return translated;

	return fetchByPrimarySlug(urlSlug);
}
