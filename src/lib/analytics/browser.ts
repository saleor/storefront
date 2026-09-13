import { claimOnce } from "@/lib/analytics/claim";
import { analyticsStorageAllowed, type AnalyticsConsentChoice } from "@/lib/analytics/consent";
import {
	ANALYTICS_CONSENT_COOKIE,
	ANALYTICS_CONSENT_MAX_AGE_SECONDS,
	ANALYTICS_LANDING_COOKIE,
	ANALYTICS_LANDING_MAX_AGE_SECONDS,
	ANALYTICS_SESSION_COOKIE,
	parseConsentChoice,
	parseLandingCookie,
} from "@/lib/analytics/cookies";
import type { Ga4Event } from "@/lib/analytics/destinations/ga4";
import { ga4Enabled, gaMeasurementId } from "@/lib/analytics/ga4";
import {
	captureLandingSnapshot,
	landingPathFromHref,
	parseLandingSnapshot,
	serializeLandingSnapshot,
	type LandingSnapshot,
} from "@/lib/analytics/landing";
import { redactAnalyticsUrl } from "@/lib/analytics/redact-url";

const PENDING_LANDING_KEY = "paper.analytics.landing.pending";

export type PaperAnalyticsApi = {
	setConsent: (choice: AnalyticsConsentChoice) => void;
	getConsent: () => AnalyticsConsentChoice | null;
};

declare global {
	interface Window {
		paperAnalytics?: PaperAnalyticsApi;
		dataLayer?: unknown[];
		gtag?: (...args: unknown[]) => void;
	}
}

export function bindPaperAnalyticsApi(): void {
	if (typeof window === "undefined") return;
	window.paperAnalytics = {
		setConsent: setAnalyticsConsent,
		getConsent: readConsentChoice,
	};
}

export function readConsentChoice(): AnalyticsConsentChoice | null {
	return parseConsentChoice(readDocumentCookie(ANALYTICS_CONSENT_COOKIE));
}

export function setAnalyticsConsent(choice: AnalyticsConsentChoice): void {
	if (choice !== "granted" && choice !== "denied") return;
	writeDocumentCookie(ANALYTICS_CONSENT_COOKIE, choice, ANALYTICS_CONSENT_MAX_AGE_SECONDS);
	if (choice === "denied") {
		deleteDocumentCookie(ANALYTICS_LANDING_COOKIE);
		deleteDocumentCookie(ANALYTICS_SESSION_COOKIE);
		clearPendingLanding();
	} else {
		persistFirstTouch();
	}
	applyConsentToGtag();
	if (choice === "granted") {
		applyCampaignFromSnapshot();
		sendRedactedPageView();
	}
}

export function persistFirstTouch(now = new Date()): void {
	if (typeof window === "undefined") return;

	const existing = parseLandingCookie(readDocumentCookie(ANALYTICS_LANDING_COOKIE));
	if (existing) {
		if (!analyticsStorageAllowed(readConsentChoice())) {
			deleteDocumentCookie(ANALYTICS_LANDING_COOKIE);
			deleteDocumentCookie(ANALYTICS_SESSION_COOKIE);
			return;
		}
		ensureSessionId();
		return;
	}

	const incoming = readPendingLanding() ?? captureLandingSnapshot(window.location.href, now);

	if (!analyticsStorageAllowed(readConsentChoice())) {
		if (!readPendingLanding()) writePendingLanding(incoming);
		return;
	}

	writeDocumentCookie(
		ANALYTICS_LANDING_COOKIE,
		serializeLandingSnapshot(incoming),
		ANALYTICS_LANDING_MAX_AGE_SECONDS,
	);
	ensureSessionId();
	clearPendingLanding();
}

export function sendGa4Event(event: Ga4Event): void {
	if (!ga4Enabled()) return;
	if (!analyticsStorageAllowed(readConsentChoice())) return;
	gtag("event", event.name, event.params);
}

export function applyConsentToGtag(): void {
	if (!ga4Enabled()) return;
	const allowed = analyticsStorageAllowed(readConsentChoice());
	gtag("consent", "update", {
		analytics_storage: allowed ? "granted" : "denied",
		ad_storage: "denied",
		ad_user_data: "denied",
		ad_personalization: "denied",
	});
}

