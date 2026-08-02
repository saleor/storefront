import { describe, it, expect } from "vitest";
import {
	CACHE_PROFILES,
	CACHE_PROFILE_LIST,
	buildTag,
	buildStorefrontManifestIdentity,
	resolveCacheLifeProfileForTag,
	resolveManualRevalidateTag,
	resolveRevalidateProfileForTag,
	resolveCacheProfileForMenuSlug,
	resolveStorefrontManifestEnvironment,
	isKnownStorefrontMenuSlug,
	isChannelLocaleScopedTagProfile,
	isChannelScopedTagProfile,
	extractMenuSlugFromWebhookPayload,
	extractPageSlugFromWebhookPayload,
	buildMenuRevalidationTags,
	planFullPurgeTagEntries,
	planMenuRevalidation,
	planPageRevalidation,
	planStorefrontContentRevalidation,
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
		expect(resolveCacheLifeProfileForTag("storefront-content:default-channel:en-US")).toBe("menus");
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
			paths: ["/en/us/pages/about-us", "/en/uk/pages/about-us"],
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
			paths: ["/en/default-channel/pages/about-us"],
		});
		expect(planPageRevalidation("about-us", [], null)).toEqual({
			action: "error",
			reason: "no_channels",
		});
	});
});

describe("storefront content revalidation helpers", () => {
	it("skips non-storefront editorial page slugs", () => {
		expect(planStorefrontContentRevalidation("about-us", ["us"])).toEqual({
			action: "skip",
			reason: "not_storefront_singleton",
		});
	});

	it("revalidates all channels for global PageType slug", () => {
		expect(planStorefrontContentRevalidation("storefront-homepage", ["us", "uk"], null)).toEqual({
			action: "revalidate",
			tags: [
				{ tag: "storefront-content:us:en-US", profile: "menus" },
				{ tag: "storefront-content:uk:en-US", profile: "menus" },
			],
			paths: ["/en/us", "/en/uk"],
		});
	});

	it("revalidates a single channel for {pageType}-{channel} slug", () => {
		expect(planStorefrontContentRevalidation("storefront-homepage-us", ["us", "uk"], null)).toEqual({
			action: "revalidate",
			tags: [{ tag: "storefront-content:us:en-US", profile: "menus" }],
			paths: ["/en/us"],
		});
	});
});

describe("full purge tag planning", () => {
	it("treats storefront-content as channel×locale, not channel-only", () => {
		expect(isChannelScopedTagProfile(CACHE_PROFILES.storefrontContent)).toBe(false);
		expect(isChannelLocaleScopedTagProfile(CACHE_PROFILES.storefrontContent)).toBe(true);
		expect(isChannelScopedTagProfile(CACHE_PROFILES.navigation)).toBe(true);
		expect(isChannelLocaleScopedTagProfile(CACHE_PROFILES.navigation)).toBe(false);
	});

	it("expands enumerable tags without throwing on locale placeholders", () => {
		const tags = planFullPurgeTagEntries(["us", "uk"]).map((e) => e.tag);

		expect(tags).toContain("channels");
		expect(tags).toContain("navigation:us");
		expect(tags).toContain("navigation:uk");
		expect(tags).toContain("footer-menu:us");
		expect(tags).toContain("footer-menu:uk");
		expect(tags).toContain("storefront-content:us:en-US");
		expect(tags).toContain("storefront-content:uk:en-US");
		expect(tags).toContain("products");
		expect(tags).toContain("categories");
		expect(tags).toContain("collections");
		expect(tags).toContain("pages");
		expect(tags.some((t) => t.includes("{locale}"))).toBe(false);
		expect(tags.some((t) => t.startsWith("product:"))).toBe(false);
	});

	it("includes shared catalog tags even when no channels are configured", () => {
		expect(planFullPurgeTagEntries([]).map((e) => e.tag)).toEqual([
			"products",
			"categories",
			"collections",
			"pages",
			"channels",
		]);
	});
});

describe("shared catalog tags", () => {
	it("defines sharedTag on every slug-scoped catalog profile", () => {
		expect(CACHE_PROFILES.products.sharedTag).toBe("products");
		expect(CACHE_PROFILES.categories.sharedTag).toBe("categories");
		expect(CACHE_PROFILES.collections.sharedTag).toBe("collections");
		expect(CACHE_PROFILES.pages.sharedTag).toBe("pages");
		expect(CACHE_PROFILE_LIST.filter((p) => p.id === "navigation")[0]?.sharedTag).toBeUndefined();
	});

	it("maps shared tags to the catalog cacheLife tier", () => {
		expect(resolveCacheLifeProfileForTag("products")).toBe("catalog");
		expect(resolveCacheLifeProfileForTag("categories")).toBe("catalog");
		expect(resolveCacheLifeProfileForTag("collections")).toBe("catalog");
		expect(resolveCacheLifeProfileForTag("pages")).toBe("catalog");
	});
});

describe("manifest v6 identity", () => {
	it("resolves environment from explicit override, then Vercel, then NODE_ENV", () => {
		expect(
			resolveStorefrontManifestEnvironment({
				PAPER_STOREFRONT_ENVIRONMENT: "staging",
				VERCEL_ENV: "production",
			}),
		).toBe("staging");
		expect(resolveStorefrontManifestEnvironment({ VERCEL_ENV: "preview" })).toBe("preview");
		expect(resolveStorefrontManifestEnvironment({ NODE_ENV: "development" })).toBe("development");
	});

	it("does not fall through when an explicit environment override is invalid", () => {
		expect(
			resolveStorefrontManifestEnvironment({
				PAPER_STOREFRONT_ENVIRONMENT: "prod",
				VERCEL_ENV: "production",
			}),
		).toBeUndefined();
	});

	it("builds identity from Saleor URL and deploy metadata", () => {
		expect(
			buildStorefrontManifestIdentity({
				NEXT_PUBLIC_SALEOR_API_URL: "https://demo.saleor.cloud/graphql/",
				VERCEL_ENV: "production",
				VERCEL_DEPLOYMENT_ID: "dpl_abc",
				VERCEL_GIT_COMMIT_SHA: "deadbeef",
				VERCEL_GIT_COMMIT_REF: "main",
			}),
		).toEqual({
			saleorApiUrl: "https://demo.saleor.cloud/graphql/",
			environment: "production",
			buildId: "dpl_abc",
			commit: "deadbeef",
			branch: "main",
		});
	});

	it("canonicalizes Saleor API URL with a trailing slash", () => {
		expect(
			buildStorefrontManifestIdentity({
				NEXT_PUBLIC_SALEOR_API_URL: "https://demo.saleor.cloud/graphql",
			}),
		).toEqual({ saleorApiUrl: "https://demo.saleor.cloud/graphql/" });
	});

	it("omits identity when Saleor URL is unset", () => {
		expect(buildStorefrontManifestIdentity({})).toBeUndefined();
	});
});
