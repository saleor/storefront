"use client";

import { cn, formatMoney } from "@/lib/utils";

/**
 * Fallback selector for variants that have no structured attributes.
 *
 * Used when variants only have names (e.g., "Navy blue S", "Navy blue M")
 * but no attribute data for grouping by Color/Size/etc.
 *
 * ## When this is used
 *
 * - Variants have empty `attributes` arrays
 * - Product has multiple variants but no attribute-based grouping possible
 *
 * ## Limitations vs. structured attributes
 *
 * - No color swatches or visual differentiation
 * - No cross-filtering (can't gray out incompatible options)
 * - Combinatorial explosion for products with many variants
 * - Inconsistent UX compared to attribute-based selectors
 *
 * Consider configuring proper variant attributes in Saleor Dashboard
 * for a better customer experience.
 */

interface VariantNameSelectorProps {
	variants: Array<{
		id: string;
		name: string;
		quantityAvailable?: number | null;
		pricing?: {
			price?: { gross: { amount: number; currency: string } } | null;
			priceUndiscounted?: { gross: { amount: number; currency: string } } | null;
		} | null;
	}>;
	selectedVariantId?: string;
	onSelect: (variantId: string) => void;
	label?: string;
	/** Whether a transition is in progress */
	isPending?: boolean;
}

export function VariantNameSelector({
	variants,
	selectedVariantId,
	onSelect,
	label = "Variant",
	isPending,
}: VariantNameSelectorProps) {
	// Check if prices differ between variants (show price if so)
	const prices = variants
		.map((v) => v.pricing?.price?.gross?.amount)
		.filter((p): p is number => p !== undefined && p !== null);
	const showPrices = prices.length > 1 && new Set(prices).size > 1;

	const selectedVariant = variants.find((v) => v.id === selectedVariantId);

	return (
		<div className="space-y-3">
			<div className="flex items-center gap-2">
				<span className="text-sm font-medium">{label}</span>
				{selectedVariant && <span className="text-sm text-muted-foreground">{selectedVariant.name}</span>}
			</div>

			<div
				role="group"
				aria-label={label}
				aria-busy={isPending}
				className={cn(
					"flex flex-wrap gap-3 transition-opacity duration-150",
					isPending && "pointer-events-none opacity-60",
				)}
				style={{ transitionDelay: isPending ? "100ms" : "0ms" }}
			>
				{variants.map((variant) => {
					const isSelected = variant.id === selectedVariantId;
					const isOutOfStock = (variant.quantityAvailable ?? 0) <= 0;
					const price = variant.pricing?.price?.gross;
					const undiscountedPrice = variant.pricing?.priceUndiscounted?.gross;
					const hasDiscount = price && undiscountedPrice && undiscountedPrice.amount > price.amount;
					const discountPercent = hasDiscount
						? Math.round((1 - price.amount / undiscountedPrice.amount) * 100)
						: null;

					// Build accessible label
					const accessibleParts = [
						variant.name,
						isOutOfStock && "out of stock",
						showPrices && price && formatMoney(price.amount, price.currency),
						discountPercent && `${discountPercent}% off`,
					].filter(Boolean);

					return (
						<div key={variant.id} className="relative">
							<button
								type="button"
								onClick={() => onSelect(variant.id)}
								disabled={isOutOfStock}
								aria-disabled={isOutOfStock}
								className={cn(
									"h-12 min-w-[4.5rem] rounded-lg border px-4 text-sm font-medium transition-all",
									"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
									isSelected
										? "border-foreground bg-foreground text-background"
										: "border-border bg-background text-foreground hover:border-foreground",
									isOutOfStock && "cursor-not-allowed text-muted-foreground line-through opacity-60",
								)}
								title={isOutOfStock ? `${variant.name} - Out of stock` : undefined}
								aria-label={accessibleParts.join(", ")}
								aria-pressed={isSelected}
							>
								<span className="flex items-center gap-2">
									{variant.name}
									{showPrices && price && (
										<span className={cn("text-xs", isSelected ? "opacity-80" : "text-muted-foreground")}>
											{formatMoney(price.amount, price.currency)}
										</span>
									)}
								</span>
							</button>
							{discountPercent && !isOutOfStock && (
								<span
									className="pointer-events-none absolute -bottom-2 -right-1 rounded-full border border-destructive bg-background px-1.5 py-0.5 text-[10px] font-semibold text-destructive"
									aria-hidden="true"
								>
									-{discountPercent}%
								</span>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
