import { describe, expect, it } from "vitest";

import type { AddressFragment, AddressInput } from "@/checkout/graphql";

import { getAddressInputData, getAddressInputDataFromAddress, isSameAddressInput } from "./utils";

const existingAddress = {
	id: "QWRkcmVzczox",
	firstName: "John New",
	lastName: "Appleseed New",
	streetAddress1: "1 Infinite Loop New",
	streetAddress2: "",
	companyName: "",
	city: "CUPERTINO",
	postalCode: "95014",
	countryArea: "CA",
	cityArea: "",
	phone: "",
	country: { code: "US", country: "United States of America" },
} as AddressFragment;

describe("isSameAddressInput", () => {
	it("matches form data seeded from the existing checkout address", () => {
		const input = getAddressInputData({
			countryCode: "US",
			firstName: "John New",
			lastName: "Appleseed New",
			streetAddress1: "1 Infinite Loop New",
			streetAddress2: "",
			companyName: "",
			city: "CUPERTINO",
			postalCode: "95014",
			countryArea: "CA",
			cityArea: "",
			phone: "",
		});

		expect(isSameAddressInput(existingAddress, input)).toBe(true);
	});

	it("is false when the street changes", () => {
		const input: AddressInput = {
			...getAddressInputDataFromAddress(existingAddress),
			streetAddress1: "2 Infinite Loop",
		};

		expect(isSameAddressInput(existingAddress, input)).toBe(false);
	});

	it("is false when there is no existing address", () => {
		expect(isSameAddressInput(null, { country: "US" })).toBe(false);
	});
});
