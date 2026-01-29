/**
 * Variant Selection System
 *
 * A modular, customizable system for selecting product variants.
 * Supports products with multiple variant attributes (e.g., Color + Size).
 *
 * ## Quick Start
 *
 * ```tsx
 * import { VariantSelectionSection } from "@/ui/components/pdp/variant-selection";
 *
 * <VariantSelectionSection
 *   variants={product.variants}
 *   selectedVariantId={searchParams.variant}
 *   productSlug={product.slug}
 *   channel={params.channel}
 * />
 * ```
 *
 * ## How Multi-Attribute Selection Works
 *
 * For a T-shirt with Color (Black, White) and Size (S, M, L, XL):
 *
 * 1. Two selectors are rendered: Color and Size
 * 2. User selects "Black" → URL: ?color=black
 * 3. User selects "M" → URL: ?color=black&size=m&variant=abc123
 * 4. The variant param is set when all attributes are selected
 *
 * Availability updates based on selections:
 * - If "Black" is selected, sizes only available in Black are shown as available
 * - If "XL" only comes in White, it shows as unavailable when Black is selected
 *
 * ## Architecture
 *
 * ```
 * VariantSelectionSection (client component, manages state)
 *   └── VariantSelector (for each attribute)
 *         └── Option Renderers
 *               ├── ColorSwatchOption
 *               ├── SizeButtonOption
 *               └── TextOption
 * ```
 */

// Main components
export { VariantSelectionSection } from "./variant-selection-section";
export { VariantSelector } from "./variant-selector";
export { VariantNameSelector } from "./variant-name-selector";

// Option renderers (for custom compositions)
export { ColorSwatchOption, ButtonOption, SizeButtonOption, TextOption, defaultRenderers } from "./renderers";

// Utilities (for custom implementations)
export {
	groupVariantsByAttributes,
	findMatchingVariant,
	getSelectionsFromVariant,
	getOptionsForAttribute,
	getAdjustedSelections,
	getUnavailableAttributeInfo,
	COLOR_NAME_TO_HEX,
	type SaleorVariant,
} from "./utils";

// Legacy utilities (deprecated)
export { extractColorHex, transformVariantsToOptions, inferSelectorLabel } from "./utils-legacy";

// Types
export type {
	VariantOption,
	AttributeGroup,
	OptionRendererProps,
	OptionRenderer,
	RendererRegistry,
	VariantSelectorProps,
	VariantSelectionSectionProps,
} from "./types";
