import { describe, expect, it } from "vitest";
import {
	isSafeExternalHref,
	isSafeInternalHref,
	isSafeMailtoHref,
	isSafeNavHref,
	sanitizeNavHref,
} from "./safe-href";

describe("safe-href", () => {
	it("accepts http and https URLs only for external hrefs", () => {
		expect(isSafeExternalHref("https://unsplash.com/@user")).toBe(true);
		expect(isSafeExternalHref("http://example.com")).toBe(true);
		expect(isSafeExternalHref("javascript:alert(1)")).toBe(false);
		expect(isSafeExternalHref("data:text/html,evil")).toBe(false);
		expect(isSafeExternalHref("/relative")).toBe(false);
	});

	it("accepts internal paths but not protocol-relative URLs", () => {
		expect(isSafeInternalHref("/products")).toBe(true);
		expect(isSafeInternalHref("/categories/apparel")).toBe(true);
		expect(isSafeInternalHref("//evil.com")).toBe(false);
		expect(isSafeInternalHref("/\\evil.com")).toBe(false);
		expect(isSafeInternalHref("https://example.com")).toBe(false);
		expect(isSafeInternalHref("products")).toBe(false);
	});

	it("accepts mailto links", () => {
		expect(isSafeMailtoHref("mailto:support@example.com")).toBe(true);
		expect(isSafeMailtoHref("javascript:alert(1)")).toBe(false);
	});

	it("combines safe nav href rules", () => {
		expect(isSafeNavHref("https://saleor.io")).toBe(true);
		expect(isSafeNavHref("/products")).toBe(true);
		expect(isSafeNavHref("mailto:hello@example.com")).toBe(true);
		expect(isSafeNavHref("javascript:alert(1)")).toBe(false);
		expect(isSafeNavHref("data:text/html,evil")).toBe(false);
		expect(isSafeNavHref("//evil.com")).toBe(false);
	});

	it("sanitizeNavHref trims and drops unsafe values", () => {
		expect(sanitizeNavHref("  /sale  ")).toBe("/sale");
		expect(sanitizeNavHref("javascript:alert(1)")).toBeNull();
		expect(sanitizeNavHref("")).toBeNull();
		expect(sanitizeNavHref(null)).toBeNull();
	});
});
