"use client";

import { cn } from "@/lib/utils";
import type { OptionRendererProps } from "../types";

/**
 * Renders a generic text option as a rectangular button.
 *
 * Visual states:
 * - Normal: Full styling, clickable
 * - Selected: Inverted colors (dark bg, light text)
 * - Incompatible: Dimmed border/text, still clickable - will clear other selections
 * - Out of stock: Strikethrough, disabled
 * - On sale: Small red dot indicator
 */
export function TextOption({ option, isSelected, onSelect }: OptionRendererProps) {
	const isOutOfStock = !option.available;
	const isIncompatible = option.existsWithCurrentSelection === false && !isSelected;
	const hasDiscount = option.discountPercent && !isOutOfStock;

	return (
		<div className="relative">
			<button
				type="button"
				onClick={() => onSelect(option.id)}
				disabled={isOutOfStock}
				className={cn(
					"h-12 min-w-[4.5rem] rounded-lg border px-4 text-sm font-medium transition-all",
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
				aria-pressed={isSelected}
			>
				{option.name}
			</button>
			{hasDiscount && (
				<span className="pointer-events-none absolute -bottom-2 -right-1 rounded-full border border-destructive bg-background px-1.5 py-0.5 text-[10px] font-semibold text-destructive">
					-{option.discountPercent}%
				</span>
			)}
		</div>
	);
}
