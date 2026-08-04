import { describe, expect, it } from "vitest";
import {
	VARIANT_CHIP_MAX_OPTIONS,
	VARIANT_NATIVE_SELECT_MAX_OPTIONS,
	VARIANT_SWATCH_CHIP_MAX_OPTIONS,
} from "@/config/variants";
import { resolveVariantGroupControl } from "./resolve-group-control";

function textOptions(n: number) {
	return Array.from({ length: n }, () => ({}));
}

function swatchOptions(n: number) {
	return Array.from({ length: n }, () => ({ colorHex: "#000000" }));
}

describe("resolveVariantGroupControl", () => {
	it("uses chips for small text groups", () => {
		expect(resolveVariantGroupControl(textOptions(VARIANT_CHIP_MAX_OPTIONS))).toBe("chips");
	});

	it("uses select between chip and combobox thresholds", () => {
		expect(resolveVariantGroupControl(textOptions(VARIANT_CHIP_MAX_OPTIONS + 1))).toBe("select");
		expect(resolveVariantGroupControl(textOptions(VARIANT_NATIVE_SELECT_MAX_OPTIONS))).toBe("select");
	});

	it("uses combobox above the select ceiling", () => {
		expect(resolveVariantGroupControl(textOptions(VARIANT_NATIVE_SELECT_MAX_OPTIONS + 1))).toBe("combobox");
	});

	it("keeps swatch groups as chips until the swatch ceiling, then combobox (no select)", () => {
		expect(resolveVariantGroupControl(swatchOptions(VARIANT_SWATCH_CHIP_MAX_OPTIONS))).toBe("chips");
		expect(resolveVariantGroupControl(swatchOptions(VARIANT_SWATCH_CHIP_MAX_OPTIONS + 1))).toBe("combobox");
	});
});
