"use client";

import { cn } from "@/lib/utils";
import { DiscountPercentLabel } from "@/ui/components/ui/sale-label";
import type { OptionRendererProps } from "../types";

/**
 * Renders a swatch option as a circular button.
 *
 * Supports Saleor Swatch attributes with hex colors (image swatches use ImageSwatchPillOption).
 *
 * Visual states:
 * - Normal: Full color/image, clickable
 * - Selected: Ring indicator
 * - Incompatible: Dimmed (50% opacity), still clickable
 * - Out of stock: Diagonal strikethrough, disabled
 * - On sale: Small red dot indicator
 */
export function ColorSwatchOption({ option, isSelected, onSelect, isPending }: OptionRendererProps) {
	const isOutOfStock = !option.available;
	const isIncompatible = option.existsWithCurrentSelection === false && !isSelected;
	const hasDiscount = option.discountPercent && !isOutOfStock;

	// Build accessible label with all relevant info
	const accessibleLabel = [
		option.name,
		isOutOfStock && "out of stock",
		hasDiscount && `${option.discountPercent}% off`,
		isSelected && "selected",
	]
		.filter(Boolean)
		.join(", ");

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
				className={cn(
					"relative h-12 w-12 rounded-full transition-all",
					"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
					isSelected
						? "ring-2 ring-foreground ring-offset-[3px] ring-offset-background"
						: "hover:ring-foreground/50 ring-1 ring-border",
					isIncompatible && "opacity-50",
					isOutOfStock && "cursor-not-allowed",
				)}
				title={
					isOutOfStock
						? `${option.name} - Out of stock`
						: isIncompatible
							? `${option.name} - Will change other selections`
							: option.discountPercent
								? `${option.name} - ${option.discountPercent}% off`
								: option.name
				}
				aria-label={accessibleLabel}
				aria-pressed={isSelected}
			>
				{option.colorHex ? (
					<span
						className="absolute inset-[3px] rounded-full"
						style={{ backgroundColor: option.colorHex }}
						aria-hidden="true"
					/>
				) : (
					<span
						className="absolute inset-[3px] flex items-center justify-center rounded-full bg-muted text-[10px] font-medium text-muted-foreground"
						aria-hidden="true"
					>
						{option.name.charAt(0)}
					</span>
				)}
				{/* Out of stock: diagonal strikethrough */}
				{isOutOfStock && (
					<span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
						<span className="h-px w-full rotate-45 bg-muted-foreground" />
					</span>
				)}
			</button>
			{hasDiscount && option.discountPercent ? (
				<DiscountPercentLabel percent={option.discountPercent} size="pill" />
			) : null}
		</div>
	);
}
