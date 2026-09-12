import paperVersion from "../../../paper-version.json";
import { type LocaleSlug, resolveLocaleFromSlug } from "@/config/locale";
import {
	COMMERCE_CONTEXT_KEYS,
	COMMERCE_CONTEXT_SURFACE_STOREFRONT,
	COMMERCE_CONTEXT_SYSTEM_PAPER,
	type CommerceContextMetadataInput,
} from "@/lib/commerce-context/keys";

/**
 * Tier-1 Commerce Context: facts about *how the order came to exist*, written once
 * on `checkoutCreate` as part of the same mutation (zero extra round trips).
 *
 * Consent-free by construction — nothing here is derived from cookies, storage,
 * UTMs or the shopper: surface, writer system, capture time, UI locale and the
 * Paper baseline the fork runs. That is exactly why it can be written for every
 * checkout: `origin` alone flips Pulse's coverage from `missing` to `valid`, so
 * merchants can tell storefront orders from POS / draft / import even before any
 * marketing attribution exists. Tier 2 (`marketing`, `session`) is consent-gated
 * and written later via `updateMetadata`.
 *
 * Paper targets Saleor 3.23+, where `CheckoutCreateInput.metadata` is a given.
 * The builder is pure and cannot throw; never wrap create in a "retry without
 * metadata" fallback — an older API is out of support, not a soft failure.
 */
export function buildCheckoutCreateContextMetadata({
	locale,
	now = new Date(),
}: {
	locale: LocaleSlug;
	now?: Date;
}): CommerceContextMetadataInput[] {
	const origin = {
		surface: COMMERCE_CONTEXT_SURFACE_STOREFRONT,
		system: COMMERCE_CONTEXT_SYSTEM_PAPER,
		capturedAt: now.toISOString(),
	};

	const extPaper = {
		locale: resolveLocaleFromSlug(locale).bcp47,
		// Upstream Paper commit this fork is based on — lets Pulse (and support) tell
		// "orders from stores on baseline X" apart from a store's own deploy history.
		paperVersion: paperVersion.lastUpstreamSha,
	};

	return [
		{ key: COMMERCE_CONTEXT_KEYS.origin, value: JSON.stringify(origin) },
		{ key: COMMERCE_CONTEXT_KEYS.extPaper, value: JSON.stringify(extPaper) },
	];
}
