import { afterEach, describe, expect, it, vi } from "vitest";

import { hashedKey, normalizeEmail } from "./keys";

afterEach(() => {
	vi.unstubAllEnvs();
});

describe("hashedKey", () => {
	it("never holds the value itself", () => {
		vi.stubEnv("RATE_LIMIT_SECRET", "s3cret");
		const key = hashedKey("order-lookup-email", "ann@example.com");
		expect(key).toMatch(/^order-lookup-email:[0-9a-f]{32}$/);
		expect(key).not.toContain("ann");
	});

	it("is stable for a value and differs between values and scopes", () => {
		vi.stubEnv("RATE_LIMIT_SECRET", "s3cret");
		expect(hashedKey("a", "x")).toBe(hashedKey("a", "x"));
		expect(hashedKey("a", "x")).not.toBe(hashedKey("a", "y"));
		expect(hashedKey("a", "x")).not.toBe(hashedKey("b", "x"));
	});

	it("depends on the secret, so the store alone does not reveal which emails were tried", () => {
		vi.stubEnv("RATE_LIMIT_SECRET", "one");
		const first = hashedKey("a", "ann@example.com");
		vi.stubEnv("RATE_LIMIT_SECRET", "two");
		expect(hashedKey("a", "ann@example.com")).not.toBe(first);
	});

	it("falls back to the order-view and revalidation secrets", () => {
		vi.stubEnv("RATE_LIMIT_SECRET", "");
		vi.stubEnv("ORDER_VIEW_SECRET", "");
		vi.stubEnv("REVALIDATE_SECRET", "shared");
		const viaRevalidate = hashedKey("a", "x");
		vi.stubEnv("RATE_LIMIT_SECRET", "shared");
		expect(hashedKey("a", "x")).toBe(viaRevalidate);
	});
});

describe("normalizeEmail", () => {
	it("ignores case and surrounding spaces", () => {
		expect(normalizeEmail("  Ann@Example.COM ")).toBe("ann@example.com");
	});
});
