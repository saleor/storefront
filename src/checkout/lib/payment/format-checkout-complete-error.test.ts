import { describe, expect, it } from "vitest";
import { formatCheckoutCompleteError } from "./format-checkout-complete-error";

describe("formatCheckoutCompleteError", () => {
	it("explains CHECKOUT_NOT_FULLY_PAID", () => {
		expect(formatCheckoutCompleteError("CHECKOUT_NOT_FULLY_PAID: amount mismatch")).toMatch(/authorized/i);
	});

	it("passes through unknown errors", () => {
		expect(formatCheckoutCompleteError("Something else failed")).toBe("Something else failed");
	});
});
