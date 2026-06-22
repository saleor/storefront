"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { type CheckoutFragment } from "@/checkout/graphql";
import { getCheckoutTransport } from "@/checkout/lib/checkout-transport";
import { useCheckoutPaymentMessages } from "@/checkout/hooks/use-checkout-payment-messages";
import {
	parseStripeGatewayConfig,
	STRIPE_GATEWAY_ID,
	type StripeGatewayConfigData,
} from "@/checkout/lib/payment/providers/stripe";

type StripeGatewayConfigState =
	| { status: "loading" }
	| { status: "ready"; config: StripeGatewayConfigData }
	| { status: "error"; message: string };

export function useStripeGatewayConfig(checkout: CheckoutFragment): StripeGatewayConfigState {
	const [state, setState] = useState<StripeGatewayConfigState>({ status: "loading" });
	const paymentMessages = useCheckoutPaymentMessages();

	const loadConfig = useCallback(
		async (options?: { background?: boolean }) => {
			setState((previous) => {
				if (options?.background && previous.status === "ready") {
					return previous;
				}

				return { status: "loading" };
			});

			const result = await getCheckoutTransport().initializePaymentGateways({
				checkoutId: checkout.id,
				paymentGateways: [{ id: STRIPE_GATEWAY_ID }],
			});

			if (!result.ok) {
				setState((previous) => {
					if (options?.background && previous.status === "ready") {
						return previous;
					}

					return { status: "error", message: result.error };
				});
				return;
			}

			const stripeConfig = result.data.gatewayConfigs?.find((config) => config.id === STRIPE_GATEWAY_ID);
			const configErrors = stripeConfig?.errors;
			if (configErrors?.length) {
				const message = configErrors[0]?.message ?? paymentMessages.stripeConfigFailed;
				setState((previous) => {
					if (options?.background && previous.status === "ready") {
						return previous;
					}

					return { status: "error", message };
				});
				return;
			}

			const parsed = parseStripeGatewayConfig(stripeConfig?.data);
			if (!parsed?.stripePublishableKey) {
				const message = paymentMessages.stripeKeyMissing;
				setState((previous) => {
					if (options?.background && previous.status === "ready") {
						return previous;
					}

					return { status: "error", message };
				});
				return;
			}

			setState({ status: "ready", config: parsed });
		},
		[checkout.id, paymentMessages.stripeConfigFailed, paymentMessages.stripeKeyMissing],
	);

	const previousBillingCountry = useRef(checkout.billingAddress?.country?.code);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect -- fetch Stripe gateway config on mount
		void loadConfig();
	}, [loadConfig]);

	const billingCountry = checkout.billingAddress?.country?.code;
	useEffect(() => {
		if (!billingCountry || billingCountry === previousBillingCountry.current) {
			return;
		}
		previousBillingCountry.current = billingCountry;
		// eslint-disable-next-line react-hooks/set-state-in-effect -- refresh config when billing country changes
		void loadConfig({ background: true });
	}, [billingCountry, loadConfig]);

	return state;
}
