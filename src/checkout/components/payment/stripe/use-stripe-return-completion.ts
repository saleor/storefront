"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { processCheckoutTransaction, syncCheckoutFromServer } from "@/app/(checkout)/actions";
import { markPaymentCompleting } from "@/checkout/lib/payment/checkout-payment-completion";
import { finalizeCheckoutOrder } from "@/checkout/lib/payment/finalize-checkout-order";
import { rethrowNextInternalError } from "@/checkout/lib/rethrow-next-internal-error";
import { getStripeTransactionError } from "@/checkout/lib/payment/providers/stripe";
import { getQueryParams } from "@/checkout/lib/utils/url";
import { reportStripeReturnFailure } from "./report-stripe-return-failure";
import { clearStripeTransactionId, STRIPE_TRANSACTION_STORAGE_KEY } from "./use-stripe-checkout-redirect";

type UseStripeReturnCompletionParams = {
	checkoutId: string;
	channelSlug?: string;
	onError: (message: string) => void;
};

/**
 * Finishes checkout after Stripe redirect (3DS, etc.).
 * Does not depend on Stripe.js — only server actions.
 */
export function useStripeReturnCompletion({
	checkoutId,
	channelSlug,
	onError,
}: UseStripeReturnCompletionParams) {
	const searchParams = useSearchParams();
	const isProcessingRef = useRef(false);
	/** Dedupes effect re-runs while Next `searchParams` still reflects the pre-clear return URL. */
	const returnAttemptRef = useRef<string | null>(null);

	useEffect(() => {
		const { paymentIntent, paymentIntentClientSecret, processingPayment, transaction, redirectStatus } =
			getQueryParams(searchParams);

		if (!processingPayment || !paymentIntent || !paymentIntentClientSecret) {
			return;
		}

		const attemptId = `${paymentIntent}:${paymentIntentClientSecret}`;
		if (returnAttemptRef.current === attemptId) {
			return;
		}

		if (isProcessingRef.current) {
			return;
		}

		returnAttemptRef.current = attemptId;

		if (redirectStatus === "failed") {
			reportStripeReturnFailure(
				"Your bank declined the payment. Please try again or use a different card.",
				onError,
			);
			return;
		}

		const transactionIdFromStorage = sessionStorage.getItem(STRIPE_TRANSACTION_STORAGE_KEY);
		const transactionIdFromQuery = typeof transaction === "string" ? transaction : undefined;
		const transactionId = transactionIdFromStorage ?? transactionIdFromQuery;

		if (!transactionId) {
			reportStripeReturnFailure("Payment session expired after redirect. Please try again.", onError);
			return;
		}

		isProcessingRef.current = true;
		markPaymentCompleting(checkoutId);

		const completeAfterRedirect = async () => {
			let keepProcessingLock = false;

			try {
				const processResult = await processCheckoutTransaction({ id: transactionId });

				if (!processResult.ok) {
					reportStripeReturnFailure(processResult.error, onError);
					return;
				}

				const processError = getStripeTransactionError(processResult.data);
				if (processError) {
					reportStripeReturnFailure(processError, onError);
					return;
				}

				let resolvedChannelSlug = channelSlug;
				if (!resolvedChannelSlug) {
					const syncResult = await syncCheckoutFromServer(checkoutId);
					resolvedChannelSlug = syncResult.checkout?.channel.slug;
				}

				if (!resolvedChannelSlug) {
					reportStripeReturnFailure(
						"Could not resolve checkout channel after payment. Please contact support.",
						onError,
					);
					return;
				}

				clearStripeTransactionId();

				const completeResult = await finalizeCheckoutOrder(checkoutId, resolvedChannelSlug);
				if (!completeResult.ok) {
					reportStripeReturnFailure(completeResult.error, onError);
					return;
				}

				// Success: hold the processing lock until hard navigation unloads the page.
				keepProcessingLock = true;
			} catch (error) {
				rethrowNextInternalError(error);
				console.error("Stripe redirect completion failed:", error);
				reportStripeReturnFailure("An unexpected error occurred while completing your payment.", onError);
			} finally {
				if (!keepProcessingLock) {
					isProcessingRef.current = false;
				}
			}
		};

		void completeAfterRedirect();
	}, [channelSlug, checkoutId, onError, searchParams]);
}
