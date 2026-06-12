import {
	findDummyGateway,
	isDummyGateway,
	isDummyPaymentAllowed,
} from "@/checkout/lib/payment/providers/dummy";
import {
	findStripeGateway,
	isStripeGateway,
	isStripePaymentEnabled,
} from "@/checkout/lib/payment/providers/stripe";
import { type PaymentGatewayLike, type PaymentSubmitMode } from "./types";

/** Built-in gateways this UI does not integrate with but should not block checkout. */
export const IGNORABLE_GATEWAY_IDS = ["saleor.io.gift-card-payment-gateway"] as const;

export type IntegratedGatewayType = "stripe" | "dummy";

type IntegratedGatewayDefinition = {
	type: IntegratedGatewayType;
	submitMode: PaymentSubmitMode;
	findGateway: (gateways: ReadonlyArray<PaymentGatewayLike>) => PaymentGatewayLike | undefined;
	isEnabled: () => boolean;
	matchesGateway: (gateway: PaymentGatewayLike) => boolean;
};

/**
 * Storefront-integrated payment apps, highest priority first.
 * Add a new Saleor payment app here plus its provider module and UI component.
 */
export const INTEGRATED_GATEWAYS: readonly IntegratedGatewayDefinition[] = [
	{
		type: "stripe",
		submitMode: "client",
		findGateway: (gateways) => findStripeGateway(gateways),
		isEnabled: isStripePaymentEnabled,
		matchesGateway: (gateway) => isStripeGateway(gateway.id),
	},
	{
		type: "dummy",
		submitMode: "server",
		findGateway: (gateways) => findDummyGateway(gateways),
		isEnabled: isDummyPaymentAllowed,
		matchesGateway: isDummyGateway,
	},
];

export function isIgnorableGateway(gateway: PaymentGatewayLike): boolean {
	return (IGNORABLE_GATEWAY_IDS as readonly string[]).includes(gateway.id);
}

export function isIntegratedGateway(gateway: PaymentGatewayLike): boolean {
	return INTEGRATED_GATEWAYS.some(
		(definition) => definition.matchesGateway(gateway) && definition.isEnabled(),
	);
}

/** Gateways on the checkout that this storefront cannot process yet (e.g. Adyen when not wired). */
export function hasUnsupportedPaymentGateway(
	gateways: ReadonlyArray<PaymentGatewayLike> | null | undefined,
): boolean {
	return (gateways ?? []).some((gateway) => !isIgnorableGateway(gateway) && !isIntegratedGateway(gateway));
}

export function findEnabledIntegratedGateway(
	gateways: ReadonlyArray<PaymentGatewayLike>,
): { definition: IntegratedGatewayDefinition; gateway: PaymentGatewayLike } | null {
	for (const definition of INTEGRATED_GATEWAYS) {
		if (!definition.isEnabled()) {
			continue;
		}

		const gateway = definition.findGateway(gateways);
		if (gateway) {
			return { definition, gateway };
		}
	}

	return null;
}
