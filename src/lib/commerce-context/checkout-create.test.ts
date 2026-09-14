import { describe, expect, it } from "vitest";
import { buildCheckoutCreateContextMetadata } from "./checkout-create";
import { COMMERCE_CONTEXT_KEYS } from "./keys";

const now = new Date("2026-09-12T10:00:00.000Z");

function section(items: { key: string; value: string }[], key: string): Record<string, unknown> {
	const item = items.find((candidate) => candidate.key === key);
	if (!item) throw new Error(`missing ${key}`);
	return JSON.parse(item.value) as Record<string, unknown>;
}

describe("buildCheckoutCreateContextMetadata", () => {
	it("writes exactly the consent-free sections: origin + ext.paper", () => {
		const keys = buildCheckoutCreateContextMetadata({ locale: "en", now, consent: "unknown" }).map(
			(item) => item.key,
		);
		expect(keys.sort()).toEqual([COMMERCE_CONTEXT_KEYS.origin, COMMERCE_CONTEXT_KEYS.extPaper].sort());
	});

	it("origin is a spec-valid storefront origin with a consent marker", () => {
		const origin = section(
			buildCheckoutCreateContextMetadata({ locale: "en", now, consent: "unknown" }),
			COMMERCE_CONTEXT_KEYS.origin,
		);
		expect(origin).toEqual({
			surface: "storefront",
			system: "paper",
			capturedAt: "2026-09-12T10:00:00.000Z",
			consent: "unknown",
		});
	});

	it("records denied so Pulse can separate declined from direct", () => {
		const origin = section(
			buildCheckoutCreateContextMetadata({ locale: "en", now, consent: "denied" }),
			COMMERCE_CONTEXT_KEYS.origin,
		);
		expect(origin.consent).toBe("denied");
	});

	it("ext.paper carries the BCP 47 locale and the Paper baseline", () => {
		const ext = section(
			buildCheckoutCreateContextMetadata({ locale: "pl", now, consent: "not_required" }),
			COMMERCE_CONTEXT_KEYS.extPaper,
		);
		expect(ext.locale).toBe("pl-PL");
		expect(ext.paperVersion).toMatch(/^[0-9a-f]{7,40}$/);
	});

	it("never writes marketing, session or Pulse-private keys at create time", () => {
		const keys = buildCheckoutCreateContextMetadata({ locale: "en", now, consent: "granted" }).map(
			(item) => item.key,
		);
		expect(keys).not.toContain(COMMERCE_CONTEXT_KEYS.marketing);
		expect(keys).not.toContain(COMMERCE_CONTEXT_KEYS.session);
		expect(keys).not.toContain(COMMERCE_CONTEXT_KEYS.actors);
		expect(keys.some((key) => key.startsWith("pulse."))).toBe(false);
	});

	it("does not collide with the newsletter opt-in namespace", () => {
		const keys = buildCheckoutCreateContextMetadata({ locale: "en", now, consent: "unknown" }).map(
			(item) => item.key,
		);
		expect(keys.some((key) => key.startsWith("paper."))).toBe(false);
	});
});
