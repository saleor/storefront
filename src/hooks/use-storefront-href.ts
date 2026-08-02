"use client";

import { useParams } from "next/navigation";
import { resolveLocaleFromSlug } from "@/config/locale";
import { buildStorefrontPath } from "@/lib/storefront-path";

export function useStorefrontParams() {
	return useParams<{ locale?: string; channel?: string }>();
}

/** Current locale as a BCP 47 tag for `Intl` formatting (falls back to the default locale). */
export function useIntlLocale(): string {
	const { locale } = useStorefrontParams();
	return resolveLocaleFromSlug(locale ?? "").bcp47;
}

/** Build a channel-scoped browse path from current locale + channel route params. */
export function useStorefrontHref(suffix: string): string {
	const { locale, channel } = useStorefrontParams();
	if (!locale || !channel) {
		return suffix;
	}
	return buildStorefrontPath(locale, channel, suffix);
}
