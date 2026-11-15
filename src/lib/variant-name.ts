/**
 * A variant's name as shoppers should see it, or `null` when it is not a real name.
 *
 * Saleor falls back to a variant's global ID for its name. Its bulk create mutations name variants
 * before they are saved, so the stored name can be the ID of `ProductVariant:None`, which differs
 * from the variant's own ID, even for a variant with a SKU. Neither ID is a name to show.
 */
export function variantDisplayName(variant: { id: string; name?: string | null }): string | null {
	const name = variant.name?.trim();
	// Any ProductVariant ID, the variant's own included.
	if (!name || isSaleorGlobalIdOf(name, "ProductVariant")) {
		return null;
	}
	return name;
}

const BASE64 = /^[A-Za-z0-9+/]+={0,2}$/;

/** Whether `value` is a Saleor global ID (base64 of `Type:pk`) of the given type. */
export function isSaleorGlobalIdOf(value: string, typeName: string): boolean {
	if (value.length % 4 !== 0 || !BASE64.test(value)) {
		return false;
	}
	try {
		return atob(value).startsWith(`${typeName}:`);
	} catch {
		return false;
	}
}
