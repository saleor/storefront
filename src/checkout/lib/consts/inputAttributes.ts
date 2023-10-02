import { type AddressField } from "@/checkout/components/AddressForm/types";

export const autocompleteTags: Record<AddressField, string> = {
	firstName: "given-name",
	lastName: "family-name",
	companyName: "organization",
	phone: "tel",
	streetAddress1: "address-line1",
	streetAddress2: "address-line2",
	city: "address-level2",
	countryCode: "country",
	postalCode: "postal-code",
	cityArea: "",
	countryArea: "address-level1",
};

export const typeTags: Partial<Record<AddressField, string>> = {
	phone: "tel",
};
