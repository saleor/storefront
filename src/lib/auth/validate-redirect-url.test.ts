import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { isAllowedRedirectUrl } from "./validate-redirect-url";

const ORIGINAL_STOREFRONT_URL = process.env.NEXT_PUBLIC_STOREFRONT_URL;
const ORIGINAL_CHECKOUT_URL = process.env.NEXT_PUBLIC_CHECKOUT_URL;

describe("isAllowedRedirectUrl", () => {
	beforeEach(() => {
		delete process.env.NEXT_PUBLIC_STOREFRONT_URL;
		delete process.env.NEXT_PUBLIC_CHECKOUT_URL;
	});

	afterEach(() => {
		if (ORIGINAL_STOREFRONT_URL === undefined) {
			delete process.env.NEXT_PUBLIC_STOREFRONT_URL;
		} else {
			process.env.NEXT_PUBLIC_STOREFRONT_URL = ORIGINAL_STOREFRONT_URL;
		}
		if (ORIGINAL_CHECKOUT_URL === undefined) {
			delete process.env.NEXT_PUBLIC_CHECKOUT_URL;
		} else {
			process.env.NEXT_PUBLIC_CHECKOUT_URL = ORIGINAL_CHECKOUT_URL;
		}
	});

	it("accepts URLs on the request origin, including paths and query strings", () => {
		expect(
			isAllowedRedirectUrl("https://shop.example.com/checkout?checkout=abc", "https://shop.example.com"),
		).toBe(true);
	});

	it("rejects URLs on a foreign origin", () => {
		expect(isAllowedRedirectUrl("https://evil.example.com/reset", "https://shop.example.com")).toBe(false);
	});

	it("rejects subdomain and scheme tricks", () => {
		expect(isAllowedRedirectUrl("https://shop.example.com.evil.com/x", "https://shop.example.com")).toBe(
			false,
		);
		expect(isAllowedRedirectUrl("javascript:alert(1)", "https://shop.example.com")).toBe(false);
		expect(isAllowedRedirectUrl("//evil.example.com/x", "https://shop.example.com")).toBe(false);
		expect(isAllowedRedirectUrl("not a url", "https://shop.example.com")).toBe(false);
	});

	it("accepts configured storefront and checkout origins", () => {
		process.env.NEXT_PUBLIC_STOREFRONT_URL = "https://store.example.com";
		process.env.NEXT_PUBLIC_CHECKOUT_URL = "https://pay.example.com/checkout";

		expect(isAllowedRedirectUrl("https://store.example.com/login", null)).toBe(true);
		expect(isAllowedRedirectUrl("https://pay.example.com/checkout?step=contact", null)).toBe(true);
		expect(isAllowedRedirectUrl("https://other.example.com/login", null)).toBe(false);
	});

	it("rejects everything when no origins are known", () => {
		expect(isAllowedRedirectUrl("https://shop.example.com/reset", null)).toBe(false);
	});
});
