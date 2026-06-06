"use client";

import { useState, type FC } from "react";
import { type CheckoutFragment } from "@/checkout/graphql";
import { Button } from "@/ui/components/ui/button";
import { LoadingSpinner } from "@/checkout/ui-kit/loading-spinner";
import { updateCheckoutBilling } from "@/checkout/lib/payment/update-billing";
import { clearPaymentCompleting } from "@/checkout/lib/payment/checkout-payment-completion";
import { finalizeCheckoutOrder } from "@/checkout/lib/payment/finalize-checkout-order";
import { useCheckoutData } from "@/checkout/providers/checkout-data";
import { formatMoneyWithFallback } from "@/checkout/lib/utils/money";
import { type StripeBillingContext } from "./stripe-payment-form";

type FreeOrderCheckoutProps = {
	checkout: CheckoutFragment;
	billing: StripeBillingContext;
	onError: (message: string) => void;
	onBillingErrors: (errors: Record<string, string>, focusField?: string) => void;
};

/** Completes a $0 checkout without mounting Stripe Elements. */
export const FreeOrderCheckout: FC<FreeOrderCheckoutProps> = ({
	checkout,
	billing,
	onError,
	onBillingErrors,
}) => {
	const { refreshCheckout } = useCheckoutData();
	const [isLoading, setIsLoading] = useState(false);
	const totalStr = formatMoneyWithFallback(checkout.totalPrice?.gross);

	const handleComplete = async () => {
		onError("");
		setIsLoading(true);
		let orderPlaced = false;

		try {
			const billingResult = await updateCheckoutBilling({
				checkoutId: checkout.id,
				sameAsBilling: billing.sameAsBilling,
				hasShippingAddress: billing.hasShippingAddress,
				billingData: billing.billingData,
				shippingAddress: billing.shippingAddress,
				userAddresses: billing.userAddresses,
				authenticated: billing.authenticated,
			});

			if (!billingResult.ok) {
				onBillingErrors(billingResult.errors, billingResult.focusField);
				return;
			}

			const liveCheckout = await refreshCheckout({ updateState: false });
			const checkoutToComplete = liveCheckout ?? checkout;

			const completeResult = await finalizeCheckoutOrder(
				checkoutToComplete.id,
				checkoutToComplete.channel.slug,
			);

			if (!completeResult.ok) {
				onError(completeResult.error);
				return;
			}

			orderPlaced = true;
		} catch (error) {
			console.error("Free order completion failed:", error);
			onError("Could not complete your order. Please try again.");
		} finally {
			if (!orderPlaced) {
				clearPaymentCompleting();
				setIsLoading(false);
			}
		}
	};

	return (
		<div className="bg-muted/30 space-y-4 rounded-lg border border-border p-6">
			<p className="text-sm text-muted-foreground">
				Your order total is <span className="font-medium text-foreground">{totalStr}</span>. No payment is
				required — confirm below to place your order.
			</p>
			<Button
				type="button"
				className="h-12 w-full md:w-auto md:min-w-[200px]"
				disabled={isLoading}
				onClick={() => void handleComplete()}
			>
				{isLoading ? (
					<span className="flex items-center justify-center gap-2">
						<LoadingSpinner />
						Placing order...
					</span>
				) : (
					"Complete order"
				)}
			</Button>
		</div>
	);
};
