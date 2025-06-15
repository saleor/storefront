import { type FormEventHandler, useEffect, useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { type StripePaymentElementOptions } from "@stripe/stripe-js";
import { getUrlForTransactionInitialize } from "../utils";
import { usePaymentProcessingScreen } from "../PaymentProcessingScreen";
import {
	useCheckoutValidationActions,
	useCheckoutValidationState,
	anyFormsValidating,
	areAllFormsValid,
} from "@/checkout/state/checkoutValidationStateStore";
import {
	useCheckoutUpdateState,
	useCheckoutUpdateStateActions,
	areAnyRequestsInProgress,
	hasFinishedApiChangesWithNoError,
} from "@/checkout/state/updateStateStore";
import { useEvent } from "@/checkout/hooks/useEvent";
import { useUser } from "@/checkout/hooks/useUser";
import { useAlerts } from "@/checkout/hooks/useAlerts";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { useCheckoutComplete } from "@/checkout/hooks/useCheckoutComplete";
import { getQueryParams } from "@/checkout/lib/utils/url";

const paymentElementOptions: StripePaymentElementOptions = {
	layout: "tabs",
	fields: {
		billingDetails: "never",
	},
};

export function CheckoutForm() {
	const [isLoading, setIsLoading] = useState(false);
	const stripe = useStripe();
	const elements = useElements();
	const { checkout } = useCheckout();

	const { authenticated } = useUser();
	const { showCustomErrors } = useAlerts();

	const checkoutUpdateState = useCheckoutUpdateState();
	const anyRequestsInProgress = areAnyRequestsInProgress(checkoutUpdateState);
	const finishedApiChangesWithNoError = hasFinishedApiChangesWithNoError(checkoutUpdateState);
	const { setSubmitInProgress, setShouldRegisterUser } = useCheckoutUpdateStateActions();
	const { validateAllForms } = useCheckoutValidationActions();
	const { validationState } = useCheckoutValidationState();

	const { setIsProcessingPayment } = usePaymentProcessingScreen();
	const { onCheckoutComplete, completingCheckout } = useCheckoutComplete();

	// handler for when user presses submit
	const onSubmitInitialize: FormEventHandler<HTMLFormElement> = useEvent(async (e) => {
		e.preventDefault();

		setIsLoading(true);
		validateAllForms(authenticated);
		setShouldRegisterUser(true);
		setSubmitInProgress(true);
	});

	// handle when page is opened from previously redirected payment
	useEffect(() => {
		const { paymentIntent, paymentIntentClientSecret, processingPayment } = getQueryParams();

		if (!paymentIntent || !paymentIntentClientSecret || !processingPayment) {
			return;
		}

		if (!completingCheckout) {
			void onCheckoutComplete();
		}
	}, [completingCheckout, onCheckoutComplete]);

	// when submission is initialized, awaits for all the other requests to finish,
	// forms to validate, then either does transaction initialize or process
	useEffect(() => {
		const validating = anyFormsValidating(validationState);
		const allFormsValid = areAllFormsValid(validationState);

		if (!checkoutUpdateState.submitInProgress || validating || anyRequestsInProgress) {
			return;
		}
		if (!stripe || !elements) {
			// Stripe.js hasn't yet loaded.
			// Make sure to disable form submission until Stripe.js has loaded.
			return;
		}

		// submit was finished - we can mark it as complete
		setSubmitInProgress(false);

		// there was en error either in some other request or form validation
		// - stop the submission altogether
		if (!finishedApiChangesWithNoError || !allFormsValid) {
			setIsLoading(false);
			return;
		}

		setIsLoading(true);

		stripe
			.confirmPayment({
				elements,
				confirmParams: {
					return_url: getUrlForTransactionInitialize().newUrl,
					payment_method_data: {
						billing_details: {
							name: checkout.billingAddress?.firstName + " " + checkout.billingAddress?.lastName,
							email: checkout.email ?? "",
							phone: checkout.billingAddress?.phone ?? "",
							address: {
								city: checkout.billingAddress?.city ?? "",
								country: checkout.billingAddress?.country.code ?? "",
								line1: checkout.billingAddress?.streetAddress1 ?? "",
								line2: checkout.billingAddress?.streetAddress2 ?? "",
								postal_code: checkout.billingAddress?.postalCode ?? "",
								state: checkout.billingAddress?.countryArea ?? "",
							},
						},
					},
				},
			})
			.then(async ({ error }) => {
				console.error(error);
				setIsLoading(false);

				if (error) {
					setIsProcessingPayment(false);
					// This point will only be reached if there is an immediate error when
					// confirming the payment. Otherwise, your customer will be redirected to
					// your `return_url`. For some payment methods like iDEAL, your customer will
					// be redirected to an intermediate site first to authorize the payment, then
					// redirected to the `return_url`.
					if (error.type === "card_error" || error.type === "validation_error") {
						showCustomErrors([{ message: error.message ?? "Something went wrong" }]);
					} else {
						showCustomErrors([{ message: "An unexpected error occurred." }]);
					}
					return;
				}

				return onCheckoutComplete();
			})
			.catch((err) => {
				console.error(err);
				setIsLoading(false);
				setIsProcessingPayment(false);
			});

		// @todo
		// there is a previous transaction going on, we want to process instead of initialize
		// if (currentTransactionId) {
		// 	void onTransactionProccess({
		// 		data: adyenCheckoutSubmitParams?.state.data,
		// 		id: currentTransactionId,
		// 	});
		// 	return;
		// }
	}, [
		anyRequestsInProgress,
		checkout.billingAddress?.city,
		checkout.billingAddress?.country.code,
		checkout.billingAddress?.countryArea,
		checkout.billingAddress?.firstName,
		checkout.billingAddress?.lastName,
		checkout.billingAddress?.phone,
		checkout.billingAddress?.postalCode,
		checkout.billingAddress?.streetAddress1,
		checkout.billingAddress?.streetAddress2,
		checkout.email,
		checkoutUpdateState.submitInProgress,
		elements,
		finishedApiChangesWithNoError,
		onCheckoutComplete,
		setIsProcessingPayment,
		setSubmitInProgress,
		showCustomErrors,
		stripe,
		validationState,
	]);

	return (
		<form className="my-8 flex flex-col gap-y-6" onSubmit={onSubmitInitialize}>
			<PaymentElement className="payment-element" options={paymentElementOptions} />
			<button
				className="h-12 items-center rounded-md bg-neutral-900 px-6 py-3 text-base font-medium leading-6 text-white shadow hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70 hover:disabled:bg-neutral-700 aria-disabled:cursor-not-allowed aria-disabled:opacity-70 hover:aria-disabled:bg-neutral-700"
				aria-disabled={isLoading || !stripe || !elements}
				id="submit"
			>
				<span className="button-text">{isLoading ? <Loader /> : "Pay now"}</span>
			</button>
		</form>
	);
}

function Loader() {
	return (
		<div className="text-center" aria-busy="true" role="status">
			<div>
				<svg
					aria-hidden="true"
					className="mr-2 inline h-6 w-6 animate-spin fill-neutral-600 text-neutral-100 dark:text-neutral-600"
					viewBox="0 0 100 101"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
						fill="currentColor"
					/>
					<path
						d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
						fill="currentFill"
					/>
				</svg>
				<span className="sr-only">Loading...</span>
			</div>
		</div>
	);
}
