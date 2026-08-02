"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";

import { buildCheckoutGatewayMessages } from "@/checkout/lib/payment/gateway-messages";

/** User-facing payment gateway alerts and pay-flow errors. */
export function useCheckoutGatewayMessages() {
	const t = useTranslations("checkout.gateways");

	return useMemo(() => buildCheckoutGatewayMessages(t), [t]);
}

export type CheckoutGatewayMessagesHook = ReturnType<typeof useCheckoutGatewayMessages>;
