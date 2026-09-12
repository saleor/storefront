import type { PaperCommerceEvent } from "@/lib/analytics/catalog";

/**
 * GA4 projector — phase 2.
 *
 * Will map the same `PaperCommerceEvent` onto recommended names + `items[]`
 * (`add_to_cart`, `begin_checkout`, `purchase`, `search`) behind
 * `NEXT_PUBLIC_GA_MEASUREMENT_ID` and Consent Mode v2. No-op until then so
 * emit sites never grow a second `gtag` call.
 */
export function projectGa4(_event: PaperCommerceEvent): null {
	return null;
}
