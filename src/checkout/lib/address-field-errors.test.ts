import { describe, expect, it } from "vitest";
import { mapAddressFieldErrors } from "./address-field-errors";

describe("mapAddressFieldErrors", () => {
	it("aliases Saleor `country` onto the country select name", () => {
		expect(
			mapAddressFieldErrors(
				[{ field: "country", message: "Cannot ship to this country." }],
				"streetAddress1",
				"Invalid value",
			),
		).toEqual({ countryCode: "Cannot ship to this country." });
	});

	it("keeps known address fields and falls back when field is missing", () => {
		expect(
			mapAddressFieldErrors(
				[
					{ field: "postalCode", message: "Enter a valid ZIP." },
					{ field: null, message: null },
				],
				"streetAddress1",
				"Invalid value",
			),
		).toEqual({
			postalCode: "Enter a valid ZIP.",
			streetAddress1: "Invalid value",
		});
	});
});
