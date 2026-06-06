import { afterEach, describe, expect, it, vi } from "vitest";
import {
	findDummyGateway,
	formatGatewayList,
	getDummyPaymentGuardError,
	getTransactionInitializeError,
	getUnsupportedGatewayMessage,
	hasUnsupportedPaymentGateway,
	isDummyGateway,
	isDummyPaymentAllowed,
	resolvePaymentGatewayStatus,
} from "./payment-gateways";
import { STRIPE_GATEWAY_ID } from "./payment/providers/stripe";

describe("isDummyGateway", () => {
	it("matches known dummy app ids", () => {
		expect(isDummyGateway({ id: "saleor.io.dummy-payment-app", name: "Dummy Payment App" })).toBe(true);
		expect(isDummyGateway({ id: "mirumee.payments.dummy", name: "Dummy" })).toBe(true);
	});

	it("matches dummy by name when id differs", () => {
		expect(isDummyGateway({ id: "custom.app.id", name: "Dummy Payment Gateway" })).toBe(true);
	});
});

describe("isDummyPaymentAllowed", () => {
	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it("allows dummy in development", () => {
		vi.stubEnv("NODE_ENV", "development");
		expect(isDummyPaymentAllowed()).toBe(true);
	});

	it("blocks dummy in production by default", () => {
		vi.stubEnv("NODE_ENV", "production");
		expect(isDummyPaymentAllowed()).toBe(false);
	});

	it("allows dummy in production when ALLOW_DUMMY_PAYMENT is set", () => {
		vi.stubEnv("NODE_ENV", "production");
		vi.stubEnv("ALLOW_DUMMY_PAYMENT", "true");
		expect(isDummyPaymentAllowed()).toBe(true);
	});

	it("allows dummy in production when NEXT_PUBLIC_ALLOW_DUMMY_PAYMENT is set", () => {
		vi.stubEnv("NODE_ENV", "production");
		vi.stubEnv("NEXT_PUBLIC_ALLOW_DUMMY_PAYMENT", "true");
		expect(isDummyPaymentAllowed()).toBe(true);
	});
});

describe("getDummyPaymentGuardError", () => {
	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it("returns null for non-dummy gateways", () => {
		vi.stubEnv("NODE_ENV", "production");
		expect(getDummyPaymentGuardError("saleor.app.payment.stripe")).toBeNull();
	});

	it("blocks dummy gateway in production", () => {
		vi.stubEnv("NODE_ENV", "production");
		expect(getDummyPaymentGuardError("saleor.io.dummy-payment-app")).toMatch(/not available/);
	});

	it("allows dummy gateway in development", () => {
		vi.stubEnv("NODE_ENV", "development");
		expect(getDummyPaymentGuardError("saleor.io.dummy-payment-app")).toBeNull();
	});
});

describe("findDummyGateway", () => {
	it("finds the current Saleor dummy app id", () => {
		const gateway = findDummyGateway([
			{ id: "stripe", name: "Stripe" },
			{ id: "saleor.io.dummy-payment-app", name: "Dummy Payment App" },
		]);
		expect(gateway?.id).toBe("saleor.io.dummy-payment-app");
	});

	it("ignores gift card when looking for dummy", () => {
		const gateway = findDummyGateway([
			{ id: "saleor.io.gift-card-payment-gateway", name: "Gift Card Payment Gateway" },
			{ id: "saleor.io.dummy-payment-app", name: "Dummy Payment App" },
		]);
		expect(gateway?.id).toBe("saleor.io.dummy-payment-app");
	});
});

describe("hasUnsupportedPaymentGateway", () => {
	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it("returns false when only dummy and gift card are available in development", () => {
		vi.stubEnv("NODE_ENV", "development");
		expect(
			hasUnsupportedPaymentGateway([
				{ id: "saleor.io.dummy-payment-app", name: "Dummy Payment App" },
				{ id: "saleor.io.gift-card-payment-gateway", name: "Gift Card Payment Gateway" },
			]),
		).toBe(false);
	});

	it("returns true when stripe is available but not enabled", () => {
		vi.stubEnv("NODE_ENV", "production");
		expect(
			hasUnsupportedPaymentGateway([
				{ id: "saleor.io.dummy-payment-app", name: "Dummy Payment App" },
				{ id: STRIPE_GATEWAY_ID, name: "Stripe" },
			]),
		).toBe(true);
	});

	it("returns false when stripe is enabled and is the only substantive gateway", () => {
		vi.stubEnv("NODE_ENV", "production");
		vi.stubEnv("NEXT_PUBLIC_ENABLE_STRIPE_PAYMENTS", "true");
		expect(
			hasUnsupportedPaymentGateway([
				{ id: STRIPE_GATEWAY_ID, name: "Stripe" },
				{ id: "saleor.io.gift-card-payment-gateway", name: "Gift Card Payment Gateway" },
			]),
		).toBe(false);
	});
});

