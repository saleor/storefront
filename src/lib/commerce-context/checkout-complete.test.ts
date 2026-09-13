import { describe, expect, it } from "vitest";
import {
	buildCheckoutCompleteContextMetadata,
	sanitizeSessionId,
	shouldApplyShopperCompleteEnrichment,
	shouldSkipCheckoutCompleteEnrichment,
	storageSectionsAllowed,
} from "./checkout-complete";
import { COMMERCE_CONTEXT_KEYS, COMMERCE_CONTEXT_SURFACE_AGENT } from "./keys";

const now = new Date("2026-09-12T15:00:00.000Z");
const landing = {
	capturedAt: "2026-09-12T12:00:00.000Z",
	landingPath: "/en/us/products/shirt",
	source: "google",
	medium: "cpc",
	campaign: "summer",
};
const sid = "1b4e2a3c-1111-4111-8111-aaaaaaaaaaaa";
const originUnknown = JSON.stringify({
	surface: "storefront",
	system: "paper",
	capturedAt: "2026-09-12T10:00:00.000Z",
	consent: "unknown",
});
const originGranted = JSON.stringify({
	surface: "storefront",
	system: "paper",
	capturedAt: "2026-09-12T10:00:00.000Z",
	consent: "granted",
});

function keys(items: { key: string }[]): string[] {
	return items.map((item) => item.key);
}

function section(items: { key: string; value: string }[], key: string): Record<string, unknown> {
	const item = items.find((candidate) => candidate.key === key);
	if (!item) throw new Error(`missing ${key}`);
	return JSON.parse(item.value) as Record<string, unknown>;
}

describe("storageSectionsAllowed", () => {
	it("allows only granted and implied", () => {
		expect(storageSectionsAllowed("granted")).toBe(true);
		expect(storageSectionsAllowed("not_required")).toBe(true);
		expect(storageSectionsAllowed("denied")).toBe(false);
		expect(storageSectionsAllowed("unknown")).toBe(false);
	});
});

describe("shouldSkipCheckoutCompleteEnrichment", () => {
	it("skips the default required-and-undecided path", () => {
		expect(shouldSkipCheckoutCompleteEnrichment("unknown")).toBe(true);
		expect(shouldSkipCheckoutCompleteEnrichment("denied")).toBe(false);
		expect(shouldSkipCheckoutCompleteEnrichment("granted")).toBe(false);
		expect(shouldSkipCheckoutCompleteEnrichment("not_required")).toBe(false);
	});
});

describe("sanitizeSessionId", () => {
	it("accepts a uuid and rejects PII-shaped values", () => {
		expect(sanitizeSessionId(sid)).toBe(sid);
		expect(sanitizeSessionId("a@b.c-not-an-id")).toBeNull();
		expect(sanitizeSessionId("short")).toBeNull();
	});
});

