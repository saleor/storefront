import { describe, expect, it } from "vitest";
import {
	isSafeExternalHref,
	isSafeInternalHref,
	isSafeMailtoHref,
	isSafeNavHref,
	sanitizeNavHref,
} from "./safe-href";

/** Dangerous schemes and obfuscated variants — every validator must reject these. */
const UNSAFE_HREFS = [
	"javascript:alert(1)",
	"%6A%61%76%61%73%63%72%69%70%74%3aalert(1)",
	"java%0ascript:alert(1)",
	"java%09script:alert(1)",
	"java%0dscript:alert(1)",
	"data:text/html,evil",
	"data:text/html,<script>alert(1)</script>",
	"data:text/html;base64,PHN2Zy9vbmxvYWQ9YWxlcnQoMik+",
] as const;

/** Protocol-relative and slash-normalization bypasses — never valid internal paths. */
const UNSAFE_PROTOCOL_RELATIVE_HREFS = ["//evil.com", "/\\evil.com"] as const;

/** Nav validators must reject scheme attacks and protocol-relative bypasses. */
const UNSAFE_NAV_HREFS = [...UNSAFE_HREFS, ...UNSAFE_PROTOCOL_RELATIVE_HREFS] as const;

describe("safe-href", () => {
	it("accepts http and https URLs only for external hrefs", () => {
		expect(isSafeExternalHref("https://unsplash.com/@user")).toBe(true);
		expect(isSafeExternalHref("http://example.com")).toBe(true);
		expect(isSafeExternalHref("/relative")).toBe(false);
	});

	it("accepts internal paths but not protocol-relative URLs", () => {
		expect(isSafeInternalHref("/products")).toBe(true);
		expect(isSafeInternalHref("/categories/apparel")).toBe(true);
		expect(isSafeInternalHref("https://example.com")).toBe(false);
		expect(isSafeInternalHref("products")).toBe(false);
	});

	it("accepts mailto links", () => {
		expect(isSafeMailtoHref("mailto:support@example.com")).toBe(true);
	});

	it("combines safe nav href rules", () => {
		expect(isSafeNavHref("https://saleor.io")).toBe(true);
		expect(isSafeNavHref("/products")).toBe(true);
		expect(isSafeNavHref("mailto:hello@example.com")).toBe(true);
	});

	it.each(UNSAFE_HREFS)("isSafeExternalHref rejects %s", (href) => {
		expect(isSafeExternalHref(href)).toBe(false);
	});

	it.each(UNSAFE_HREFS)("isSafeInternalHref rejects %s", (href) => {
		expect(isSafeInternalHref(href)).toBe(false);
	});

	it.each(UNSAFE_PROTOCOL_RELATIVE_HREFS)("isSafeInternalHref rejects %s", (href) => {
		expect(isSafeInternalHref(href)).toBe(false);
	});

	it.each(UNSAFE_HREFS)("isSafeMailtoHref rejects %s", (href) => {
		expect(isSafeMailtoHref(href)).toBe(false);
	});

	it.each(UNSAFE_NAV_HREFS)("isSafeNavHref rejects %s", (href) => {
		expect(isSafeNavHref(href)).toBe(false);
	});

	it.each(UNSAFE_NAV_HREFS)("sanitizeNavHref rejects %s", (href) => {
		expect(sanitizeNavHref(href)).toBeNull();
	});

	it("sanitizeNavHref trims safe values and drops empty input", () => {
		expect(sanitizeNavHref("  /sale  ")).toBe("/sale");
		expect(sanitizeNavHref("")).toBeNull();
		expect(sanitizeNavHref(null)).toBeNull();
		expect(sanitizeNavHref(undefined)).toBeNull();
	});
});
