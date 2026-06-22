"use client";

import { cn } from "@/lib/utils";
import { DiscountPercentLabel } from "@/ui/components/ui/sale-label";
import { useVariantOptionLabels } from "@/ui/components/pdp/use-variant-option-labels";
import type { OptionRendererProps } from "../types";

export interface ButtonOptionProps extends OptionRendererProps {
	/** Optional prefix for accessible label (e.g., "Size" → "Size M") */
	labelPrefix?: string;
	/** Minimum width of the button */
	minWidth?: string;
}

/**
 * Renders a variant option as a rectangular button.
 *
 * Visual states:
 * - Normal: Full styling, clickable
 * - Selected: Inverted colors (dark bg, light text)
 * - Incompatible: Dimmed border/text, still clickable - will clear other selections
 * - Out of stock: Strikethrough, disabled
 * - On sale: Small discount badge
 */
export function ButtonOption({
	option,
	isSelected,
	onSelect,
	isPending,
	labelPrefix,
	minWidth = "3.5rem",
}: ButtonOptionProps) {
	const isOutOfStock = !option.available;
	const isIncompatible = option.existsWithCurrentSelection === false && !isSelected;
	const hasDiscount = option.discountPercent && !isOutOfStock;
	const labels = useVariantOptionLabels();

	const accessibleParts = [
		labelPrefix ? `${labelPrefix} ${option.name}` : option.name,
		isOutOfStock && labels.outOfStockA11y(),
		hasDiscount && labels.percentOffA11y(option.discountPercent!),
	].filter(Boolean);

	return (
		<div
			className={cn(
				"relative transition-opacity duration-150",
				isPending && "pointer-events-none opacity-60",
			)}
			style={{ transitionDelay: isPending ? "100ms" : "0ms" }}
		>
			<button
				type="button"
				onClick={() => onSelect(option.id)}
				disabled={isOutOfStock || isPending}
				aria-disabled={isOutOfStock || isPending}
				style={{ minWidth }}
				className={cn(
					"h-12 rounded-lg border px-4 text-sm font-medium transition-all",
					"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
					isSelected
						? "border-foreground bg-foreground text-background"
						: isIncompatible
							? "hover:border-muted-foreground/40 border-border text-muted-foreground"
							: "border-input bg-background text-foreground hover:border-foreground",
					isOutOfStock && "cursor-not-allowed text-muted-foreground line-through opacity-60",
				)}
				title={
					isOutOfStock
						? labels.outOfStockTitle(option.name)
						: isIncompatible
							? labels.willChangeSelections(option.name)
							: option.discountPercent
								? labels.percentOffTitle(option.name, option.discountPercent)
								: undefined
				}
				aria-label={accessibleParts.join(", ")}
				aria-pressed={isSelected}
			>
				{option.name}
			</button>
			{hasDiscount && option.discountPercent ? (
				<DiscountPercentLabel percent={option.discountPercent} size="pill" />
			) : null}
		</div>
	);
}

// Backwards-compatible aliases
export function SizeButtonOption(props: OptionRendererProps) {
	return <ButtonOption {...props} labelPrefix="Size" />;
}

export function TextOption(props: OptionRendererProps) {
	return <ButtonOption {...props} minWidth="4.5rem" />;
}
