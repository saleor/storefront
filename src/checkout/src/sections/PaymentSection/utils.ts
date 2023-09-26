import {
  type CheckoutAuthorizeStatusEnum,
  type CheckoutChargeStatusEnum,
  type OrderAuthorizeStatusEnum,
  type OrderChargeStatusEnum,
  type PaymentGateway,
  type PaymentGatewayConfig,
} from "@/checkout/src/graphql";
import { type MightNotExist } from "@/checkout/src/lib/globalTypes";
import { getUrl } from "@/checkout/src/lib/utils/url";
import { adyenGatewayId } from "@/checkout/src/sections/PaymentSection/AdyenDropIn/types";
import {
  type ParsedPaymentGateways,
  type PaymentGatewayId,
  type PaymentStatus,
} from "@/checkout/src/sections/PaymentSection/types";
import { compact } from "lodash-es";

const PAYMENT_PLUGIN_PREFIX = "mirumee";

const paymentGatewayMap: Record<PaymentGatewayId, keyof ParsedPaymentGateways> = {
  [adyenGatewayId]: "adyen",
};

export const getParsedPaymentGatewayConfigs = (
  gatewayConfigs: MightNotExist<PaymentGatewayConfig[]>
): ParsedPaymentGateways => {
  if (!gatewayConfigs) {
    return {};
  }

  return gatewayConfigs.reduce((result, gatewayConfig) => {
    const hasError = !gatewayConfig?.data && !!gatewayConfig?.errors?.length;

    if (!gatewayConfig || hasError) {
      return result;
    }

    const { id, ...rest } = gatewayConfig;

    return {
      ...result,
      [paymentGatewayMap[id as PaymentGatewayId]]: {
        id,
        ...rest,
      },
    };
  }, {});
};

export const getFilteredPaymentGateways = (
  paymentGateways: MightNotExist<PaymentGateway[]>
): PaymentGateway[] => {
  if (!paymentGateways) {
    return [];
  }

  // we want to use only payment apps, not plugins
  return compact(paymentGateways).filter(({ id, name }) => {
    const shouldBeIncluded = Object.keys(paymentGatewayMap).includes(id);
    const isAPlugin = id.includes(PAYMENT_PLUGIN_PREFIX);

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
