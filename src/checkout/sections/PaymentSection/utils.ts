import { compact } from "lodash-es";
import { adyenGatewayId } from "./AdyenDropIn/types";
import { stripeV2GatewayId } from "./StripeV2DropIn/types";
import {
	type CheckoutAuthorizeStatusEnum,
	type CheckoutChargeStatusEnum,
	type OrderAuthorizeStatusEnum,
	type OrderChargeStatusEnum,
	type PaymentGateway,
} from "@/checkout/graphql";
import { type MightNotExist } from "@/checkout/lib/globalTypes";
import { getUrl, type ParamBasicValue } from "@/checkout/lib/utils/url";
import { type PaymentStatus } from "@/checkout/sections/PaymentSection/types";

export const supportedPaymentGateways = [adyenGatewayId, stripeV2GatewayId] as const;

export const getFilteredPaymentGateways = (
	paymentGateways: MightNotExist<PaymentGateway[]>,
): PaymentGateway[] => {
	if (!paymentGateways) {
		return [];
	}

	// we want to use only payment apps, not plugins
	return compact(paymentGateways).filter(({ id }) => supportedPaymentGateways.includes(id));
};

export const getUrlForTransactionInitialize = (extraQuery?: Record<string, ParamBasicValue>) =>
	getUrl({
		query: {
			processingPayment: true,
			...extraQuery,
		},
	});

export const usePaymentStatus = ({
	chargeStatus,
	authorizeStatus,
}: {
	chargeStatus: CheckoutChargeStatusEnum | OrderChargeStatusEnum;
	authorizeStatus: CheckoutAuthorizeStatusEnum | OrderAuthorizeStatusEnum;
}): PaymentStatus => {
	if (chargeStatus === "NONE" && authorizeStatus === "FULL") {
		return "authorized";
	}

	if (chargeStatus === "FULL") {
		return "paidInFull";
	}

	if (chargeStatus === "OVERCHARGED") {
		return "overpaid";
	}

	return "none";
};
