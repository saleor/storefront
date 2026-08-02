"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { getCheckoutTransport } from "@/checkout/lib/checkout-transport";
import {
	clearPaymentCompleting,
	isPaymentCompletingOrphaned,
	markPaymentCompleting,
	stashPaymentCompletionError,
} from "@/checkout/lib/payment/checkout-payment-completion";
import { useCheckoutPaymentMessages } from "@/checkout/hooks/use-checkout-payment-messages";
import { isCheckoutReadyToComplete } from "@/checkout/lib/payment/checkout-payment-status";
import { finalizeCheckoutOrder } from "@/checkout/lib/payment/finalize-checkout-order";
import { rethrowNextInternalError } from "@/checkout/lib/rethrow-next-internal-error";
import { getStripeTransactionError } from "@/checkout/lib/payment/providers/stripe";
import {
	clearStripeTransactionId,
	getOrphanedStripeTransactionId,
	STRIPE_TRANSACTION_STORAGE_KEY,
} from "@/checkout/lib/payment/stripe-transaction-storage";
import { getQueryParams } from "@/checkout/lib/utils/url";
import { reportStripeReturnFailure } from "./report-stripe-return-failure";

type UseStripeReturnCompletionParams = {
	checkoutId: string;
	channelSlug?: string;
	onError: (message: string) => void;
};

/**
 * Finishes checkout after Stripe redirect (3DS, etc.) AND resumes attempts that a
 * page reload interrupted (in-modal 3DS leaves no return params in the URL).
 * Does not depend on Stripe.js — only the checkout transport.
 */
export function useStripeReturnCompletion({
	checkoutId,
	channelSlug,
	onError,
}: UseStripeReturnCompletionParams) {
	const searchParams = useSearchParams();
	const paymentMessages = useCheckoutPaymentMessages();
	const isProcessingRef = useRef(false);
	/** Dedupes effect re-runs while Next `searchParams` still reflects the pre-clear return URL. */
	const returnAttemptRef = useRef<string | null>(null);
	const resumeAttemptedRef = useRef(false);

	useEffect(() => {
		const { paymentIntent, paymentIntentClientSecret, processingPayment, transaction, redirectStatus } =
			getQueryParams(searchParams);

		if (processingPayment && paymentIntent && paymentIntentClientSecret) {
			const attemptId = `${paymentIntent}:${paymentIntentClientSecret}`;
			if (returnAttemptRef.current === attemptId) {
				return;
			}

			if (isProcessingRef.current) {
				return;
			}

			returnAttemptRef.current = attemptId;

			if (redirectStatus === "failed") {
				reportStripeReturnFailure(paymentMessages.bankDeclined, onError);
				return;
			}

			const transactionIdFromStorage = sessionStorage.getItem(STRIPE_TRANSACTION_STORAGE_KEY);
			const transactionIdFromQuery = typeof transaction === "string" ? transaction : undefined;
			const transactionId = transactionIdFromStorage ?? transactionIdFromQuery;

			if (!transactionId) {
				reportStripeReturnFailure(paymentMessages.sessionExpired, onError);
				return;
			}

			isProcessingRef.current = true;
			markPaymentCompleting(checkoutId);

			const completeAfterRedirect = async () => {
				let keepProcessingLock = false;

				try {
					const processResult = await getCheckoutTransport().processTransaction({ id: transactionId });

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
						const syncResult = await getCheckoutTransport().fetchCheckout(checkoutId);
						if (syncResult.ok) {
							resolvedChannelSlug = syncResult.checkout?.channel.slug;
						}
					}

					if (!resolvedChannelSlug) {
						reportStripeReturnFailure(paymentMessages.channelUnresolved, onError);
						return;
					}

					clearStripeTransactionId();

					const completeResult = await finalizeCheckoutOrder(checkoutId, resolvedChannelSlug);
					if (!completeResult.ok) {
						reportStripeReturnFailure(completeResult.error, onError);
						return;
					}

					// Success: hold the processing lock until navigateToOrderConfirmation unloads the page.
					keepProcessingLock = true;
				} catch (error) {
					rethrowNextInternalError(error);
					console.error("Stripe redirect completion failed:", error);
					reportStripeReturnFailure(paymentMessages.unexpectedError, onError);
				} finally {
					if (!keepProcessingLock) {
						isProcessingRef.current = false;
					}
				}
			};

			void completeAfterRedirect();
			return;
		}

		// Mid-redirect URL state without intent params — not ours to handle.
		if (processingPayment) {
			return;
		}

		// --- Resume after reload ---------------------------------------------------------
		// In-modal 3DS (`redirect: "if_required"`) never adds return params to the URL, so a
		// refresh right after the confirm kills process/finalize with no marker except
		// sessionStorage: an orphaned transaction id and/or an orphaned completing flag.
		// Without this, the pay form re-renders while Stripe holds an authorization.
		const orphanedTransactionId = getOrphanedStripeTransactionId();
		const orphanedCompleting = isPaymentCompletingOrphaned(checkoutId);

		if (!orphanedTransactionId && !orphanedCompleting) {
			return;
		}

		if (resumeAttemptedRef.current || isProcessingRef.current) {
			return;
		}

		resumeAttemptedRef.current = true;
		isProcessingRef.current = true;
		// Keeps the completing screen up (or brings it up) while we verify — the pay form
		// must not be reachable until the interrupted attempt's outcome is known.
		markPaymentCompleting(checkoutId);

		const resumeAfterReload = async () => {
			let keepProcessingLock = false;

			try {
				if (orphanedTransactionId) {
					try {
						// Sync the attempt's true outcome from Stripe into Saleor (no webhook wait).
						// Result errors are non-fatal — authorizeStatus below is the ground truth.
						await getCheckoutTransport().processTransaction({ id: orphanedTransactionId });
					} catch (error) {
						rethrowNextInternalError(error);
						console.error("Resuming interrupted payment: transaction process failed:", error);
					}
				}

				const syncResult = await getCheckoutTransport().fetchCheckout(checkoutId);
				if (!syncResult.ok || !syncResult.checkout) {
					// Cannot verify: keep the transaction id so the next load retries, exit the
					// completing screen, and warn against paying again.
					stashPaymentCompletionError(paymentMessages.verificationUnavailable);
					clearPaymentCompleting();
					onError(paymentMessages.verificationUnavailable);
					return;
				}

				if (!isCheckoutReadyToComplete(syncResult.checkout)) {
					// The interrupted attempt never produced an authorization — safe to pay fresh.
					reportStripeReturnFailure(paymentMessages.interruptedBeforeCharge, onError);
					return;
				}

				clearStripeTransactionId();

				const completeResult = await finalizeCheckoutOrder(checkoutId, syncResult.checkout.channel.slug);
				if (!completeResult.ok) {
					reportStripeReturnFailure(completeResult.error, onError);
					return;
				}

				keepProcessingLock = true;
			} catch (error) {
				rethrowNextInternalError(error);
				console.error("Resuming interrupted payment failed:", error);
				stashPaymentCompletionError(paymentMessages.verificationUnavailable);
				clearPaymentCompleting();
				onError(paymentMessages.verificationUnavailable);
			} finally {
				if (!keepProcessingLock) {
					isProcessingRef.current = false;
				}
			}
		};

		void resumeAfterReload();
	}, [channelSlug, checkoutId, onError, paymentMessages, searchParams]);
}
