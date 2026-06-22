import { type ReadonlyURLSearchParams } from "next/navigation";
import { type Stripe, type StripeElements } from "@stripe/stripe-js";
import { type CheckoutFragment } from "@/checkout/graphql";
import { getCheckoutTransport } from "@/checkout/lib/checkout-transport";
import {
	getCheckoutPayAmount,
	getCheckoutPayCurrency,
	hasMaterialCheckoutTotalChange,
	buildCheckoutPriceChangeNotice,
	type CheckoutPriceChangeNotice,
} from "@/checkout/lib/payment/checkout-pay-amount";
import {
	beginCheckoutPaymentFlow,
	clearPaymentCompleting,
	isCheckoutPaymentFlowStale,
	markPaymentCompleting,
	stashPaymentCompletionError,
} from "@/checkout/lib/payment/checkout-payment-completion";
import { finalizeCheckoutOrder } from "@/checkout/lib/payment/finalize-checkout-order";
import { formatStripePayError } from "@/checkout/lib/payment/format-stripe-pay-error";
import {
	getStripeClientSecret,
	getStripeTransactionError,
	resolveStripePaymentMethodForInitialize,
	STRIPE_GATEWAY_ID,
	type StripeInitializePaymentMethodContext,
} from "@/checkout/lib/payment/providers/stripe";
import { updateCheckoutBilling } from "@/checkout/lib/payment/update-billing";
import { rethrowNextInternalError } from "@/checkout/lib/rethrow-next-internal-error";
import { buildStripeReturnUrl } from "./build-stripe-return-url";
import { type StripeBillingContext } from "./stripe-billing-context";
import {
	clearStripeTransactionId,
	storeStripeTransactionId,
} from "@/checkout/lib/payment/stripe-transaction-storage";
import type { CheckoutPaymentMessages } from "@/checkout/hooks/use-checkout-payment-messages";

export type StripeCheckoutPayResult =
	| { ok: true }
	| { ok: false; kind: "error"; message: string }
	| { ok: false; kind: "billing"; errors: Record<string, string>; focusField?: string }
	| { ok: false; kind: "price_change"; notice: CheckoutPriceChangeNotice };

type ExecuteStripeCheckoutPaymentParams = {
	stripe: Stripe;
	elements: StripeElements;
	checkout: CheckoutFragment;
	billing: StripeBillingContext;
	searchParams: ReadonlyURLSearchParams;
	refreshCheckout: (options?: { updateState?: boolean }) => Promise<CheckoutFragment | null>;
	paymentMethodContext: StripeInitializePaymentMethodContext;
	messages: CheckoutPaymentMessages;
};

function stripeElementMountError(
	surface: StripeInitializePaymentMethodContext["surface"],
	messages: CheckoutPaymentMessages,
): string {
	return surface === "expressCheckout" ? messages.expressReset : messages.formReset;
}

let payInFlight: Promise<StripeCheckoutPayResult> | null = null;

/**
 * Single-flight wrapper: a double click or double wallet tap must not run
 * `transactionInitialize` + `confirmPayment` twice (duplicate Saleor transactions
 * are the classic path to CHECKOUT_NOT_FULLY_PAID). Followers join the in-flight
 * attempt and receive its result.
 */
export async function executeStripeCheckoutPayment(
	params: ExecuteStripeCheckoutPaymentParams,
): Promise<StripeCheckoutPayResult> {
	if (payInFlight) {
		return payInFlight;
	}

	const run = runStripeCheckoutPayment(params);
	payInFlight = run;

	try {
		return await run;
	} finally {
		if (payInFlight === run) {
			payInFlight = null;
		}
	}
}

/**
 * The shopper aborted (browser Back) after Stripe already authorized the payment.
 * "Try again" here is the double-authorization path — instead, sync the existing
 * transaction into Saleor right away (no webhook wait) and refresh the snapshot so
 * authorizeStatus FULL hides the pay form and surfaces the "Complete order" banner.
 * transactionProcess only records the PaymentIntent outcome; it never moves money.
 */
async function reconcileInterruptedAuthorizedPayment({
	transactionId,
	refreshCheckout,
	messages,
}: {
	transactionId: string;
	refreshCheckout: ExecuteStripeCheckoutPaymentParams["refreshCheckout"];
	messages: CheckoutPaymentMessages;
}): Promise<StripeCheckoutPayResult> {
	try {
		const processResult = await getCheckoutTransport().processTransaction({ id: transactionId });
		const processError = processResult.ok
			? getStripeTransactionError(processResult.data)
			: processResult.error;

		if (!processError) {
			clearStripeTransactionId();
		}

		await refreshCheckout();
	} catch (error) {
		rethrowNextInternalError(error);
		// Saleor will still reconcile via webhook; the message below keeps the shopper safe meanwhile.
		console.error("Failed to sync interrupted authorized payment:", error);
	}

	stashPaymentCompletionError(messages.interruptedAfterAuthorize);
	return { ok: false, kind: "error", message: messages.interruptedAfterAuthorize };
}

