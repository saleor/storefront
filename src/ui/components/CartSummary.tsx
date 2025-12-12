"use client";

import { useState } from "react";
import { Tag, Truck, ShieldCheck } from "lucide-react";
import { formatMoney } from "@/lib/utils";
import { Button } from "../atoms/Button";
import { Input } from "../atoms/Input";

export interface CartSummaryProps {
	subtotal: {
		amount: number;
		currency: string;
	};
	total: {
		amount: number;
		currency: string;
	};
	shippingEstimate?: {
		amount: number;
		currency: string;
	} | null;
	taxEstimate?: {
		amount: number;
		currency: string;
	} | null;
	discount?: {
		amount: number;
		currency: string;
	} | null;
	itemCount: number;
	showPromoCode?: boolean;
	onApplyPromoCode?: (code: string) => Promise<boolean>;
	checkoutHref?: string;
	isCheckoutDisabled?: boolean;
	freeShippingThreshold?: string;
}

export function CartSummary({
	subtotal,
	total,
	shippingEstimate,
	taxEstimate,
	discount,
	itemCount,
	showPromoCode = true,
	onApplyPromoCode,
	checkoutHref,
	isCheckoutDisabled = false,
	freeShippingThreshold = "6000",
}: CartSummaryProps) {
	const [promoCode, setPromoCode] = useState("");
	const [promoError, setPromoError] = useState("");
	const [isApplyingPromo, setIsApplyingPromo] = useState(false);

	const handleApplyPromoCode = async () => {
		if (!promoCode.trim() || !onApplyPromoCode) return;

		setIsApplyingPromo(true);
		setPromoError("");

		try {
			const success = await onApplyPromoCode(promoCode.trim());
			if (!success) {
				setPromoError("Invalid promo code");
			} else {
				setPromoCode("");
			}
		} catch {
			setPromoError("Failed to apply promo code");
		} finally {
			setIsApplyingPromo(false);
		}
	};

	return (
		<div className="rounded-lg border border-secondary-200 bg-secondary-50 p-6">
			<h2 className="mb-4 text-lg font-semibold text-secondary-900">Order Summary</h2>

			{/* Summary Lines */}
			<div className="space-y-3 text-sm">
				<div className="flex justify-between">
					<span className="text-secondary-600">
						Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
					</span>
					<span className="font-medium text-secondary-900">
						{formatMoney(subtotal.amount, subtotal.currency)}
					</span>
				</div>

				{shippingEstimate && (
					<div className="flex justify-between">
						<span className="text-secondary-600">Shipping estimate</span>
						<span className="font-medium text-secondary-900">
							{shippingEstimate.amount === 0
								? "Free"
								: formatMoney(shippingEstimate.amount, shippingEstimate.currency)}
						</span>
					</div>
				)}

				{!shippingEstimate && (
					<div className="flex justify-between">
						<span className="text-secondary-600">Shipping</span>
						<span className="text-secondary-500">Calculated at checkout</span>
					</div>
				)}

				{taxEstimate && (
					<div className="flex justify-between">
						<span className="text-secondary-600">Tax estimate</span>
						<span className="font-medium text-secondary-900">
							{formatMoney(taxEstimate.amount, taxEstimate.currency)}
						</span>
					</div>
				)}

				{discount && discount.amount > 0 && (
					<div className="flex justify-between text-green-600">
						<span>Discount</span>
						<span className="font-medium">-{formatMoney(discount.amount, discount.currency)}</span>
					</div>
				)}

				<div className="mt-3 border-t border-secondary-200 pt-3">
					<div className="flex justify-between">
						<span className="text-base font-semibold text-secondary-900">Total</span>
						<span className="text-base font-bold text-secondary-900">
							{formatMoney(total.amount, total.currency)}
						</span>
					</div>
				</div>
			</div>

			{/* Promo Code */}
			{showPromoCode && onApplyPromoCode && (
				<div className="mt-6 border-t border-secondary-200 pt-6">
					<label className="mb-2 flex items-center gap-2 text-sm font-medium text-secondary-700">
						<Tag className="h-4 w-4" />
						Promo Code
					</label>
					<div className="flex gap-2">
						<Input
							type="text"
							value={promoCode}
							onChange={(e) => setPromoCode(e.target.value)}
							placeholder="Enter code"
							error={promoError}
							className="flex-1"
						/>
						<Button
							type="button"
							variant="secondary"
							onClick={handleApplyPromoCode}
							loading={isApplyingPromo}
							disabled={!promoCode.trim()}
						>
							Apply
						</Button>
					</div>
				</div>
			)}

			{/* Checkout Button */}
			{checkoutHref && (
				<div className="mt-6">
					<a
						href={checkoutHref}
						aria-disabled={isCheckoutDisabled}
						onClick={(e) => isCheckoutDisabled && e.preventDefault()}
						className="block w-full rounded-md bg-primary-600 px-6 py-3 text-center text-base font-medium text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 aria-disabled:cursor-not-allowed aria-disabled:bg-secondary-400"
					>
						Proceed to Checkout
					</a>
				</div>
			)}

			{/* Trust Badges */}
			<div className="mt-6 space-y-2 border-t border-secondary-200 pt-6">
				<div className="flex items-center gap-2 text-xs text-secondary-500">
					<Truck className="h-4 w-4" />
					<span>Free shipping on orders over KES {freeShippingThreshold}</span>
				</div>
				<div className="flex items-center gap-2 text-xs text-secondary-500">
					<ShieldCheck className="h-4 w-4" />
					<span>Secure checkout with SSL encryption</span>
				</div>
			</div>
		</div>
	);
}
