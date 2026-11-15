import { afterEach, describe, expect, it, vi } from "vitest";

import { defaultStorefrontContent } from "@/lib/content/defaults";
import { freeShippingThresholdFromMethods, withFreeShippingThreshold } from "@/lib/content/free-shipping";
import type { StorefrontContent } from "@/lib/content/types";

const method = (price: number, minimumOrderPrice?: number) => ({
	price: { amount: price },
	minimumOrderPrice: minimumOrderPrice === undefined ? null : { amount: minimumOrderPrice },
});

const withOverride = (threshold: number | null): StorefrontContent => ({
	...defaultStorefrontContent,
	policies: { ...defaultStorefrontContent.policies, shipping: { freeShippingThreshold: threshold } },
});

describe("freeShippingThresholdFromMethods", () => {
	it("reads the minimum order price of the method that costs nothing", () => {
		// Germany on an EU store: paid Standard below 50, free from 50, Express always paid.
		expect(freeShippingThresholdFromMethods([method(4.9, 0), method(0, 50), method(9.9, 0)])).toBe(50);
	});

	it("takes the lowest threshold when several free methods exist", () => {
		expect(freeShippingThresholdFromMethods([method(0, 150), method(0, 100)])).toBe(100);
	});

	it("returns null when no method is free", () => {
		expect(freeShippingThresholdFromMethods([method(4.9), method(9.9)])).toBeNull();
		expect(freeShippingThresholdFromMethods([])).toBeNull();
		expect(freeShippingThresholdFromMethods(null)).toBeNull();
	});

	it("does not let a free method without a minimum (a pickup) hide free delivery", () => {
		expect(freeShippingThresholdFromMethods([method(0), method(4.9, 0), method(0, 50)])).toBe(50);
	});

	it("returns null when the only free method has no minimum", () => {
		expect(freeShippingThresholdFromMethods([method(0), method(4.9, 0)])).toBeNull();
	});
});

describe("withFreeShippingThreshold", () => {
	afterEach(() => {
		vi.unstubAllEnvs();
		vi.restoreAllMocks();
	});

	it("uses Saleor's threshold when the content sets none", () => {
		const content = withFreeShippingThreshold(withOverride(null), 50, { channel: "eu" });
		expect(content.policies.shipping.freeShippingThreshold).toBe(50);
	});

	it("lets the content override win", () => {
		const content = withFreeShippingThreshold(withOverride(60), 50, { channel: "eu" });
		expect(content.policies.shipping.freeShippingThreshold).toBe(60);
	});

	it("shows no threshold when neither Saleor nor the content has one", () => {
		const content = withFreeShippingThreshold(withOverride(null), null, { channel: "eu" });
		expect(content.policies.shipping.freeShippingThreshold).toBeNull();
	});

	it("ships no threshold of its own in the code defaults", () => {
		expect(defaultStorefrontContent.policies.shipping.freeShippingThreshold).toBeNull();
	});

	it("warns in development when the override disagrees with Saleor", () => {
		vi.stubEnv("NODE_ENV", "development");
		const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

		withFreeShippingThreshold(withOverride(40), 50, { channel: "eu" });
		expect(warn).toHaveBeenCalledWith(expect.stringContaining('Channel "eu"'));
		expect(warn).toHaveBeenCalledWith(expect.stringContaining("(40)"));

		warn.mockClear();
		withFreeShippingThreshold(withOverride(50), 50, { channel: "eu" });
		withFreeShippingThreshold(withOverride(40), null, { channel: "eu" });
		expect(warn).not.toHaveBeenCalled();
	});

	it("stays quiet outside development", () => {
		vi.stubEnv("NODE_ENV", "production");
		const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

		withFreeShippingThreshold(withOverride(40), 50, { channel: "eu" });
		expect(warn).not.toHaveBeenCalled();
	});
});
