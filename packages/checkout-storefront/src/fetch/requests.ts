import { FetchResponse } from "@/checkout-storefront/hooks/useFetch";
import { AppConfig } from "@/checkout-storefront/providers/AppConfigProvider/types";
import {
  PayRequestBody,
  PaymentStatusResponse,
  ChannelActivePaymentProvidersByChannel,
} from "checkout-common";
import { PayResult } from "./types";
import urlJoin from "url-join";

export type PaymentMethodsRequestArgs = {
  channelId: string;
  checkoutApiUrl: string;
};

export const getPaymentMethods = ({
  checkoutApiUrl,
  channelId,
}: PaymentMethodsRequestArgs): FetchResponse<ChannelActivePaymentProvidersByChannel> =>
  fetch(urlJoin(checkoutApiUrl, "active-payment-providers", channelId));

export const pay = ({
  checkoutApiUrl,
  ...body
}: PayRequestBody): FetchResponse<PayResult> =>
  fetch(urlJoin(checkoutApiUrl, "pay"), {
    method: "POST",
    body: JSON.stringify(body),
  });

export const getAppConfig = ({
  checkoutApiUrl,
}: {
  checkoutApiUrl: string;
}): FetchResponse<AppConfig> =>
  fetch(urlJoin(checkoutApiUrl, "customization-settings"));

export const getOrderPaymentStatus = ({
  orderId,
  checkoutApiUrl,
}: {
  orderId: string;
  checkoutApiUrl: string;
}): FetchResponse<PaymentStatusResponse> =>
  fetch(urlJoin(checkoutApiUrl, "payment-status", orderId));
