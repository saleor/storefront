"use client";

import { useParams } from "next/navigation";
import { buildStorefrontPath } from "@/lib/storefront-path";

export function useStorefrontParams() {
	return useParams<{ locale?: string; channel?: string }>();
}

/** Build a channel-scoped browse path from current locale + channel route params. */
export function useStorefrontHref(suffix: string): string {
	const { locale, channel } = useStorefrontParams();
	if (!locale || !channel) {
		return suffix;
	}
	return buildStorefrontPath(locale, channel, suffix);
}
