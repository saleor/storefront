"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { initializePaymentGateways } from "@/app/(checkout)/actions";
import { type CheckoutFragment } from "@/checkout/graphql";
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

	const loadConfig = useCallback(
		async (options?: { background?: boolean }) => {
			setState((previous) => {
				if (options?.background && previous.status === "ready") {
					return previous;
				}

				return { status: "loading" };
			});

			const result = await initializePaymentGateways({
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
				const message = configErrors[0]?.message ?? "Stripe gateway configuration failed";
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
				const message =
					"Stripe publishable key is missing. Check Stripe app configuration in Saleor Dashboard.";
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
		[checkout.id],
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
