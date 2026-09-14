import "server-only";

import { cookies } from "next/headers";
import { ANALYTICS_CONSENT_COOKIE, parseConsentChoice } from "@/lib/analytics/cookies";
import { resolveOriginConsent } from "@/lib/analytics/consent";
import { type LocaleSlug } from "@/config/locale";
import { buildCheckoutCreateContextMetadata } from "@/lib/commerce-context/checkout-create";
import type { CommerceContextMetadataInput } from "@/lib/commerce-context/keys";

/** Tier-1 metadata for `checkoutCreate`, including `origin.consent`. */
export async function checkoutCreateContextMetadata(
	locale: LocaleSlug,
): Promise<CommerceContextMetadataInput[]> {
	let choice: ReturnType<typeof parseConsentChoice> = null;
	try {
		choice = parseConsentChoice((await cookies()).get(ANALYTICS_CONSENT_COOKIE)?.value);
	} catch {
		// static generation / no request
	}

	return buildCheckoutCreateContextMetadata({
		locale,
		consent: resolveOriginConsent(choice),
	});
}
