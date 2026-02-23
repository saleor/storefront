import { describe, it, expect } from "vitest";
import { getSizeOrder, compareSizes, sortSizes, sortBySizeProperty } from "./sizes";

// =============================================================================
// getSizeOrder
// =============================================================================
describe("getSizeOrder", () => {
	it("returns correct order for standard sizes", () => {
		expect(getSizeOrder("XS")).toBeLessThan(getSizeOrder("S"));
		expect(getSizeOrder("S")).toBeLessThan(getSizeOrder("M"));
		expect(getSizeOrder("M")).toBeLessThan(getSizeOrder("L"));
		expect(getSizeOrder("L")).toBeLessThan(getSizeOrder("XL"));
		expect(getSizeOrder("XL")).toBeLessThan(getSizeOrder("XXL"));
	});

	it("is case-insensitive", () => {
		expect(getSizeOrder("xs")).toBe(getSizeOrder("XS"));
		expect(getSizeOrder("m")).toBe(getSizeOrder("M"));
	});

	it("handles aliases (2XL = XXL)", () => {
		expect(getSizeOrder("2XL")).toBe(getSizeOrder("XXL"));
		expect(getSizeOrder("3XL")).toBe(getSizeOrder("XXXL"));
	});

	it("parses numeric sizes (shoes, jeans)", () => {
		expect(getSizeOrder("28")).toBe(28);
		expect(getSizeOrder("42")).toBe(42);
	});

	it("returns 100 for unknown non-numeric sizes", () => {
		expect(getSizeOrder("one-size")).toBe(100);
		expect(getSizeOrder("custom")).toBe(100);
	});
});

// =============================================================================
// compareSizes
// =============================================================================
describe("compareSizes", () => {
	it("S comes before L", () => {
		expect(compareSizes("S", "L")).toBeLessThan(0);
	});

	it("XL comes after M", () => {
		expect(compareSizes("XL", "M")).toBeGreaterThan(0);
	});

	it("same size returns 0", () => {
		expect(compareSizes("M", "M")).toBe(0);
	});

	it("numeric sizes sort numerically", () => {
		expect(compareSizes("28", "32")).toBeLessThan(0);
		expect(compareSizes("42", "38")).toBeGreaterThan(0);
	});
});

// =============================================================================
// sortSizes
// =============================================================================
describe("sortSizes", () => {
	it("sorts standard sizes in logical order", () => {
		const input = ["L", "XS", "XXL", "S", "M", "XL"];
		expect(sortSizes(input)).toEqual(["XS", "S", "M", "L", "XL", "XXL"]);
	});

	it("does not mutate original array", () => {
		const input = ["L", "S", "M"];
		const original = [...input];
		sortSizes(input);
		expect(input).toEqual(original);
	});

	it("handles numeric sizes", () => {
		const input = ["32", "28", "30", "34"];
		expect(sortSizes(input)).toEqual(["28", "30", "32", "34"]);
	});

	it("handles empty array", () => {
		expect(sortSizes([])).toEqual([]);
	});

	it("handles single item", () => {
		expect(sortSizes(["M"])).toEqual(["M"]);
	});
});

// =============================================================================
// sortBySizeProperty
// =============================================================================
describe("sortBySizeProperty", () => {
	it("sorts objects by name as size", () => {
		const input = [{ name: "L" }, { name: "S" }, { name: "XL" }, { name: "M" }];
		const result = sortBySizeProperty(input);
		expect(result.map((item) => item.name)).toEqual(["S", "M", "L", "XL"]);
	});

	it("does not mutate original array", () => {
		const input = [{ name: "L" }, { name: "S" }];
		const original = [...input];
		sortBySizeProperty(input);
		expect(input).toEqual(original);
	});

	it("preserves additional properties", () => {
		const input = [
			{ name: "L", id: 1 },
			{ name: "S", id: 2 },
		];
		const result = sortBySizeProperty(input);
		expect(result[0]).toEqual({ name: "S", id: 2 });
		expect(result[1]).toEqual({ name: "L", id: 1 });
	});
});
