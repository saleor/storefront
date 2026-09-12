/**
 * GA4 is off until a valid measurement id is set. Paper does not ship GTM.
 * Ads consents stay denied even when analytics storage is granted.
 */
const GA4_MEASUREMENT_ID = /^G-[A-Z0-9]+$/i;

export function gaMeasurementId(raw = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID): string | null {
	const value = raw?.trim();
	if (!value) return null;
	if (!GA4_MEASUREMENT_ID.test(value)) {
		console.warn(
			`[analytics] Ignoring invalid NEXT_PUBLIC_GA_MEASUREMENT_ID. Expected a GA4 id (G-XXXXXXXX).`,
		);
		return null;
	}
	return value;
}

export function ga4Enabled(raw = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID): boolean {
	return gaMeasurementId(raw) !== null;
}
