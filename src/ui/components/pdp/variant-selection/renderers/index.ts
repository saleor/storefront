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

export { ColorSwatchOption } from "./ColorSwatchOption";
export { SizeButtonOption } from "./SizeButtonOption";
export { TextOption } from "./TextOption";

import type { RendererRegistry } from "../types";
import { ColorSwatchOption } from "./ColorSwatchOption";
import { SizeButtonOption } from "./SizeButtonOption";
import { TextOption } from "./TextOption";

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
