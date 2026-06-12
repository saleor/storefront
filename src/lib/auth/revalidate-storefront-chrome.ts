import "server-only";

import { revalidatePath } from "next/cache";

/**
 * Invalidate cached storefront chrome after session or cart changes (PPR-safe).
 * Busts the channel layout (header user menu + cart badge) and checkout shell.
 * Server actions / route handlers only — not during RSC render.
 */
export function revalidateStorefrontChrome(channel?: string | null) {
	if (channel) {
		revalidatePath(`/${channel}`, "layout");
	}
	revalidatePath("/checkout");
}
