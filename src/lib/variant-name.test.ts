import { describe, expect, it } from "vitest";

import { isSaleorGlobalIdOf, variantDisplayName } from "@/lib/variant-name";

const id = btoa("ProductVariant:42");

describe("variantDisplayName", () => {
	it("keeps a real name", () => {
		expect(variantDisplayName({ id, name: "Red / M" })).toBe("Red / M");
		expect(variantDisplayName({ id, name: "BANDANA-01" })).toBe("BANDANA-01");
	});

	it("drops an empty name or the variant's own ID", () => {
		expect(variantDisplayName({ id, name: "" })).toBeNull();
		expect(variantDisplayName({ id, name: "  " })).toBeNull();
		expect(variantDisplayName({ id, name: null })).toBeNull();
		expect(variantDisplayName({ id, name: id })).toBeNull();
	});

	it("drops a generated ID saved before the variant had one", () => {
		expect(variantDisplayName({ id, name: "UHJvZHVjdFZhcmlhbnQ6Tm9uZQ==" })).toBeNull();
	});
});

describe("isSaleorGlobalIdOf", () => {
	it("matches only base64 IDs of the given type", () => {
		expect(isSaleorGlobalIdOf(id, "ProductVariant")).toBe(true);
		expect(isSaleorGlobalIdOf(btoa("Product:42"), "ProductVariant")).toBe(false);
		expect(isSaleorGlobalIdOf("Size", "ProductVariant")).toBe(false);
		expect(isSaleorGlobalIdOf("ab=c", "ProductVariant")).toBe(false);
	});
});
