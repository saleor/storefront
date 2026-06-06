"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { type AddressFragment, type CheckoutFragment } from "@/checkout/graphql";
import { type BillingAddressData } from "@/checkout/components/payment";
import {
	canSubmitPayment,
	executePayment,
	resolvePaymentProvider,
	updateCheckoutBilling,
	type ResolvedPaymentProvider,
} from "@/checkout/lib/payment";
import { clearCheckout } from "@/app/actions";
import { getCheckoutPayAmount } from "@/checkout/lib/payment/checkout-pay-amount";
import { useCheckoutData } from "@/checkout/providers/checkout-data";
import { createQueryString } from "@/checkout/lib/utils/url";

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
	const router = useRouter();
	const searchParams = useSearchParams();
	const { refreshCheckout } = useCheckoutData();

	const [isProcessing, setIsProcessing] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const provider: ResolvedPaymentProvider = resolvePaymentProvider(checkout.availablePaymentGateways);

	const submit = useCallback(
		async (event?: React.FormEvent) => {
			if (event) {
				event.preventDefault();
			}

			setErrors({});
			setIsProcessing(true);

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
						payment: "Could not refresh checkout totals. Please try again.",
					});
					return;
				}

				const payAmount = getCheckoutPayAmount(liveCheckout);
				if (payAmount === null) {
					setErrors({
						payment: "Checkout total is unavailable. Please refresh the page and try again.",
					});
					return;
				}

				const payResult = await executePayment(provider, {
					checkoutId: liveCheckout.id,
					amount: payAmount,
				});

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
					setErrors(nextErrors);
					return;
				}

				const newQuery = createQueryString(searchParams, {
					orderId: payResult.orderId,
					checkoutId: null,
				});
				router.replace(`?${newQuery}`, { scroll: false });
				void clearCheckout(checkout.channel.slug);
			} finally {
				setIsProcessing(false);
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
			searchParams,
			router,
		],
	);

	return {
		submit,
		errors,
		provider,
		canSubmit: canSubmitPayment(provider),
		isProcessing,
		isPaymentProcessing: isProcessing,
		isCompletingOrder: isProcessing,
		isLoading: isProcessing,
	};
}
