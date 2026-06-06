import { type PaymentGatewayFragment } from "@/checkout/graphql";
import { resolvePaymentProvider } from "@/checkout/lib/payment/resolve-provider";

/** Known Saleor Dummy Payment app IDs (legacy + current). */
export const DUMMY_GATEWAY_IDS = ["saleor.io.dummy-payment-app", "mirumee.payments.dummy"] as const;

/** Built-in gateways this UI does not integrate with but should not block dummy checkout. */
export const IGNORABLE_GATEWAY_IDS = ["saleor.io.gift-card-payment-gateway"] as const;

type GatewayLike = Pick<PaymentGatewayFragment, "id" | "name">;

export function isDummyGateway(gateway: GatewayLike): boolean {
	if ((DUMMY_GATEWAY_IDS as readonly string[]).includes(gateway.id)) {
		return true;
	}

	const id = String(gateway.id).toLowerCase();
	const name = String(gateway.name ?? "").toLowerCase();

	return id.includes("dummy") || name.includes("dummy");
}

export function isIgnorableGateway(gateway: GatewayLike): boolean {
	return (IGNORABLE_GATEWAY_IDS as readonly string[]).includes(gateway.id);
}

export function findDummyGateway(
	gateways: ReadonlyArray<GatewayLike> | null | undefined,
): GatewayLike | undefined {
	return gateways?.find(isDummyGateway);
}

/** Shown when dummy payment is blocked (UI and server actions). */
export const DUMMY_PAYMENT_NOT_ALLOWED_MESSAGE = "Test payment is not available in this environment.";

/**
 * Dummy Payment is for local/staging test checkouts only.
 * Enabled in development, or when ALLOW_DUMMY_PAYMENT / NEXT_PUBLIC_ALLOW_DUMMY_PAYMENT is true.
 */
export function isDummyPaymentAllowed(): boolean {
	if (process.env.ALLOW_DUMMY_PAYMENT === "true") {
		return true;
	}
	if (process.env.NEXT_PUBLIC_ALLOW_DUMMY_PAYMENT === "true") {
		return true;
	}
	return process.env.NODE_ENV === "development";
}

/**
 * Server-side guard for transactionInitialize — blocks dummy gateways in production
 * even when callers bypass the checkout UI (e.g. direct server action invocation).
 */
export function getDummyPaymentGuardError(gatewayId: string | null | undefined): string | null {
	if (!gatewayId || !isDummyGateway({ id: gatewayId, name: "" })) {
		return null;
	}
	if (isDummyPaymentAllowed()) {
		return null;
	}
	return DUMMY_PAYMENT_NOT_ALLOWED_MESSAGE;
}

export type PaymentGatewayStatus =
	| { kind: "ready"; dummyGateway: GatewayLike }
	| { kind: "none" }
	| { kind: "unsupported" }
	| { kind: "dummy_missing" };

/** Classifies checkout.availablePaymentGateways for UI and pay flow. */
export function resolvePaymentGatewayStatus(
	gateways: ReadonlyArray<GatewayLike> | null | undefined,
): PaymentGatewayStatus {
	const provider = resolvePaymentProvider(gateways);

	switch (provider.type) {
		case "dummy":
			return { kind: "ready", dummyGateway: provider.gateway };
		case "none":
			return { kind: "none" };
		case "unsupported":
			return { kind: "unsupported" };
		case "dummy_missing":
			return { kind: "dummy_missing" };
	}
}

/** Production gateways this checkout UI cannot process (Stripe, Adyen, etc.). */
export function hasUnsupportedPaymentGateway(
	gateways: ReadonlyArray<GatewayLike> | null | undefined,
): boolean {
	return (gateways ?? []).some((gateway) => !isDummyGateway(gateway) && !isIgnorableGateway(gateway));
}

export function formatGatewayList(gateways: ReadonlyArray<GatewayLike> | null | undefined): string {
	return (gateways ?? []).map((gateway) => `${gateway.name ?? gateway.id} (${gateway.id})`).join(", ");
}

/** Shown when only unsupported production gateways are available on the checkout. */
export function getUnsupportedGatewayMessage(
	gateways: ReadonlyArray<GatewayLike> | null | undefined,
): string {
	const listed = formatGatewayList(gateways);
	return listed
		? `This checkout only supports the Saleor Dummy Payment app. Available on this checkout: ${listed}.`
		: "This checkout only supports the Saleor Dummy Payment app for test orders.";
}

/** Shown when Dummy Payment is installed in Dashboard but missing from checkout.availablePaymentGateways. */
export const DUMMY_MISSING_FROM_CHECKOUT_MESSAGE =
	"Dummy Payment App is installed, but it is not available for this checkout. In Saleor Dashboard, check the app is active, webhooks are delivering successfully, and the checkout currency is supported (USD for the hosted app).";

const FAILED_TRANSACTION_EVENT_TYPES = new Set([
	"AUTHORIZATION_FAILURE",
	"AUTHORIZATION_ADJUSTMENT_FAILURE",
	"CHARGE_FAILURE",
	"REFUND_FAILURE",
	"CANCEL_FAILURE",
]);

type TransactionInitializePayload =
	| {
			errors?: ReadonlyArray<{ message?: string | null }> | null;
			transactionEvent?: { type?: string | null; message?: string | null } | null;
			transaction?: { id?: string | null } | null;
	  }
	| null
	| undefined;

/** Returns a user-facing message when transactionInitialize did not succeed. */
export function getTransactionInitializeError(payload: TransactionInitializePayload): string | null {
	const errors = payload?.errors;
	if (errors?.length) {
		return errors[0]?.message || "Payment failed";
	}

	const eventType = payload?.transactionEvent?.type;
	const eventMessage = payload?.transactionEvent?.message;

	if (eventType && FAILED_TRANSACTION_EVENT_TYPES.has(eventType)) {
		if (eventMessage?.toLowerCase().includes("failed to delivery request")) {
			return "Payment app webhook failed. In Saleor Dashboard → Apps → Dummy Payment App, check webhook deliveries are succeeding.";
		}

		return eventMessage || "Payment failed";
	}

	if (!payload?.transaction?.id) {
		return "Payment could not be initialized. Check that the payment app is running in Saleor.";
	}

	return null;
}
