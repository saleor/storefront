"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";

/** User-facing payment copy for checkout Stripe/dummy flows. */
export function useCheckoutPaymentMessages() {
	const t = useTranslations("checkout.payment");

	return useMemo(
		() => ({
			unavailable: t("unavailable"),
			initFailed: t("initFailed"),
			loadingGateway: (gateway: string) => t("loadingGateway", { gateway }),
			confirmingPayment: t("confirmingPayment"),
			securingWithStripe: t("securingWithStripe"),
			doNotClose: t("doNotClose"),
			completeOrderFailed: t("completeOrderFailed"),
			placeOrderFailed: t("placeOrderFailed"),
			totalsRefreshFailed: t("totalsRefreshFailed"),
			totalUnavailable: t("totalUnavailable"),
			currencyUnavailable: t("currencyUnavailable"),
			validationFailed: t("validationFailed"),
			methodRequired: t("methodRequired"),
			detailsUnavailable: t("detailsUnavailable"),
			expressReset: t("expressReset"),
			formReset: t("formReset"),
			totalChanged: t("totalChanged"),
			bankDeclined: t("bankDeclined"),
			sessionExpired: t("sessionExpired"),
			channelUnresolved: t("channelUnresolved"),
			unexpectedError: t("unexpectedError"),
			stripeConfigFailed: t("stripeConfigFailed"),
			stripeKeyMissing: t("stripeKeyMissing"),
			dummyGateway: t("dummyGateway"),
			failed: t("failed"),
			interruptedBeforeCharge: t("interruptedBeforeCharge"),
			interruptedAfterAuthorize: t("interruptedAfterAuthorize"),
			verificationUnavailable: t("verificationUnavailable"),
			authorizedTitle: t("authorizedTitle"),
			authorizedBody: t("authorizedBody"),
			freeOrderBody: (total: string) => t("freeOrderBody", { total }),
			dummyTestMode: t("dummyTestMode"),
			stripeLoadTitle: t("stripeLoadTitle"),
		}),
		[t],
	);
}

export type CheckoutPaymentMessages = ReturnType<typeof useCheckoutPaymentMessages>;
