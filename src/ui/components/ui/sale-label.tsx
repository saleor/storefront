import { cn } from "@/lib/utils";
import { Badge } from "@/ui/components/ui/badge";

/** "Sale" chip for PLP cards, PDP header, etc. */
export function SaleBadge({ className }: { className?: string }) {
	return (
		<Badge variant="destructive" className={cn("text-xs", className)}>
			Sale
		</Badge>
	);
}

type DiscountPercentLabelProps = {
	percent: number;
	className?: string;
	/** `inline` — next to price; `pill` — overlay on variant options */
	size?: "inline" | "pill";
};

/** Discount percentage label (e.g. -20%). Uses `--destructive` for sale color. */
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
