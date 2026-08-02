import { afterEach, describe, expect, it, vi } from "vitest";
import { buildLocaleHreflangAlternates } from "./hreflang";

describe("buildLocaleHreflangAlternates", () => {
	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it("builds language-only hreflang keys when locale×channel pairs are unset", () => {
		vi.stubEnv("NEXT_PUBLIC_STOREFRONT_LOCALES", "en,pl");
		vi.stubEnv("NEXT_PUBLIC_DEFAULT_CHANNEL", "default-channel");
		vi.stubEnv("STOREFRONT_CHANNELS", "default-channel");

		expect(buildLocaleHreflangAlternates("default-channel", "/products/hoodie")).toEqual({
			en: "/en/default-channel/products/hoodie",
			pl: "/pl/default-channel/products/hoodie",
			"x-default": "/en/default-channel/products/hoodie",
		});
	});

	it("uses paired channels and region-aware keys when LOCALE_CHANNELS is configured", () => {
		vi.stubEnv("NEXT_PUBLIC_STOREFRONT_LOCALES", "en,pl,ja");
		vi.stubEnv("NEXT_PUBLIC_DEFAULT_CHANNEL", "default-channel");
		vi.stubEnv("STOREFRONT_CHANNELS", "default-channel,channel-pln,japan");
		vi.stubEnv("NEXT_PUBLIC_STOREFRONT_LOCALE_CHANNELS", "en:default-channel,pl:channel-pln,ja:japan");

		expect(buildLocaleHreflangAlternates("default-channel", "/products/hoodie")).toEqual({
			"en-US": "/en/default-channel/products/hoodie",
			"pl-PL": "/pl/channel-pln/products/hoodie",
			"ja-JP": "/ja/japan/products/hoodie",
			"x-default": "/en/default-channel/products/hoodie",
		});
	});

	it("uses per-locale path suffixes for translated catalog slugs", () => {
		vi.stubEnv("NEXT_PUBLIC_STOREFRONT_LOCALES", "en,pl");
		vi.stubEnv("NEXT_PUBLIC_DEFAULT_LOCALE", "en");
		vi.stubEnv("NEXT_PUBLIC_DEFAULT_CHANNEL", "default-channel");
		vi.stubEnv("STOREFRONT_CHANNELS", "default-channel");

		expect(
			buildLocaleHreflangAlternates("default-channel", {
				en: "/products/hoodie",
				pl: "/products/bluza",
			}),
		).toEqual({
			en: "/en/default-channel/products/hoodie",
			pl: "/pl/default-channel/products/bluza",
			"x-default": "/en/default-channel/products/hoodie",
		});
	});
});
