"use client";

import { useCallback, useState, type FC } from "react";
import { ExpressCheckoutElement, useElements, useStripe } from "@stripe/react-stripe-js";
import {
	type StripeExpressCheckoutElementConfirmEvent,
	type StripeExpressCheckoutElementOptions,
} from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";
import { type CheckoutFragment } from "@/checkout/graphql";
import { type CheckoutPriceChangeNotice } from "@/checkout/lib/payment/checkout-pay-amount";
import { clearPaymentCompleting } from "@/checkout/lib/payment/checkout-payment-completion";
import { useLiveCheckoutSearchParams } from "@/checkout/lib/checkout-search-params";
import { useCheckoutData } from "@/checkout/providers/checkout-data";
import { executeStripeCheckoutPayment } from "./execute-stripe-checkout-payment";
import { type StripeBillingContext } from "./stripe-billing-context";
import { useCheckoutPaymentMessages } from "@/checkout/hooks/use-checkout-payment-messages";

const expressCheckoutOptions: StripeExpressCheckoutElementOptions = {
	buttonType: {
		applePay: "buy",
		googlePay: "buy",
	},
	layout: {
		maxColumns: 2,
		maxRows: 1,
	},
	paymentMethods: {
		applePay: "always",
		googlePay: "always",
		link: "auto",
	},
	emailRequired: false,
	phoneNumberRequired: false,
	billingAddressRequired: false,
	shippingAddressRequired: false,
};

type StripeExpressCheckoutProps = {
	checkout: CheckoutFragment;
	billing: StripeBillingContext;
	onError: (message: string) => void;
	onBillingErrors: (errors: Record<string, string>, focusField?: string) => void;
	onPriceChangeNotice: (notice: CheckoutPriceChangeNotice) => void;
	onPaymentActivityChange?: (active: boolean) => void;
};

export const StripeExpressCheckout: FC<StripeExpressCheckoutProps> = ({
	checkout,
	billing,
	onError,
	onBillingErrors,
	onPriceChangeNotice,
	onPaymentActivityChange,
}) => {
	const stripe = useStripe();
	const elements = useElements();
	const searchParams = useSearchParams();
	const liveSearchParams = useLiveCheckoutSearchParams(searchParams);
	const { refreshCheckout } = useCheckoutData();
	const paymentMessages = useCheckoutPaymentMessages();
	const [hasWallets, setHasWallets] = useState<boolean | null>(null);

	const handleConfirm = useCallback(
		async (event: StripeExpressCheckoutElementConfirmEvent) => {
			onError("");
			onPaymentActivityChange?.(true);

			if (!stripe || !elements) {
				event.paymentFailed({ message: paymentMessages.unavailable });
				onPaymentActivityChange?.(false);
				return;
			}

			const result = await executeStripeCheckoutPayment({
				stripe,
				elements,
				checkout,
				billing,
				searchParams: liveSearchParams,
				refreshCheckout,
				paymentMethodContext: {
					surface: "expressCheckout",
					expressPaymentType: event.expressPaymentType,
				},
				messages: paymentMessages,
			});

			if (!result.ok) {
				clearPaymentCompleting();
				onPaymentActivityChange?.(false);

				if (result.kind === "billing") {
					onBillingErrors(result.errors, result.focusField);
					event.paymentFailed({ reason: "invalid_billing_address" });
					return;
				}

				if (result.kind === "price_change") {
					onPriceChangeNotice(result.notice);
					event.paymentFailed({ message: paymentMessages.totalChanged });
					return;
				}

				onError(result.message);
				event.paymentFailed({ message: result.message });
				return;
			}
		},
		[
			billing,
			checkout,
			elements,
			onBillingErrors,
			onError,
			onPaymentActivityChange,
			onPriceChangeNotice,
			paymentMessages,
			refreshCheckout,
			liveSearchParams,
			stripe,
		],
	);

	if (hasWallets === false) {
		return null;
	}

	return (
		<div className="space-y-4">
			<ExpressCheckoutElement
				options={expressCheckoutOptions}
				onConfirm={(event) => void handleConfirm(event)}
				onAvailablePaymentMethodsChange={({ paymentMethods }) => {
					const available = Boolean(
						paymentMethods?.applePay?.available ||
						paymentMethods?.googlePay?.available ||
						paymentMethods?.link?.available,
					);
					setHasWallets(available);
				}}
			/>

			{hasWallets ? (
				<div className="relative">
					<div className="absolute inset-0 flex items-center">
						<span className="w-full border-t border-border" />
					</div>
					<div className="relative flex justify-center text-xs uppercase">
						<span className="bg-card px-4 font-medium text-muted-foreground">Or pay with card</span>
					</div>
				</div>
			) : null}
		</div>
	);
};
