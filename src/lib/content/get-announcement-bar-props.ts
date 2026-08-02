import { resolveLocaleFromSlug } from "@/config/locale";
import { resolveChannelCurrency } from "@/lib/channels/resolve-channel-currency";
import { applyCacheProfile, CACHE_PROFILES } from "@/lib/cache-manifest";
import { defaultStorefrontContent } from "@/lib/content/defaults";
import { getStorefrontContent } from "@/lib/content/get-storefront-content";
import { buildPolicyLabelValues, formatPolicyAwareLabel } from "@/lib/content/policy-format";
import type { AnnouncementBarContent, StorefrontContent } from "@/lib/content/types";

/** Pure policy interpolation for announcement copy — testable without the cache runtime. */
export function buildAnnouncementBarContent(
	content: Pick<StorefrontContent, "policies" | "chrome">,
	{ currency, localeSlug }: { currency: string; localeSlug: string },
): AnnouncementBarContent {
	const policyValues = buildPolicyLabelValues(content.policies, {
		currency,
		locale: resolveLocaleFromSlug(localeSlug).bcp47,
	});
	const bar = content.chrome.announcementBar;

	return {
		...bar,
		message: formatPolicyAwareLabel(bar.message, policyValues, {
			defaultTemplate: defaultStorefrontContent.chrome.announcementBar.message,
			context: "announcementBar.message",
		}),
	};
}

/**
 * Cached storefront announcement copy with channel policy tokens resolved
 * (`{freeShippingThreshold}`, `{returnsWindowDays}`). Used by the browse chrome slot.
 */
export async function getAnnouncementBarProps(
	channel: string,
	localeSlug: string,
): Promise<AnnouncementBarContent> {
	"use cache";
	const bcp47 = resolveLocaleFromSlug(localeSlug).bcp47;
	applyCacheProfile(CACHE_PROFILES.storefrontContent, { channel, locale: bcp47 });

	const [content, currency] = await Promise.all([
		getStorefrontContent(channel, localeSlug),
		resolveChannelCurrency(channel),
	]);

	return buildAnnouncementBarContent(content, { currency, localeSlug });
}
