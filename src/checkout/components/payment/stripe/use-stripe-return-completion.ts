"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { processCheckoutTransaction, syncCheckoutFromServer } from "@/app/(checkout)/actions";
import {
	clearPaymentCompleting,
	markPaymentCompleting,
} from "@/checkout/lib/payment/checkout-payment-completion";
import { finalizeCheckoutOrder } from "@/checkout/lib/payment/finalize-checkout-order";
import { getStripeTransactionError } from "@/checkout/lib/payment/providers/stripe";
import { getQueryParams } from "@/checkout/lib/utils/url";
import { clearStripeTransactionId, STRIPE_TRANSACTION_STORAGE_KEY } from "./use-stripe-checkout-redirect";

type UseStripeReturnCompletionParams = {
	checkoutId: string;
	channelSlug?: string;
	onError: (message: string) => void;
	onProcessingChange?: (processing: boolean) => void;
};

/**
 * Finishes checkout after Stripe redirect (3DS, etc.).
 * Does not depend on Stripe.js — only server actions.
 */
export function useStripeReturnCompletion({
	checkoutId,
	channelSlug,
	onError,
	onProcessingChange,
}: UseStripeReturnCompletionParams) {
	const searchParams = useSearchParams();
	const isProcessingRef = useRef(false);

	useEffect(() => {
		const { paymentIntent, paymentIntentClientSecret, processingPayment, transaction, redirectStatus } =
			getQueryParams(searchParams);

		if (!processingPayment || !paymentIntent || !paymentIntentClientSecret) {
			return;
		}

		if (isProcessingRef.current) {
			return;
		}

		if (redirectStatus === "failed") {
			onError("Your bank declined the payment. Please try again or use a different card.");
			return;
		}

		const transactionIdFromStorage = sessionStorage.getItem(STRIPE_TRANSACTION_STORAGE_KEY);
		const transactionIdFromQuery = typeof transaction === "string" ? transaction : undefined;
		const transactionId = transactionIdFromStorage ?? transactionIdFromQuery;

		if (!transactionId) {
			onError("Payment session expired after redirect. Please try again.");
			return;
		}

		isProcessingRef.current = true;
		markPaymentCompleting(checkoutId);
		onProcessingChange?.(true);

		const completeAfterRedirect = async () => {
			try {
				const processResult = await processCheckoutTransaction({ id: transactionId });

				if (!processResult.ok) {
					onError(processResult.error);
					clearPaymentCompleting();
					onProcessingChange?.(false);
					return;
				}

				const processError = getStripeTransactionError(processResult.data);
				if (processError) {
					onError(processError);
					clearPaymentCompleting();
					onProcessingChange?.(false);
					return;
				}

				clearStripeTransactionId();

				let resolvedChannelSlug = channelSlug;
				if (!resolvedChannelSlug) {
					const syncResult = await syncCheckoutFromServer(checkoutId);
					resolvedChannelSlug = syncResult.checkout?.channel.slug;
				}

				if (!resolvedChannelSlug) {
					onError("Could not resolve checkout channel after payment. Please contact support.");
					clearPaymentCompleting();
					onProcessingChange?.(false);
					return;
				}

				const completeResult = await finalizeCheckoutOrder(checkoutId, resolvedChannelSlug);
				if (!completeResult.ok) {
					onError(completeResult.error);
					clearPaymentCompleting();
					onProcessingChange?.(false);
				}
				// Success: keep overlay until hard navigation unloads the page.
			} catch (error) {
				console.error("Stripe redirect completion failed:", error);
				onError("An unexpected error occurred while completing your payment.");
				clearPaymentCompleting();
				onProcessingChange?.(false);
			} finally {
				isProcessingRef.current = false;
			}
		};

		void completeAfterRedirect();
	}, [channelSlug, checkoutId, onError, onProcessingChange, searchParams]);
}
