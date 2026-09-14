import { redactAnalyticsUrl } from "@/lib/analytics/redact-url";

/**
 * First-touch capture for `commerce.context.marketing` (written fill-missing
 * before checkoutComplete) and campaign params on the merchant tag. Cookie
 * only when analytics storage is allowed. Never sent to a tag before consent.
 *
 * No full referrer, no click ids, no PII. UTM values are copied off the URL
 * (the URL is not storage); `landingPath` is redacted and stripped of `utm_*`.
 */
export type LandingSnapshot = {
	capturedAt: string;
	landingPath: string;
	source?: string;
	medium?: string;
	campaign?: string;
	term?: string;
	content?: string;
};

const UTM_FIELDS = [
	["utm_source", "source"],
	["utm_medium", "medium"],
	["utm_campaign", "campaign"],
	["utm_term", "term"],
	["utm_content", "content"],
] as const;

/** Click ids stay off the snapshot — marketing is UTM + path only. */
const CLICK_ID_PARAMS = new Set([
	"gclid",
	"gbraid",
	"wbraid",
	"fbclid",
	"msclkid",
	"ttclid",
	"twclid",
	"li_fat_id",
	"mc_eid",
]);

const MAX_UTM_CHARS = 200;
/** Cookie + metadata JSON budget — drop the query before slicing the path. */
const MAX_LANDING_PATH_CHARS = 400;

export function captureLandingSnapshot(href: string, now = new Date()): LandingSnapshot {
	const snapshot: LandingSnapshot = {
		capturedAt: now.toISOString(),
		landingPath: landingPathFromHref(href),
	};

	try {
		const url = new URL(href);
		for (const [param, field] of UTM_FIELDS) {
			const value = sanitizeUtm(url.searchParams.get(param));
			if (value) snapshot[field] = value;
		}
	} catch {
		// landingPath already failed closed
	}

	return snapshot;
}

export function serializeLandingSnapshot(snapshot: LandingSnapshot): string {
	return JSON.stringify(snapshot);
}

export function parseLandingSnapshot(raw: string): LandingSnapshot | null {
	let parsed: unknown;
	try {
		parsed = JSON.parse(raw);
	} catch {
		return null;
	}
	if (!parsed || typeof parsed !== "object") return null;

	const record = parsed as Record<string, unknown>;
	if (typeof record.capturedAt !== "string" || typeof record.landingPath !== "string") {
		return null;
	}
	if (!record.capturedAt || !isSafeLandingPath(record.landingPath)) return null;

	const snapshot: LandingSnapshot = {
		capturedAt: record.capturedAt,
		landingPath: record.landingPath,
	};

	for (const [, field] of UTM_FIELDS) {
		const raw = record[field];
		const value = sanitizeUtm(typeof raw === "string" ? raw : null);
		if (value) snapshot[field] = value;
	}

	return snapshot;
}

export function landingPathFromHref(href: string): string {
	const redacted = redactAnalyticsUrl(href);
	try {
		const url = new URL(redacted);
		for (const name of [...url.searchParams.keys()]) {
			const lower = name.toLowerCase();
			if (lower.startsWith("utm_") || CLICK_ID_PARAMS.has(lower)) {
				url.searchParams.delete(name);
			}
		}
		return clipLandingPath(`${url.pathname}${url.search}`);
	} catch {
		const path = redacted.split(/[?#]/, 1)[0] ?? "";
		return isSafeLandingPath(path) ? clipLandingPath(path) : "/";
	}
}

function isSafeLandingPath(path: string): boolean {
	return path.startsWith("/") && !path.startsWith("//") && !path.includes("\\");
}

function clipLandingPath(path: string): string {
	if (path.length <= MAX_LANDING_PATH_CHARS) return path;
	const queryAt = path.indexOf("?");
	const pathname = queryAt === -1 ? path : path.slice(0, queryAt);
	if (pathname.length <= MAX_LANDING_PATH_CHARS) return pathname;
	return pathname.slice(0, MAX_LANDING_PATH_CHARS);
}

function hasControlChars(value: string): boolean {
	for (let i = 0; i < value.length; i++) {
		const code = value.charCodeAt(i);
		if (code < 32 || code === 127) return true;
	}
	return false;
}

function sanitizeUtm(value: string | null): string | undefined {
	if (!value) return undefined;
	const trimmed = value.trim();
	if (!trimmed || hasControlChars(trimmed)) return undefined;
	return trimmed.length > MAX_UTM_CHARS ? trimmed.slice(0, MAX_UTM_CHARS) : trimmed;
}