export function applyCampaignFromSnapshot(): void {
	const id = gaMeasurementId();
	if (!id || !analyticsStorageAllowed(readConsentChoice())) return;

	const snapshot = parseLandingCookie(readDocumentCookie(ANALYTICS_LANDING_COOKIE)) ?? readPendingLanding();
	if (!snapshot) return;

	const campaign: Record<string, string> = {};
	if (snapshot.source) campaign.campaign_source = snapshot.source;
	if (snapshot.medium) campaign.campaign_medium = snapshot.medium;
	if (snapshot.campaign) campaign.campaign_name = snapshot.campaign;
	if (snapshot.term) campaign.campaign_term = snapshot.term;
	if (snapshot.content) campaign.campaign_content = snapshot.content;
	if (Object.keys(campaign).length === 0) return;

	gtag("config", id, {
		send_page_view: false,
		...campaign,
	});
}

/** Dedup key — redacted so guest `/order/<hmac>` never lands in sessionStorage. */
export function pageViewClaimKey(href: string): string {
	return `paper.analytics.page_view:${landingPathFromHref(href)}`;
}

export function sendRedactedPageView(): void {
	if (!ga4Enabled()) return;
	if (!analyticsStorageAllowed(readConsentChoice())) return;
	if (typeof window === "undefined") return;

	const href = window.location.href;
	const pagePath = landingPathFromHref(href);
	if (!pagePath || !claimOnce(pageViewClaimKey(href))) return;

	gtag("event", "page_view", {
		page_location: redactAnalyticsUrl(href),
		page_path: pagePath,
	});
}

function gtag(...args: unknown[]): void {
	if (typeof window === "undefined") return;
	if (typeof window.gtag === "function") {
		window.gtag(...args);
		return;
	}
	window.dataLayer = window.dataLayer ?? [];
	window.dataLayer.push(args);
}

function ensureSessionId(): void {
	if (readDocumentCookie(ANALYTICS_SESSION_COOKIE)) return;
	writeDocumentCookie(ANALYTICS_SESSION_COOKIE, createSessionId());
}

function createSessionId(): string {
	if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
		return crypto.randomUUID();
	}
	return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

function readPendingLanding(): LandingSnapshot | null {
	try {
		if (typeof sessionStorage === "undefined") return null;
		const raw = sessionStorage.getItem(PENDING_LANDING_KEY);
		return raw ? parseLandingSnapshot(raw) : null;
	} catch {
		return null;
	}
}

function writePendingLanding(snapshot: LandingSnapshot): void {
	try {
		if (typeof sessionStorage === "undefined") return;
		sessionStorage.setItem(PENDING_LANDING_KEY, serializeLandingSnapshot(snapshot));
	} catch {
		// private mode
	}
}

function clearPendingLanding(): void {
	try {
		sessionStorage.removeItem(PENDING_LANDING_KEY);
	} catch {
		// ignore
	}
}

function readDocumentCookie(name: string): string | null {
	if (typeof document === "undefined") return null;
	const prefix = `${name}=`;
	const entry = document.cookie
		.split(";")
		.map((part) => part.trim())
		.find((part) => part.startsWith(prefix));
	if (!entry) return null;
	return entry.slice(prefix.length);
}

function writeDocumentCookie(name: string, value: string, maxAgeSeconds?: number): void {
	if (typeof document === "undefined") return;
	const age = maxAgeSeconds !== undefined ? `; max-age=${maxAgeSeconds}` : "";
	document.cookie = `${name}=${encodeURIComponent(value)}; path=/; samesite=lax${age}${cookieSecureFlag()}`;
}

function deleteDocumentCookie(name: string): void {
	if (typeof document === "undefined") return;
	// Must match the Secure flag used at write or HTTPS browsers keep the cookie.
	document.cookie = `${name}=; path=/; max-age=0; samesite=lax${cookieSecureFlag()}`;
}

function cookieSecureFlag(): string {
	return window.location.protocol === "https:" ? "; secure" : "";
}
