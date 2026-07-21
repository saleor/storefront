import { describe, it, expect } from "vitest";
import { compareOptionLabels, compareSizes, sortSizes, sortByOptionLabel, SIZE_ORDER } from "./sizes";

describe("compareOptionLabels", () => {
	it("orders known clothing sizes semantically", () => {
		expect(sortSizes(["L", "S", "XL", "M", "XS"])).toEqual(["XS", "S", "M", "L", "XL"]);
	});

	it("orders numeric labels naturally (not lexicographically)", () => {
		expect(sortSizes(["10", "2", "1", "19"])).toEqual(["1", "2", "10", "19"]);
	});

	it("orders numeric prefixes in compound labels", () => {
		expect(sortSizes(["10mm", "2mm", "19mm"])).toEqual(["2mm", "10mm", "19mm"]);
		expect(sortSizes(["Row 10", "Row 2", "Row 1"])).toEqual(["Row 1", "Row 2", "Row 10"]);
	});

	it("does not collapse unknown labels to the same rank (old parseInt||100 bug)", () => {
		const ranked = ["Walnut", "Oak", "Ash"].sort(compareOptionLabels);
		expect(ranked).toEqual(["Ash", "Oak", "Walnut"]);
		// Distinct pairwise results — not all ties at 100
		expect(compareOptionLabels("Ash", "Oak")).toBeLessThan(0);
		expect(compareOptionLabels("Oak", "Walnut")).toBeLessThan(0);
	});

	it("compares two known size tokens via SIZE_ORDER", () => {
		expect(compareOptionLabels("S", "L")).toBe(SIZE_ORDER.S! - SIZE_ORDER.L!);
		expect(compareSizes("XL", "M")).toBeGreaterThan(0);
	});

	it("sortByOptionLabel sorts by name", () => {
		const items = [{ name: "10" }, { name: "2" }, { name: "S" }, { name: "M" }];
		expect(sortByOptionLabel(items).map((i) => i.name)).toEqual(["2", "10", "S", "M"]);
	});
});
