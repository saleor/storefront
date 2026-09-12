import paperVersion from "../../../paper-version.json";
import { type LocaleSlug, resolveLocaleFromSlug } from "@/config/locale";
import {
	COMMERCE_CONTEXT_KEYS,
	COMMERCE_CONTEXT_SURFACE_STOREFRONT,
	COMMERCE_CONTEXT_SYSTEM_PAPER,
	type CommerceContextMetadataInput,
} from "@/lib/commerce-context/keys";
import type { GraphQLResult } from "@/lib/graphql";

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
 * Never let this block a checkout: no I/O, no throws on bad input.
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

type CheckoutCreatePayload = {
	checkoutCreate?: {
		checkout?: unknown;
		errors?: ReadonlyArray<{ field?: string | null } | null> | null;
	} | null;
};

/**
 * True when Saleor rejected the create *because of metadata* — unknown argument on
 * a pre-3.21 instance, or a domain error on the `metadata` field. Other failures
 * (channel, network) must not be retried without context; they are real.
 */
export function isCommerceContextBlockingCreate(input: {
	graphqlMessage?: string;
	checkoutErrors?: ReadonlyArray<{ field?: string | null } | null> | null;
}): boolean {
	if (input.checkoutErrors?.some((error) => error?.field && /metadata/i.test(error.field))) {
		return true;
	}
	return Boolean(input.graphqlMessage && /metadata/i.test(input.graphqlMessage));
}

/**
 * Run `checkoutCreate` with tier-1 context, and if Saleor rejects that metadata,
 * retry once without it. Attribution is optional; creating the cart is not.
 */
export async function executeCheckoutCreateWithContext<T extends CheckoutCreatePayload>(
	run: (metadata: CommerceContextMetadataInput[] | undefined) => Promise<GraphQLResult<T>>,
	locale: LocaleSlug,
): Promise<GraphQLResult<T>> {
	const first = await run(buildCheckoutCreateContextMetadata({ locale }));
	if (first.ok && first.data.checkoutCreate?.checkout) return first;

	const blocking = isCommerceContextBlockingCreate({
		graphqlMessage: first.ok ? undefined : first.error.message,
		checkoutErrors: first.ok ? first.data.checkoutCreate?.errors : undefined,
	});
	if (!blocking) return first;

	console.warn(
		"[commerce-context] Saleor rejected create-time metadata; creating checkout without Commerce Context.",
	);
	return run(undefined);
}
