/** Drop undefined/empty-string fields so merge keeps code defaults for unset Saleor attributes. */
export function omitEmpty<T extends Record<string, unknown>>(fields: T): Partial<T> {
	const result: Partial<T> = {};

	for (const [key, value] of Object.entries(fields)) {
		if (value !== undefined && value !== "") {
			(result as Record<string, unknown>)[key] = value;
		}
	}

	return result;
}
