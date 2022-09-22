import { FetchResponse } from "@/checkout-storefront/hooks/useFetch";
import { AppConfig } from "@/checkout-storefront/providers/AppConfigProvider/types";
import {
  PayRequestBody,
  PaymentStatusResponse,
  ChannelActivePaymentProvidersByChannel,
  AdyenDropInCreateSessionResponse,
  PostDropInAdyenSessionsBody,
  PostDropInAdyenPaymentsBody,
  PostAdyenDropInPaymentsResponse,
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
}: PayRequestBody & { checkoutApiUrl: string }): FetchResponse<PayResult> =>
  fetch(urlJoin(checkoutApiUrl, "pay"), {
    method: "POST",
    body: JSON.stringify(body),
  });

export const getAppConfig = ({
  checkoutApiUrl,
}: {
  checkoutApiUrl: string;
}): FetchResponse<AppConfig> => fetch(urlJoin(checkoutApiUrl, "customization-settings"));

export const getOrderPaymentStatus = ({
  orderId,
  checkoutApiUrl,
}: {
  orderId: string;
  checkoutApiUrl: string;
}): FetchResponse<PaymentStatusResponse> =>
  fetch(urlJoin(checkoutApiUrl, "payment-status", orderId));

export const createDropInAdyenSession = ({
  checkoutApiUrl,
  ...body
}: PostDropInAdyenSessionsBody & {
  checkoutApiUrl: string;
}): FetchResponse<AdyenDropInCreateSessionResponse> => {
  return fetch(urlJoin(checkoutApiUrl, "drop-in", "adyen", "sessions", "/"), {
    method: "POST",
    body: JSON.stringify(body),
  });
};

export const createDropInAdyenPayment = ({
  checkoutApiUrl,
  ...body
}: PostDropInAdyenPaymentsBody & {
  checkoutApiUrl: string;
}): FetchResponse<PostAdyenDropInPaymentsResponse | { message: string }> => {
  return fetch(urlJoin(checkoutApiUrl, "drop-in", "adyen", "payments", "/"), {
    method: "POST",
    body: JSON.stringify(body),
  });
};
