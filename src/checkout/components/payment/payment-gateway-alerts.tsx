"use client";

import { type FC } from "react";
import { AlertCircle, AlertTriangle } from "lucide-react";
import { type PaymentGatewayFragment } from "@/checkout/graphql";
import {
	DUMMY_MISSING_FROM_CHECKOUT_MESSAGE,
	getUnsupportedGatewayMessage,
	resolvePaymentGatewayStatus,
} from "@/checkout/lib/payment-gateways";

type PaymentGatewayAlertsProps = {
	gateways: ReadonlyArray<PaymentGatewayFragment> | null | undefined;
};

export const PaymentGatewayAlerts: FC<PaymentGatewayAlertsProps> = ({ gateways }) => {
	const status = resolvePaymentGatewayStatus(gateways);

	if (status.kind === "ready") {
		return null;
	}

	if (status.kind === "none") {
		return (
			<div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
				<AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
				<div>
					<p className="font-medium text-amber-800">No payment gateway configured</p>
					<p className="mt-1 text-sm text-amber-700">
						To accept payments, install a payment app (like Saleor Dummy Payment for testing, or Stripe/Adyen
						for production) from the Saleor Dashboard.
					</p>
				</div>
			</div>
		);
	}

	if (status.kind === "unsupported") {
		return (
			<div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
				<AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
				<div>
					<p className="font-medium text-amber-800">Unsupported payment gateway</p>
					<p className="mt-1 text-sm text-amber-700">{getUnsupportedGatewayMessage(gateways)}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
			<AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
			<div>
				<p className="font-medium text-amber-800">Dummy Payment not available on this checkout</p>
				<p className="mt-1 text-sm text-amber-700">{DUMMY_MISSING_FROM_CHECKOUT_MESSAGE}</p>
			</div>
		</div>
	);
};
