// Copied from https://stripe.com/docs/payments/quickstart
/* eslint-disable */
// @ts-nocheck
import { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

export default function CheckoutForm({ returnUrl }: { returnUrl: string }) {
	const stripe = useStripe();
	const elements = useElements();

	const [message, setMessage] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!stripe || !elements) {
			// Stripe.js hasn't yet loaded.
			// Make sure to disable form submission until Stripe.js has loaded.
			return;
		}

		setIsLoading(true);

		const { error } = await stripe.confirmPayment({
			elements,
			confirmParams: {
				// Make sure to change this to your payment completion page
				return_url: returnUrl,
			},
		});

		// This point will only be reached if there is an immediate error when
		// confirming the payment. Otherwise, your customer will be redirected to
		// your `return_url`. For some payment methods like iDEAL, your customer will
		// be redirected to an intermediate site first to authorize the payment, then
		// redirected to the `return_url`.
		if (error.type === "card_error" || error.type === "validation_error") {
			setMessage(error.message);
		} else {
			setMessage("An unexpected error occurred.");
		}

		setIsLoading(false);
	};

	const paymentElementOptions = {
		layout: "tabs",
	};

	return (
		<div className="stripe">
			<form className="payment-form" onSubmit={handleSubmit}>
				<PaymentElement className="payment-element" options={paymentElementOptions} />
				<button disabled={isLoading || !stripe || !elements} id="submit">
					<span className="button-text">{isLoading ? <div className="spinner" /> : "Pay now"}</span>
				</button>
				{/* Show any error or success messages */}
				{message && <div className="payment-message">{message}</div>}
			</form>
		</div>
	);
}
