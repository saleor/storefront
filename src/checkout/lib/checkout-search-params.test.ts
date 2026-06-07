import { afterEach, describe, expect, it, vi } from "vitest";

import { buildCheckoutQueryUrl, writeCheckoutQueryHistory } from "./checkout-search-params";

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

describe("writeCheckoutQueryHistory", () => {
	const pushState = vi.fn();
	const replaceState = vi.fn();
	const dispatchEvent = vi.fn();

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	function stubWindowHistory() {
		vi.stubGlobal("window", {
			history: { state: { idx: 1 }, pushState, replaceState },
			dispatchEvent,
		});
		pushState.mockClear();
		replaceState.mockClear();
		dispatchEvent.mockClear();
	}

	it("pushState when history is push", () => {
		stubWindowHistory();
		writeCheckoutQueryHistory("/checkout?checkout=abc&step=shipping", "push");

		expect(pushState).toHaveBeenCalledWith({ idx: 1 }, "", "/checkout?checkout=abc&step=shipping");
		expect(replaceState).not.toHaveBeenCalled();
		expect(dispatchEvent).toHaveBeenCalled();
	});

	it("replaceState by default", () => {
		stubWindowHistory();
		writeCheckoutQueryHistory("/checkout?checkout=abc&step=payment");

		expect(replaceState).toHaveBeenCalledWith({ idx: 1 }, "", "/checkout?checkout=abc&step=payment");
		expect(pushState).not.toHaveBeenCalled();
	});
});
