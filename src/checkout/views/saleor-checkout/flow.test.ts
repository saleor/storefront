import { describe, expect, it } from "vitest";
import { getCurrentStepFromParams } from "./flow";

describe("getCurrentStepFromParams", () => {
	it("stays on payment when returning from Stripe redirect", () => {
		const params = new URLSearchParams("checkout=abc&processingPayment=true&payment_intent=pi_123");

		expect(getCurrentStepFromParams(params, true).id).toBe("PAYMENT");
	});

	it("defaults to contact when step is missing", () => {
		const params = new URLSearchParams("checkout=abc");

		expect(getCurrentStepFromParams(params, true).id).toBe("INFO");
	});
});
