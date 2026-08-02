/** Interpolate `{key}` placeholders in Saleor / default copy templates. */
export function formatContentLabel(template: string, values: Record<string, string | number>): string {
	return template.replace(/\{(\w+)\}/g, (_, key: string) => {
		const value = values[key];
		return value === undefined ? "" : String(value);
	});
}
