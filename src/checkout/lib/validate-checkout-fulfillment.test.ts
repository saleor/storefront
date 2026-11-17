import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/app/(checkout)/actions", () => ({
	updateCheckoutShippingAddress: vi.fn(),
}));

import { updateCheckoutShippingAddress } from "@/app/(checkout)/actions";
import type { ServerCheckout } from "@/checkout/lib/checkout-types";
import { validateCheckoutFulfillment } from "./validate-checkout-fulfillment";

const updateAddress = vi.mocked(updateCheckoutShippingAddress);

/** The fields the check reads; the rest of a checkout does not matter here. */
const asCheckout = (value: object) => value as ServerCheckout;
const accepted = (value: object) => ({ ok: true as const, checkout: asCheckout(value) });

const checkout = asCheckout({
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
	lines: [{ id: "line-m", quantity: 2, variant: { name: "M" } }],
});
const stockProblem = {
	__typename: "CheckoutLineProblemInsufficientStock",
	availableQuantity: 0,
	line: { id: "line-m" },
};

describe("validateCheckoutFulfillment", () => {
	beforeEach(() => {
		updateAddress.mockReset();
	});

	it("passes the checkout it was given when shipping is not required", async () => {
		const digital = asCheckout({ ...checkout, isShippingRequired: false, shippingAddress: null });
		await expect(validateCheckoutFulfillment(digital, "Could not verify availability.")).resolves.toEqual({
			ok: true,
			checkout: digital,
		});
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
			failure: {
				checkout: null,
				destination: {
					message: "Could not add items M. Only 0 remaining in stock.",
					lineIds: ["line-m"],
					isExact: true,
				},
			},
		});
		expect(updateAddress).toHaveBeenCalledWith(
			checkout.id,
			expect.objectContaining({ country: "US" }),
			false,
		);
	});

	it("hands back the live checkout when Saleor accepts the address but lists a stock problem", async () => {
		// Channel with `useLegacyErrorFlow: false`: no mutation error, the line is in `problems`.
		const live = asCheckout({ ...checkout, problems: [stockProblem] });
		updateAddress.mockResolvedValue(accepted(live));

		await expect(validateCheckoutFulfillment(checkout, "Could not verify availability.")).resolves.toEqual({
			ok: false,
			reason: "availability",
			failure: { checkout: live, destination: null },
		});
	});

	it("asks Saleor again even when the snapshot passed in lists a stock problem", async () => {
		// A stale snapshot must not block the shopper once the problem is gone.
		const live = asCheckout({ ...checkout, problems: [] });
		updateAddress.mockResolvedValue(accepted(live));

		await expect(
			validateCheckoutFulfillment(
				asCheckout({ ...checkout, problems: [stockProblem] }),
				"Could not verify availability.",
			),
		).resolves.toEqual({ ok: true, checkout: live });
		expect(updateAddress).toHaveBeenCalled();
	});

	it("passes when Saleor accepts the address and lists only delivery problems", async () => {
		const live = asCheckout({
			...checkout,
			problems: [{ __typename: "CheckoutProblemDeliveryMethodStale" }],
		});
		updateAddress.mockResolvedValue(accepted(live));

		await expect(validateCheckoutFulfillment(checkout, "Could not verify availability.")).resolves.toEqual({
			ok: true,
			checkout: live,
		});
	});

	it("reads the problems of a checkout that needs no shipping without calling Saleor", async () => {
		const digital = asCheckout({
			...checkout,
			isShippingRequired: false,
			shippingAddress: null,
			problems: [{ __typename: "CheckoutLineProblemVariantNotAvailable", line: { id: "line-m" } }],
		});
		await expect(validateCheckoutFulfillment(digital, "Could not verify availability.")).resolves.toEqual({
			ok: false,
			reason: "availability",
			failure: { checkout: digital, destination: null },
		});
		expect(updateAddress).not.toHaveBeenCalled();
	});

	it("fails, so the shopper can try again, when a gift line is still short after the re-submit", async () => {
		// Saleor checks gift stock when it creates the order; the re-submit lets it swap the gift.
		updateAddress.mockResolvedValue(
			accepted({
				...checkout,
				lines: [...checkout.lines, { id: "line-gift", quantity: 1, isGift: true, variant: { name: "G" } }],
				problems: [
					{
						__typename: "CheckoutLineProblemInsufficientStock",
						availableQuantity: 0,
						line: { id: "line-gift" },
					},
				],
			}),
		);

		await expect(validateCheckoutFulfillment(checkout, "Could not verify availability.")).resolves.toEqual({
			ok: false,
			reason: "error",
			error: "Could not verify availability.",
		});
	});

	it("passes once Saleor has swapped the gift that ran out", async () => {
		const live = asCheckout({
			...checkout,
			lines: [...checkout.lines, { id: "line-new-gift", quantity: 1, isGift: true, variant: { name: "H" } }],
			problems: [],
		});
		updateAddress.mockResolvedValue(accepted(live));

		await expect(validateCheckoutFulfillment(checkout, "Could not verify availability.")).resolves.toEqual({
			ok: true,
			checkout: live,
		});
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
