import { describe, it, expect } from "vitest";
import { isValidHex, normalizeHex, getColorHex, isColorAttribute, isSizeAttribute } from "./colors";

// =============================================================================
// isValidHex
// =============================================================================
describe("isValidHex", () => {
	it("accepts 6-char hex with #", () => {
		expect(isValidHex("#ff0000")).toBe(true);
	});

	it("accepts 6-char hex without #", () => {
		expect(isValidHex("ff0000")).toBe(true);
	});

	it("accepts 8-char hex with alpha", () => {
		expect(isValidHex("#ff0000aa")).toBe(true);
	});

	it("accepts uppercase hex", () => {
		expect(isValidHex("#FF0000")).toBe(true);
	});

	it("accepts mixed case hex", () => {
		expect(isValidHex("#aAbBcC")).toBe(true);
	});

	it("rejects 3-char shorthand hex", () => {
		expect(isValidHex("#fff")).toBe(false);
	});

	it("rejects invalid characters", () => {
		expect(isValidHex("#gggggg")).toBe(false);
	});

	it("rejects empty string", () => {
		expect(isValidHex("")).toBe(false);
	});

	it("rejects random text", () => {
		expect(isValidHex("red")).toBe(false);
	});

	it("rejects too-long hex", () => {
		expect(isValidHex("#ff0000aabb")).toBe(false);
	});
});

// =============================================================================
// normalizeHex
// =============================================================================
describe("normalizeHex", () => {
	it("adds # prefix when missing", () => {
		expect(normalizeHex("ff0000")).toBe("#ff0000");
	});

	it("keeps # prefix when present", () => {
		expect(normalizeHex("#ff0000")).toBe("#ff0000");
	});
});

// =============================================================================
// getColorHex
// =============================================================================
describe("getColorHex", () => {
	it("returns hex from swatch value (with #)", () => {
		expect(getColorHex({ name: "Red", value: "#dc2626" })).toBe("#dc2626");
	});

	it("returns normalized hex from swatch value (without #)", () => {
		expect(getColorHex({ name: "Red", value: "dc2626" })).toBe("#dc2626");
	});

	it("falls back to color name lookup when no hex value", () => {
		expect(getColorHex({ name: "Red", value: null })).toBe("#dc2626");
	});

	it("falls back to color name lookup when value is not hex", () => {
		expect(getColorHex({ name: "Blue", value: "not-a-hex" })).toBe("#2563eb");
	});

	it("handles multi-word color names (light-blue)", () => {
		expect(getColorHex({ name: "Light Blue", value: null })).toBe("#38bdf8");
	});

	it("is case-insensitive for color names", () => {
		expect(getColorHex({ name: "BLACK", value: null })).toBe("#1a1a1a");
	});

	it("returns undefined for unknown color name and no hex", () => {
		expect(getColorHex({ name: "Chartreuse", value: null })).toBeUndefined();
	});

	it("returns undefined for null name and null value", () => {
		expect(getColorHex({ name: null, value: null })).toBeUndefined();
	});

	it("prefers swatch hex over name lookup", () => {
		// Custom hex should win even though "red" maps to #dc2626
		expect(getColorHex({ name: "Red", value: "#ff0000" })).toBe("#ff0000");
	});
});

// =============================================================================
// isColorAttribute
// =============================================================================
describe("isColorAttribute", () => {
	it("matches 'color'", () => {
		expect(isColorAttribute("color")).toBe(true);
	});

	it("matches 'colour' (British spelling)", () => {
		expect(isColorAttribute("colour")).toBe(true);
	});

	it("is case-insensitive", () => {
		expect(isColorAttribute("Color")).toBe(true);
		expect(isColorAttribute("COLOR")).toBe(true);
	});

	it("rejects unrelated slugs", () => {
		expect(isColorAttribute("size")).toBe(false);
		expect(isColorAttribute("color-family")).toBe(false);
	});
});

// =============================================================================
// isSizeAttribute
// =============================================================================
describe("isSizeAttribute", () => {
	it("matches 'size'", () => {
		expect(isSizeAttribute("size")).toBe(true);
	});

	it("matches 'shoe-size'", () => {
		expect(isSizeAttribute("shoe-size")).toBe(true);
	});

	it("matches 'clothing-size'", () => {
		expect(isSizeAttribute("clothing-size")).toBe(true);
	});

	it("is case-insensitive", () => {
		expect(isSizeAttribute("Size")).toBe(true);
		expect(isSizeAttribute("SHOE-SIZE")).toBe(true);
	});

	it("rejects unrelated slugs", () => {
		expect(isSizeAttribute("color")).toBe(false);
		expect(isSizeAttribute("font-size")).toBe(false);
	});
});
