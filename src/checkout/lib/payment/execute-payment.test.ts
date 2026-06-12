import { describe, expect, it, vi, beforeEach } from "vitest";

import { setCheckoutTransport, type CheckoutTransport } from "@/checkout/lib/checkout-transport";
import { executePayment } from "./execute-payment";

const initializeTransaction = vi.fn<CheckoutTransport["initializeTransaction"]>();
const completeCheckout = vi.fn<CheckoutTransport["completeCheckout"]>();

const fakeTransport: CheckoutTransport = {
	fetchCheckout: vi.fn(),
	updateBillingAddress: vi.fn(),
	initializePaymentGateways: vi.fn(),
	initializeTransaction,
	processTransaction: vi.fn(),
	completeCheckout,
};

describe("executePayment", () => {
	beforeEach(() => {
		initializeTransaction.mockReset();
		completeCheckout.mockReset();
		setCheckoutTransport(fakeTransport);
	});

	it("runs dummy payment flow and completes checkout", async () => {
		initializeTransaction.mockResolvedValue({
			ok: true,
			data: {
				transactionEvent: { type: "CHARGE_SUCCESS", message: "ok" },
				transaction: { id: "tx-1" },
				errors: [],
			},
		});
		completeCheckout.mockResolvedValue({ ok: true, orderId: "order-1" });

		const result = await executePayment(
			{ type: "dummy", gateway: { id: "saleor.io.dummy-payment-app", name: "Dummy" }, submitMode: "server" },
			{ checkoutId: "checkout-1", amount: 42.5 },
		);

		expect(result).toEqual({ ok: true, orderId: "order-1" });
		expect(initializeTransaction).toHaveBeenCalledWith({
			checkoutId: "checkout-1",
			amount: 42.5,
			paymentGateway: {
				id: "saleor.io.dummy-payment-app",
				data: { event: { includePspReference: true, type: "CHARGE_SUCCESS" } },
			},
		});
	});

	it("surfaces initializeTransaction error message", async () => {
		initializeTransaction.mockResolvedValue({
			ok: false,
			error: "Test payment is not available in this environment.",
		});

		const result = await executePayment(
			{ type: "dummy", gateway: { id: "saleor.io.dummy-payment-app", name: "Dummy" }, submitMode: "server" },
			{ checkoutId: "checkout-1", amount: 10 },
		);

		expect(result).toEqual({
			ok: false,
			error: "Test payment is not available in this environment.",
			errorKey: "payment",
		});
	});

	it("completes checkout without payment when amount is zero", async () => {
		completeCheckout.mockResolvedValue({ ok: true, orderId: "order-free" });

		const result = await executePayment(
			{ type: "stripe", gateway: { id: "stripe", name: "Stripe" }, submitMode: "client" },
			{ checkoutId: "checkout-1", amount: 0 },
		);

		expect(result).toEqual({ ok: true, orderId: "order-free" });
		expect(initializeTransaction).not.toHaveBeenCalled();
		expect(completeCheckout).toHaveBeenCalledWith("checkout-1");
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
