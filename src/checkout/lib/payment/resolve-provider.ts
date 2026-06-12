import {
	findDummyGateway,
	isDummyGateway,
	isDummyPaymentAllowed,
} from "@/checkout/lib/payment/providers/dummy";
import {
	isIgnorableGateway,
	findEnabledIntegratedGateway,
	hasUnsupportedPaymentGateway,
} from "./integrated-gateways";
import { type PaymentGatewayLike, type ResolvedPaymentProvider } from "./types";

function hasSubstantiveGateway(gateways: ReadonlyArray<PaymentGatewayLike>): boolean {
	return gateways.some((gateway) => !isIgnorableGateway(gateway));
}

/** Picks the payment integration for checkout.availablePaymentGateways. */
export function resolvePaymentProvider(
	gateways: ReadonlyArray<PaymentGatewayLike> | null | undefined,
): ResolvedPaymentProvider {
	const list = gateways ?? [];

	const integrated = findEnabledIntegratedGateway(list);
	if (integrated) {
		return {
			type: integrated.definition.type,
			gateway: integrated.gateway,
			submitMode: integrated.definition.submitMode,
		};
	}

	// In production, ignore dummy even if Saleor exposes it on the checkout.
	const dummyGateway = findDummyGateway(list);
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

/** Client-driven gateways render their own Pay button (e.g. Stripe Elements). */
export function usesClientPaymentSubmit(provider: ResolvedPaymentProvider): boolean {
	return provider.type === "stripe" || provider.type === "dummy" ? provider.submitMode === "client" : false;
}

/** Whether the checkout Pay button can run for the resolved provider. */
export function canSubmitPayment(provider: ResolvedPaymentProvider): boolean {
	return provider.type === "dummy" && provider.submitMode === "server";
}
