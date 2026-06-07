import { describe, expect, it } from "vitest";

import { buildCheckoutQueryUrl } from "./checkout-search-params";

describe("buildCheckoutQueryUrl", () => {
	it("merges step into the live URL without dropping Stripe return params", () => {
		const url = buildCheckoutQueryUrl(
			"?checkout=abc&processingPayment=true&payment_intent=pi_123",
			{ step: "payment" },
			"/checkout",
		);

		const params = new URLSearchParams(url.split("?")[1]);
		expect(params.get("checkout")).toBe("abc");
		expect(params.get("processingPayment")).toBe("true");
		expect(params.get("payment_intent")).toBe("pi_123");
		expect(params.get("step")).toBe("payment");
	});

	it("replaces an existing step slug", () => {
		const url = buildCheckoutQueryUrl("?checkout=abc&step=contact", { step: "shipping" }, "/checkout");

		expect(new URLSearchParams(url.split("?")[1]).get("step")).toBe("shipping");
	});
});
