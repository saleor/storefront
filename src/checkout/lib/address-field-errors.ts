import { isAvailabilityFieldError } from "@/checkout/lib/checkout-availability";

/** Saleor address error `field` values that don't match checkout input `name`s. */
const ADDRESS_ERROR_FIELD_ALIASES: Record<string, string> = {
	country: "countryCode",
};

/** Inputs the address form actually renders — anything else is a section-level error. */
const ADDRESS_FORM_ERROR_FIELDS = new Set([
	"firstName",
	"lastName",
	"streetAddress1",
	"streetAddress2",
	"companyName",
	"city",
	"postalCode",
	"countryArea",
	"cityArea",
	"phone",
	"countryCode",
]);

/**
 * Map Saleor address-mutation field errors onto checkout form keys so they
 * actually render (e.g. `country` → the `name="countryCode"` select).
 *
 * Stock and line errors (`quantity`, `variant`) are owned by the availability
 * banner, not this map — partition them with `partitionCheckoutFieldErrors`.
 */
export function mapAddressFieldErrors(
	fieldErrors: ReadonlyArray<{ field?: string | null; message?: string | null; code?: string | null }>,
	fallbackField: string,
	fallbackMessage: string,
): Record<string, string> {
	const errorMap: Record<string, string> = {};

	for (const error of fieldErrors) {
		if (isAvailabilityFieldError(error)) {
			continue;
		}

		const rawField = error.field || fallbackField;
		const field = ADDRESS_ERROR_FIELD_ALIASES[rawField] ?? rawField;
		const message = error.message || fallbackMessage;

		if (!ADDRESS_FORM_ERROR_FIELDS.has(field)) {
			errorMap.form = errorMap.form ? `${errorMap.form} ${message}` : message;
			continue;
		}

		errorMap[field] = message;
	}

	return errorMap;
}
