"use client";

import { useCallback, useState } from "react";
import { type AddressFragment, type CheckoutFragment } from "@/checkout/graphql";
import { type BillingAddressData } from "@/checkout/components/payment";
import {
	canSubmitPayment,
	executePayment,
	resolvePaymentProvider,
	updateCheckoutBilling,
	type ResolvedPaymentProvider,
} from "@/checkout/lib/payment";
import {
	buildCheckoutPriceChangeNotice,
	getCheckoutPayAmount,
	getCheckoutPayCurrency,
	hasMaterialCheckoutTotalChange,
	type CheckoutPriceChangeNotice,
} from "@/checkout/lib/payment/checkout-pay-amount";
import { useCheckoutData } from "@/checkout/providers/checkout-data";
import {
	clearPaymentCompleting,
	markPaymentCompleting,
	stashPaymentCompletionError,
} from "@/checkout/lib/payment/checkout-payment-completion";
import { navigateToOrderConfirmation } from "@/checkout/lib/payment/navigate-to-order";
import { useCheckoutGatewayMessages } from "@/checkout/hooks/use-checkout-gateway-messages";
import { useCheckoutPaymentMessages } from "@/checkout/hooks/use-checkout-payment-messages";

type UseCheckoutPaymentParams = {
	checkout: CheckoutFragment;
	billingData: BillingAddressData;
	sameAsBilling: boolean;
	hasShippingAddress: boolean;
	shippingAddress: AddressFragment | null | undefined;
	userAddresses: ReadonlyArray<AddressFragment> | undefined;
	authenticated: boolean;
};

export function useCheckoutPayment({
	checkout,
	billingData,
	sameAsBilling,
	hasShippingAddress,
	shippingAddress,
	userAddresses,
	authenticated,
}: UseCheckoutPaymentParams) {
	const { refreshCheckout } = useCheckoutData();
	const paymentMessages = useCheckoutPaymentMessages();
	const gatewayMessages = useCheckoutGatewayMessages();

	const [isProcessing, setIsProcessing] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [priceChangeNotice, setPriceChangeNotice] = useState<CheckoutPriceChangeNotice | null>(null);

	const setPaymentError = useCallback((message: string) => {
		setErrors((current) => {
			if (!message) {
				const { payment: _payment, ...rest } = current;
				return rest;
			}
			return { ...current, payment: message };
		});
	}, []);

	const setBillingErrors = useCallback((fieldErrors: Record<string, string>, focusField?: string) => {
		setErrors(fieldErrors);
		if (focusField) {
			const element = document.querySelector(`[name="${focusField}"]`) as HTMLElement;
			element?.focus();
		}
	}, []);

	const setPriceChangeNoticeState = useCallback((notice: CheckoutPriceChangeNotice) => {
		setPriceChangeNotice(notice);
	}, []);

	const provider: ResolvedPaymentProvider = resolvePaymentProvider(checkout.availablePaymentGateways);

	const submit = useCallback(
		async (event?: React.FormEvent) => {
			if (event) {
				event.preventDefault();
			}

			setErrors({});
			setIsProcessing(true);
			let orderPlaced = false;

			const displayedAmount = getCheckoutPayAmount(checkout);

			try {
				const billingResult = await updateCheckoutBilling({
					checkoutId: checkout.id,
					sameAsBilling,
					hasShippingAddress,
					billingData,
					shippingAddress,
					userAddresses,
					authenticated,
				});

				if (!billingResult.ok) {
					setErrors(billingResult.errors);
					if (billingResult.focusField) {
						const element = document.querySelector(`[name="${billingResult.focusField}"]`) as HTMLElement;
						element?.focus();
					}
					return;
				}

				const liveCheckout = await refreshCheckout();
				if (!liveCheckout) {
					setErrors({
						payment: paymentMessages.totalsRefreshFailed,
					});
					return;
				}

				const payAmount = getCheckoutPayAmount(liveCheckout);
				if (payAmount === null) {
					setErrors({
						payment: paymentMessages.totalUnavailable,
					});
					return;
				}

				const currency = getCheckoutPayCurrency(liveCheckout);
				if (!currency) {
					setErrors({
						payment: paymentMessages.currencyUnavailable,
					});
					return;
				}

				if (displayedAmount !== null && hasMaterialCheckoutTotalChange(displayedAmount, payAmount)) {
					setPriceChangeNotice(buildCheckoutPriceChangeNotice(displayedAmount, payAmount, currency));
					return;
				}

				setPriceChangeNotice(null);
				markPaymentCompleting(liveCheckout.id);

				const payResult = await executePayment(
					provider,
					{
						checkoutId: liveCheckout.id,
						amount: payAmount,
					},
					gatewayMessages,
				);

				if (!payResult.ok) {
					const nextErrors: Record<string, string> = {};
					if (payResult.errorKey) {
						nextErrors[payResult.errorKey] = payResult.error;
					}
					if (payResult.fieldErrors) {
						Object.assign(nextErrors, payResult.fieldErrors);
					}
					if (!payResult.errorKey && !payResult.fieldErrors) {
						nextErrors.payment = payResult.error;
					}
					const paymentMessage = nextErrors.payment;
					if (paymentMessage) {
						stashPaymentCompletionError(paymentMessage);
					}
					setErrors(nextErrors);
					return;
				}

				orderPlaced = true;
				navigateToOrderConfirmation(payResult.orderId);
			} finally {
				setIsProcessing(false);
				if (!orderPlaced) {
					clearPaymentCompleting();
				}
			}
		},
		[
			checkout.id,
			checkout.channel.slug,
			sameAsBilling,
			hasShippingAddress,
			billingData,
			shippingAddress,
			userAddresses,
			authenticated,
			provider,
			refreshCheckout,
			paymentMessages,
			gatewayMessages,
		],
	);

	return {
		submit,
		errors,
		setPaymentError,
		setBillingErrors,
		setPriceChangeNotice: setPriceChangeNoticeState,
		priceChangeNotice,
		provider,
		canSubmit: canSubmitPayment(provider),
		isProcessing,
		isPaymentProcessing: isProcessing,
		isCompletingOrder: isProcessing,
		isLoading: isProcessing,
	};
}
