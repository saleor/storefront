import { type PaymentGatewayLike } from "../types";

/**
 * Saleor Stripe app gateway id (v2).
 * @see https://docs.saleor.io/developer/app-store/apps/stripe
 */
export const STRIPE_GATEWAY_ID = "saleor.app.payment.stripe";

/** Shown when Stripe is on the checkout but the storefront flag is off. */
export const STRIPE_PAYMENT_NOT_ENABLED_MESSAGE =
	"Stripe payments are not enabled in this environment. Set NEXT_PUBLIC_ENABLE_STRIPE_PAYMENTS=true on the storefront.";

/** Config returned by paymentGatewayInitialize for the Stripe app. */
export type StripeGatewayConfigData = {
	stripePublishableKey?: string;
};

export type StripeGatewayConfig = {
	id: string;
	data?: StripeGatewayConfigData | null;
};

export function isStripeGateway(gatewayId: string): boolean {
	return gatewayId === STRIPE_GATEWAY_ID || gatewayId.includes("stripe");
}

export function findStripeGateway(
	gateways: ReadonlyArray<PaymentGatewayLike> | null | undefined,
): PaymentGatewayLike | undefined {
	return gateways?.find((gateway) => isStripeGateway(gateway.id));
}

/**
 * Stripe Elements checkout — opt-in via env (required on cloud/staging where NODE_ENV is production).
 * Publishable keys come from Saleor's paymentGatewayInitialize, not from env.
 */
export function isStripePaymentEnabled(): boolean {
	if (process.env.ENABLE_STRIPE_PAYMENTS === "true") {
		return true;
	}
	if (process.env.NEXT_PUBLIC_ENABLE_STRIPE_PAYMENTS === "true") {
		return true;
	}
	return process.env.NODE_ENV === "development";
}

/**
 * Server-side guard for transactionInitialize — blocks Stripe when the storefront flag is off.
 */
export function getStripePaymentGuardError(gatewayId: string | null | undefined): string | null {
	if (!gatewayId || !isStripeGateway(gatewayId)) {
		return null;
	}
	if (isStripePaymentEnabled()) {
		return null;
	}
	return STRIPE_PAYMENT_NOT_ENABLED_MESSAGE;
}

export function parseStripeGatewayConfig(data: unknown): StripeGatewayConfigData | null {
	if (!data || typeof data !== "object") {
		return null;
	}

	const record = data as Record<string, unknown>;
	const publishableKey = record.stripePublishableKey;

	if (typeof publishableKey !== "string" || !publishableKey.trim()) {
		return null;
	}

	return { stripePublishableKey: publishableKey };
}

export type StripePaymentIntentData = {
	stripeClientSecret?: string;
};

export type StripeTransactionData = {
	paymentIntent?: StripePaymentIntentData;
};

export function parseStripeTransactionData(data: unknown): StripeTransactionData | null {
	if (!data || typeof data !== "object") {
		return null;
	}

	const record = data as Record<string, unknown>;
	const paymentIntent = record.paymentIntent;

	if (!paymentIntent || typeof paymentIntent !== "object") {
		return null;
	}

	const intentRecord = paymentIntent as Record<string, unknown>;
	const clientSecret = intentRecord.stripeClientSecret;

	return {
		paymentIntent: {
			stripeClientSecret: typeof clientSecret === "string" ? clientSecret : undefined,
		},
	};
}

export function getStripeClientSecret(data: unknown): string | null {
	const parsed = parseStripeTransactionData(data);
	const secret = parsed?.paymentIntent?.stripeClientSecret;
	return secret?.trim() ? secret : null;
}

const FAILED_TRANSACTION_EVENT_TYPES = new Set([
	"AUTHORIZATION_FAILURE",
	"AUTHORIZATION_ADJUSTMENT_FAILURE",
	"CHARGE_FAILURE",
	"REFUND_FAILURE",
	"CANCEL_FAILURE",
]);

/** Either outcome satisfies checkout when authorizeStatus becomes FULL. */
export const SUCCESSFUL_TRANSACTION_EVENT_TYPES = new Set([
	"AUTHORIZATION_SUCCESS",
	"AUTHORIZATION_ADJUSTMENT_SUCCESS",
	"CHARGE_SUCCESS",
	"CHARGE_BACK",
]);

type TransactionPayload = {
	errors?: ReadonlyArray<{ message?: string | null }> | null;
	transactionEvent?: { type?: string | null; message?: string | null } | null;
	transaction?: { id?: string | null } | null;
};

/** User-facing error when paymentGatewayInitialize did not return Stripe config. */
export function getPaymentGatewayInitializeError(
	payload: TransactionPayload | null | undefined,
): string | null {
	const errors = payload?.errors;
	if (errors?.length) {
		return errors[0]?.message || "Payment gateway initialization failed";
	}
	return null;
}

/** User-facing error when transactionInitialize or transactionProcess did not succeed. */
export function getStripeTransactionError(payload: TransactionPayload | null | undefined): string | null {
	const initError = getPaymentGatewayInitializeError(payload);
	if (initError) {
		return initError;
	}

	const eventType = payload?.transactionEvent?.type;
	const eventMessage = payload?.transactionEvent?.message;

	if (eventType && FAILED_TRANSACTION_EVENT_TYPES.has(eventType)) {
		if (eventMessage?.toLowerCase().includes("failed to delivery request")) {
			return "Stripe app webhook failed. In Saleor Dashboard → Apps → Stripe, check webhook deliveries are succeeding.";
		}

		return eventMessage || "Payment failed";
	}

	if (!payload?.transaction?.id) {
		return "Payment could not be processed. Check that the Stripe app is active in Saleor.";
	}

	return null;
}
