import "server-only";

import { getDefaultLocaleSlug, resolveLocaleFromSlug } from "@/config/locale";
import { bindCacheProfile, CACHE_PROFILES } from "@/lib/saleor";
import { withFreeShippingThreshold } from "@/lib/content/free-shipping";
import { getSaleorFreeShippingThreshold } from "@/lib/content/get-saleor-free-shipping";
import { loadStorefrontContent } from "@/lib/content/provider";
import type { StorefrontContent } from "@/lib/content/types";

/**
 * Cached storefront marketing copy for a channel + browse locale slug, with the
 * free-shipping threshold settled between Saleor and the content override
 * (see `withFreeShippingThreshold`).
 * Cache tags use BCP 47; GraphQL uses Saleor base language codes from the slug.
 */
export async function getStorefrontContent(
	channel: string,
	localeSlug: string = getDefaultLocaleSlug(),
): Promise<StorefrontContent> {
	"use cache";
	const bcp47 = resolveLocaleFromSlug(localeSlug).bcp47;
	bindCacheProfile(CACHE_PROFILES.storefrontContent, { channel, locale: bcp47 });

	const [content, saleorFreeShippingThreshold] = await Promise.all([
		loadStorefrontContent({ channel, locale: localeSlug }),
		getSaleorFreeShippingThreshold(channel),
	]);

	return withFreeShippingThreshold(content, saleorFreeShippingThreshold, { channel });
}
