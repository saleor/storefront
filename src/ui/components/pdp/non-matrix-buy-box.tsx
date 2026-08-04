import type { BuyBoxStrategy } from "@/lib/catalog/buy-box-strategy";
import type { PdpVariant } from "@/lib/catalog/get-product-data";
import { formatVariantSelectionSummary } from "./format-variant-selection-summary";

type NonMatrixBuyBoxProps = {
	strategy: Exclude<BuyBoxStrategy, "matrix">;
	selectedVariant?: PdpVariant | null;
	/** i18n: hint when no deep link is present */
	hint: string;
	/** i18n: accessible label for the resolved selection summary */
	summaryLabel: string;
};

/**
 * Buy-box chrome for `over_budget` and `external` strategies.
 *
 * No attribute matrix — a partial list would be wrong. With `?variant=` / `?sku=`
 * resolved, shows a selection summary; ATC lives in the parent form.
 * Forks can replace this module for a custom external picker while keeping the
 * deep-link ATC contract.
 */
export function NonMatrixBuyBox({ strategy, selectedVariant, hint, summaryLabel }: NonMatrixBuyBoxProps) {
	if (selectedVariant) {
		const summary = formatVariantSelectionSummary(selectedVariant);
		return (
			<div className="space-y-1" data-buybox-strategy={strategy}>
				<p className="text-sm font-medium text-foreground" aria-label={summaryLabel}>
					{summary || selectedVariant.name}
				</p>
			</div>
		);
	}

	return (
		<p className="text-sm text-muted-foreground" data-buybox-strategy={strategy} role="status">
			{hint}
		</p>
	);
}
