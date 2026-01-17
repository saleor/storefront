"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { VariantSelectionSectionProps } from "./types";
import { VariantSelector } from "./variant-selector";
import {
	groupVariantsByAttributes,
	findMatchingVariant,
	getSelectionsFromVariant,
	getOptionsForAttribute,
	getAdjustedSelections,
	getUnavailableAttributeInfo,
	type SaleorVariant,
} from "./utils";

/**
 * Main container for variant selection with multiple attributes.
 *
 * Handles products with multiple variant attributes (e.g., Color AND Size).
 * Each attribute gets its own selector, and selections are combined to find
 * the matching variant.
 *
 * ## How it works
 *
 * 1. Groups variants by their attributes (Color, Size, etc.)
 * 2. Shows a selector for each attribute
 * 3. Tracks selections in URL params (e.g., ?color=black&size=m)
 * 4. When all attributes selected, finds and sets the variant param
 * 5. Updates availability based on other selections (e.g., "XL" grayed out if not available in Black)
 *
 * ## URL Structure
 *
 * - `?variant=abc123` - Selected variant ID (for cart/checkout)
 * - `?color=black&size=m` - Individual attribute selections (for UX)
 *
 * ## Customization
 *
 * Replace entirely with a custom implementation:
 * ```tsx
 * <VariantSelectionSection variants={variants}>
 *   <MyCustomVariantPicker variants={variants} />
 * </VariantSelectionSection>
 * ```
 */
export function VariantSelectionSection({
	variants,
	selectedVariantId,
	productSlug,
	channel,
	children,
}: VariantSelectionSectionProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	// Group variants by attributes (always call hooks unconditionally)
	const attributeGroups = useMemo(() => groupVariantsByAttributes(variants as SaleorVariant[]), [variants]);

	// Get current selections from URL params OR from selected variant
	const currentSelections = useMemo(() => {
		const selections: Record<string, string> = {};

		// First, try to get from URL params
		for (const group of attributeGroups) {
			const paramValue = searchParams.get(group.slug);
			if (paramValue) {
				selections[group.slug] = paramValue;
			}
		}

		// If no URL params but we have a variant ID, extract from that
		if (Object.keys(selections).length === 0 && selectedVariantId) {
			return getSelectionsFromVariant(variants as SaleorVariant[], selectedVariantId);
		}

		return selections;
	}, [attributeGroups, searchParams, selectedVariantId, variants]);

	// Handle selection change with smart adjustment
	const handleSelect = useCallback(
		(attributeSlug: string, optionId: string) => {
			// Get adjusted selections - clears conflicting selections if needed
			const newSelections = getAdjustedSelections(
				variants as SaleorVariant[],
				currentSelections,
				attributeSlug,
				optionId,
			);

			// Build URL params
			const params = new URLSearchParams();

			for (const [slug, value] of Object.entries(newSelections)) {
				if (value) params.set(slug, value);
			}

			// Try to find matching variant
			const matchingVariantId = findMatchingVariant(variants as SaleorVariant[], newSelections);

			if (matchingVariantId) {
				params.set("variant", matchingVariantId);
			} else {
				// Remove variant param if no exact match yet
				params.delete("variant");
			}

			router.push(`/${channel}/products/${productSlug}?${params.toString()}`, { scroll: false });
		},
		[currentSelections, variants, channel, productSlug, router],
	);

	// Check if any attribute group is completely unavailable
	const unavailableInfo = useMemo(
		() => getUnavailableAttributeInfo(variants as SaleorVariant[], attributeGroups, currentSelections),
		[variants, attributeGroups, currentSelections],
	);

	// If children provided, render them instead (full override)
	if (children) {
		return <>{children}</>;
	}

	// Skip rendering if only one variant (no selection needed)
	if (variants.length <= 1) {
		return null;
	}

	// If no attributes found, show nothing (variant names might be used instead)
	if (attributeGroups.length === 0) {
		return null;
	}

	return (
		<div className="space-y-6 py-2">
			{attributeGroups.map((group) => {
				// Get options - all are selectable, availability shows stock status
				const options = getOptionsForAttribute(
					variants as SaleorVariant[],
					attributeGroups,
					currentSelections,
					group.slug,
				);

				// Check if this group is the one with no available options
				const isUnavailable = unavailableInfo?.slug === group.slug;
				const unavailableMessage = isUnavailable
					? `No ${group.name.toLowerCase()} available in ${unavailableInfo.blockedBy}`
					: undefined;

				return (
					<VariantSelector
						key={group.slug}
						label={group.name}
						options={options}
						selectedId={currentSelections[group.slug]}
						attributeSlug={group.slug}
						onSelect={handleSelect}
						unavailableMessage={unavailableMessage}
					/>
				);
			})}
		</div>
	);
}
