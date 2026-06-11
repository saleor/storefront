import { describe, expect, it } from "vitest";
import {
	buildMarketingConsentMetadata,
	MARKETING_CONSENT_METADATA,
	MARKETING_CONSENT_SOURCE_CHECKOUT_CONTACT,
} from "./keys";

describe("buildMarketingConsentMetadata", () => {
	it("writes namespaced keys for opt-in", () => {
		const metadata = buildMarketingConsentMetadata(true);

		expect(metadata).toEqual(
			expect.arrayContaining([
				{ key: MARKETING_CONSENT_METADATA.optIn, value: "true" },
				{ key: MARKETING_CONSENT_METADATA.source, value: MARKETING_CONSENT_SOURCE_CHECKOUT_CONTACT },
			]),
		);
		expect(metadata.find((entry) => entry.key === MARKETING_CONSENT_METADATA.optInAt)?.value).toMatch(
			/^\d{4}-\d{2}-\d{2}T/,
		);
	});

	it("writes explicit false when unchecked", () => {
		const metadata = buildMarketingConsentMetadata(false);
		expect(metadata.find((entry) => entry.key === MARKETING_CONSENT_METADATA.optIn)?.value).toBe("false");
	});
});
