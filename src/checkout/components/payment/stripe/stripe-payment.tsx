"use client";

import { useCallback, useEffect, useRef, useState, type FC } from "react";
import { loadStripe, type Stripe, type StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { AlertCircle } from "lucide-react";
import { type CheckoutFragment } from "@/checkout/graphql";
import { LoadingSpinner } from "@/checkout/ui-kit/loading-spinner";
import {
	getCheckoutPayAmountInCents,
	getCheckoutPayCurrency,
	hasCheckoutTotalLoadingMismatch,
	isCheckoutFreeOrder,
	type CheckoutPriceChangeNotice,
} from "@/checkout/lib/payment/checkout-pay-amount";
import { useCheckoutData } from "@/checkout/providers/checkout-data";
import { FreeOrderCheckout } from "./free-order-checkout";
import { StripePaymentForm, type StripeBillingContext } from "./stripe-payment-form";
import { useStripeGatewayConfig } from "./use-stripe-gateway-config";

type StripePaymentProps = {
	checkout: CheckoutFragment;
	gatewayName?: string | null;
	billing: StripeBillingContext;
	onPaymentError: (message: string) => void;
	onBillingErrors: (errors: Record<string, string>, focusField?: string) => void;
	onPriceChangeNotice: (notice: CheckoutPriceChangeNotice) => void;
};

function buildElementsOptions(checkout: CheckoutFragment): StripeElementsOptions | null {
	const amountInCents = getCheckoutPayAmountInCents(checkout);
	const currency = getCheckoutPayCurrency(checkout)?.toLowerCase();

	if (amountInCents === null || !currency) {
		return null;
	}

	return {
		mode: "payment",
		amount: amountInCents,
		currency,
		appearance: { theme: "stripe" },
	};
}

export const StripePayment: FC<StripePaymentProps> = (props) => {
	if (isCheckoutFreeOrder(props.checkout)) {
		return (
			<FreeOrderCheckout
				checkout={props.checkout}
				billing={props.billing}
				onError={props.onPaymentError}
				onBillingErrors={props.onBillingErrors}
			/>
		);
	}

	return <StripePaidPayment {...props} />;
};

const StripePaidPayment: FC<StripePaymentProps> = ({
	checkout,
	gatewayName,
	billing,
	onPaymentError,
	onBillingErrors,
	onPriceChangeNotice,
}) => {
	const { refreshCheckout } = useCheckoutData();
	const gatewayState = useStripeGatewayConfig(checkout);
	const [stripePromise, setStripePromise] = useState<Stripe | null>(null);
	const [lockedElementsOptions, setLockedElementsOptions] = useState<StripeElementsOptions | null>(null);
	const [isRefreshingTotal, setIsRefreshingTotal] = useState(false);
	const refreshedTotalForCheckoutRef = useRef<string | null>(null);

	const hasTotalMismatch = hasCheckoutTotalLoadingMismatch(checkout);
	const liveElementsOptions = buildElementsOptions(checkout);

	useEffect(() => {
		if (!hasTotalMismatch || refreshedTotalForCheckoutRef.current === checkout.id) {
			return;
		}

		refreshedTotalForCheckoutRef.current = checkout.id;
		let isMounted = true;
		// eslint-disable-next-line react-hooks/set-state-in-effect -- show loading while refreshing stale totals
		setIsRefreshingTotal(true);

		void refreshCheckout()
			.catch((error) => {
				console.error("Failed to refresh checkout total:", error);
			})
			.finally(() => {
				if (isMounted) {
					setIsRefreshingTotal(false);
				}
			});

		return () => {
			isMounted = false;
		};
	}, [checkout.id, hasTotalMismatch, refreshCheckout]);

	const handlePaymentActivityChange = useCallback(
		(active: boolean) => {
			if (active) {
				if (liveElementsOptions) {
					setLockedElementsOptions(liveElementsOptions);
				}
				return;
			}

			setLockedElementsOptions(null);
		},
		[liveElementsOptions],
	);

	useEffect(() => {
		if (gatewayState.status !== "ready") {
			// eslint-disable-next-line react-hooks/set-state-in-effect -- reset Stripe when gateway is unavailable
			setStripePromise(null);
			return;
		}

		let isMounted = true;

		void loadStripe(gatewayState.config.stripePublishableKey!)
			.then((stripe) => {
				if (!isMounted) {
					return;
				}
				setStripePromise(stripe);
			})
			.catch((error) => {
				console.error("Failed to initialize Stripe:", error);
				if (isMounted) {
					onPaymentError("Failed to initialize payment system.");
				}
			});

		return () => {
			isMounted = false;
		};
	}, [gatewayState, onPaymentError]);

	if (gatewayState.status === "loading" || (gatewayState.status === "ready" && !stripePromise)) {
		return (
			<div className="bg-muted/30 flex items-center gap-3 rounded-lg border border-border p-6 text-sm text-muted-foreground">
				<LoadingSpinner />
				Loading {gatewayName ?? "Stripe"} payment form...
			</div>
		);
	}

	if (gatewayState.status === "error") {
		return (
			<div className="border-destructive/30 bg-destructive/5 flex items-start gap-3 rounded-lg border p-4">
				<AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
				<div>
					<p className="font-medium text-destructive">Could not load Stripe</p>
					<p className="mt-1 text-sm text-muted-foreground">{gatewayState.message}</p>
				</div>
			</div>
		);
	}

	if (hasTotalMismatch || isRefreshingTotal) {
		return (
			<div className="bg-muted/30 flex items-center gap-3 rounded-lg border border-border p-6 text-sm text-muted-foreground">
				<LoadingSpinner />
				Loading order total...
			</div>
		);
	}

	const elementsOptions = lockedElementsOptions ?? liveElementsOptions;

	if (!elementsOptions) {
		return (
			<p className="text-sm text-muted-foreground">
				Checkout total is unavailable. Refresh the page and try again.
			</p>
		);
	}

	return (
		<Elements key={checkout.id} options={elementsOptions} stripe={stripePromise}>
			<StripePaymentForm
				checkout={checkout}
				billing={billing}
				onError={onPaymentError}
				onBillingErrors={onBillingErrors}
				onPriceChangeNotice={onPriceChangeNotice}
				onPaymentActivityChange={handlePaymentActivityChange}
			/>
		</Elements>
	);
};

export type { StripeBillingContext };
