"use client";

import { ProductCardBase } from "./product-card-base";
import { QuickAddOverlay } from "./quick-add-overlay";
import type { ProductCardData } from "./product-card-data";

interface ProductCardWithQuickAddProps {
	product: ProductCardData;
	priority?: boolean;
	onQuickAdd: (productId: string) => void;
	/** Preview only — show overlay even when the product has multiple variants. */
	forceShowQuickAdd?: boolean;
	/** Preview only — keep overlay visible without hover (desktop). */
	previewAlwaysVisibleOverlay?: boolean;
}

/**
 * Client wrapper for PLP cards with quick-add. Skips the overlay when the product
 * has multiple variants or is over the PDP variant cap (shopper must use the PDP —
 * never open a variant sheet for over-cap matrices).
 */
export function ProductCardWithQuickAdd({
	product,
	priority = false,
	onQuickAdd,
	forceShowQuickAdd = false,
	previewAlwaysVisibleOverlay = false,
}: ProductCardWithQuickAddProps) {
	const showQuickAdd = !product.isOverVariantCap && (forceShowQuickAdd || !product.hasVariants);

	return (
		<ProductCardBase
			product={product}
			priority={priority}
			imageOverlay={
				showQuickAdd ? (
					<QuickAddOverlay
						alwaysVisible={previewAlwaysVisibleOverlay}
						onQuickAdd={() => onQuickAdd(product.id)}
					/>
				) : undefined
			}
		/>
	);
}
