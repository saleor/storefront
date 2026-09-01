import { describe, expect, it } from "vitest";
import { findChannelDefaultCountryCode } from "./get-channel-default-country";

describe("findChannelDefaultCountryCode", () => {
	const channels = [
		{ slug: "default-channel", defaultCountry: { code: "US" } },
		{ slug: "channel-pln", defaultCountry: { code: "PL" } },
		{ slug: "japan", defaultCountry: null },
	];

	it("returns the matching channel default", () => {
		expect(findChannelDefaultCountryCode(channels, "channel-pln")).toBe("PL");
	});

	it("returns null when the channel is missing or has no default", () => {
		expect(findChannelDefaultCountryCode(channels, "unknown")).toBeNull();
		expect(findChannelDefaultCountryCode(channels, "japan")).toBeNull();
		expect(findChannelDefaultCountryCode(null, "default-channel")).toBeNull();
	});
});
