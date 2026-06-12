import { afterEach, describe, expect, it, vi } from "vitest";
import { canSubmitPayment, resolvePaymentProvider, usesClientPaymentSubmit } from "./resolve-provider";

describe("resolvePaymentProvider", () => {
	const dummyAndGiftCard = [
		{ id: "saleor.io.dummy-payment-app", name: "Dummy Payment App" },
		{ id: "saleor.io.gift-card-payment-gateway", name: "Gift Card Payment Gateway" },
	];

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it("returns dummy when dummy gateway is present in development", () => {
		vi.stubEnv("NODE_ENV", "development");
		expect(resolvePaymentProvider(dummyAndGiftCard)).toEqual({
			type: "dummy",
			gateway: dummyAndGiftCard[0],
			submitMode: "server",
		});
	});

	it("returns dummy in production when NEXT_PUBLIC_ALLOW_DUMMY_PAYMENT is set", () => {
		vi.stubEnv("NODE_ENV", "production");
		vi.stubEnv("NEXT_PUBLIC_ALLOW_DUMMY_PAYMENT", "true");
		expect(resolvePaymentProvider(dummyAndGiftCard)).toEqual({
			type: "dummy",
			gateway: dummyAndGiftCard[0],
			submitMode: "server",
		});
	});

	it("returns dummy in production when ALLOW_DUMMY_PAYMENT is set", () => {
		vi.stubEnv("NODE_ENV", "production");
		vi.stubEnv("ALLOW_DUMMY_PAYMENT", "true");
		expect(resolvePaymentProvider(dummyAndGiftCard)).toEqual({
			type: "dummy",
			gateway: dummyAndGiftCard[0],
			submitMode: "server",
		});
	});

	it("treats dummy-only checkout as none in production", () => {
		vi.stubEnv("NODE_ENV", "production");
		expect(
			resolvePaymentProvider([{ id: "saleor.io.dummy-payment-app", name: "Dummy Payment App" }]),
		).toEqual({ type: "none" });
	});

	it("ignores dummy and surfaces real gateways in production", () => {
		vi.stubEnv("NODE_ENV", "production");
		const stripe = { id: "saleor.app.payment.stripe", name: "Stripe" };
		expect(
			resolvePaymentProvider([{ id: "saleor.io.dummy-payment-app", name: "Dummy Payment App" }, stripe]),
		).toEqual({
			type: "unsupported",
			gateways: [stripe],
		});
	});

	it("prefers stripe over dummy when stripe is enabled", () => {
		vi.stubEnv("NODE_ENV", "production");
		vi.stubEnv("NEXT_PUBLIC_ENABLE_STRIPE_PAYMENTS", "true");
		vi.stubEnv("NEXT_PUBLIC_ALLOW_DUMMY_PAYMENT", "true");
		const stripe = { id: "saleor.app.payment.stripe", name: "Stripe" };
		expect(
			resolvePaymentProvider([{ id: "saleor.io.dummy-payment-app", name: "Dummy Payment App" }, stripe]),
		).toEqual({
			type: "stripe",
			gateway: stripe,
			submitMode: "client",
		});
	});

	it("returns stripe when enabled and stripe is the only gateway", () => {
		vi.stubEnv("NODE_ENV", "production");
		vi.stubEnv("NEXT_PUBLIC_ENABLE_STRIPE_PAYMENTS", "true");
		const stripe = { id: "saleor.app.payment.stripe", name: "Stripe" };
		expect(resolvePaymentProvider([stripe])).toEqual({
			type: "stripe",
			gateway: stripe,
			submitMode: "client",
		});
	});

	it("returns none for an empty gateway list", () => {
		expect(resolvePaymentProvider([])).toEqual({ type: "none" });
	});

	it("returns unsupported when only production gateways are available", () => {
		const gateways = [{ id: "saleor.app.payment.stripe", name: "Stripe" }];
		expect(resolvePaymentProvider(gateways)).toEqual({
			type: "unsupported",
			gateways,
		});
	});

	it("returns none when gift card is the only gateway", () => {
		expect(
			resolvePaymentProvider([
				{ id: "saleor.io.gift-card-payment-gateway", name: "Gift Card Payment Gateway" },
			]),
		).toEqual({ type: "none" });
	});
});

describe("usesClientPaymentSubmit", () => {
	it("is true only for client-submit providers", () => {
		expect(
			usesClientPaymentSubmit({
				type: "stripe",
				gateway: { id: "saleor.app.payment.stripe", name: "Stripe" },
				submitMode: "client",
			}),
		).toBe(true);
		expect(
			usesClientPaymentSubmit({
				type: "dummy",
				gateway: { id: "saleor.io.dummy-payment-app", name: "Dummy" },
				submitMode: "server",
			}),
		).toBe(false);
		expect(usesClientPaymentSubmit({ type: "none" })).toBe(false);
	});
});

describe("canSubmitPayment", () => {
	it("allows pay only for server-submit dummy provider", () => {
		expect(
			canSubmitPayment({
				type: "dummy",
				gateway: { id: "saleor.io.dummy-payment-app", name: "Dummy" },
				submitMode: "server",
			}),
		).toBe(true);
		expect(
			canSubmitPayment({
				type: "stripe",
				gateway: { id: "saleor.app.payment.stripe", name: "Stripe" },
				submitMode: "client",
			}),
		).toBe(false);
		expect(canSubmitPayment({ type: "none" })).toBe(false);
		expect(canSubmitPayment({ type: "dummy_missing" })).toBe(false);
		expect(canSubmitPayment({ type: "unsupported", gateways: [] })).toBe(false);
	});
});