async function runStripeCheckoutPayment({
	stripe,
	elements,
	checkout,
	billing,
	searchParams,
	refreshCheckout,
	paymentMethodContext,
	messages,
}: ExecuteStripeCheckoutPaymentParams): Promise<StripeCheckoutPayResult> {
	let stripePaymentConfirmed = false;
	const paymentFlowGeneration = beginCheckoutPaymentFlow();

	const failAfterStripeConfirm = async (message: string): Promise<StripeCheckoutPayResult> => {
		stashPaymentCompletionError(message);

		// Pull the live authorize status before the payment step re-renders: once the
		// transaction is processed the pay form must stay hidden (recovery banner instead).
		try {
			await refreshCheckout();
		} catch (error) {
			rethrowNextInternalError(error);
			console.error("Failed to refresh checkout after payment error:", error);
		}

		clearPaymentCompleting();
		return { ok: false, kind: "error", message };
	};

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
			return {
				ok: false,
				kind: "billing",
				errors: billingResult.errors,
				focusField: billingResult.focusField,
			};
		}

		const liveCheckout = await refreshCheckout({ updateState: false });
		if (!liveCheckout) {
			return { ok: false, kind: "error", message: messages.totalsRefreshFailed };
		}

		const displayedAmount = getCheckoutPayAmount(checkout);
		const payAmount = getCheckoutPayAmount(liveCheckout);
		if (payAmount === null) {
			return {
				ok: false,
				kind: "error",
				message: messages.totalUnavailable,
			};
		}

		const currency = getCheckoutPayCurrency(liveCheckout);
		if (!currency) {
			return {
				ok: false,
				kind: "error",
				message: messages.currencyUnavailable,
			};
		}

		if (displayedAmount !== null && hasMaterialCheckoutTotalChange(displayedAmount, payAmount)) {
			return {
				ok: false,
				kind: "price_change",
				notice: buildCheckoutPriceChangeNotice(displayedAmount, payAmount, currency),
			};
		}

		let methodContext = paymentMethodContext;

		if (paymentMethodContext.surface === "paymentElement") {
			const submitResult = await elements.submit();
			if (submitResult.error) {
				return {
					ok: false,
					kind: "error",
					message: submitResult.error.message || messages.validationFailed,
				};
			}

			methodContext = {
				surface: "paymentElement",
				changeType: paymentMethodContext.changeType,
				submitType: "selectedPaymentMethod" in submitResult ? submitResult.selectedPaymentMethod : null,
			};
		}

		const resolvedPaymentMethod = resolveStripePaymentMethodForInitialize(methodContext);

		if (!resolvedPaymentMethod) {
			return {
				ok: false,
				kind: "error",
				message: messages.methodRequired,
			};
		}

		// Browser Back / abandoned wallet sheet bumps the flow generation — stop before
		// creating a Saleor transaction the shopper no longer expects.
		if (isCheckoutPaymentFlowStale(paymentFlowGeneration)) {
			return { ok: false, kind: "error", message: messages.interruptedBeforeCharge };
		}

		const initResult = await getCheckoutTransport().initializeTransaction({
			checkoutId: liveCheckout.id,
			amount: payAmount,
			paymentGateway: {
				id: STRIPE_GATEWAY_ID,
				data: {
					paymentIntent: {
						paymentMethod: resolvedPaymentMethod,
					},
				},
			},
		});

		if (!initResult.ok) {
			return { ok: false, kind: "error", message: initResult.error };
		}

		const transactionError = getStripeTransactionError(initResult.data);
		if (transactionError) {
			return { ok: false, kind: "error", message: transactionError };
		}

		const clientSecret = getStripeClientSecret(initResult.data.data);
		const transactionId = initResult.data.transaction?.id;

		if (!clientSecret || !transactionId) {
			return { ok: false, kind: "error", message: messages.detailsUnavailable };
		}

		storeStripeTransactionId(transactionId);
		const returnUrl = buildStripeReturnUrl(searchParams, transactionId);

		const stripeElementMounted =
			paymentMethodContext.surface === "expressCheckout"
				? elements.getElement("expressCheckout")
				: elements.getElement("payment");

		if (!stripeElementMounted) {
			return {
				ok: false,
				kind: "error",
				message: stripeElementMountError(paymentMethodContext.surface, messages),
			};
		}

		// Last abort point before money moves — confirmPayment authorizes the charge.
		if (isCheckoutPaymentFlowStale(paymentFlowGeneration)) {
			return { ok: false, kind: "error", message: messages.interruptedBeforeCharge };
		}

		const billingAddress = liveCheckout.billingAddress;

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
			redirect: "if_required",
		});

		if (confirmError) {
			return { ok: false, kind: "error", message: formatStripePayError(confirmError, messages) };
		}

		if (isCheckoutPaymentFlowStale(paymentFlowGeneration)) {
			// Aborted after authorization — never suggest retrying; reconcile instead.
			return reconcileInterruptedAuthorizedPayment({ transactionId, refreshCheckout, messages });
		}

		// Stripe confirmed — safe to unmount Elements and show order-completion UI.
		markPaymentCompleting(liveCheckout.id);
		stripePaymentConfirmed = true;

		const processResult = await getCheckoutTransport().processTransaction({ id: transactionId });
		if (!processResult.ok) {
			return failAfterStripeConfirm(processResult.error);
		}

		const processError = getStripeTransactionError(processResult.data);
		if (processError) {
			return failAfterStripeConfirm(processError);
		}

		clearStripeTransactionId();

		const refreshed = await refreshCheckout({ updateState: false });
		const checkoutToComplete = refreshed ?? liveCheckout;

		const completeResult = await finalizeCheckoutOrder(
			checkoutToComplete.id,
			checkoutToComplete.channel.slug,
		);
		if (!completeResult.ok) {
			return failAfterStripeConfirm(completeResult.error);
		}

		return { ok: true };
	} catch (error) {
		rethrowNextInternalError(error);
		console.error("Stripe payment failed:", error);
		// Post-confirm failures must never read as "retry" — the authorization exists.
		const message = stripePaymentConfirmed
			? messages.interruptedAfterAuthorize
			: formatStripePayError(error, messages);
		if (stripePaymentConfirmed) {
			stashPaymentCompletionError(message);
		}
		clearPaymentCompleting();
		return { ok: false, kind: "error", message };
	}
}
