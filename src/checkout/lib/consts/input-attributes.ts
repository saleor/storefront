import { type AddressField } from "@/checkout/components/address-form/types";

/** Base autofill tokens — prefix with `shipping` or `billing` via `formatAddressAutocomplete`. */
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
	cityArea: "address-level3",
	countryArea: "address-level1",
};

export const typeTags: Partial<Record<AddressField, string>> = {
	phone: "tel",
};

/** Mobile keyboard hints — pair with `autocomplete` for best autofill (see checkout-design-principles #3). */
export const inputModeTags: Partial<Record<AddressField, "text" | "tel" | "numeric" | "email">> = {
	phone: "tel",
	postalCode: "text",
};

export type AddressAutocompleteSection = "shipping" | "billing";

export function formatAddressAutocomplete(field: AddressField, section: AddressAutocompleteSection): string {
	const token = autocompleteTags[field];
	if (!token) return "";
	return `${section} ${token}`;
}

export function formatSectionCountryAutocomplete(section: AddressAutocompleteSection): string {
	return `${section} country`;
}

/** Contact / auth fields (not address-scoped). */
export const contactFieldAttributes = {
	email: { autoComplete: "email", inputMode: "email" as const, name: "email" },
	newPassword: { autoComplete: "new-password", name: "password" },
	currentPassword: { autoComplete: "current-password", name: "password" },
	promoCode: { autoComplete: "off", name: "promoCode", inputMode: "text" as const },
} as const;
