import { describe, expect, it } from "vitest";

import type { ShopSellerIdentityQuery } from "@/gql/graphql";
import { sellerAddressLines, sellerCountryName, toSellerIdentity } from "./seller-identity";

type Shop = ShopSellerIdentityQuery["shop"];

const shop: Shop = {
	name: "Northvale Outfitters",
	companyAddress: {
		companyName: "Northvale Outfitters GmbH",
		streetAddress1: "Musterstraße 1",
		streetAddress2: "",
		postalCode: "10115",
		city: "BERLIN",
		phone: "+493023125000",
		country: { code: "DE" },
	},
	sellerLegalName: "Northvale Outfitters GmbH",
	sellerRepresentatives: "Anna Example (Geschäftsführerin)",
	sellerRegister: "Amtsgericht Charlottenburg, HRB 000000 B",
	sellerVatId: "DE000000000",
	sellerEmail: null,
};

describe("toSellerIdentity", () => {
	it("reads the company address and the seller.* metadata", () => {
		expect(toSellerIdentity(shop)).toEqual({
			legalName: "Northvale Outfitters GmbH",
			address: {
				streetLines: ["Musterstraße 1"],
				postalCode: "10115",
				city: "BERLIN",
				countryCode: "DE",
			},
			phone: "+493023125000",
			email: null,
			representatives: "Anna Example (Geschäftsführerin)",
			register: "Amtsgericht Charlottenburg, HRB 000000 B",
			vatId: "DE000000000",
		});
	});

	it("falls back to the company name when seller.legalName is not set", () => {
		expect(toSellerIdentity({ ...shop, sellerLegalName: null })?.legalName).toBe("Northvale Outfitters GmbH");
	});

	it("returns null when the shop names no seller", () => {
		expect(toSellerIdentity({ ...shop, sellerLegalName: " ", companyAddress: null })).toBeNull();
	});

	it("keeps the seller without an address when only metadata is set", () => {
		expect(toSellerIdentity({ ...shop, companyAddress: null })).toMatchObject({
			legalName: "Northvale Outfitters GmbH",
			address: null,
			phone: null,
		});
	});

	it("shows the email once the shop sets seller.email", () => {
		expect(toSellerIdentity({ ...shop, sellerEmail: " hello@example.com " })?.email).toBe(
			"hello@example.com",
		);
	});
});

describe("sellerAddressLines", () => {
	it("prints street, locality and the country in the shopper's language", () => {
		const address = toSellerIdentity(shop)!.address!;
		expect(sellerAddressLines(address, "de-DE")).toEqual(["Musterstraße 1", "10115 BERLIN", "Deutschland"]);
		expect(sellerAddressLines(address, "en-US")).toEqual(["Musterstraße 1", "10115 BERLIN", "Germany"]);
	});
});

describe("sellerCountryName", () => {
	it("returns null without a country and the code for an unknown one", () => {
		expect(sellerCountryName(null, "en-US")).toBeNull();
		expect(sellerCountryName("not-a-country", "en-US")).toBe("not-a-country");
	});
});
