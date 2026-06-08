"use client";

import { useRef, useState, type FC } from "react";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { type StripePaymentElementOptions } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";
import { type CheckoutFragment } from "@/checkout/graphql";
import { LoadingSpinner } from "@/checkout/ui-kit/loading-spinner";
import { Button } from "@/ui/components/ui/button";
import { buildCheckoutPriceChangeNotice } from "@/checkout/lib/payment/checkout-pay-amount";
import { clearPaymentCompleting } from "@/checkout/lib/payment/checkout-payment-completion";
import { isStripeExpressCheckoutEnabled } from "@/checkout/lib/payment/providers/stripe";
import { useCheckoutData } from "@/checkout/providers/checkout-data";
import { cn } from "@/lib/utils";
import { formatMoneyWithFallback } from "@/checkout/lib/utils/money";
import { executeStripeCheckoutPayment } from "./execute-stripe-checkout-payment";
import { StripeExpressCheckout } from "./stripe-express-checkout";
import { StripePaymentProcessingOverlay } from "./stripe-payment-processing-overlay";
import { type StripeBillingContext } from "./stripe-billing-context";

export type { StripeBillingContext } from "./stripe-billing-context";

const paymentElementOptions: StripePaymentElementOptions = {
	layout: "tabs",
};

type StripePaymentFormProps = {
	checkout: CheckoutFragment;
	billing: StripeBillingContext;
	onError: (message: string) => void;
	onBillingErrors: (errors: Record<string, string>, focusField?: string) => void;
	onPriceChangeNotice: (notice: ReturnType<typeof buildCheckoutPriceChangeNotice>) => void;
	onPaymentActivityChange?: (active: boolean) => void;
	isPaymentOverlayVisible?: boolean;
};

export const StripePaymentForm: FC<StripePaymentFormProps> = ({
	checkout,
	billing,
	onError,
	onBillingErrors,
	onPriceChangeNotice,
	onPaymentActivityChange,
	isPaymentOverlayVisible = false,
}) => {
	const stripe = useStripe();
	const elements = useElements();
	const searchParams = useSearchParams();
	const { refreshCheckout } = useCheckoutData();
	const [isLoading, setIsLoading] = useState(false);
	const paymentElementChangeTypeRef = useRef<string | null>(null);
	const showExpressCheckout = isStripeExpressCheckoutEnabled();

	const total = checkout.totalPrice?.gross;
	const totalStr = formatMoneyWithFallback(total);

	const handlePay = async () => {
		onError("");

		if (!stripe || !elements) {
			onError("Payment system is not available. Please try again.");
			return;
		}

		setIsLoading(true);
		onPaymentActivityChange?.(true);
		let orderPlaced = false;

		const result = await executeStripeCheckoutPayment({
			stripe,
			elements,
			checkout,
			billing,
			searchParams,
			refreshCheckout,
			paymentMethodContext: {
				surface: "paymentElement",
				changeType: paymentElementChangeTypeRef.current,
			},
		});

		if (!result.ok) {
			if (result.kind === "billing") {
				onBillingErrors(result.errors, result.focusField);
			} else if (result.kind === "price_change") {
				onPriceChangeNotice(result.notice);
			} else {
				onError(result.message);
			}
		} else {
			orderPlaced = true;
		}

		if (!orderPlaced) {
			clearPaymentCompleting();
			setIsLoading(false);
			onPaymentActivityChange?.(false);
		}
	};

	const showProcessingOverlay = isPaymentOverlayVisible || isLoading;
	const processingTitle = isLoading ? "Processing payment..." : "Confirming your payment...";

	return (
		<div
			className={cn(
				"relative",
				showProcessingOverlay && "overflow-hidden rounded-lg border border-border bg-card shadow-sm",
			)}
		>
			<div
				className={cn("space-y-6", showProcessingOverlay && "invisible")}
				aria-hidden={showProcessingOverlay}
			>
				{showExpressCheckout ? (
					<StripeExpressCheckout
						checkout={checkout}
						billing={billing}
						onError={onError}
						onBillingErrors={onBillingErrors}
						onPriceChangeNotice={onPriceChangeNotice}
						onPaymentActivityChange={onPaymentActivityChange}
					/>
				) : null}

				<PaymentElement
					options={paymentElementOptions}
					onChange={(event) => {
						paymentElementChangeTypeRef.current = event.value.type ?? null;
					}}
				/>
				<Button
					type="button"
					className="h-12 w-full md:w-auto md:min-w-[200px]"
					disabled={isLoading || !stripe || !elements}
					onClick={() => void handlePay()}
				>
					{isLoading ? (
						<span className="flex items-center justify-center gap-2">
							<LoadingSpinner />
							Processing payment...
						</span>
					) : (
						`Pay ${totalStr}`
					)}
				</Button>
			</div>

			{showProcessingOverlay ? (
				<StripePaymentProcessingOverlay
					title={processingTitle}
					description="We're securing your payment with Stripe. This usually takes a few seconds."
				/>
			) : null}
		</div>
	);
};
