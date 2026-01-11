"use client";

import { cn } from "@/lib/utils";
import type { OptionRendererProps } from "../types";

/**
 * Renders a color swatch option as a circular button.
 *
 * Visual states:
 * - Normal: Full color, clickable
 * - Selected: Ring indicator
 * - Incompatible: Dimmed (50% opacity), still clickable
 * - Out of stock: Diagonal strikethrough, disabled
 * - On sale: Small red dot indicator
 */
export function ColorSwatchOption({ option, isSelected, onSelect }: OptionRendererProps) {
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
					"relative h-12 w-12 rounded-full transition-all",
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
				aria-label={option.name}
				aria-pressed={isSelected}
			>
				<span className="absolute inset-[3px] rounded-full" style={{ backgroundColor: option.colorHex }} />
				{/* Out of stock: diagonal strikethrough */}
				{isOutOfStock && (
					<span className="absolute inset-0 flex items-center justify-center">
						<span className="h-px w-full rotate-45 bg-muted-foreground" />
					</span>
				)}
			</button>
			{hasDiscount && (
				<span className="pointer-events-none absolute -bottom-2 -right-1 rounded-full border border-destructive bg-background px-1.5 py-0.5 text-[10px] font-semibold text-destructive">
					-{option.discountPercent}%
				</span>
			)}
		</div>
	);
}
