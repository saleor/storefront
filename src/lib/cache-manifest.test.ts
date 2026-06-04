import { describe, it, expect } from "vitest";
import {
	CACHE_PROFILES,
	buildTag,
	resolveCacheLifeProfileForTag,
	resolveManualRevalidateTag,
} from "./cache-manifest";

describe("buildTag", () => {
	it("resolves slug placeholders", () => {
		expect(buildTag(CACHE_PROFILES.products, "blue-shirt")).toBe("product:blue-shirt");
		expect(buildTag(CACHE_PROFILES.products, { slug: "blue-shirt" })).toBe("product:blue-shirt");
	});

	it("resolves channel placeholders", () => {
		expect(buildTag(CACHE_PROFILES.navigation, { channel: "default-channel" })).toBe(
			"navigation:default-channel",
		);
		expect(buildTag(CACHE_PROFILES.footerMenu, { channel: "us" })).toBe("footer-menu:us");
	});

	it("throws when required placeholders are missing", () => {
		expect(() => buildTag(CACHE_PROFILES.navigation)).toThrow(/Unresolved tag/);
		expect(() => buildTag(CACHE_PROFILES.navigation, {})).toThrow(/Provide: \{channel\}/);
		expect(() => buildTag(CACHE_PROFILES.products, { channel: "us" })).toThrow(/Provide: \{slug\}/);
	});
});

describe("resolveCacheLifeProfileForTag", () => {
	it("maps known tags to profile cacheLife values", () => {
		expect(resolveCacheLifeProfileForTag("navigation:default-channel")).toBe("hours");
		expect(resolveCacheLifeProfileForTag("footer-menu:us")).toBe("hours");
		expect(resolveCacheLifeProfileForTag("product:blue-shirt")).toBe("minutes");
		expect(resolveCacheLifeProfileForTag("channels")).toBe("days");
	});

	it("falls back to minutes for unknown tags", () => {
		expect(resolveCacheLifeProfileForTag("unknown-tag")).toBe("minutes");
	});
});

describe("resolveManualRevalidateTag", () => {
	it("expands profile id + channel into a concrete tag", () => {
		expect(resolveManualRevalidateTag("navigation", "default-channel")).toBe("navigation:default-channel");
		expect(resolveManualRevalidateTag("footer-menu", "us")).toBe("footer-menu:us");
	});

	it("leaves fully qualified tags unchanged", () => {
		expect(resolveManualRevalidateTag("navigation:default-channel", "us")).toBe("navigation:default-channel");
	});
});
