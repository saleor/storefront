"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { isLocaleSlug, isStorefrontLocaleSlug } from "@/config/locale";
import { getPairedChannelForLocale } from "@/config/locale-channel";
import { hasCartCookieForChannel } from "@/lib/cart-channel-cookie";
import { writeBrowseLocaleCookieClient } from "@/lib/browse-locale";
import {
	buildStorefrontPath,
	parseStorefrontPathname,
	replaceStorefrontChannel,
} from "@/lib/storefront-path";

/** Navigate browse URLs while preserving the path suffix (ADR 0001 picker behavior). */
export function useStorefrontRegionNavigation() {
	const router = useRouter();
	const pathname = usePathname();
	const params = useParams<{ locale?: string; channel?: string }>();

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
		const href = parsed
			? buildStorefrontPath(newLocale, targetChannel, parsed.suffix)
			: buildStorefrontPath(newLocale, targetChannel);
		router.push(href);
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

		const href = replaceStorefrontChannel(pathname, newChannel) ?? buildStorefrontPath(locale, newChannel);
		router.push(href);
	}

	return { locale, channel, navigateToLocale, navigateToChannel };
}
