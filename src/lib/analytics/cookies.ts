import type { AnalyticsConsentChoice } from "@/lib/analytics/consent";
import type { LandingSnapshot } from "@/lib/analytics/landing";
import { parseLandingSnapshot } from "@/lib/analytics/landing";

/** First-party cookies. Underscores — some proxies mishandle dots in cookie names. */
export const ANALYTICS_CONSENT_COOKIE = "paper_analytics_consent";
export const ANALYTICS_LANDING_COOKIE = "paper_analytics_landing";
export const ANALYTICS_SESSION_COOKIE = "paper_analytics_sid";

export const ANALYTICS_CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 180;
export const ANALYTICS_LANDING_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export function parseConsentChoice(raw: string | null | undefined): AnalyticsConsentChoice | null {
	if (!raw) return null;
	let value = raw;
	try {
		value = decodeURIComponent(raw);
	} catch {
		// already decoded
	}
	if (value === "granted" || value === "denied") return value;
	return null;
}

export function parseLandingCookie(raw: string | null | undefined): LandingSnapshot | null {
	if (!raw) return null;
	let value = raw;
	try {
		value = decodeURIComponent(raw);
	} catch {
		// already decoded
	}
	return parseLandingSnapshot(value);
}
