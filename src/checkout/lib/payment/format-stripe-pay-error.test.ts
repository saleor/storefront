import { describe, expect, it } from "vitest";
import { formatStripePayError } from "./format-stripe-pay-error";

const messages = {
	formReset: "Form was reset.",
	expressReset: "Express checkout was reset.",
	failed: "Payment failed.",
	unexpectedError: "Unexpected payment error.",
	validationFailed: "Payment validation failed.",
};

describe("formatStripePayError", () => {
	it("explains unmounted Payment Element integration errors", () => {
		expect(
			formatStripePayError(
				{
					type: "IntegrationError",
					message:
						"Invalid value for stripe.confirmPayment(): elements should have a mounted Payment Element or Express Checkout Element.",
				},
				messages,
			),
		).toBe(messages.formReset);
	});

	it("uses card error message when present", () => {
		expect(
			formatStripePayError(
				{
					type: "card_error",
					message: "Your card was declined.",
				},
				messages,
			),
		).toBe("Your card was declined.");
	});
});