describe("buildCheckoutCompleteContextMetadata", () => {
	it("writes marketing + session and updates origin when consent becomes granted", () => {
		const writes = buildCheckoutCompleteContextMetadata({
			existing: [{ key: COMMERCE_CONTEXT_KEYS.origin, value: originUnknown }],
			consent: "granted",
			landing,
			sessionId: sid,
			now,
		});
		expect(keys(writes).sort()).toEqual(
			[COMMERCE_CONTEXT_KEYS.marketing, COMMERCE_CONTEXT_KEYS.origin, COMMERCE_CONTEXT_KEYS.session].sort(),
		);
		expect(section(writes, COMMERCE_CONTEXT_KEYS.origin)).toMatchObject({
			capturedAt: "2026-09-12T10:00:00.000Z",
			consent: "granted",
		});
		expect(section(writes, COMMERCE_CONTEXT_KEYS.marketing)).toEqual({
			landingPath: "/en/us/products/shirt",
			source: "google",
			medium: "cpc",
			campaign: "summer",
		});
		expect(section(writes, COMMERCE_CONTEXT_KEYS.session)).toEqual({ sessionId: sid });
	});

	it("is fill-missing — existing marketing and session are left alone", () => {
		const writes = buildCheckoutCompleteContextMetadata({
			existing: [
				{ key: COMMERCE_CONTEXT_KEYS.origin, value: originGranted },
				{ key: COMMERCE_CONTEXT_KEYS.marketing, value: '{"source":"already"}' },
				{ key: COMMERCE_CONTEXT_KEYS.session, value: '{"sessionId":"old"}' },
			],
			consent: "granted",
			landing,
			sessionId: sid,
			now,
		});
		expect(writes).toEqual([]);
	});

	it("never writes marketing or session when consent is denied or unknown", () => {
		for (const consent of ["denied", "unknown"] as const) {
			const writes = buildCheckoutCompleteContextMetadata({
				existing: [{ key: COMMERCE_CONTEXT_KEYS.origin, value: originUnknown }],
				consent,
				landing,
				sessionId: sid,
				now,
			});
			expect(keys(writes)).not.toContain(COMMERCE_CONTEXT_KEYS.marketing);
			expect(keys(writes)).not.toContain(COMMERCE_CONTEXT_KEYS.session);
		}
	});

	it("records denied on origin so Pulse can separate declined from direct", () => {
		const writes = buildCheckoutCompleteContextMetadata({
			existing: [{ key: COMMERCE_CONTEXT_KEYS.origin, value: originUnknown }],
			consent: "denied",
			landing,
			sessionId: sid,
			now,
		});
		expect(section(writes, COMMERCE_CONTEXT_KEYS.origin).consent).toBe("denied");
	});

	it("does not rewrite origin when consent is unchanged", () => {
		const writes = buildCheckoutCompleteContextMetadata({
			existing: [{ key: COMMERCE_CONTEXT_KEYS.origin, value: originGranted }],
			consent: "granted",
			landing: null,
			sessionId: null,
			now,
		});
		expect(writes).toEqual([]);
	});

	it("writes a storefront origin when the key is missing", () => {
		const writes = buildCheckoutCompleteContextMetadata({
			existing: [],
			consent: "not_required",
			landing: { capturedAt: now.toISOString(), landingPath: "/en/us" },
			sessionId: null,
			now,
		});
		expect(section(writes, COMMERCE_CONTEXT_KEYS.origin)).toEqual({
			surface: "storefront",
			system: "paper",
			capturedAt: "2026-09-12T15:00:00.000Z",
			consent: "not_required",
		});
		expect(section(writes, COMMERCE_CONTEXT_KEYS.marketing)).toEqual({ landingPath: "/en/us" });
	});

	it("does not write an empty marketing object or a bad session id", () => {
		const writes = buildCheckoutCompleteContextMetadata({
			existing: [{ key: COMMERCE_CONTEXT_KEYS.origin, value: originGranted }],
			consent: "granted",
			landing: null,
			sessionId: "not valid",
			now,
		});
		expect(writes).toEqual([]);
	});

	it("does not stamp shopper cookies onto a non-storefront origin", () => {
		const agentOrigin = JSON.stringify({
			surface: COMMERCE_CONTEXT_SURFACE_AGENT,
			system: "paper",
			capturedAt: "2026-09-12T10:00:00.000Z",
			consent: "not_required",
		});
		expect(
			shouldApplyShopperCompleteEnrichment([{ key: COMMERCE_CONTEXT_KEYS.origin, value: agentOrigin }]),
		).toBe(false);

		for (const consent of ["granted", "denied", "not_required"] as const) {
			const writes = buildCheckoutCompleteContextMetadata({
				existing: [{ key: COMMERCE_CONTEXT_KEYS.origin, value: agentOrigin }],
				consent,
				landing,
				sessionId: sid,
				now,
			});
			expect(writes).toEqual([]);
		}
	});

	it("does not rewrite POS consent from the browser visitor", () => {
		const writes = buildCheckoutCompleteContextMetadata({
			existing: [
				{
					key: COMMERCE_CONTEXT_KEYS.origin,
					value: JSON.stringify({
						surface: "pos",
						system: "register",
						capturedAt: "2026-09-12T10:00:00.000Z",
						consent: "not_required",
					}),
				},
			],
			consent: "denied",
			landing,
			sessionId: sid,
			now,
		});
		expect(writes).toEqual([]);
	});

	it("does not write newsletter or pulse-private keys", () => {
		const writes = buildCheckoutCompleteContextMetadata({
			existing: [],
			consent: "granted",
			landing,
			sessionId: sid,
			now,
		});
		expect(keys(writes).some((key) => key.startsWith("paper.") || key.startsWith("pulse."))).toBe(false);
		expect(keys(writes)).not.toContain("commerce.context.actors");
	});
});
