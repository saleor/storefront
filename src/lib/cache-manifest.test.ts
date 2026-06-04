import { describe, it, expect } from "vitest";
import {
	CACHE_PROFILES,
	buildTag,
	resolveCacheLifeProfileForTag,
	resolveManualRevalidateTag,
	resolveRevalidateProfileForTag,
	resolveCacheProfileForMenuSlug,
	isKnownStorefrontMenuSlug,
	extractMenuSlugFromWebhookPayload,
	extractPageSlugFromWebhookPayload,
	buildMenuRevalidationTags,
	planMenuRevalidation,
	planPageRevalidation,
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
		expect(resolveCacheLifeProfileForTag("page:about-us")).toBe("catalog");
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

describe("menu revalidation helpers", () => {
	it("maps storefront menu slugs to cache profiles", () => {
		expect(isKnownStorefrontMenuSlug("navbar")).toBe(true);
		expect(isKnownStorefrontMenuSlug("footer")).toBe(true);
		expect(isKnownStorefrontMenuSlug("sidebar")).toBe(false);
		expect(resolveCacheProfileForMenuSlug("navbar")).toBe(CACHE_PROFILES.navigation);
		expect(resolveCacheProfileForMenuSlug("footer")).toBe(CACHE_PROFILES.footerMenu);
		expect(resolveCacheProfileForMenuSlug("sidebar")).toBeNull();
	});

	it("extracts menu slug from menu and menuItem webhook payloads", () => {
		expect(extractMenuSlugFromWebhookPayload({ menu: { slug: "navbar" } })).toBe("navbar");
		expect(extractMenuSlugFromWebhookPayload({ menuItem: { menu: { slug: "footer" } } })).toBe("footer");
		expect(extractMenuSlugFromWebhookPayload({ menu: { slug: "" } })).toBeNull();
		expect(extractMenuSlugFromWebhookPayload({ product: { slug: "shirt" } })).toBeNull();
	});

	it("builds channel-scoped tags for all storefront channels", () => {
		expect(buildMenuRevalidationTags("navbar", ["us", "uk"])).toEqual([
			{ tag: "navigation:us", profile: "menus" },
			{ tag: "navigation:uk", profile: "menus" },
		]);
		expect(buildMenuRevalidationTags("footer", ["default-channel"])).toEqual([
			{ tag: "footer-menu:default-channel", profile: "menus" },
		]);
		expect(buildMenuRevalidationTags("unknown", ["us"])).toEqual([]);
	});

	it("plans menu revalidation outcomes", () => {
		expect(planMenuRevalidation(undefined, ["us"])).toEqual({
			action: "skip",
			reason: "missing_slug",
		});
		expect(planMenuRevalidation("sidebar", ["us"])).toEqual({
			action: "skip",
			reason: "unknown_menu",
		});
		expect(planMenuRevalidation("navbar", [])).toEqual({
			action: "error",
			reason: "no_channels",
		});
		expect(planMenuRevalidation("navbar", ["us", "uk"])).toEqual({
			action: "revalidate",
			menuSlug: "navbar",
			tags: [
				{ tag: "navigation:us", profile: "menus" },
				{ tag: "navigation:uk", profile: "menus" },
			],
		});
	});
});

describe("page revalidation helpers", () => {
	it("extracts page slug from page webhook payloads", () => {
		expect(extractPageSlugFromWebhookPayload({ page: { slug: "about-us" } })).toBe("about-us");
		expect(extractPageSlugFromWebhookPayload({ page: { slug: "" } })).toBeNull();
		expect(extractPageSlugFromWebhookPayload({ product: { slug: "shirt" } })).toBeNull();
	});

	it("plans tag + channel paths for CMS pages", () => {
		expect(planPageRevalidation("about-us", ["us", "uk"], null)).toEqual({
			action: "revalidate",
			slug: "about-us",
			tag: "page:about-us",
			profile: "catalog",
			paths: ["/us/pages/about-us", "/uk/pages/about-us"],
		});
		expect(planPageRevalidation(undefined, ["us"])).toEqual({
			action: "skip",
			reason: "missing_slug",
		});
		expect(planPageRevalidation("about-us", [], "default-channel")).toEqual({
			action: "revalidate",
			slug: "about-us",
			tag: "page:about-us",
			profile: "catalog",
			paths: ["/default-channel/pages/about-us"],
		});
		expect(planPageRevalidation("about-us", [], null)).toEqual({
			action: "error",
			reason: "no_channels",
		});
	});
});
