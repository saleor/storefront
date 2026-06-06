import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@/app/(checkout)/actions", () => ({
	initializeCheckoutTransaction: vi.fn(),
	runCheckoutComplete: vi.fn(),
}));

import { initializeCheckoutTransaction, runCheckoutComplete } from "@/app/(checkout)/actions";
import { executePayment } from "./execute-payment";

describe("executePayment", () => {
	beforeEach(() => {
		vi.mocked(initializeCheckoutTransaction).mockReset();
		vi.mocked(runCheckoutComplete).mockReset();
	});

	it("runs dummy payment flow and completes checkout", async () => {
		vi.mocked(initializeCheckoutTransaction).mockResolvedValue({
			ok: true,
			data: {
				transactionEvent: { type: "CHARGE_SUCCESS", message: "ok" },
				transaction: { id: "tx-1" },
				errors: [],
			},
		});
		vi.mocked(runCheckoutComplete).mockResolvedValue({ ok: true, orderId: "order-1" });

		const result = await executePayment(
			{ type: "dummy", gateway: { id: "saleor.io.dummy-payment-app", name: "Dummy" } },
			{ checkoutId: "checkout-1", amount: 42.5 },
		);

		expect(result).toEqual({ ok: true, orderId: "order-1" });
		expect(initializeCheckoutTransaction).toHaveBeenCalledWith({
			checkoutId: "checkout-1",
			amount: 42.5,
			paymentGateway: {
				id: "saleor.io.dummy-payment-app",
				data: { event: { includePspReference: true, type: "CHARGE_SUCCESS" } },
			},
		});
	});

	it("surfaces initializeCheckoutTransaction error message", async () => {
		vi.mocked(initializeCheckoutTransaction).mockResolvedValue({
			ok: false,
			error: "Test payment is not available in this environment.",
		});

		const result = await executePayment(
			{ type: "dummy", gateway: { id: "saleor.io.dummy-payment-app", name: "Dummy" } },
			{ checkoutId: "checkout-1", amount: 10 },
		);

		expect(result).toEqual({
			ok: false,
			error: "Test payment is not available in this environment.",
			errorKey: "payment",
		});
	});

	it("completes checkout without payment when amount is zero", async () => {
		vi.mocked(runCheckoutComplete).mockResolvedValue({ ok: true, orderId: "order-free" });

		const result = await executePayment(
			{ type: "stripe", gateway: { id: "stripe", name: "Stripe" } },
			{ checkoutId: "checkout-1", amount: 0 },
		);

		expect(result).toEqual({ ok: true, orderId: "order-free" });
		expect(initializeCheckoutTransaction).not.toHaveBeenCalled();
		expect(runCheckoutComplete).toHaveBeenCalledWith("checkout-1");
	});

	it("returns error for unsupported provider", async () => {
		const result = await executePayment(
			{ type: "unsupported", gateways: [{ id: "stripe", name: "Stripe" }] },
			{ checkoutId: "checkout-1", amount: 10 },
		);

		expect(result.ok).toBe(false);
		if (!result.ok) {
			expect(result.error).toContain("Stripe");
		}
	});
});
