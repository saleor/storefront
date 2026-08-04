import {
	VARIANT_CHIP_MAX_OPTIONS,
	VARIANT_NATIVE_SELECT_MAX_OPTIONS,
	VARIANT_SWATCH_CHIP_MAX_OPTIONS,
} from "@/config/variants";

export type VariantGroupControl = "chips" | "select" | "combobox";

type OptionShape = {
	colorHex?: string;
	swatchImageUrl?: string;
};

/**
 * Pick the PDP control for one attribute group from its option count + swatch-ness.
 *
 * - Swatch groups: chips up to {@link VARIANT_SWATCH_CHIP_MAX_OPTIONS}, then combobox
 *   (Select cannot show swatches).
 * - Text/numeric: chips → select → combobox by count thresholds.
 */
export function resolveVariantGroupControl(options: OptionShape[]): VariantGroupControl {
	const count = options.length;
	if (count === 0) return "chips";

	const isSwatchGroup = options.some((o) => Boolean(o.colorHex || o.swatchImageUrl));
	if (isSwatchGroup) {
		return count <= VARIANT_SWATCH_CHIP_MAX_OPTIONS ? "chips" : "combobox";
	}

	if (count <= VARIANT_CHIP_MAX_OPTIONS) return "chips";
	if (count <= VARIANT_NATIVE_SELECT_MAX_OPTIONS) return "select";
	return "combobox";
}