describe("formatGatewayList", () => {
	it("formats gateway names and ids", () => {
		expect(formatGatewayList([{ id: "saleor.io.dummy-payment-app", name: "Dummy Payment App" }])).toBe(
			"Dummy Payment App (saleor.io.dummy-payment-app)",
		);
	});
});

describe("getUnsupportedGatewayMessage", () => {
	it("includes available gateways", () => {
		expect(getUnsupportedGatewayMessage([{ id: "saleor.app.payment.stripe", name: "Stripe" }])).toContain(
			"Stripe (saleor.app.payment.stripe)",
		);
	});
});

describe("resolvePaymentGatewayStatus", () => {
	const dummyAndGiftCard = [
		{ id: "saleor.io.dummy-payment-app", name: "Dummy Payment App" },
		{ id: "saleor.io.gift-card-payment-gateway", name: "Gift Card Payment Gateway" },
	];

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it("returns dummy when dummy gateway is present in development", () => {
		vi.stubEnv("NODE_ENV", "development");
		expect(resolvePaymentGatewayStatus(dummyAndGiftCard)).toEqual({
			kind: "dummy",
			gateway: dummyAndGiftCard[0],
		});
	});

	it("returns stripe when stripe is enabled and present", () => {
		vi.stubEnv("NODE_ENV", "production");
		vi.stubEnv("NEXT_PUBLIC_ENABLE_STRIPE_PAYMENTS", "true");
		const stripe = { id: STRIPE_GATEWAY_ID, name: "Stripe" };
		expect(resolvePaymentGatewayStatus([stripe])).toEqual({
			kind: "stripe",
			gateway: stripe,
		});
	});

	it("returns none when only dummy is available in production", () => {
		vi.stubEnv("NODE_ENV", "production");
		expect(
			resolvePaymentGatewayStatus([{ id: "saleor.io.dummy-payment-app", name: "Dummy Payment App" }]),
		).toEqual({ kind: "none" });
	});

	it("returns none for an empty gateway list", () => {
		expect(resolvePaymentGatewayStatus([])).toEqual({ kind: "none" });
	});

	it("returns unsupported when only production gateways are available", () => {
		expect(resolvePaymentGatewayStatus([{ id: "saleor.app.payment.stripe", name: "Stripe" }])).toEqual({
			kind: "unsupported",
		});
	});

	it("returns none when gift card is the only gateway", () => {
		expect(
			resolvePaymentGatewayStatus([
				{ id: "saleor.io.gift-card-payment-gateway", name: "Gift Card Payment Gateway" },
			]),
		).toEqual({ kind: "none" });
	});
});

describe("getTransactionInitializeError", () => {
	it("returns mutation errors", () => {
		expect(
			getTransactionInitializeError({
				errors: [{ message: "Gateway unavailable" }],
				transaction: { id: "tx-1" },
			}),
		).toBe("Gateway unavailable");
	});

	it("returns webhook delivery guidance for authorization failures", () => {
		expect(
			getTransactionInitializeError({
				transactionEvent: { type: "AUTHORIZATION_FAILURE", message: "Failed to delivery request." },
				transaction: { id: "tx-1" },
			}),
		).toMatch(/webhook/i);
	});

	it("returns message when transaction id is missing", () => {
		expect(getTransactionInitializeError({ transactionEvent: { type: "CHARGE_SUCCESS" } })).toMatch(
			/Payment could not be initialized/,
		);
	});

	it("returns null for a successful initialize payload", () => {
		expect(
			getTransactionInitializeError({
				transactionEvent: { type: "CHARGE_SUCCESS" },
				transaction: { id: "tx-1" },
			}),
		).toBeNull();
	});
});
