import { afterEach, describe, expect, it, vi } from "vitest";

import {
	buildCheckoutQueryUrl,
	getCheckoutRouterSyncHref,
	getCheckoutStepIntent,
	recordCheckoutStepIntent,
	resolveStepReassertion,
	updateCheckoutQuery,
	writeCheckoutQueryHistory,
} from "./checkout-search-params";

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

describe("checkout step intent", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
		recordCheckoutStepIntent(null);
	});

	function stubCheckoutWindow(search: string) {
		vi.stubGlobal("window", {
			location: { search, pathname: "/checkout" },
			history: { state: null, pushState: vi.fn(), replaceState: vi.fn() },
			dispatchEvent: vi.fn(),
		});
	}

	it("updateCheckoutQuery records step intent", () => {
		stubCheckoutWindow("?checkout=abc&step=shipping");

		updateCheckoutQuery({ step: "payment" });

		expect(getCheckoutStepIntent()).toBe("payment");
	});

	it("updateCheckoutQuery without step keeps existing intent", () => {
		stubCheckoutWindow("?checkout=abc&step=payment");
		recordCheckoutStepIntent("payment");

		updateCheckoutQuery({ processingPayment: null });

		expect(getCheckoutStepIntent()).toBe("payment");
	});

	it("resolveStepReassertion re-asserts the intended step after a router clobber", () => {
		expect(resolveStepReassertion("checkout=abc&locale=fr", "payment")).toBe("payment");
		expect(resolveStepReassertion("checkout=abc&step=contact", "payment")).toBe("payment");
	});

	it("resolveStepReassertion is a no-op when URL matches or intent is empty", () => {
		expect(resolveStepReassertion("checkout=abc&step=payment", "payment")).toBeNull();
		expect(resolveStepReassertion("checkout=abc", null)).toBeNull();
	});
});

describe("getCheckoutRouterSyncHref", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
		recordCheckoutStepIntent(null);
	});

	it("returns null when router and live URL already match", () => {
		vi.stubGlobal("window", { location: { search: "?checkout=abc&step=payment", pathname: "/checkout" } });

		expect(getCheckoutRouterSyncHref("checkout=abc&step=payment")).toBeNull();
	});

	it("returns live query when router lags a shallow step update", () => {
		vi.stubGlobal("window", {
			location: { search: "?checkout=abc&step=payment&locale=fr", pathname: "/checkout" },
		});

		expect(getCheckoutRouterSyncHref("checkout=abc&step=contact&locale=fr")).toBe(
			"?checkout=abc&step=payment&locale=fr",
		);
	});

	it("returns null when live URL contradicts recorded step intent (revalidation clobber)", () => {
		vi.stubGlobal("window", {
			location: { search: "?checkout=abc&step=contact&locale=fr", pathname: "/checkout" },
		});
		recordCheckoutStepIntent("payment");

		expect(getCheckoutRouterSyncHref("checkout=abc&step=payment&locale=fr")).toBeNull();
	});
});

describe("writeCheckoutQueryHistory", () => {
	const pushState = vi.fn();
	const replaceState = vi.fn();
	const dispatchEvent = vi.fn();

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	function stubWindowHistory(currentSearch = "?checkout=abc&step=contact") {
		vi.stubGlobal("window", {
			location: { pathname: "/checkout", search: currentSearch },
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

	it("push of the current URL downgrades to replace (no duplicate history entries)", () => {
		stubWindowHistory("?checkout=abc&step=shipping");
		writeCheckoutQueryHistory("/checkout?checkout=abc&step=shipping", "push");

		expect(pushState).not.toHaveBeenCalled();
		expect(replaceState).toHaveBeenCalledWith({ idx: 1 }, "", "/checkout?checkout=abc&step=shipping");
	});

	it("replaceState by default", () => {
		stubWindowHistory();
		writeCheckoutQueryHistory("/checkout?checkout=abc&step=payment");

		expect(replaceState).toHaveBeenCalledWith({ idx: 1 }, "", "/checkout?checkout=abc&step=payment");
		expect(pushState).not.toHaveBeenCalled();
	});
});
