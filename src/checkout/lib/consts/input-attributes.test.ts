import { describe, expect, it } from "vitest";
import {
	autocompleteTags,
	contactFieldAttributes,
	formatAddressAutocomplete,
	formatSectionCountryAutocomplete,
	inputModeTags,
} from "./input-attributes";

describe("input-attributes", () => {
	it("maps every address field to an autofill token", () => {
		expect(autocompleteTags.cityArea).toBe("address-level3");
		expect(autocompleteTags.countryCode).toBe("country");
	});

	it("scopes address tokens for shipping and billing sections", () => {
		expect(formatAddressAutocomplete("firstName", "shipping")).toBe("shipping given-name");
		expect(formatAddressAutocomplete("streetAddress1", "billing")).toBe("billing address-line1");
		expect(formatSectionCountryAutocomplete("shipping")).toBe("shipping country");
		expect(formatSectionCountryAutocomplete("billing")).toBe("billing country");
	});

	it("assigns mobile keyboard hints for high-friction fields", () => {
		expect(inputModeTags.phone).toBe("tel");
		expect(inputModeTags.postalCode).toBe("text");
	});

	it("defines contact field autofill metadata", () => {
		expect(contactFieldAttributes.email).toEqual({
			autoComplete: "email",
			inputMode: "email",
			name: "email",
		});
		expect(contactFieldAttributes.promoCode.autoComplete).toBe("off");
	});
});
