import {
	findDummyGateway,
	hasUnsupportedPaymentGateway,
	isDummyGateway,
	isDummyPaymentAllowed,
	isIgnorableGateway,
} from "@/checkout/lib/payment-gateways";
import { type PaymentGatewayLike, type ResolvedPaymentProvider } from "./types";

function hasSubstantiveGateway(gateways: ReadonlyArray<PaymentGatewayLike>): boolean {
	return gateways.some((gateway) => !isIgnorableGateway(gateway));
}

/** Picks the payment integration for checkout.availablePaymentGateways. */
export function resolvePaymentProvider(
	gateways: ReadonlyArray<PaymentGatewayLike> | null | undefined,
): ResolvedPaymentProvider {
	const list = gateways ?? [];
	const dummyGateway = findDummyGateway(list);

	if (dummyGateway && isDummyPaymentAllowed()) {
		return { type: "dummy", gateway: dummyGateway };
	}

	// In production, ignore dummy even if Saleor exposes it on the checkout.
	const effectiveList =
		dummyGateway && !isDummyPaymentAllowed() ? list.filter((gateway) => !isDummyGateway(gateway)) : list;

	if (!hasSubstantiveGateway(effectiveList)) {
		return { type: "none" };
	}
	if (hasUnsupportedPaymentGateway(effectiveList)) {
		return { type: "unsupported", gateways: effectiveList };
	}
	return { type: "dummy_missing" };
}

/** Whether the Pay button can run for the resolved provider. */
export function canSubmitPayment(provider: ResolvedPaymentProvider): boolean {
	return provider.type === "dummy";
}
