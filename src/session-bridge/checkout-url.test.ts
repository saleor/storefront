import { describe, expect, it } from "vitest";

import {
	buildCheckoutPath,
	buildCheckoutUrl,
	buildOrderConfirmationPath,
	buildOrderConfirmationUrl,
} from "./checkout-url";

describe("buildCheckoutPath", () => {
	it("builds checkout session path", () => {
		expect(buildCheckoutPath({ checkoutId: "abc" })).toBe("/checkout?checkout=abc");
	});

	it("includes step when provided", () => {
		expect(buildCheckoutPath({ checkoutId: "abc", step: "payment" })).toBe(
			"/checkout?checkout=abc&step=payment",
		);
	});

	it("includes browse locale when provided", () => {
		expect(buildCheckoutPath({ checkoutId: "abc", browseLocale: "pl" })).toBe(
			"/checkout?checkout=abc&locale=pl",
		);
	});
});

describe("buildOrderConfirmationPath", () => {
	it("builds order confirmation path on dedicated route", () => {
		expect(buildOrderConfirmationPath({ orderId: "ord-1" })).toBe("/checkout/complete?order=ord-1");
	});
});

describe("buildCheckoutUrl", () => {
	it("returns relative path when CHECKOUT_URL is unset", () => {
		const prev = process.env.NEXT_PUBLIC_CHECKOUT_URL;
		delete process.env.NEXT_PUBLIC_CHECKOUT_URL;
		expect(buildCheckoutUrl({ checkoutId: "x" })).toBe("/checkout?checkout=x");
		process.env.NEXT_PUBLIC_CHECKOUT_URL = prev;
	});

	it("returns absolute URL when CHECKOUT_URL is set", () => {
		const prev = process.env.NEXT_PUBLIC_CHECKOUT_URL;
		process.env.NEXT_PUBLIC_CHECKOUT_URL = "https://checkout.example.com";
		expect(buildCheckoutUrl({ checkoutId: "x" })).toBe("https://checkout.example.com/checkout?checkout=x");
		process.env.NEXT_PUBLIC_CHECKOUT_URL = prev;
	});
});

describe("buildOrderConfirmationUrl", () => {
	it("returns relative path when CHECKOUT_URL is unset", () => {
		const prev = process.env.NEXT_PUBLIC_CHECKOUT_URL;
		delete process.env.NEXT_PUBLIC_CHECKOUT_URL;
		expect(buildOrderConfirmationUrl({ orderId: "ord-1" })).toBe("/checkout/complete?order=ord-1");
		process.env.NEXT_PUBLIC_CHECKOUT_URL = prev;
	});
});
