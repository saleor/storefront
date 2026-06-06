import "server-only";

import { revalidatePath } from "next/cache";

/** Invalidate cached storefront header and checkout shell after session changes (PPR-safe). Server actions only — not during RSC render. */
export function revalidateAuthSurfaces(channel?: string | null) {
	if (channel) {
		revalidatePath(`/${channel}`, "layout");
	}
	revalidatePath("/checkout");
}
