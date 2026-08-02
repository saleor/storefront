import { type PaymentGatewayFragment } from "@/checkout/graphql";
import { resolvePaymentProvider } from "@/checkout/lib/payment/resolve-provider";

export {
	buildCheckoutGatewayMessages,
	formatGatewayList,
	getTransactionInitializeError,
	getUnsupportedGatewayMessage,
	type CheckoutGatewayMessages,
} from "@/checkout/lib/payment/gateway-messages";

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
