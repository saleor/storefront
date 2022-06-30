import { FetchResponse } from "@/checkout/hooks/useFetch";
import { envVars } from "@/checkout/lib/utils";
import { AppConfig } from "@/checkout/providers/AppConfigProvider/types";
import { PayRequestBody } from "checkout-app/types/api/pay";
import { PaymentStatusResponse } from "checkout-app/types/api/payment-status";
import { PayResult } from "./types";
import { ChannelActivePaymentProvidersByChannel } from "checkout-app/types";
import urlJoin from "url-join";

export type PaymentMethodsRequestArgs = {
  channelId: string;
};

export const getPaymentMethods = ({
  channelId,
}: PaymentMethodsRequestArgs): FetchResponse<ChannelActivePaymentProvidersByChannel> =>
  fetch(urlJoin(envVars.checkoutApiUrl, "active-payment-providers", channelId));

export const pay = (body: PayRequestBody): FetchResponse<PayResult> =>
  fetch(urlJoin(envVars.checkoutApiUrl, "pay"), {
    method: "POST",
    body: JSON.stringify(body),
  });

export const getAppConfig = (): FetchResponse<AppConfig> =>
  fetch(urlJoin(envVars.checkoutApiUrl, "customization-settings"));

export const getOrderPaymentStatus = ({
  orderId,
}: {
  orderId: string;
}): FetchResponse<PaymentStatusResponse> =>
  fetch(urlJoin(envVars.checkoutApiUrl, "payment-status", orderId));
