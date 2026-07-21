"use client";

import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { isLocaleSlug, isStorefrontLocaleSlug } from "@/config/locale";
import { getPairedChannelForLocale } from "@/config/locale-channel";
import { useCatalogIdentity } from "@/lib/catalog/catalog-identity-bridge";
import { appendSearchParams, rewriteCatalogSuffixWithPrimarySlug } from "@/lib/catalog/catalog-identity";
import { hasCartCookieForChannel } from "@/lib/cart-channel-cookie";
import { writeBrowseLocaleCookieClient } from "@/lib/browse-locale";
import {
	buildStorefrontPath,
	parseStorefrontPathname,
	replaceStorefrontChannel,
} from "@/lib/storefront-path";

/**
 * Navigate browse URLs while preserving the path suffix (ADR 0001), except on
 * catalog detail pages with translated slugs: swap to the primary slug so the
 * target locale can resolve + canonical-redirect (ADR 0004).
 */
export function useStorefrontRegionNavigation() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const params = useParams<{ locale?: string; channel?: string }>();
	const catalogIdentity = useCatalogIdentity();

	const locale = params.locale ?? "";
	const channel = params.channel ?? "";

	function navigateToLocale(newLocale: string) {
		if (!channel || !isLocaleSlug(newLocale)) return;

		if (isStorefrontLocaleSlug(newLocale)) {
			writeBrowseLocaleCookieClient(newLocale);
		}

		// When a locale×channel matrix is configured, switch to the paired market too.
		const targetChannel = getPairedChannelForLocale(newLocale, channel);

		if (targetChannel !== channel && hasCartCookieForChannel(channel)) {
			const proceed = window.confirm(
				"Your cart is tied to this market. Switching markets starts a new cart — continue?",
			);
			if (!proceed) return;
		}

		const parsed = parseStorefrontPathname(pathname);
		let suffix = parsed?.suffix ?? "";
		if (catalogIdentity && parsed) {
			suffix = rewriteCatalogSuffixWithPrimarySlug(suffix, catalogIdentity);
		}

		const path = parsed
			? buildStorefrontPath(newLocale, targetChannel, suffix)
			: buildStorefrontPath(newLocale, targetChannel);

		router.push(appendSearchParams(path, searchParams));
	}

	function navigateToChannel(newChannel: string) {
		if (!locale || newChannel === channel) return;

		// Locale slugs must never land in the channel segment (e.g. `no` / `nb` mistaken for a market).
		if (isLocaleSlug(newChannel)) return;

		if (hasCartCookieForChannel(channel)) {
			const proceed = window.confirm(
				"Your cart is tied to this market. Switching markets starts a new cart — continue?",
			);
			if (!proceed) return;
		}

		const path = replaceStorefrontChannel(pathname, newChannel) ?? buildStorefrontPath(locale, newChannel);
		router.push(appendSearchParams(path, searchParams));
	}

	return { locale, channel, navigateToLocale, navigateToChannel };
}
