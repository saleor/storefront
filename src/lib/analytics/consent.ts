import type { OriginConsent } from "@/lib/commerce-context/keys";

/**
 * Analytics consent mode.
 *
 * `required` (default) — storage-derived destinations (merchant tag) and
 * the first-touch cookie stay off until a fork banner calls
 * `window.paperAnalytics.setConsent("granted")`. Paper core ships no banner.
 *
 * `implied` — visiting is enough (`origin.consent` = `not_required`). First-touch
 * cookie is written; the tag may load with `analytics_storage` granted. Ads
 * consents stay denied (Paper has no ad pixels).
 *
 * Agents / POS do not use this env. They write `origin.consent: "not_required"`
 * because there is no shopper cookie, not because a banner was skipped.
 *
 * Distinct from `paper.marketing_opt_in*` (newsletter). Do not merge them.
 */
export type AnalyticsConsentMode = "required" | "implied";
export type AnalyticsConsentChoice = "granted" | "denied";

export function analyticsConsentMode(
	raw = process.env.NEXT_PUBLIC_ANALYTICS_CONSENT_MODE,
): AnalyticsConsentMode {
	const value = raw?.trim().toLowerCase();
	if (!value || value === "required") return "required";
	if (value === "implied") return "implied";

	console.warn(
		`[analytics] Ignoring invalid NEXT_PUBLIC_ANALYTICS_CONSENT_MODE="${raw}". Expected required or implied.`,
	);
	return "required";
}

/** True when first-touch storage and the merchant tag may run. */
export function analyticsStorageAllowed(
	choice: AnalyticsConsentChoice | null,
	mode: AnalyticsConsentMode = analyticsConsentMode(),
): boolean {
	if (choice === "denied") return false;
	if (choice === "granted") return true;
	return mode === "implied";
}

/**
 * Commerce Context `origin.consent` for the current visitor. Always a known
 * enum — never omit the field on checkoutCreate.
 */
export function resolveOriginConsent(
	choice: AnalyticsConsentChoice | null,
	mode: AnalyticsConsentMode = analyticsConsentMode(),
): OriginConsent {
	if (choice === "granted") return "granted";
	if (choice === "denied") return "denied";
	return mode === "implied" ? "not_required" : "unknown";
}
