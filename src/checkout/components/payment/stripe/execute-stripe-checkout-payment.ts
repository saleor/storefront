import { type ReadonlyURLSearchParams } from "next/navigation";
import { type Stripe, type StripeElements } from "@stripe/stripe-js";
import { initializeCheckoutTransaction, processCheckoutTransaction } from "@/app/(checkout)/actions";
import { type CheckoutFragment } from "@/checkout/graphql";
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
import { clearStripeTransactionId, storeStripeTransactionId } from "./use-stripe-checkout-redirect";

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
};

function stripeElementMountError(surface: StripeInitializePaymentMethodContext["surface"]): string {
	return surface === "expressCheckout"
		? "The express checkout buttons were reset before payment could be confirmed. Please try again."
		: "The payment form was reset before your card could be confirmed. Please try Pay again without refreshing the page.";
}

export async function executeStripeCheckoutPayment({
	stripe,
	elements,
	checkout,
	billing,
	searchParams,
	refreshCheckout,
	paymentMethodContext,
}: ExecuteStripeCheckoutPaymentParams): Promise<StripeCheckoutPayResult> {
	let stripePaymentConfirmed = false;
	const paymentFlowGeneration = beginCheckoutPaymentFlow();

	const failAfterStripeConfirm = (message: string): StripeCheckoutPayResult => {
		stashPaymentCompletionError(message);
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
			return { ok: false, kind: "error", message: "Could not refresh checkout totals. Please try again." };
		}

		const displayedAmount = getCheckoutPayAmount(checkout);
		const payAmount = getCheckoutPayAmount(liveCheckout);
		if (payAmount === null) {
			return {
				ok: false,
				kind: "error",
				message: "Checkout total is unavailable. Please refresh the page and try again.",
			};
		}

		const currency = getCheckoutPayCurrency(liveCheckout);
		if (!currency) {
			return {
				ok: false,
				kind: "error",
				message: "Checkout currency is unavailable. Please refresh the page and try again.",
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
					message: submitResult.error.message || "Payment validation failed",
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
				message:
					"Could not determine the selected payment method. Please choose a payment option and try again.",
			};
		}

		const initResult = await initializeCheckoutTransaction({
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
			return { ok: false, kind: "error", message: "Could not retrieve payment details. Please try again." };
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
				message: stripeElementMountError(paymentMethodContext.surface),
			};
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
			return { ok: false, kind: "error", message: formatStripePayError(confirmError) };
		}

		if (isCheckoutPaymentFlowStale(paymentFlowGeneration)) {
			return { ok: false, kind: "error", message: "Payment was interrupted. Please try again." };
		}

		// Stripe confirmed — safe to unmount Elements and show order-completion UI.
		markPaymentCompleting(liveCheckout.id);
		stripePaymentConfirmed = true;

		const processResult = await processCheckoutTransaction({ id: transactionId });
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
		const message = formatStripePayError(error);
		if (stripePaymentConfirmed) {
			stashPaymentCompletionError(message);
		}
		clearPaymentCompleting();
		return { ok: false, kind: "error", message };
	}
}
