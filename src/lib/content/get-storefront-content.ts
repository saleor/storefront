import { getDefaultLocaleSlug, resolveLocaleFromSlug } from "@/config/locale";
import { applyCacheProfile, CACHE_PROFILES } from "@/lib/cache-manifest";
import { loadStorefrontContent } from "@/lib/content/provider";
import type { StorefrontContent } from "@/lib/content/types";

/**
 * Cached storefront marketing copy for a channel + browse locale slug.
 * Cache tags use BCP 47; GraphQL uses Saleor base language codes from the slug.
 */
export async function getStorefrontContent(
	channel: string,
	localeSlug: string = getDefaultLocaleSlug(),
): Promise<StorefrontContent> {
	"use cache";
	const bcp47 = resolveLocaleFromSlug(localeSlug).bcp47;
	applyCacheProfile(CACHE_PROFILES.storefrontContent, { channel, locale: bcp47 });

	return loadStorefrontContent({ channel, locale: localeSlug });
}
