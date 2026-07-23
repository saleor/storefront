import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { isAllowedRedirectUrl } from "./validate-redirect-url";

const ORIGINAL_NODE_ENV = process.env.NODE_ENV;
const ORIGINAL_STOREFRONT_URL = process.env.NEXT_PUBLIC_STOREFRONT_URL;
const ORIGINAL_CHECKOUT_URL = process.env.NEXT_PUBLIC_CHECKOUT_URL;
const ORIGINAL_ALLOWED_EXTRA_ORIGINS = process.env.ALLOWED_EXTRA_ORIGINS;

function setNodeEnv(value: string) {
	Object.defineProperty(process.env, "NODE_ENV", {
		configurable: true,
		enumerable: true,
		value,
		writable: true,
	});
}

function restoreEnv(name: string, value: string | undefined) {
	if (value === undefined) {
		delete process.env[name];
	} else {
		process.env[name] = value;
	}
}

describe("isAllowedRedirectUrl", () => {
	beforeEach(() => {
		setNodeEnv("production");
		delete process.env.NEXT_PUBLIC_STOREFRONT_URL;
		delete process.env.NEXT_PUBLIC_CHECKOUT_URL;
		delete process.env.ALLOWED_EXTRA_ORIGINS;
	});

	afterEach(() => {
		restoreEnv("NODE_ENV", ORIGINAL_NODE_ENV);
		restoreEnv("NEXT_PUBLIC_STOREFRONT_URL", ORIGINAL_STOREFRONT_URL);
		restoreEnv("NEXT_PUBLIC_CHECKOUT_URL", ORIGINAL_CHECKOUT_URL);
		restoreEnv("ALLOWED_EXTRA_ORIGINS", ORIGINAL_ALLOWED_EXTRA_ORIGINS);
	});

	it("rejects URLs that only match the request origin in production", () => {
		// Production mode should reject
		expect(
			isAllowedRedirectUrl("https://shop.example.com/checkout?checkout=abc", "https://shop.example.com"),
		).toBe(false);
	});

	it("rejects URLs on a foreign origin", () => {
		process.env.NEXT_PUBLIC_STOREFRONT_URL = "https://shop.example.com";

		expect(isAllowedRedirectUrl("https://evil.example.com/reset", "https://shop.example.com")).toBe(false);
	});

	it("rejects subdomain and scheme tricks", () => {
		process.env.NEXT_PUBLIC_STOREFRONT_URL = "https://shop.example.com";

		expect(isAllowedRedirectUrl("https://shop.example.com.evil.com/x", null)).toBe(false);
		expect(isAllowedRedirectUrl("javascript:alert(1)", null)).toBe(false);
		expect(isAllowedRedirectUrl("//evil.example.com/x", null)).toBe(false);
		expect(isAllowedRedirectUrl("not a url", null)).toBe(false);
	});

	it("accepts configured storefront and checkout origins", () => {
		process.env.NEXT_PUBLIC_STOREFRONT_URL = "https://store.example.com";
		process.env.NEXT_PUBLIC_CHECKOUT_URL = "https://pay.example.com/checkout";

		expect(isAllowedRedirectUrl("https://store.example.com/login", null)).toBe(true);
		expect(isAllowedRedirectUrl("https://pay.example.com/checkout?step=contact", null)).toBe(true);
		expect(isAllowedRedirectUrl("https://other.example.com/login", null)).toBe(false);
	});

	it("accepts explicitly configured extra origins", () => {
		process.env.ALLOWED_EXTRA_ORIGINS = "https://preview.example.com,https://checkout-preview.example.com";

		expect(isAllowedRedirectUrl("https://preview.example.com/login", null)).toBe(true);
		expect(isAllowedRedirectUrl("https://checkout-preview.example.com/checkout", null)).toBe(true);
		expect(isAllowedRedirectUrl("https://not-allowed.example.com/login", null)).toBe(false);
	});

	it("accepts loopback request origins outside production", () => {
		setNodeEnv("development");

		expect(isAllowedRedirectUrl("http://localhost:3000/login", "http://localhost:3000")).toBe(true);
		expect(isAllowedRedirectUrl("http://127.0.0.1:3000/login", "http://127.0.0.1:3000")).toBe(true);
		expect(isAllowedRedirectUrl("http://[::1]:3000/login", "http://[::1]:3000")).toBe(true);
	});

	it("rejects loopback request origins in production", () => {
		expect(isAllowedRedirectUrl("http://localhost:3000/login", "http://localhost:3000")).toBe(false);
		expect(isAllowedRedirectUrl("http://127.0.0.1:3000/login", "http://127.0.0.1:3000")).toBe(false);
		expect(isAllowedRedirectUrl("http://[::1]:3000/login", "http://[::1]:3000")).toBe(false);
	});

	it("rejects arbitrary request origins outside production", () => {
		setNodeEnv("development");

		expect(isAllowedRedirectUrl("https://shop.example.com/reset", "https://shop.example.com")).toBe(false);
	});

	it("rejects everything when no origins are known", () => {
		expect(isAllowedRedirectUrl("https://shop.example.com/reset", null)).toBe(false);
	});
});
