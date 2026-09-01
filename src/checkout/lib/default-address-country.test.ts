import { describe, expect, it } from "vitest";
import { FALLBACK_ADDRESS_COUNTRY, resolveBlankAddressCountryCode } from "./default-address-country";

describe("resolveBlankAddressCountryCode", () => {
	it("prefers an existing address country when it is still shippable", () => {
		expect(
			resolveBlankAddressCountryCode({
				existingCountryCode: "DE",
				channelDefaultCountryCode: "US",
				availableCountryCodes: ["AF", "DE", "US"],
			}),
		).toBe("DE");
	});

	it("uses the channel default instead of the first listed country", () => {
		expect(
			resolveBlankAddressCountryCode({
				existingCountryCode: null,
				channelDefaultCountryCode: "US",
				availableCountryCodes: ["AF", "DE", "US"],
			}),
		).toBe("US");
	});

	it("ignores a channel default that is not in the shippable list", () => {
		expect(
			resolveBlankAddressCountryCode({
				existingCountryCode: null,
				channelDefaultCountryCode: "US",
				availableCountryCodes: ["AF", "DE"],
			}),
		).toBe("AF");
	});

	it("ignores an existing country that the channel cannot ship to", () => {
		expect(
			resolveBlankAddressCountryCode({
				existingCountryCode: "BR",
				channelDefaultCountryCode: "GB",
				availableCountryCodes: ["AF", "GB"],
			}),
		).toBe("GB");
	});

	it("falls back to the channel default when the country list is empty", () => {
		expect(
			resolveBlankAddressCountryCode({
				existingCountryCode: null,
				channelDefaultCountryCode: "PL",
				availableCountryCodes: [],
			}),
		).toBe("PL");
	});

	it("keeps an existing country when the country list failed to load", () => {
		expect(
			resolveBlankAddressCountryCode({
				existingCountryCode: "DE",
				channelDefaultCountryCode: "PL",
				availableCountryCodes: [],
			}),
		).toBe("DE");
	});

	it("uses the hardcoded fallback only when nothing else is available", () => {
		expect(
			resolveBlankAddressCountryCode({
				existingCountryCode: null,
				channelDefaultCountryCode: null,
				availableCountryCodes: [],
			}),
		).toBe(FALLBACK_ADDRESS_COUNTRY);
	});
});
