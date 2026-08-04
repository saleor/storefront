"use client";

import { cn } from "@/lib/utils";
import { DiscountPercentLabel } from "@/ui/components/ui/sale-label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectItemText,
	SelectTrigger,
	SelectValue,
} from "@/ui/components/ui/select";
import { useVariantOptionLabels } from "@/ui/components/pdp/use-variant-option-labels";
import type { VariantOption } from "./types";

export interface VariantSelectControlProps {
	label: string;
	attributeSlug: string;
	options: VariantOption[];
	selectedId?: string;
	onSelect: (optionId: string) => void;
	isPending?: boolean;
	labelId: string;
	placeholder: string;
}

/**
 * Mid-size text/numeric attribute control (11–24 options).
 * Visual parity with the combobox list: muted highlight, inline discount, check.
 * Lazy-loaded so the chips path never pays for `@radix-ui/react-select`.
 */
export function VariantSelectControl({
	label,
	attributeSlug,
	options,
	selectedId,
	onSelect,
	isPending,
	labelId,
	placeholder,
}: VariantSelectControlProps) {
	const labels = useVariantOptionLabels();
	const selectId = `variant-select-${attributeSlug}`;

	return (
		<div className={cn("transition-opacity duration-150", isPending && "pointer-events-none opacity-60")}>
			<Select
				value={selectedId ?? ""}
				disabled={isPending}
				onValueChange={(next) => {
					if (!next) return;
					onSelect(next);
				}}
			>
				<SelectTrigger id={selectId} aria-labelledby={labelId} className="h-12 w-full max-w-md">
					<SelectValue placeholder={placeholder || label} />
				</SelectTrigger>
				<SelectContent className="max-w-md" position="popper" sideOffset={6}>
					{options.map((option) => {
						const isOutOfStock = !option.available;
						const hasDiscount = Boolean(option.discountPercent && option.available);
						const isIncompatible = option.existsWithCurrentSelection === false;

						return (
							<SelectItem
								key={option.id}
								value={option.id}
								disabled={isOutOfStock}
								textValue={option.name}
								title={
									isOutOfStock
										? labels.outOfStockTitle(option.name)
										: isIncompatible
											? labels.willChangeSelections(option.name)
											: option.discountPercent
												? labels.percentOffTitle(option.name, option.discountPercent)
												: undefined
								}
								className={cn(
									isIncompatible && !isOutOfStock && "text-muted-foreground/55",
									isOutOfStock && "line-through opacity-50",
								)}
							>
								<span className="flex min-w-0 flex-1 items-baseline gap-2">
									<SelectItemText className="truncate">{option.name}</SelectItemText>
									{hasDiscount && option.discountPercent ? (
										<DiscountPercentLabel
											percent={option.discountPercent}
											size="inline"
											className="shrink-0 text-xs tabular-nums"
										/>
									) : null}
									{isOutOfStock ? <span className="sr-only">{labels.outOfStockA11y()}</span> : null}
								</span>
							</SelectItem>
						);
					})}
				</SelectContent>
			</Select>
		</div>
	);
}
