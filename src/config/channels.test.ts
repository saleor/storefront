import { afterEach, describe, expect, it, vi } from "vitest";
import {
	filterToStorefrontChannels,
	getConfiguredStorefrontChannelSlugs,
	getStaticStorefrontChannelSlugs,
	isAllowedStorefrontChannel,
	isStorefrontChannelDiscoveryEnabled,
	needsAsyncChannelDiscovery,
	shouldFetchChannelMetadata,
	toChannelSelectOptions,
} from "./channels";

const ENV_KEYS = [
	"STOREFRONT_CHANNELS",
	"STOREFRONT_DISCOVER_CHANNELS",
	"NEXT_PUBLIC_DEFAULT_CHANNEL",
	"SALEOR_APP_TOKEN",
] as const;

function saveEnv(): Record<(typeof ENV_KEYS)[number], string | undefined> {
	return Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]])) as Record<
		(typeof ENV_KEYS)[number],
		string | undefined
	>;
}

function restoreEnv(snapshot: Record<(typeof ENV_KEYS)[number], string | undefined>) {
	for (const key of ENV_KEYS) {
		const value = snapshot[key];
		if (value === undefined) delete process.env[key];
		else process.env[key] = value;
	}
}

describe("storefront channel config", () => {
	const envSnapshot = saveEnv();

	afterEach(() => {
		restoreEnv(envSnapshot);
		vi.restoreAllMocks();
	});

	it("parses STOREFRONT_CHANNELS allowlist", () => {
		process.env.STOREFRONT_CHANNELS = " us , uk,us ";
		expect(getConfiguredStorefrontChannelSlugs()).toEqual(["us", "uk"]);
		expect(getStaticStorefrontChannelSlugs()).toEqual(["us", "uk"]);
	});

	it("falls back to default channel when no allowlist", () => {
		delete process.env.STOREFRONT_CHANNELS;
		process.env.NEXT_PUBLIC_DEFAULT_CHANNEL = "default-channel";
		expect(getStaticStorefrontChannelSlugs()).toEqual(["default-channel"]);
	});

	it("discovery is opt-in", () => {
		expect(isStorefrontChannelDiscoveryEnabled()).toBe(false);
		process.env.STOREFRONT_DISCOVER_CHANNELS = "true";
		expect(isStorefrontChannelDiscoveryEnabled()).toBe(true);
	});

	it("needs async discovery only when configured and token present", () => {
		delete process.env.STOREFRONT_CHANNELS;
		delete process.env.STOREFRONT_DISCOVER_CHANNELS;
		delete process.env.SALEOR_APP_TOKEN;
		expect(needsAsyncChannelDiscovery()).toBe(false);

		process.env.STOREFRONT_DISCOVER_CHANNELS = "true";
		process.env.SALEOR_APP_TOKEN = "token";
		expect(needsAsyncChannelDiscovery()).toBe(true);

		process.env.STOREFRONT_CHANNELS = "us,uk";
		expect(needsAsyncChannelDiscovery()).toBe(false);
	});

	it("warns when default channel is missing from allowlist", () => {
		const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
		process.env.STOREFRONT_CHANNELS = "us,uk";
		process.env.NEXT_PUBLIC_DEFAULT_CHANNEL = "default-channel";

		getStaticStorefrontChannelSlugs();

		expect(warn).toHaveBeenCalledWith(expect.stringContaining("default-channel"));
	});

	it("filters API channels to storefront allowlist", () => {
		const channels = [
			{ slug: "us", isActive: true, currencyCode: "USD" },
			{ slug: "internal-b2b", isActive: true, currencyCode: "USD" },
			{ slug: "uk", isActive: false, currencyCode: "GBP" },
		];

		expect(filterToStorefrontChannels(channels, ["us", "uk"])).toEqual([
			{ slug: "us", isActive: true, currencyCode: "USD" },
		]);
	});

	it("builds channel selector options from active storefront channels only", () => {
		const channels = [
			{ id: "1", slug: "us", isActive: true, currencyCode: "USD" },
			{ id: "2", slug: "internal-b2b", isActive: true, currencyCode: "USD" },
			{ id: "3", slug: "uk", isActive: false, currencyCode: "GBP" },
		];

		expect(toChannelSelectOptions(channels, ["us", "uk"])).toEqual([
			{ id: "1", slug: "us", currencyCode: "USD" },
		]);
	});

	it("checks allowed storefront channel slugs", () => {
		expect(isAllowedStorefrontChannel("us", ["us", "uk"])).toBe(true);
		expect(isAllowedStorefrontChannel("internal", ["us", "uk"])).toBe(false);
	});

	it("skips channel metadata fetch for single-channel storefronts", () => {
		delete process.env.SALEOR_APP_TOKEN;
		expect(shouldFetchChannelMetadata(["default-channel"])).toBe(false);

		process.env.SALEOR_APP_TOKEN = "token";
		expect(shouldFetchChannelMetadata(["default-channel"])).toBe(false);
		expect(shouldFetchChannelMetadata(["us", "uk"])).toBe(true);
	});
});
