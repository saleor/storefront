import { afterEach, describe, expect, it, vi } from "vitest";
import { paymentMethodsForCheckout } from "./payment-methods";

const stripe = { id: "saleor.app.payment.stripe", name: "Stripe" };
const dummy = { id: "saleor.io.dummy-payment-app", name: "Dummy Payment App" };
const legacyDummy = { id: "mirumee.payments.dummy", name: "Dummy" };
const giftCard = { id: "saleor.io.gift-card-payment-gateway", name: "Gift Card Payment Gateway" };

describe("paymentMethodsForCheckout", () => {
	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it("names card for Stripe when Stripe payments are enabled", () => {
		vi.stubEnv("NEXT_PUBLIC_ENABLE_STRIPE_PAYMENTS", "true");
		expect(paymentMethodsForCheckout([giftCard, stripe])).toEqual(["card"]);
	});

	it("names test payment only where test payments are allowed", () => {
		vi.stubEnv("NODE_ENV", "development");
		expect(paymentMethodsForCheckout([dummy])).toEqual(["test"]);
		expect(paymentMethodsForCheckout([legacyDummy])).toEqual(["test"]);
		vi.stubEnv("NODE_ENV", "production");
		expect(paymentMethodsForCheckout([dummy])).toEqual([]);
	});

	it("names nothing for gateways the checkout cannot process", () => {
		vi.stubEnv("NODE_ENV", "production");
		expect(paymentMethodsForCheckout([{ id: "acme.pay", name: "Acme Pay" }, giftCard])).toEqual([]);
		expect(paymentMethodsForCheckout([])).toEqual([]);
	});
});
