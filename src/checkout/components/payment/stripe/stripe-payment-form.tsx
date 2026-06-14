"use client";

import { useRef, useState, type FC } from "react";
import { useTranslations } from "next-intl";
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
import { PaymentTrustSignals } from "@/checkout/components/payment/payment-trust-signals";
import { type StripeBillingContext } from "./stripe-billing-context";
import { useCheckoutPaymentMessages } from "@/checkout/hooks/use-checkout-payment-messages";

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
	const paymentMessages = useCheckoutPaymentMessages();
	const tActions = useTranslations("checkout.actions");
	const [isLoading, setIsLoading] = useState(false);
	const paymentElementChangeTypeRef = useRef<string | null>(null);
	const showExpressCheckout = isStripeExpressCheckoutEnabled();

	const total = checkout.totalPrice?.gross;
	const totalStr = formatMoneyWithFallback(total);

	const handlePay = async () => {
		onError("");

		if (!stripe || !elements) {
			onError(paymentMessages.unavailable);
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
			messages: paymentMessages,
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
	const processingTitle = isLoading ? tActions("processingPayment") : paymentMessages.confirmingPayment;

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
				<PaymentTrustSignals provider="stripe" className="pt-1" />
				<Button
					type="button"
					className="h-12 w-full md:w-auto md:min-w-[200px]"
					disabled={isLoading || !stripe || !elements}
					onClick={() => void handlePay()}
				>
					{isLoading ? (
						<span className="flex items-center justify-center gap-2">
							<LoadingSpinner />
							{tActions("processingPayment")}
						</span>
					) : (
						tActions("payTotal", { total: totalStr })
					)}
				</Button>
			</div>

			{showProcessingOverlay ? (
				<StripePaymentProcessingOverlay
					title={processingTitle}
					description={paymentMessages.securingWithStripe}
				/>
			) : null}
		</div>
	);
};
