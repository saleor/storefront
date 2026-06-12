import { afterEach, describe, expect, it, vi } from "vitest";

describe("isCheckoutMarketingConsentEnabled", () => {
	const original = process.env.NEXT_PUBLIC_ENABLE_CHECKOUT_MARKETING_OPT_IN;

	afterEach(() => {
		if (original === undefined) {
			delete process.env.NEXT_PUBLIC_ENABLE_CHECKOUT_MARKETING_OPT_IN;
		} else {
			process.env.NEXT_PUBLIC_ENABLE_CHECKOUT_MARKETING_OPT_IN = original;
		}
		vi.resetModules();
	});

	it("is enabled by default", async () => {
		delete process.env.NEXT_PUBLIC_ENABLE_CHECKOUT_MARKETING_OPT_IN;
		const { isCheckoutMarketingConsentEnabled } = await import("./config");
		expect(isCheckoutMarketingConsentEnabled()).toBe(true);
	});

	it("can be disabled explicitly", async () => {
		process.env.NEXT_PUBLIC_ENABLE_CHECKOUT_MARKETING_OPT_IN = "false";
		const { isCheckoutMarketingConsentEnabled } = await import("./config");
		expect(isCheckoutMarketingConsentEnabled()).toBe(false);
	});
});
