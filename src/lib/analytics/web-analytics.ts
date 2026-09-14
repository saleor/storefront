/**
 * Vercel Web Analytics toggle.
 *
 * Web Analytics is Paper's page-view denominator: cookieless, one event per
 * navigation, billed per event ($ per 100k) with no sampling knob. Unlike Speed
 * Insights it cannot be thinned, so the only lever is on/off.
 *
 * Default: on when the build runs on Vercel (`VERCEL=1`), off elsewhere. On a
 * non-Vercel host the `/_vercel/insights/script.js` request 404s and would cost an
 * Edge Request per page for nothing. Vercel deployments still need Web Analytics
 * enabled in the project (Analytics tab) — until then the script 404s the same way.
 * `NEXT_PUBLIC_VERCEL_WEB_ANALYTICS=0|1` overrides either way.
 */
export function webAnalyticsEnabled(): boolean {
	const raw = process.env.NEXT_PUBLIC_VERCEL_WEB_ANALYTICS?.trim().toLowerCase();
	if (!raw) return Boolean(process.env.VERCEL);

	if (raw === "1" || raw === "true" || raw === "on") return true;
	if (raw === "0" || raw === "false" || raw === "off") return false;

	// A typo must not take the page down — fall back to the platform default.
	console.warn(
		`[web-analytics] Ignoring invalid NEXT_PUBLIC_VERCEL_WEB_ANALYTICS="${raw}". Expected 1 or 0.`,
	);
	return Boolean(process.env.VERCEL);
}
