import { describe, expect, it } from "vitest";
import {
	canCallCheckoutComplete,
	getCheckoutPaymentCoverage,
	isCheckoutReadyToComplete,
} from "./checkout-payment-status";

describe("isCheckoutReadyToComplete", () => {
	it("is true when authorizeStatus is FULL (capture not required)", () => {
		expect(isCheckoutReadyToComplete({ authorizeStatus: "FULL" })).toBe(true);
	});

	it("is false when authorizeStatus is not FULL", () => {
		expect(isCheckoutReadyToComplete({ authorizeStatus: "PARTIAL" })).toBe(false);
		expect(isCheckoutReadyToComplete({ authorizeStatus: "NONE" })).toBe(false);
	});
});

describe("getCheckoutPaymentCoverage", () => {
	it("returns authorized for manual capture (FULL auth, no charge)", () => {
		expect(getCheckoutPaymentCoverage({ authorizeStatus: "FULL", chargeStatus: "NONE" })).toBe("authorized");
	});

	it("returns charged when chargeStatus is FULL", () => {
		expect(getCheckoutPaymentCoverage({ authorizeStatus: "FULL", chargeStatus: "FULL" })).toBe("charged");
	});
});

describe("canCallCheckoutComplete", () => {
	it("matches isCheckoutReadyToComplete", () => {
		expect(canCallCheckoutComplete({ authorizeStatus: "FULL" })).toBe(true);
	});
});
