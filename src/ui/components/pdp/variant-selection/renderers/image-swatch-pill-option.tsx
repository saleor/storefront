"use client";

import { cn } from "@/lib/utils";
import type { OptionRendererProps } from "../types";

/**
 * Renders an image swatch as a pill: thumbnail + label in a fully rounded button.
 */
export function ImageSwatchPillOption({ option, isSelected, onSelect, isPending }: OptionRendererProps) {
	const isOutOfStock = !option.available;
	const isIncompatible = option.existsWithCurrentSelection === false && !isSelected;
	const hasDiscount = option.discountPercent && !isOutOfStock;

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
					"inline-flex h-12 items-center gap-2.5 rounded-full border pl-1 pr-4 text-sm font-medium transition-all",
					"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
					isSelected
						? "border-foreground bg-foreground text-background"
						: isIncompatible
							? "border-gray-200 text-muted-foreground hover:border-gray-300"
							: "border-gray-400 bg-background text-foreground hover:border-foreground",
					isOutOfStock && "cursor-not-allowed opacity-60",
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
