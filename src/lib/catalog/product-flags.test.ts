import { describe, expect, it } from "vitest";
import { isBestseller } from "./product-flags";

describe("isBestseller", () => {
	it("returns true for the canonical bestseller boolean attribute", () => {
		expect(isBestseller({ bestseller: { value: true } })).toBe(true);
	});

	it("returns true for the pulse-bestseller slug on demo catalogs", () => {
		expect(isBestseller({ pulseBestseller: { value: true } })).toBe(true);
	});

	it("returns false when the attribute is missing, false, or null", () => {
		expect(isBestseller({})).toBe(false);
		expect(isBestseller(null)).toBe(false);
		expect(isBestseller({ bestseller: null })).toBe(false);
		expect(isBestseller({ pulseBestseller: { value: false } })).toBe(false);
		expect(isBestseller({ bestseller: { value: null } })).toBe(false);
	});

	it("returns false for a non-boolean attribute type (no value field)", () => {
		expect(isBestseller({ bestseller: { __typename: "AssignedTextAttribute" } })).toBe(false);
	});
});
