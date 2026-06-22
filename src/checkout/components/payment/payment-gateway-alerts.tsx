"use client";

import { type FC } from "react";
import { AlertCircle, AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";
import { type PaymentGatewayFragment } from "@/checkout/graphql";
import { useCheckoutGatewayMessages } from "@/checkout/hooks/use-checkout-gateway-messages";
import { getUnsupportedGatewayMessage, resolvePaymentGatewayStatus } from "@/checkout/lib/payment-gateways";

type PaymentGatewayAlertsProps = {
	gateways: ReadonlyArray<PaymentGatewayFragment> | null | undefined;
};

export const PaymentGatewayAlerts: FC<PaymentGatewayAlertsProps> = ({ gateways }) => {
	const gatewayMessages = useCheckoutGatewayMessages();
	const t = useTranslations("checkout.gateways");
	const status = resolvePaymentGatewayStatus(gateways);

	if (status.kind === "dummy" || status.kind === "stripe") {
		return null;
	}

	if (status.kind === "none") {
		return (
			<div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
				<AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
				<div>
					<p className="font-medium text-amber-800">{t("noneTitle")}</p>
					<p className="mt-1 text-sm text-amber-700">{t("noneBody")}</p>
				</div>
			</div>
		);
	}

	if (status.kind === "unsupported") {
		return (
			<div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
				<AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
				<div>
					<p className="font-medium text-amber-800">{t("unsupportedTitle")}</p>
					<p className="mt-1 text-sm text-amber-700">
						{getUnsupportedGatewayMessage(gateways, gatewayMessages)}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
			<AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
			<div>
				<p className="font-medium text-amber-800">{t("dummyMissingTitle")}</p>
				<p className="mt-1 text-sm text-amber-700">{t("dummyMissingBody")}</p>
			</div>
		</div>
	);
};
