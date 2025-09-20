import { useEffect, useMemo, useRef, useState } from "react";
import { type CountryCode, usePaymentGatewaysInitializeMutation } from "@/checkout/graphql";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { useSubmit } from "@/checkout/hooks/useSubmit";
import { type MightNotExist } from "@/checkout/lib/globalTypes";
import { type ParsedPaymentGateways } from "@/checkout/sections/PaymentSection/types";
import { getFilteredPaymentGateways } from "@/checkout/sections/PaymentSection/utils";

export const usePaymentGatewaysInitialize = () => {
	const {
		checkout: { billingAddress },
	} = useCheckout();
	const {
		checkout: { id: checkoutId, availablePaymentGateways },
	} = useCheckout();

	const billingCountry = billingAddress?.country.code as MightNotExist<CountryCode>;

	const [gatewayConfigs, setGatewayConfigs] = useState<ParsedPaymentGateways>([]);
	const previousBillingCountry = useRef(billingCountry);
	const initializingRef = useRef(false);

	const [{ fetching }, paymentGatewaysInitialize] = usePaymentGatewaysInitializeMutation();

	const onSubmit = useSubmit<{}, typeof paymentGatewaysInitialize>(
		useMemo(
			() => ({
				hideAlerts: true,
				scope: "paymentGatewaysInitialize",
				shouldAbort: () => !availablePaymentGateways.length || initializingRef.current,
				onSubmit: async (...args) => {
					initializingRef.current = true;
					try {
						return await paymentGatewaysInitialize(...args);
					} finally {
						initializingRef.current = false;
					}
				},
				parse: () => ({
					checkoutId,
					paymentGateways: getFilteredPaymentGateways(availablePaymentGateways).map(({ config, id }) => ({
						id,
						data: config,
					})),
				}),
				onSuccess: ({ data }) => {
					const parsedConfigs = (data.gatewayConfigs || []) as ParsedPaymentGateways;

					if (!parsedConfigs.length) {
						throw new Error("No available payment gateways");
					}

					setGatewayConfigs(parsedConfigs);
				},
				onError: ({ errors }) => {
					console.log({ errors });
				},
			}),
			[availablePaymentGateways, checkoutId, paymentGatewaysInitialize],
		),
	);

	useEffect(() => {
		// Only initialize if we don't already have gateway configs, payment gateways are available, and we're not already initializing
		if (!gatewayConfigs.length && availablePaymentGateways.length > 0 && !initializingRef.current) {
			void onSubmit();
		}
	}, [availablePaymentGateways.length, onSubmit]);

	useEffect(() => {
		if (
			billingCountry !== previousBillingCountry.current &&
			availablePaymentGateways.length > 0 &&
			!initializingRef.current
		) {
			previousBillingCountry.current = billingCountry;
			setGatewayConfigs([]);
			void onSubmit();
		}
	}, [billingCountry, onSubmit, availablePaymentGateways.length]);

	return {
		fetching: fetching || initializingRef.current,
		availablePaymentGateways: gatewayConfigs || [],
	};
};
