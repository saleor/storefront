/**
 * Option Renderers for the Variant Selection System
 *
 * This module exports individual renderers and the default registry.
 *
 * ## Customization
 *
 * To use a custom renderer for a specific attribute:
 *
 * ```tsx
 * import { VariantSelectionSection, TextOption } from "@/ui/components/pdp/variant-selection";
 *
 * // Custom renderer for a specific attribute
 * function MyCustomColorRenderer({ option, isSelected, onSelect }) {
 *   return (
 *     <button onClick={() => onSelect(option.id)}>
 *       {option.name} - Custom!
 *     </button>
 *   );
 * }
 *
 * // Use it in the section
 * <VariantSelectionSection
 *   variants={variants}
 *   renderers={{
 *     color: MyCustomColorRenderer,
 *     _default: TextOption,
 *   }}
 * />
 * ```
 */

export { ColorSwatchOption } from "./color-swatch-option";
export { SizeButtonOption } from "./size-button-option";
export { TextOption } from "./text-option";

import type { RendererRegistry } from "../types";
import { ColorSwatchOption } from "./color-swatch-option";
import { SizeButtonOption } from "./size-button-option";
import { TextOption } from "./text-option";

/**
 * Default renderer registry.
 *
 * Special keys:
 * - `_color`: Used when an option has a colorHex value (regardless of attribute)
 * - `_default`: Fallback for any unmatched options
 *
 * Attribute slugs (like "size", "color") can also be used as keys.
 */
export const defaultRenderers: RendererRegistry = {
	// Special: render as color swatch when colorHex is present
	_color: ColorSwatchOption,

	// Size-related attributes
	size: SizeButtonOption,
	"shoe-size": SizeButtonOption,
	"clothing-size": SizeButtonOption,

	// Color attributes (when no hex is available, falls back to text)
	color: TextOption,
	colour: TextOption,

	// Default fallback
	_default: TextOption,
};
