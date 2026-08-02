import { cn } from "@/lib/utils";

// Localized badges live in a client module (next-intl). Re-exported here so existing
// `@/ui/components/ui/sale-label` import paths keep working.
export { SaleBadge, NewBadge, BestsellerBadge } from "@/ui/components/ui/product-badges";

type DiscountPercentLabelProps = {
	percent: number;
	className?: string;
	/** `inline` — next to price; `pill` — overlay on variant options */
	size?: "inline" | "pill";
};

/**
 * Discount percentage label (e.g. -20%). Uses `--destructive` for sale color.
 * Presentational only (no translations) so it stays a Server Component and renders
 * on any surface.
 */
export function DiscountPercentLabel({ percent, size = "inline", className }: DiscountPercentLabelProps) {
	if (size === "pill") {
		return (
			<span
				className={cn(
					"pointer-events-none absolute -bottom-2 -right-1 rounded-full border border-destructive bg-background px-1.5 py-0.5 text-[10px] font-semibold text-destructive",
					className,
				)}
				aria-hidden="true"
			>
				-{percent}%
			</span>
		);
	}

	return <span className={cn("text-sm font-medium text-destructive", className)}>-{percent}%</span>;
}
