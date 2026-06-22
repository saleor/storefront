"use client";

import { useState, type FC } from "react";
import { useTranslations } from "next-intl";
import { type CheckoutFragment } from "@/checkout/graphql";
import { Button } from "@/ui/components/ui/button";
import { LoadingSpinner } from "@/checkout/ui-kit/loading-spinner";
import { clearPaymentCompleting } from "@/checkout/lib/payment/checkout-payment-completion";
import { completeFreeOrderCheckout } from "@/checkout/lib/payment/complete-free-order-checkout";
import { rethrowNextInternalError } from "@/checkout/lib/rethrow-next-internal-error";
import { useCheckoutData } from "@/checkout/providers/checkout-data";
import { formatMoneyWithFallback } from "@/checkout/lib/utils/money";
import { PaymentTrustSignals } from "@/checkout/components/payment/payment-trust-signals";
import { type StripeBillingContext } from "./stripe-payment-form";
import { useCheckoutPaymentMessages } from "@/checkout/hooks/use-checkout-payment-messages";

type FreeOrderCheckoutProps = {
	checkout: CheckoutFragment;
	billing: StripeBillingContext;
	onError: (message: string) => void;
	onBillingErrors: (errors: Record<string, string>, focusField?: string) => void;
	onPaymentActivityChange?: (active: boolean) => void;
};

/** Completes a $0 checkout without mounting Stripe Elements. */
export const FreeOrderCheckout: FC<FreeOrderCheckoutProps> = ({
	checkout,
	billing,
	onError,
	onBillingErrors,
	onPaymentActivityChange,
}) => {
	const { refreshCheckout } = useCheckoutData();
	const paymentMessages = useCheckoutPaymentMessages();
	const tActions = useTranslations("checkout.actions");
	const [isLoading, setIsLoading] = useState(false);
	const totalStr = formatMoneyWithFallback(checkout.totalPrice?.gross);

	const handleComplete = async () => {
		onError("");
		setIsLoading(true);
		onPaymentActivityChange?.(true);
		let orderPlaced = false;

		try {
			const result = await completeFreeOrderCheckout({
				checkout,
				billingData: billing.billingData,
				sameAsBilling: billing.sameAsBilling,
				hasShippingAddress: billing.hasShippingAddress,
				shippingAddress: billing.shippingAddress,
				userAddresses: billing.userAddresses,
				authenticated: billing.authenticated,
				refreshCheckout,
			});

			if (!result.ok) {
				if (result.kind === "billing") {
					onBillingErrors(result.errors, result.focusField);
				} else {
					onError(result.error);
				}
				return;
			}

			orderPlaced = true;
		} catch (error) {
			rethrowNextInternalError(error);
			console.error("Free order completion failed:", error);
			onError(paymentMessages.completeOrderFailed);
		} finally {
			if (!orderPlaced) {
				clearPaymentCompleting();
				setIsLoading(false);
				onPaymentActivityChange?.(false);
			}
		}
	};

	return (
		<div className="bg-muted/30 space-y-4 rounded-lg border border-border p-6">
			<p className="text-sm text-muted-foreground">{paymentMessages.freeOrderBody(totalStr)}</p>
			<PaymentTrustSignals />
			<Button
				type="button"
				className="h-12 w-full md:w-auto md:min-w-[200px]"
				disabled={isLoading}
				onClick={() => void handleComplete()}
			>
				{isLoading ? (
					<span className="flex items-center justify-center gap-2">
						<LoadingSpinner />
						{tActions("placingOrder")}
					</span>
				) : (
					tActions("completeOrder")
				)}
			</Button>
		</div>
	);
};
