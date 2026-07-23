import { describe, expect, it, vi, afterEach } from "vitest";
import { buildCatalogPathSuffixByLocale, buildLocaleSlugMap } from "./locale-slugs";

describe("buildLocaleSlugMap", () => {
	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it("uses translated slugs per configured locale and falls back to primary", () => {
		vi.stubEnv("NEXT_PUBLIC_STOREFRONT_LOCALES", "en,pl");
		vi.stubEnv("NEXT_PUBLIC_DEFAULT_LOCALE", "en");

		expect(
			buildLocaleSlugMap({
				slug: "hoodie",
				slugEN: { slug: null },
				slugPL: { slug: "bluza" },
			}),
		).toEqual({
			en: "hoodie",
			pl: "bluza",
		});
	});

	it("resolves JA via slugJA alias from LOCALE_DEFINITIONS graphqlLanguageCode", () => {
		vi.stubEnv("NEXT_PUBLIC_STOREFRONT_LOCALES", "en,ja");
		vi.stubEnv("NEXT_PUBLIC_DEFAULT_LOCALE", "en");

		expect(
			buildLocaleSlugMap({
				slug: "kimono",
				slugEN: { slug: null },
				slugJA: { slug: "kimono-jp" },
			}),
		).toEqual({
			en: "kimono",
			ja: "kimono-jp",
		});
	});
});

describe("buildCatalogPathSuffixByLocale", () => {
	it("builds encoded path suffixes per locale", () => {
		expect(
			buildCatalogPathSuffixByLocale("products", {
				en: "hoodie",
				pl: "bluza",
			}),
		).toEqual({
			en: "/products/hoodie",
			pl: "/products/bluza",
		});
	});
});
