import { type PaymentGatewayFragment } from "@/checkout/graphql";
import { resolvePaymentProvider } from "@/checkout/lib/payment/resolve-provider";

export {
	DUMMY_GATEWAY_IDS,
	DUMMY_PAYMENT_NOT_ALLOWED_MESSAGE,
	findDummyGateway,
	getDummyPaymentGuardError,
	isDummyGateway,
	isDummyPaymentAllowed,
} from "@/checkout/lib/payment/providers/dummy";

export { hasUnsupportedPaymentGateway, isIgnorableGateway } from "@/checkout/lib/payment/integrated-gateways";

type GatewayLike = Pick<PaymentGatewayFragment, "id" | "name">;

export type PaymentGatewayStatus =
	| { kind: "dummy"; gateway: GatewayLike }
	| { kind: "stripe"; gateway: GatewayLike }
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
			return { kind: "dummy", gateway: provider.gateway };
		case "stripe":
			return { kind: "stripe", gateway: provider.gateway };
		case "none":
			return { kind: "none" };
		case "unsupported":
			return { kind: "unsupported" };
		case "dummy_missing":
			return { kind: "dummy_missing" };
	}
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
		? `This checkout does not support the available payment gateway(s): ${listed}.`
		: "No supported payment gateway is available for this checkout.";
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
