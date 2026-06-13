import { afterEach, describe, expect, it, vi } from "vitest";
import { getConfiguredLocaleChannelPairs, isAllowedLocaleChannelPair } from "./locale-channel";

describe("locale-channel pairs", () => {
	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it("allows any pair when STOREFRONT_LOCALE_CHANNELS is unset", () => {
		expect(isAllowedLocaleChannelPair("en", "default-channel")).toBe(true);
		expect(isAllowedLocaleChannelPair("pl", "us")).toBe(true);
	});

	it("restricts to configured pairs", () => {
		vi.stubEnv("STOREFRONT_LOCALE_CHANNELS", "en:default-channel,pl:channel-pln");

		expect(getConfiguredLocaleChannelPairs()).toEqual([
			{ locale: "en", channel: "default-channel" },
			{ locale: "pl", channel: "channel-pln" },
		]);
		expect(isAllowedLocaleChannelPair("en", "default-channel")).toBe(true);
		expect(isAllowedLocaleChannelPair("pl", "channel-pln")).toBe(true);
		expect(isAllowedLocaleChannelPair("pl", "default-channel")).toBe(false);
	});
});
