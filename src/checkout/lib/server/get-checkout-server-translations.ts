import "server-only";

import { getTranslations } from "next-intl/server";
import { cache } from "react";

import { buildCheckoutGatewayMessages } from "@/checkout/lib/payment/gateway-messages";
import { getCheckoutLocaleSlug } from "@/lib/browse-locale-server";

/** Locale-aware checkout server-action fallbacks and gateway copy. */
export const getCheckoutServerTranslations = cache(async () => {
	const locale = await getCheckoutLocaleSlug();
	const [server, gateways] = await Promise.all([
		getTranslations({ locale, namespace: "checkout.server" }),
		getTranslations({ locale, namespace: "checkout.gateways" }),
	]);

	return {
		server,
		gatewayMessages: buildCheckoutGatewayMessages(gateways),
	};
});
