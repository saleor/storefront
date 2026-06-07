"use client";

import { useState, type FC } from "react";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { type StripePaymentElementOptions } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";
import { initializeCheckoutTransaction, processCheckoutTransaction } from "@/app/(checkout)/actions";
import { type AddressFragment, type CheckoutFragment } from "@/checkout/graphql";
import { type BillingAddressData } from "@/checkout/components/payment";
import { LoadingSpinner } from "@/checkout/ui-kit/loading-spinner";
import { Button } from "@/ui/components/ui/button";
import {
	getCheckoutPayAmount,
	getCheckoutPayCurrency,
	hasMaterialCheckoutTotalChange,
	buildCheckoutPriceChangeNotice,
} from "@/checkout/lib/payment/checkout-pay-amount";
import { updateCheckoutBilling } from "@/checkout/lib/payment/update-billing";
import {
	getStripeClientSecret,
	getStripeTransactionError,
	STRIPE_GATEWAY_ID,
} from "@/checkout/lib/payment/providers/stripe";
import { clearPaymentCompleting } from "@/checkout/lib/payment/checkout-payment-completion";
import { finalizeCheckoutOrder } from "@/checkout/lib/payment/finalize-checkout-order";
import { formatStripePayError } from "@/checkout/lib/payment/format-stripe-pay-error";
import { rethrowNextInternalError } from "@/checkout/lib/rethrow-next-internal-error";
import { useCheckoutData } from "@/checkout/providers/checkout-data";
import { formatMoneyWithFallback } from "@/checkout/lib/utils/money";
import { buildStripeReturnUrl } from "./build-stripe-return-url";
import { clearStripeTransactionId, storeStripeTransactionId } from "./use-stripe-checkout-redirect";

const paymentElementOptions: StripePaymentElementOptions = {
	layout: "tabs",
};

export type StripeBillingContext = {
	billingData: BillingAddressData;
	sameAsBilling: boolean;
	hasShippingAddress: boolean;
	shippingAddress: AddressFragment | null | undefined;
	userAddresses: ReadonlyArray<AddressFragment> | undefined;
	authenticated: boolean;
};

type StripePaymentFormProps = {
	checkout: CheckoutFragment;
	billing: StripeBillingContext;
	onError: (message: string) => void;
	onBillingErrors: (errors: Record<string, string>, focusField?: string) => void;
	onPriceChangeNotice: (notice: ReturnType<typeof buildCheckoutPriceChangeNotice>) => void;
	onPaymentActivityChange?: (active: boolean) => void;
};

export const StripePaymentForm: FC<StripePaymentFormProps> = ({
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
	const { refreshCheckout } = useCheckoutData();
	const [isLoading, setIsLoading] = useState(false);

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

			// Do not update checkout context here — remounting Elements breaks confirmPayment.
			const liveCheckout = await refreshCheckout({ updateState: false });
			if (!liveCheckout) {
				onError("Could not refresh checkout totals. Please try again.");
				return;
			}

			const displayedAmount = getCheckoutPayAmount(checkout);
			const payAmount = getCheckoutPayAmount(liveCheckout);
			if (payAmount === null) {
				onError("Checkout total is unavailable. Please refresh the page and try again.");
				return;
			}

			const currency = getCheckoutPayCurrency(liveCheckout);
			if (!currency) {
				onError("Checkout currency is unavailable. Please refresh the page and try again.");
				return;
			}

			if (displayedAmount !== null && hasMaterialCheckoutTotalChange(displayedAmount, payAmount)) {
				onPriceChangeNotice(buildCheckoutPriceChangeNotice(displayedAmount, payAmount, currency));
				return;
			}

			const submitResult = await elements.submit();
			if (submitResult.error) {
				onError(submitResult.error.message || "Payment validation failed");
				return;
			}

			const selectedPaymentMethod = (submitResult as { selectedPaymentMethod?: string })
				.selectedPaymentMethod;

			// Initialize + confirm back-to-back while PaymentElement is still mounted.
			const initResult = await initializeCheckoutTransaction({
				checkoutId: liveCheckout.id,
				amount: payAmount,
				paymentGateway: {
					id: STRIPE_GATEWAY_ID,
					data: {
						paymentIntent: {
							paymentMethod: selectedPaymentMethod,
						},
					},
				},
			});

			if (!initResult.ok) {
				onError(initResult.error);
				return;
			}

			const transactionError = getStripeTransactionError(initResult.data);
			if (transactionError) {
				onError(transactionError);
				return;
			}

			const clientSecret = getStripeClientSecret(initResult.data.data);
			const transactionId = initResult.data.transaction?.id;

			if (!clientSecret || !transactionId) {
				onError("Could not retrieve payment details. Please try again.");
				return;
			}

			storeStripeTransactionId(transactionId);
			const returnUrl = buildStripeReturnUrl(searchParams, transactionId);

			const billingAddress = liveCheckout.billingAddress;

			if (!elements.getElement("payment")) {
				onError(
					"The payment form was reset before your card could be confirmed. Please try Pay again without refreshing the page.",
				);
				return;
			}

			const { error: confirmError } = await stripe.confirmPayment({
				elements,
				clientSecret,
				confirmParams: {
					return_url: returnUrl,
					payment_method_data: {
						billing_details: {
							name: `${billingAddress?.firstName ?? ""} ${billingAddress?.lastName ?? ""}`.trim(),
							email: liveCheckout.email || "",
							phone: billingAddress?.phone || "",
							address: {
								city: billingAddress?.city || "",
								country: billingAddress?.country?.code || "",
								line1: billingAddress?.streetAddress1 || "",
								line2: billingAddress?.streetAddress2 || "",
								postal_code: billingAddress?.postalCode || "",
								state: billingAddress?.countryArea || "",
							},
						},
					},
				},
			});

			if (confirmError) {
				onError(formatStripePayError(confirmError));
				return;
			}

			const processResult = await processCheckoutTransaction({ id: transactionId });
			if (!processResult.ok) {
				onError(processResult.error);
				return;
			}

			const processError = getStripeTransactionError(processResult.data);
			if (processError) {
				onError(processError);
				return;
			}

			clearStripeTransactionId();

			// Saleor may need a moment to update authorizeStatus — still attempt checkoutComplete.
			const refreshed = await refreshCheckout({ updateState: false });
			const checkoutToComplete = refreshed ?? liveCheckout;

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
			rethrowNextInternalError(error);
			console.error("Stripe payment failed:", error);
			onError(formatStripePayError(error));
		} finally {
			if (!orderPlaced) {
				clearPaymentCompleting();
				setIsLoading(false);
				onPaymentActivityChange?.(false);
			}
		}
	};

	return (
		<div className="space-y-6">
			<PaymentElement options={paymentElementOptions} />
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
	);
};
