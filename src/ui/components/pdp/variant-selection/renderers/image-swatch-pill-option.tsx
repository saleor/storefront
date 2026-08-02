"use client";

import { cn } from "@/lib/utils";
import { DiscountPercentLabel } from "@/ui/components/ui/sale-label";
import { useVariantOptionLabels } from "@/ui/components/pdp/use-variant-option-labels";
import type { OptionRendererProps } from "../types";

/**
 * Renders an image swatch as a pill: thumbnail + label in a fully rounded button.
 */
export function ImageSwatchPillOption({ option, isSelected, onSelect, isPending }: OptionRendererProps) {
	const isOutOfStock = !option.available;
	const isIncompatible = option.existsWithCurrentSelection === false && !isSelected;
	const hasDiscount = option.discountPercent && !isOutOfStock;
	const labels = useVariantOptionLabels();

	const accessibleLabel = [
		option.name,
		isOutOfStock && labels.outOfStockA11y(),
		hasDiscount && labels.percentOffA11y(option.discountPercent!),
		isSelected && labels.selectedA11y(),
	]
		.filter(Boolean)
		.join(", ");

	return (
		<div
			className={cn(
				"relative p-1",
				hasDiscount && "pb-2",
				"transition-opacity duration-150",
				isPending && "pointer-events-none opacity-60",
			)}
			style={{ transitionDelay: isPending ? "100ms" : "0ms" }}
		>
			<div className="relative w-fit">
				<button
					type="button"
					onClick={() => onSelect(option.id)}
					disabled={isOutOfStock || isPending}
					aria-disabled={isOutOfStock || isPending}
					className={cn(
						"inline-flex h-12 items-center gap-2.5 rounded-full border pl-1 pr-4 text-sm font-medium transition-all",
						"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
						isSelected
							? "border-foreground bg-foreground text-background"
							: isIncompatible
								? "border-border/70 text-muted-foreground/55 hover:border-muted-foreground/40 hover:text-muted-foreground/70"
								: "border-input bg-background text-foreground hover:border-foreground",
						isOutOfStock && "cursor-not-allowed opacity-60",
					)}
					title={
						isOutOfStock
							? labels.outOfStockTitle(option.name)
							: isIncompatible
								? labels.willChangeSelections(option.name)
								: option.discountPercent
									? labels.percentOffTitle(option.name, option.discountPercent)
									: option.name
					}
					aria-label={accessibleLabel}
					aria-pressed={isSelected}
				>
					{option.swatchImageUrl ? (
						<span
							className={cn(
								"flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full",
								isSelected ? "bg-background/15" : "bg-muted/50",
							)}
							aria-hidden="true"
						>
							{/* eslint-disable-next-line @next/next/no-img-element -- swatch thumbnails may be SVGs from Saleor media */}
							<img
								src={option.swatchImageUrl}
								alt=""
								className={cn("h-5 w-5 object-contain object-center", isSelected && "brightness-0 invert")}
							/>
						</span>
					) : null}
					<span className={cn(isOutOfStock && "line-through")}>{option.name}</span>
				</button>
				{hasDiscount && option.discountPercent ? (
					<DiscountPercentLabel percent={option.discountPercent} size="pill" />
				) : null}
			</div>
		</div>
	);
}
