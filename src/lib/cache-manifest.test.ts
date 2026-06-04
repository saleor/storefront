import { describe, it, expect } from "vitest";
import {
	CACHE_PROFILES,
	buildTag,
	resolveCacheLifeProfileForTag,
	resolveManualRevalidateTag,
	resolveRevalidateProfileForTag,
} from "./cache-manifest";
import { PAPER_CACHE_LIFE_PROFILE_NAMES, paperCacheLifeProfiles } from "./cache-life-profiles";

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
	it("maps known tags to Paper cacheLife tiers", () => {
		expect(resolveCacheLifeProfileForTag("navigation:default-channel")).toBe("menus");
		expect(resolveCacheLifeProfileForTag("footer-menu:us")).toBe("menus");
		expect(resolveCacheLifeProfileForTag("product:blue-shirt")).toBe("catalog");
		expect(resolveCacheLifeProfileForTag("channels")).toBe("channels");
	});

	it("falls back to catalog for unknown tags", () => {
		expect(resolveCacheLifeProfileForTag("unknown-tag")).toBe("catalog");
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

describe("cache manifest ↔ cacheLife tiers", () => {
	it("maps every manifest profile to a registered next.config tier", () => {
		for (const profile of Object.values(CACHE_PROFILES)) {
			expect(PAPER_CACHE_LIFE_PROFILE_NAMES).toContain(profile.cacheProfile);
			expect(paperCacheLifeProfiles[profile.cacheProfile]).toBeDefined();
		}
	});
});

describe("resolveRevalidateProfileForTag", () => {
	it("accepts legacy built-in profile names for manual revalidation", () => {
		expect(resolveRevalidateProfileForTag("navigation:us", "hours")).toBe("menus");
		expect(resolveRevalidateProfileForTag("product:foo", "minutes")).toBe("catalog");
		expect(resolveRevalidateProfileForTag("channels", "days")).toBe("channels");
	});

	it("falls back to tag resolution for unknown overrides", () => {
		expect(resolveRevalidateProfileForTag("product:foo", "bogus")).toBe("catalog");
	});
});
