"use client";

import { cn } from "@/lib/utils";
import type { OptionRendererProps } from "../types";

/**
 * Renders a size option as a rectangular button.
 *
 * Visual states:
 * - Normal: Full styling, clickable
 * - Selected: Inverted colors (dark bg, light text)
 * - Incompatible: Dimmed border/text, still clickable - will clear other selections
 * - Out of stock: Strikethrough, disabled
 * - On sale: Small red dot indicator
 */
export function SizeButtonOption({ option, isSelected, onSelect, isPending }: OptionRendererProps) {
	const isOutOfStock = !option.available;
	const isIncompatible = option.existsWithCurrentSelection === false && !isSelected;
	const hasDiscount = option.discountPercent && !isOutOfStock;

	// Build accessible label with context
	const accessibleParts = [
		`Size ${option.name}`,
		isOutOfStock && "out of stock",
		hasDiscount && `${option.discountPercent}% off`,
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
				className={cn(
					"h-12 min-w-[3.5rem] rounded-lg border px-4 text-sm font-medium transition-all",
					"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
					isSelected
						? "border-foreground bg-foreground text-background"
						: "border-border bg-background text-foreground hover:border-foreground",
					isIncompatible && !isSelected && "border-border/50 text-muted-foreground hover:border-border",
					isOutOfStock && "cursor-not-allowed text-muted-foreground line-through opacity-60",
				)}
				title={
					isOutOfStock
						? `${option.name} - Out of stock`
						: isIncompatible
							? `${option.name} - Will change other selections`
							: option.discountPercent
								? `${option.name} - ${option.discountPercent}% off`
								: undefined
				}
				aria-label={accessibleParts.join(", ")}
				aria-pressed={isSelected}
			>
				{option.name}
			</button>
			{hasDiscount && (
				<span
					className="pointer-events-none absolute -bottom-2 -right-1 rounded-full border border-destructive bg-background px-1.5 py-0.5 text-[10px] font-semibold text-destructive"
					aria-hidden="true"
				>
					-{option.discountPercent}%
				</span>
			)}
		</div>
	);
}
