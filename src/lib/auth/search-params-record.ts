/** Adapt Next.js `searchParams` page props to the minimal `URLSearchParams` interface. */
export function searchParamsRecordToGetter(
	searchParams: Record<string, string | string[] | undefined>,
): Pick<URLSearchParams, "get"> {
	return {
		get(key: string) {
			const value = searchParams[key];
			if (typeof value === "string") {
				return value;
			}
			if (Array.isArray(value)) {
				return value[0] ?? null;
			}
			return null;
		},
	};
}
