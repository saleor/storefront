import { afterEach, describe, expect, it, vi } from "vitest";
import {
	findStripeGateway,
	getStripeClientSecret,
	getStripePaymentGuardError,
	getStripeTransactionError,
	isStripeGateway,
	isStripePaymentEnabled,
	parseStripeGatewayConfig,
	parseStripeTransactionData,
	STRIPE_GATEWAY_ID,
} from "./stripe";

describe("isStripeGateway", () => {
	it("matches the Saleor Stripe app id", () => {
		expect(isStripeGateway(STRIPE_GATEWAY_ID)).toBe(true);
	});

	it("matches legacy ids containing stripe", () => {
		expect(isStripeGateway("custom.stripe.gateway")).toBe(true);
	});
});

describe("findStripeGateway", () => {
	it("returns the stripe gateway from checkout gateways", () => {
		const stripe = { id: STRIPE_GATEWAY_ID, name: "Stripe" };
		expect(findStripeGateway([{ id: "saleor.io.dummy-payment-app", name: "Dummy" }, stripe])).toEqual(stripe);
	});
});

describe("isStripePaymentEnabled", () => {
	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it("allows stripe in development", () => {
		vi.stubEnv("NODE_ENV", "development");
		expect(isStripePaymentEnabled()).toBe(true);
	});

	it("blocks stripe in production by default", () => {
		vi.stubEnv("NODE_ENV", "production");
		expect(isStripePaymentEnabled()).toBe(false);
	});

	it("allows stripe in production when NEXT_PUBLIC_ENABLE_STRIPE_PAYMENTS is set", () => {
		vi.stubEnv("NODE_ENV", "production");
		vi.stubEnv("NEXT_PUBLIC_ENABLE_STRIPE_PAYMENTS", "true");
		expect(isStripePaymentEnabled()).toBe(true);
	});

	it("allows stripe in production when ENABLE_STRIPE_PAYMENTS is set", () => {
		vi.stubEnv("NODE_ENV", "production");
		vi.stubEnv("ENABLE_STRIPE_PAYMENTS", "true");
		expect(isStripePaymentEnabled()).toBe(true);
	});
});

describe("getStripePaymentGuardError", () => {
	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it("returns null for non-stripe gateways", () => {
		vi.stubEnv("NODE_ENV", "production");
		expect(getStripePaymentGuardError("saleor.io.dummy-payment-app")).toBeNull();
	});

	it("blocks stripe gateway in production without flag", () => {
		vi.stubEnv("NODE_ENV", "production");
		expect(getStripePaymentGuardError(STRIPE_GATEWAY_ID)).toMatch(/not enabled/i);
	});

	it("allows stripe gateway when enabled", () => {
		vi.stubEnv("NODE_ENV", "production");
		vi.stubEnv("NEXT_PUBLIC_ENABLE_STRIPE_PAYMENTS", "true");
		expect(getStripePaymentGuardError(STRIPE_GATEWAY_ID)).toBeNull();
	});
});

describe("parseStripeTransactionData", () => {
	it("extracts client secret from transaction initialize data", () => {
		expect(
			parseStripeTransactionData({
				paymentIntent: { stripeClientSecret: "pi_secret_abc" },
			}),
		).toEqual({
			paymentIntent: { stripeClientSecret: "pi_secret_abc" },
		});
	});

	it("returns null when payment intent is missing", () => {
		expect(parseStripeTransactionData({})).toBeNull();
	});
});

describe("getStripeClientSecret", () => {
	it("returns trimmed client secret", () => {
		expect(
			getStripeClientSecret({
				paymentIntent: { stripeClientSecret: "pi_secret_abc" },
			}),
		).toBe("pi_secret_abc");
	});
});

describe("getStripeTransactionError", () => {
	it("returns webhook guidance for authorization failures", () => {
		expect(
			getStripeTransactionError({
				transactionEvent: { type: "AUTHORIZATION_FAILURE", message: "Failed to delivery request." },
				transaction: { id: "tx-1" },
			}),
		).toMatch(/Stripe app webhook/i);
	});
});

describe("parseStripeGatewayConfig", () => {
	it("extracts publishable key from gateway config data", () => {
		expect(parseStripeGatewayConfig({ stripePublishableKey: "pk_test_abc" })).toEqual({
			stripePublishableKey: "pk_test_abc",
		});
	});

	it("returns null when publishable key is missing", () => {
		expect(parseStripeGatewayConfig({})).toBeNull();
		expect(parseStripeGatewayConfig(null)).toBeNull();
	});
});
