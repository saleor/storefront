interface VariantAttribute {
	name: string;
	slug: string;
	values: string[];
}

interface VariantAttributeBadgesProps {
	attributes: VariantAttribute[];
}

/**
 * Displays non-selection variant attributes as informational badges.
 * These are static attributes that describe the variant but don't affect selection
 * (e.g., material, brand, care instructions).
 */
export function VariantAttributeBadges({ attributes }: VariantAttributeBadgesProps) {
	if (attributes.length === 0) {
		return null;
	}

	return (
		<div className="flex flex-wrap gap-2">
			{attributes.map((attr) => (
				<span
					key={attr.slug}
					className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-muted-foreground"
				>
					<span className="font-medium">{attr.name}:</span>
					<span>{attr.values.join(", ")}</span>
				</span>
			))}
		</div>
	);
}

// Backwards compatible alias
export const OptionalAttributes = VariantAttributeBadges;

type VariantWithAttributes = {
	id: string;
	nonSelectionAttributes?: Array<{
		attribute: { name?: string | null; slug?: string | null };
		values: Array<{ name?: string | null }>;
	}>;
};

/**
 * Extract optional attributes from the selected variant.
 * Returns empty array if no variant is selected or variant has no non-selection attributes.
 */
export function extractOptionalAttributes(
	variants: VariantWithAttributes[],
	selectedVariantId?: string,
): VariantAttribute[] {
	// Find the selected variant, or fall back to first if none selected
	const variant = selectedVariantId ? variants.find((v) => v.id === selectedVariantId) : variants[0];

	if (!variant?.nonSelectionAttributes) {
		return [];
	}

	return variant.nonSelectionAttributes
		.filter((attr) => attr.attribute.name && attr.attribute.slug)
		.map((attr) => ({
			name: attr.attribute.name!,
			slug: attr.attribute.slug!,
			values: attr.values.map((v) => v.name).filter((n): n is string => !!n),
		}))
		.filter((attr) => attr.values.length > 0);
}
