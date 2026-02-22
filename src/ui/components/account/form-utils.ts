/**
 * Safely extract a string field from FormData.
 * Throws if the field is missing or is a File.
 */
export function getFormString(fd: FormData, key: string): string {
	const val = fd.get(key);
	if (typeof val !== "string") {
		throw new Error(`Missing or invalid form field: ${key}`);
	}
	return val;
}

/**
 * Extract an optional string field from FormData.
 * Returns undefined if empty or missing.
 */
export function getFormStringOptional(fd: FormData, key: string): string | undefined {
	const val = fd.get(key);
	if (typeof val !== "string" || val === "") return undefined;
	return val;
}
