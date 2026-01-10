/**
 * Types for the variant selection system.
 *
 * This module defines the interfaces used across all variant selection components,
 * enabling type-safe customization and replacement of renderers.
 */

/**
 * A single variant option that can be selected.
 */
export interface VariantOption {
	/** Unique identifier (derived from value name, e.g., "black", "medium") */
	id: string;
	/** Display name for the option */
	name: string;
	/** Whether this option is available for purchase (in stock) */
	available: boolean;
	/** Whether a variant exists with this option AND current other selections */
	existsWithCurrentSelection?: boolean;
	/** Hex color code for swatch display (e.g., "#ff0000") */
	colorHex?: string;
	/** Variant IDs that have this option value */
	variantIds?: string[];
	/** Additional metadata from Saleor attributes */
	metadata?: Record<string, unknown>;
}

/**
 * A group of options for a single attribute (e.g., all colors, all sizes).
 */
export interface AttributeGroup {
	/** Attribute slug (e.g., "color", "size") */
	slug: string;
	/** Display name (e.g., "Color", "Size") */
	name: string;
	/** Available options for this attribute */
	options: VariantOption[];
}

/**
 * Props passed to individual option renderer components.
 */
export interface OptionRendererProps {
	/** The option to render */
	option: VariantOption;
	/** Whether this option is currently selected */
	isSelected: boolean;
	/** Callback when the option is clicked */
	onSelect: (id: string) => void;
}

/**
 * A component that renders a single variant option.
 */
export type OptionRenderer = React.ComponentType<OptionRendererProps>;

/**
 * Configuration for mapping attribute types to renderers.
 *
 * Keys are attribute slugs (e.g., "color", "size") or special keys:
 * - "_color": Used when option has a colorHex value
 * - "_default": Fallback for unmatched options
 */
export interface RendererRegistry {
	[attributeSlug: string]: OptionRenderer;
}

/**
 * Props for the VariantSelector component (single attribute).
 */
export interface VariantSelectorProps {
	/** Label to display above options */
	label: string;
	/** Available options to choose from */
	options: VariantOption[];
	/** Currently selected option ID (value name, not variant ID) */
	selectedId?: string;
	/** Attribute slug for this selector */
	attributeSlug: string;
	/** Callback when an option is selected */
	onSelect: (attributeSlug: string, optionId: string) => void;
	/** Optional: Custom renderer to use for all options */
	renderer?: OptionRenderer;
	/** Optional: Message to show when no options available (replaces selected value display) */
	unavailableMessage?: string;
}

/**
 * Props for the main VariantSelectionSection container.
 *
 * This component can be entirely replaced with a custom implementation
 * while maintaining the same interface with the page.
 */
export interface VariantSelectionSectionProps {
	/** Variants from Saleor GraphQL response */
	variants: Array<{
		id: string;
		name: string;
		quantityAvailable?: number | null;
		attributes: Array<{
			attribute: { slug?: string | null; name?: string | null };
			values: Array<{ name?: string | null; value?: string | null }>;
		}>;
	}>;
	/** Currently selected variant ID from URL params */
	selectedVariantId?: string;
	/** Product slug for URL building */
	productSlug: string;
	/** Channel slug for URL building */
	channel: string;
	/** Optional: Custom renderer registry to override defaults */
	renderers?: Partial<RendererRegistry>;
	/** Optional: Override the entire section rendering */
	children?: React.ReactNode;
}
