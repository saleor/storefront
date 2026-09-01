/** Saleor address error `field` values that don't match checkout input `name`s. */
const ADDRESS_ERROR_FIELD_ALIASES: Record<string, string> = {
	country: "countryCode",
};

/**
 * Map Saleor address-mutation field errors onto checkout form keys so they
 * actually render (e.g. `country` → the `name="countryCode"` select).
 */
export function mapAddressFieldErrors(
	fieldErrors: ReadonlyArray<{ field?: string | null; message?: string | null }>,
	fallbackField: string,
	fallbackMessage: string,
): Record<string, string> {
	const errorMap: Record<string, string> = {};

	for (const error of fieldErrors) {
		const rawField = error.field || fallbackField;
		const field = ADDRESS_ERROR_FIELD_ALIASES[rawField] ?? rawField;
		errorMap[field] = error.message || fallbackMessage;
	}

	return errorMap;
}
