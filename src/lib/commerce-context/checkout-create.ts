import paperVersion from "../../../paper-version.json";
import { type LocaleSlug, resolveLocaleFromSlug } from "@/config/locale";
import {
	COMMERCE_CONTEXT_KEYS,
	COMMERCE_CONTEXT_SURFACE_STOREFRONT,
	COMMERCE_CONTEXT_SYSTEM_PAPER,
	type CommerceContextMetadataInput,
	type OriginConsent,
} from "@/lib/commerce-context/keys";

/**
 * Tier-1 Commerce Context: facts about *how the order came to exist*, written once
 * on `checkoutCreate` as part of the same mutation (zero extra round trips).
 *
 * Nothing here is derived from UTMs or marketing storage: surface, writer,
 * capture time, locale, Paper baseline, and an `origin.consent` marker
 * the caller already resolved. Marketing / session stay out — those are
 * consent-gated `updateMetadata` writes in `checkout-complete.ts`.
 *
 * Storefront only — hard-codes `surface: "storefront"`. An agent route writes
 * its own origin (`surface: "agent"`, `consent: "not_required"`) and must not
 * call this builder.
 *
 * Paper targets Saleor 3.23+, where `CheckoutCreateInput.metadata` is a given.
 * The builder is pure and cannot throw; never wrap create in a "retry without
 * metadata" fallback — an older API is out of support, not a soft failure.
 */
export function buildCheckoutCreateContextMetadata({
	locale,
	now = new Date(),
	consent,
}: {
	locale: LocaleSlug;
	now?: Date;
	consent: OriginConsent;
}): CommerceContextMetadataInput[] {
	const origin = {
		surface: COMMERCE_CONTEXT_SURFACE_STOREFRONT,
		system: COMMERCE_CONTEXT_SYSTEM_PAPER,
		capturedAt: now.toISOString(),
		consent,
	};

	const extPaper = {
		locale: resolveLocaleFromSlug(locale).bcp47,
		// Upstream Paper commit this fork is based on — lets support tell
		// "orders from stores on baseline X" apart from a store's own deploy history.
		paperVersion: paperVersion.lastUpstreamSha,
	};

	return [
		{ key: COMMERCE_CONTEXT_KEYS.origin, value: JSON.stringify(origin) },
		{ key: COMMERCE_CONTEXT_KEYS.extPaper, value: JSON.stringify(extPaper) },
	];
}
