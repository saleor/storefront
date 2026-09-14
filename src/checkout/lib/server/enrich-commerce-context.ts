import "server-only";

import { cookies } from "next/headers";
import {
	CheckoutCommerceContextDocument,
	CheckoutMetadataUpdateDocument,
	type CheckoutCommerceContextQuery,
	type CheckoutCommerceContextQueryVariables,
	type CheckoutMetadataUpdateMutation,
	type CheckoutMetadataUpdateMutationVariables,
} from "@/checkout/graphql/generated/operations";
import { toTypedDocument } from "@/checkout/lib/server/to-typed-document";
import {
	ANALYTICS_CONSENT_COOKIE,
	ANALYTICS_LANDING_COOKIE,
	ANALYTICS_SESSION_COOKIE,
	parseConsentChoice,
	parseLandingCookie,
} from "@/lib/analytics/cookies";
import { resolveOriginConsent } from "@/lib/analytics/consent";
import {
	buildCheckoutCompleteContextMetadata,
	shouldSkipCheckoutCompleteEnrichment,
} from "@/lib/commerce-context/checkout-complete";
import { executeAuthenticatedGraphQL, executePublicGraphQL } from "@/lib/graphql";

/** Best-effort: one attempt, then complete the order without attribution. */
const ENRICH_TIMEOUT_MS = 1_500;

const checkoutCommerceContextDocument = toTypedDocument<
	CheckoutCommerceContextQuery,
	CheckoutCommerceContextQueryVariables
>(CheckoutCommerceContextDocument);

const checkoutMetadataUpdateDocument = toTypedDocument<
	CheckoutMetadataUpdateMutation,
	CheckoutMetadataUpdateMutationVariables
>(CheckoutMetadataUpdateDocument);

/**
 * Tier-2 Commerce Context. Must run *before* checkoutComplete so Saleor copies
 * the keys onto the order. Never throws — complete must not wait on attribution.
 */
export async function enrichCheckoutCommerceContext(checkoutId: string): Promise<void> {
	if (!checkoutId) return;

	try {
		const cookieStore = await cookies();
		const consent = resolveOriginConsent(
			parseConsentChoice(cookieStore.get(ANALYTICS_CONSENT_COOKIE)?.value),
		);
		if (shouldSkipCheckoutCompleteEnrichment(consent)) return;

		const landing = parseLandingCookie(cookieStore.get(ANALYTICS_LANDING_COOKIE)?.value);
		const sessionId = cookieStore.get(ANALYTICS_SESSION_COOKIE)?.value ?? null;

		const existing = await readCheckoutMetadata(checkoutId);
		if (!existing) return;

		const input = buildCheckoutCompleteContextMetadata({
			existing,
			consent,
			landing,
			sessionId,
		});
		if (input.length === 0) return;

		const result = await executeAuthenticatedGraphQL(checkoutMetadataUpdateDocument, {
			variables: { id: checkoutId, input },
			cache: "no-cache",
			maxRetries: 0,
			timeoutMs: ENRICH_TIMEOUT_MS,
		});
		if (!result.ok) {
			console.warn("[commerce-context] tier-2 write failed", result.error.message);
			return;
		}
		const errors = result.data.updateMetadata?.errors ?? [];
		if (errors.length > 0) {
			console.warn("[commerce-context] tier-2 write rejected", errors[0]?.message);
		}
	} catch (error) {
		console.warn("[commerce-context] tier-2 skipped", error);
	}
}

async function readCheckoutMetadata(checkoutId: string): Promise<{ key: string; value: string }[] | null> {
	const result = await executePublicGraphQL(checkoutCommerceContextDocument, {
		variables: { id: checkoutId },
		cache: "no-cache",
		maxRetries: 0,
		timeoutMs: ENRICH_TIMEOUT_MS,
	});
	if (!result.ok) {
		console.warn("[commerce-context] tier-2 read failed", result.error.message);
		return null;
	}
	if (!result.data.checkout) return null;
	return result.data.checkout.metadata ?? [];
}
