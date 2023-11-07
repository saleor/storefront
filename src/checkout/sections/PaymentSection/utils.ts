import { compact } from "lodash-es";
import { adyenGatewayId } from "./AdyenDropIn/types";
import { stripeGatewayId } from "./StripeElements/types";
import {
	type CheckoutAuthorizeStatusEnum,
	type CheckoutChargeStatusEnum,
	type OrderAuthorizeStatusEnum,
	type OrderChargeStatusEnum,
	type PaymentGateway,
} from "@/checkout/graphql";
import { type MightNotExist } from "@/checkout/lib/globalTypes";
import { getUrl } from "@/checkout/lib/utils/url";
import { type PaymentStatus } from "@/checkout/sections/PaymentSection/types";

export const supportedPaymentGateways = [adyenGatewayId, stripeGatewayId] as const;

export const getFilteredPaymentGateways = (
	paymentGateways: MightNotExist<PaymentGateway[]>,
): PaymentGateway[] => {
	if (!paymentGateways) {
		return [];
	}

	// we want to use only payment apps, not plugins
	return compact(paymentGateways).filter(({ id, name }) => {
		const shouldBeIncluded = supportedPaymentGateways.includes(id);
		const isAPlugin = !id.startsWith("app.");

		// app is missing in our codebase but is an app and not a plugin
		// hence we'd like to have it handled by default
		if (!shouldBeIncluded && !isAPlugin) {
			console.warn(`Unhandled payment gateway - name: ${name}, id: ${id}`);
			return false;
		}

		return shouldBeIncluded;
	});
};

export const getUrlForTransactionInitialize = () => getUrl({ query: { processingPayment: true } });

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
