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
 */
export function TextOption({ option, isSelected, onSelect }: OptionRendererProps) {
	const isOutOfStock = !option.available;
	const isIncompatible = option.existsWithCurrentSelection === false && !isSelected;

	return (
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
						: undefined
			}
			aria-pressed={isSelected}
		>
			{option.name}
		</button>
	);
}
