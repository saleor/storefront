import { describe, expect, it } from "vitest";

import {
	buildCheckoutPath,
	buildCheckoutUrl,
	buildOrderConfirmationPath,
	buildOrderConfirmationUrl,
	buildOrderStatusPath,
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
	it("builds the guest order path from a signed token", () => {
		expect(buildOrderConfirmationPath({ token: "ov1.abc.def" })).toBe("/order/ov1.abc.def");
	});

	it("forwards browse locale so confirmation matches checkout", () => {
		expect(buildOrderConfirmationPath({ token: "ov1.abc.def", browseLocale: "pl" })).toBe(
			"/order/ov1.abc.def?locale=pl",
		);
	});
});

describe("buildOrderStatusPath", () => {
	it("encodes a Saleor order id for the email landing", () => {
		expect(buildOrderStatusPath("T3JkZXI6MQ==")).toBe("/order/T3JkZXI6MQ%3D%3D");
	});

	it("appends browse locale when provided", () => {
		expect(buildOrderStatusPath("T3JkZXI6MQ==", "ja")).toBe("/order/T3JkZXI6MQ%3D%3D?locale=ja");
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
		expect(buildOrderConfirmationUrl({ token: "ov1.abc.def" })).toBe("/order/ov1.abc.def");
		process.env.NEXT_PUBLIC_CHECKOUT_URL = prev;
	});
});
