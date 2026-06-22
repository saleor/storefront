"use client";

import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/ui/components/ui/button";
import { DiscountPercentLabel } from "@/ui/components/ui/sale-label";
import { cn } from "@/lib/utils";

interface AddToCartProps {
	price: string;
	compareAtPrice?: string | null;
	discountPercent?: number | null;
	disabled?: boolean;
	disabledReason?: "no-selection" | "out-of-stock";
	secureCheckoutLabel: string;
	freeShippingTrustLabel?: string | null;
}

function AddToCartButton({
	disabled,
	disabledReason,
}: {
	disabled?: boolean;
	disabledReason?: "no-selection" | "out-of-stock";
}) {
	const { pending } = useFormStatus();
	const t = useTranslations("pdp");

	const getButtonText = () => {
		if (pending) return t("adding");
		if (!disabled) return t("addToBag");
		if (disabledReason === "out-of-stock") return t("outOfStock");
		return t("selectOptions");
	};

	return (
		<Button
			type="submit"
			size="lg"
			disabled={disabled || pending}
			className={cn("h-14 w-full text-base font-medium transition-all duration-200", pending && "opacity-80")}
		>
			<ShoppingBag className={cn("mr-2 h-5 w-5 transition-transform", pending && "scale-90")} />
			{getButtonText()}
		</Button>
	);
}

export function AddToCart({
	price,
	compareAtPrice,
	discountPercent,
	disabled = false,
	disabledReason,
	secureCheckoutLabel,
	freeShippingTrustLabel,
}: AddToCartProps) {
	return (
		<div className="space-y-4">
			<div className="flex items-baseline gap-3">
				<span className="text-2xl font-semibold tabular-nums tracking-tight">{price}</span>
				{compareAtPrice && (
					<>
						<span className="text-lg tabular-nums text-muted-foreground line-through">{compareAtPrice}</span>
						{discountPercent ? <DiscountPercentLabel percent={discountPercent} /> : null}
					</>
				)}
			</div>

			<AddToCartButton disabled={disabled} disabledReason={disabledReason} />

			<div className="flex items-center justify-center gap-6 pt-2 text-xs text-muted-foreground">
				<span className="flex items-center gap-1.5">
					<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
						<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
					</svg>
					{secureCheckoutLabel}
				</span>
				{freeShippingTrustLabel ? (
					<span className="flex items-center gap-1.5">
						<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
							<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
							<path d="M9 22V12h6v10" />
						</svg>
						{freeShippingTrustLabel}
					</span>
				) : null}
			</div>
		</div>
	);
}
