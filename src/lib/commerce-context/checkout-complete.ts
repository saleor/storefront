import type { LandingSnapshot } from "@/lib/analytics/landing";
import {
	COMMERCE_CONTEXT_KEYS,
	COMMERCE_CONTEXT_SURFACE_AGENT,
	COMMERCE_CONTEXT_SURFACE_STOREFRONT,
	COMMERCE_CONTEXT_SYSTEM_PAPER,
	ORIGIN_CONSENT_VALUES,
	type CommerceContextMetadataInput,
	type OriginConsent,
} from "@/lib/commerce-context/keys";

const DEVICES = new Set(["mobile", "tablet", "desktop", "other"]);
const SURFACES = new Set([
	COMMERCE_CONTEXT_SURFACE_STOREFRONT,
	COMMERCE_CONTEXT_SURFACE_AGENT,
	"pos",
	"draft",
	"import",
	"marketplace",
	"api",
	"support",
]);

export type CheckoutMetadataEntry = {
	key: string;
	value?: string | null;
};

/**
 * Tier-2 Commerce Context: fill-missing `marketing` / `session` (and `origin`
 * only when consent changed or the key is absent). Pure — the caller reads
 * cookies and existing checkout metadata.
 *
 * Storage sections are written only for `granted` / `not_required`. Denied and
 * unknown never get UTMs, so declined stays distinct from direct.
 *
 * Shopper cookies belong to the browse storefront. A recognized non-storefront
 * origin (agent, POS, import, …) is left alone — including `not_required`.
 */
export function buildCheckoutCompleteContextMetadata({
	existing,
	consent,
	landing,
	sessionId,
	now = new Date(),
}: {
	existing: readonly CheckoutMetadataEntry[];
	consent: OriginConsent;
	landing: LandingSnapshot | null;
	sessionId: string | null;
	now?: Date;
}): CommerceContextMetadataInput[] {
	if (!shouldApplyShopperCompleteEnrichment(existing)) return [];

	const writes: CommerceContextMetadataInput[] = [];
	const originWrite = originPatch(existing, consent, now);
	if (originWrite) writes.push(originWrite);

	if (!storageSectionsAllowed(consent)) return writes;

	if (!hasSection(existing, COMMERCE_CONTEXT_KEYS.marketing)) {
		const marketing = marketingFromSnapshot(landing);
		if (marketing) {
			writes.push({ key: COMMERCE_CONTEXT_KEYS.marketing, value: JSON.stringify(marketing) });
		}
	}

	const sid = sanitizeSessionId(sessionId);
	if (sid && !hasSection(existing, COMMERCE_CONTEXT_KEYS.session)) {
		writes.push({
			key: COMMERCE_CONTEXT_KEYS.session,
			value: JSON.stringify({ sessionId: sid }),
		});
	}

	return writes;
}

/**
 * Default Paper (`required`, no banner) records `unknown` at create and still
 * has `unknown` at complete — marketing is not allowed and origin does not
 * change. Skip the purchase-path Saleor read/write.
 */
export function shouldSkipCheckoutCompleteEnrichment(consent: OriginConsent): boolean {
	return consent === "unknown";
}

/**
 * Complete-time enrich reads the *browser* consent / landing cookies. That is
 * storefront work. Missing or unrecognized `surface` still counts as storefront
 * (same fallback as `originPatch`).
 */
export function shouldApplyShopperCompleteEnrichment(existing: readonly CheckoutMetadataEntry[]): boolean {
	const current = readOrigin(existing);
	if (!current?.surface) return true;
	if (!SURFACES.has(current.surface)) return true;
	return current.surface === COMMERCE_CONTEXT_SURFACE_STOREFRONT;
}

export function storageSectionsAllowed(consent: OriginConsent): boolean {
	return consent === "granted" || consent === "not_required";
}

export function sanitizeSessionId(raw: string | null | undefined): string | null {
	if (!raw) return null;
	let value = raw;
	try {
		value = decodeURIComponent(raw);
	} catch {
		// already decoded
	}
	const trimmed = value.trim();
	if (trimmed.length < 8 || trimmed.length > 80) return null;
	if (!/^[A-Za-z0-9._:-]+$/.test(trimmed)) return null;
	return trimmed;
}

function originPatch(
	existing: readonly CheckoutMetadataEntry[],
	consent: OriginConsent,
	now: Date,
): CommerceContextMetadataInput | null {
	const current = readOrigin(existing);
	if (current && current.consent === consent) return null;

	return {
		key: COMMERCE_CONTEXT_KEYS.origin,
		value: JSON.stringify({
			surface:
				current?.surface && SURFACES.has(current.surface)
					? current.surface
					: COMMERCE_CONTEXT_SURFACE_STOREFRONT,
			system:
				typeof current?.system === "string" && current.system
					? current.system
					: COMMERCE_CONTEXT_SYSTEM_PAPER,
			capturedAt:
				typeof current?.capturedAt === "string" && current.capturedAt
					? current.capturedAt
					: now.toISOString(),
			consent,
			...(current?.device && DEVICES.has(current.device) ? { device: current.device } : {}),
		}),
	};
}

function marketingFromSnapshot(landing: LandingSnapshot | null): Record<string, string> | null {
	if (!landing?.landingPath) return null;
	const marketing: Record<string, string> = { landingPath: landing.landingPath };
	if (landing.source) marketing.source = landing.source;
	if (landing.medium) marketing.medium = landing.medium;
	if (landing.campaign) marketing.campaign = landing.campaign;
	if (landing.term) marketing.term = landing.term;
	if (landing.content) marketing.content = landing.content;
	return marketing;
}

function hasSection(entries: readonly CheckoutMetadataEntry[], key: string): boolean {
	const value = entries.find((entry) => entry.key === key)?.value;
	return Boolean(value?.trim());
}

function readOrigin(entries: readonly CheckoutMetadataEntry[]): {
	surface?: string;
	system?: string;
	capturedAt?: string;
	consent?: OriginConsent;
	device?: string;
} | null {
	const raw = entries.find((entry) => entry.key === COMMERCE_CONTEXT_KEYS.origin)?.value;
	if (!raw) return null;
	try {
		const parsed = JSON.parse(raw) as Record<string, unknown>;
		if (!parsed || typeof parsed !== "object") return null;
		const consent =
			typeof parsed.consent === "string" &&
			(ORIGIN_CONSENT_VALUES as readonly string[]).includes(parsed.consent)
				? (parsed.consent as OriginConsent)
				: undefined;
		return {
			surface: typeof parsed.surface === "string" ? parsed.surface : undefined,
			system: typeof parsed.system === "string" ? parsed.system : undefined,
			capturedAt: typeof parsed.capturedAt === "string" ? parsed.capturedAt : undefined,
			consent,
			device: typeof parsed.device === "string" ? parsed.device : undefined,
		};
	} catch {
		return null;
	}
}
