import { localeConfig } from "@/config/locale";
import { applyCacheProfile, CACHE_PROFILES } from "@/lib/cache-manifest";
import { loadStorefrontContent } from "@/lib/content/provider";
import type { StorefrontContent } from "@/lib/content/types";

/**
 * Cached storefront marketing copy for a channel + locale.
 * Saleor Models support translations; locale keys the cache — provider fetch not wired yet.
 */
export async function getStorefrontContent(
	channel: string,
	locale: string = localeConfig.default,
): Promise<StorefrontContent> {
	"use cache";
	applyCacheProfile(CACHE_PROFILES.storefrontContent, { channel, locale });

	return loadStorefrontContent({ channel, locale });
}
