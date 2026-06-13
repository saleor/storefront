"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import {
	buildStorefrontPath,
	replaceStorefrontChannel,
	replaceStorefrontLocale,
} from "@/lib/storefront-path";

/** Navigate browse URLs while preserving the path suffix (ADR 0001 picker behavior). */
export function useStorefrontRegionNavigation() {
	const router = useRouter();
	const pathname = usePathname();
	const params = useParams<{ locale?: string; channel?: string }>();

	const locale = params.locale ?? "";
	const channel = params.channel ?? "";

	function navigateToLocale(newLocale: string) {
		if (!channel) return;

		const href = replaceStorefrontLocale(pathname, newLocale) ?? buildStorefrontPath(newLocale, channel);
		router.push(href);
	}

	function navigateToChannel(newChannel: string) {
		if (!locale) return;

		const href = replaceStorefrontChannel(pathname, newChannel) ?? buildStorefrontPath(locale, newChannel);
		router.push(href);
	}

	return { locale, channel, navigateToLocale, navigateToChannel };
}
