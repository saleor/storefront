import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/app/(checkout)/actions", () => ({
	updateCheckoutShippingAddress: vi.fn(),
}));

import { updateCheckoutShippingAddress } from "@/app/(checkout)/actions";
import { validateCheckoutFulfillment } from "./validate-checkout-fulfillment";

const updateAddress = vi.mocked(updateCheckoutShippingAddress);

const checkout = {
	id: "chk",
	isShippingRequired: true,
	shippingAddress: {
		id: "addr",
		firstName: "John",
		lastName: "Appleseed",
		streetAddress1: "1 Infinite Loop",
		streetAddress2: "",
		companyName: "",
		city: "CUPERTINO",
		cityArea: "",
		postalCode: "95014",
		countryArea: "CA",
		phone: "",
		country: { code: "US", country: "United States" },
	},
	lines: [{ id: "line-m", variant: { name: "M" } }],
};

describe("validateCheckoutFulfillment", () => {
	beforeEach(() => {
		updateAddress.mockReset();
	});

	it("skips when shipping is not required", async () => {
		await expect(
			validateCheckoutFulfillment(
				{ ...checkout, isShippingRequired: false, shippingAddress: null },
				"Could not verify availability.",
			),
		).resolves.toEqual({ ok: true });
		expect(updateAddress).not.toHaveBeenCalled();
	});

	it("returns an availability issue when Saleor rejects the saved address for stock", async () => {
		updateAddress.mockResolvedValue({
			ok: false,
			fieldErrors: [
				{
					field: "quantity",
					message: "Could not add items M. Only 0 remaining in stock.",
					code: "INSUFFICIENT_STOCK",
				},
			],
		});

		await expect(validateCheckoutFulfillment(checkout, "Could not verify availability.")).resolves.toEqual({
			ok: false,
			reason: "availability",
			issue: {
				message: "Could not add items M. Only 0 remaining in stock.",
				lineIds: ["line-m"],
			},
		});
		expect(updateAddress).toHaveBeenCalledWith(
			checkout.id,
			expect.objectContaining({ country: "US" }),
			false,
		);
	});

	it("fails closed on non-stock address errors so pay cannot proceed", async () => {
		updateAddress.mockResolvedValue({
			ok: false,
			fieldErrors: [{ field: "postalCode", message: "Enter a valid ZIP.", code: "INVALID" }],
		});

		await expect(validateCheckoutFulfillment(checkout, "Could not verify availability.")).resolves.toEqual({
			ok: false,
			reason: "error",
			error: "Enter a valid ZIP.",
		});
	});

	it("fails closed when Saleor does not answer", async () => {
		updateAddress.mockResolvedValue({ ok: false, error: "Network error" });

		await expect(validateCheckoutFulfillment(checkout, "Could not verify availability.")).resolves.toEqual({
			ok: false,
			reason: "error",
			error: "Network error",
		});
	});

	it("uses the caller fallback when Saleor returns no message", async () => {
		updateAddress.mockResolvedValue({ ok: false });

		await expect(validateCheckoutFulfillment(checkout, "Could not verify availability.")).resolves.toEqual({
			ok: false,
			reason: "error",
			error: "Could not verify availability.",
		});
	});
});
