import { afterEach, describe, expect, it, vi } from "vitest";
import { buildLocaleHreflangAlternates } from "./hreflang";

describe("buildLocaleHreflangAlternates", () => {
	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it("builds per-locale URLs for a fixed channel", () => {
		vi.stubEnv("STOREFRONT_LOCALES", "en,pl");
		vi.stubEnv("NEXT_PUBLIC_DEFAULT_CHANNEL", "default-channel");
		vi.stubEnv("STOREFRONT_CHANNELS", "default-channel");

		expect(buildLocaleHreflangAlternates("default-channel", "/products/hoodie")).toEqual({
			en: "/en/default-channel/products/hoodie",
			pl: "/pl/default-channel/products/hoodie",
			"x-default": "/en/default-channel/products/hoodie",
		});
	});

	it("uses paired channels when STOREFRONT_LOCALE_CHANNELS is configured", () => {
		vi.stubEnv("STOREFRONT_LOCALES", "en,pl");
		vi.stubEnv("NEXT_PUBLIC_DEFAULT_CHANNEL", "default-channel");
		vi.stubEnv("STOREFRONT_CHANNELS", "default-channel,channel-pln");
		vi.stubEnv("STOREFRONT_LOCALE_CHANNELS", "en:default-channel,pl:channel-pln");

		expect(buildLocaleHreflangAlternates("default-channel", "/products/hoodie")).toEqual({
			en: "/en/default-channel/products/hoodie",
			pl: "/pl/channel-pln/products/hoodie",
			"x-default": "/en/default-channel/products/hoodie",
		});
	});
});
