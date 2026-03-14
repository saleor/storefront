"use client";

import { useCallback, useMemo, useEffect, useTransition, useOptimistic } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { VariantSelectionSectionProps } from "./types";
import { VariantSelector } from "./variant-selector";
import { VariantNameSelector } from "./variant-name-selector";
import {
	groupVariantsByAttributes,
	findMatchingVariant,
	getSelectionsFromVariant,
	getOptionsForAttribute,
	getAdjustedSelections,
	getUnavailableAttributeInfo,
	type SaleorVariant,
} from "./utils";
import { VariantAttributeBadges, extractOptionalAttributes } from "./optional-attributes";

/**
 * Main container for variant selection with multiple attributes.
 *
 * Uses useOptimistic to provide immediate visual feedback when clicking
 * options, while the server-side navigation completes in the background.
 * This prevents the "dead click" feel on slow connections where router.push()
 * triggers a server round-trip before searchParams update.
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
	const [isPending, startTransition] = useTransition();

	const attributeGroups = useMemo(() => groupVariantsByAttributes(variants as SaleorVariant[]), [variants]);

	// Get current selections from URL params OR from selected variant
	const currentSelections = useMemo(() => {
		const selections: Record<string, string> = {};

		for (const group of attributeGroups) {
			const paramValue = searchParams.get(group.slug);
			if (paramValue) {
				selections[group.slug] = paramValue;
			}
		}

		if (Object.keys(selections).length === 0 && selectedVariantId) {
			return getSelectionsFromVariant(variants as SaleorVariant[], selectedVariantId);
		}

		return selections;
	}, [attributeGroups, searchParams, selectedVariantId, variants]);

	// Optimistic selections: immediately reflect user clicks while navigation is pending.
	// Without this, selections only update after the server round-trip completes
	// (router.push → server re-renders VariantSectionDynamic → new searchParams).
	const [optimisticSelections, setOptimisticSelections] = useOptimistic(currentSelections);

	// Optimistic variant ID for the name-based fallback selector
	const [optimisticVariantId, setOptimisticVariantId] = useOptimistic(selectedVariantId);

	// Compute the matching variant from optimistic selections
	const currentVariantId = useMemo(
		() => findMatchingVariant(variants as SaleorVariant[], optimisticSelections),
		[variants, optimisticSelections],
	);

	const optionalAttributes = useMemo(
		() => extractOptionalAttributes(variants, currentVariantId),
		[variants, currentVariantId],
	);

	// Handle selection change with smart adjustment + optimistic UI
	const handleSelect = useCallback(
		(attributeSlug: string, optionId: string) => {
			const newSelections = getAdjustedSelections(
				variants as SaleorVariant[],
				optimisticSelections,
				attributeSlug,
				optionId,
			);

			const params = new URLSearchParams();
			for (const [slug, value] of Object.entries(newSelections)) {
				if (value) params.set(slug, value);
			}

			const matchingVariantId = findMatchingVariant(variants as SaleorVariant[], newSelections);
			if (matchingVariantId) {
				params.set("variant", matchingVariantId);
			}

			startTransition(() => {
				setOptimisticSelections(newSelections);
				router.push(`/${channel}/products/${productSlug}?${params.toString()}`, { scroll: false });
			});
		},
		[optimisticSelections, variants, channel, productSlug, router, startTransition, setOptimisticSelections],
	);

	// Check if any attribute group is completely unavailable
	const unavailableInfo = useMemo(
		() => getUnavailableAttributeInfo(variants as SaleorVariant[], attributeGroups, optimisticSelections),
		[variants, attributeGroups, optimisticSelections],
	);

	useEffect(() => {
		if (process.env.NODE_ENV === "development" && attributeGroups.length === 0 && variants.length > 1) {
			console.warn(
				`[VariantSelectionSection] Product "${productSlug}" has ${variants.length} variants but no structured attributes. ` +
					`Using name-based fallback selector. For better UX (color swatches, size pills, cross-filtering), ` +
					`configure variant attributes in Saleor Dashboard.`,
			);
		}
	}, [attributeGroups.length, variants.length, productSlug]);

	// Handle variant selection for name-based fallback with optimistic UI
	const handleVariantSelect = useCallback(
		(variantId: string) => {
			startTransition(() => {
				setOptimisticVariantId(variantId);
				router.push(`/${channel}/products/${productSlug}?variant=${variantId}`, { scroll: false });
			});
		},
		[channel, productSlug, router, startTransition, setOptimisticVariantId],
	);

	if (children) {
		return <>{children}</>;
	}

	if (variants.length <= 1) {
		return null;
	}

	// Fallback: variants without structured attributes use name-based selector
	if (attributeGroups.length === 0) {
		return (
			<div className="space-y-6 py-2">
				<VariantNameSelector
					variants={variants}
					selectedVariantId={optimisticVariantId}
					onSelect={handleVariantSelect}
					isPending={isPending}
				/>
			</div>
		);
	}

	return (
		<div className="space-y-6 py-2">
			{attributeGroups.map((group) => {
				const options = getOptionsForAttribute(
					variants as SaleorVariant[],
					attributeGroups,
					optimisticSelections,
					group.slug,
				);

				const isUnavailable = unavailableInfo?.slug === group.slug;
				const unavailableMessage = isUnavailable
					? `No ${group.name.toLowerCase()} available in ${unavailableInfo.blockedBy}`
					: undefined;

				return (
					<VariantSelector
						key={group.slug}
						label={group.name}
						options={options}
						selectedId={optimisticSelections[group.slug]}
						attributeSlug={group.slug}
						onSelect={handleSelect}
						unavailableMessage={unavailableMessage}
						isPending={isPending}
					/>
				);
			})}

			<VariantAttributeBadges attributes={optionalAttributes} />
		</div>
	);
}
