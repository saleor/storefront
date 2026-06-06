import { describe, expect, it } from "vitest";
import { formatStripePayError } from "./format-stripe-pay-error";

describe("formatStripePayError", () => {
	it("explains unmounted Payment Element integration errors", () => {
		expect(
			formatStripePayError({
				type: "IntegrationError",
				message:
					"Invalid value for stripe.confirmPayment(): elements should have a mounted Payment Element or Express Checkout Element.",
			}),
		).toMatch(/payment form was reset/i);
	});

	it("uses card error message when present", () => {
		expect(
			formatStripePayError({
				type: "card_error",
				message: "Your card was declined.",
			}),
		).toBe("Your card was declined.");
	});
});
