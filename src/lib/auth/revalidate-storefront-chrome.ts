import "server-only";

import { revalidatePath } from "next/cache";
import { getStorefrontLocaleSlugs } from "@/config/locale";
import { buildStorefrontPath } from "@/lib/storefront-path";

/** Bust cached browse pages for every configured locale on a channel. */
export function revalidateStorefrontBrowsePath(channel: string, suffix: string) {
	for (const locale of getStorefrontLocaleSlugs()) {
		revalidatePath(buildStorefrontPath(locale, channel, suffix));
	}
}

/**
 * Invalidate cached storefront chrome after session or cart changes (PPR-safe).
 * Busts the channel layout (header user menu + cart badge) and checkout shell.
 * Server actions / route handlers only — not during RSC render.
 */
export function revalidateStorefrontChrome(channel?: string | null) {
	if (channel) {
		for (const locale of getStorefrontLocaleSlugs()) {
			revalidatePath(buildStorefrontPath(locale, channel), "layout");
		}
	}
	revalidatePath("/checkout");
}
