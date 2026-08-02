import { type PaymentGatewayFragment } from "@/checkout/graphql";

type GatewayLike = Pick<PaymentGatewayFragment, "id" | "name">;

export type CheckoutGatewayMessages = {
	unsupportedList: (gateways: string) => string;
	unsupportedEmpty: string;
	dummyMissingBody: string;
	noneTitle: string;
	noneBody: string;
	unsupportedTitle: string;
	dummyMissingTitle: string;
	noGatewayConfigured: string;
	stripeUseCardForm: string;
	paymentFailed: string;
	paymentTryAgain: string;
	paymentWebhookFailed: string;
	paymentInitFailed: string;
};

type GatewayMessageKey =
	| "unsupportedList"
	| "unsupportedEmpty"
	| "dummyMissingBody"
	| "noneTitle"
	| "noneBody"
	| "unsupportedTitle"
	| "dummyMissingTitle"
	| "noGatewayConfigured"
	| "stripeUseCardForm"
	| "paymentFailed"
	| "paymentTryAgain"
	| "paymentWebhookFailed"
	| "paymentInitFailed";

type GatewayTranslator = (key: GatewayMessageKey, values?: Record<string, string>) => string;

/** Builds gateway copy from `checkout.gateways` — shared by client hooks and server actions. */
export function buildCheckoutGatewayMessages(t: GatewayTranslator): CheckoutGatewayMessages {
	return {
		unsupportedList: (gateways) => t("unsupportedList", { gateways }),
		unsupportedEmpty: t("unsupportedEmpty"),
		dummyMissingBody: t("dummyMissingBody"),
		noneTitle: t("noneTitle"),
		noneBody: t("noneBody"),
		unsupportedTitle: t("unsupportedTitle"),
		dummyMissingTitle: t("dummyMissingTitle"),
		noGatewayConfigured: t("noGatewayConfigured"),
		stripeUseCardForm: t("stripeUseCardForm"),
		paymentFailed: t("paymentFailed"),
		paymentTryAgain: t("paymentTryAgain"),
		paymentWebhookFailed: t("paymentWebhookFailed"),
		paymentInitFailed: t("paymentInitFailed"),
	};
}

export function formatGatewayList(gateways: ReadonlyArray<GatewayLike> | null | undefined): string {
	return (gateways ?? []).map((gateway) => `${gateway.name ?? gateway.id} (${gateway.id})`).join(", ");
}

/** Shown when only unsupported production gateways are available on the checkout. */
export function getUnsupportedGatewayMessage(
	gateways: ReadonlyArray<GatewayLike> | null | undefined,
	messages: CheckoutGatewayMessages,
): string {
	const listed = formatGatewayList(gateways);
	return listed ? messages.unsupportedList(listed) : messages.unsupportedEmpty;
}

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
export function getTransactionInitializeError(
	payload: TransactionInitializePayload,
	messages: CheckoutGatewayMessages,
): string | null {
	const errors = payload?.errors;
	if (errors?.length) {
		return errors[0]?.message || messages.paymentFailed;
	}

	const eventType = payload?.transactionEvent?.type;
	const eventMessage = payload?.transactionEvent?.message;

	if (eventType && FAILED_TRANSACTION_EVENT_TYPES.has(eventType)) {
		if (eventMessage?.toLowerCase().includes("failed to delivery request")) {
			return messages.paymentWebhookFailed;
		}

		return eventMessage || messages.paymentFailed;
	}

	if (!payload?.transaction?.id) {
		return messages.paymentInitFailed;
	}

	return null;
}
