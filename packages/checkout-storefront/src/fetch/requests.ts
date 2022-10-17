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
  PostDropInAdyenPaymentsDetailsBody,
  PostAdyenDropInPaymentsDetailsResponse,
  DummyPayRequestResult,
  DummyPayRequestBody,
} from "checkout-common";
import { PayResult } from "./types";
import { urlJoinTrailingSlash } from "./urlJoin";

export type PaymentMethodsRequestArgs = {
  saleorApiHost: string;
  channelId: string;
  checkoutApiUrl: string;
};

export const getPaymentMethods = ({
  saleorApiHost,
  checkoutApiUrl,
  channelId,
}: PaymentMethodsRequestArgs): FetchResponse<ChannelActivePaymentProvidersByChannel> =>
  fetch(
    urlJoinTrailingSlash(checkoutApiUrl, "active-payment-providers", channelId) +
      `?` +
      new URLSearchParams({ saleorApiHost }).toString()
  );

export const pay = ({
  checkoutApiUrl,
  saleorApiHost,
  ...body
}: PayRequestBody & {
  saleorApiHost: string;
  checkoutApiUrl: string;
}): FetchResponse<PayResult> =>
  fetch(
    urlJoinTrailingSlash(checkoutApiUrl, "pay") +
      `?` +
      new URLSearchParams({ saleorApiHost }).toString(),
    {
      method: "POST",
      body: JSON.stringify(body),
    }
  );

export const getAppConfig = ({
  saleorApiHost,
  checkoutApiUrl,
}: {
  saleorApiHost: string;
  checkoutApiUrl: string;
}): FetchResponse<AppConfig> =>
  fetch(
    urlJoinTrailingSlash(checkoutApiUrl, "customization-settings") +
      `?` +
      new URLSearchParams({ saleorApiHost }).toString()
  );

export const getOrderPaymentStatus = ({
  saleorApiHost,
  orderId,
  checkoutApiUrl,
}: {
  saleorApiHost: string;
  orderId: string;
  checkoutApiUrl: string;
}): FetchResponse<PaymentStatusResponse> =>
  fetch(
    urlJoinTrailingSlash(checkoutApiUrl, "payment-status", orderId) +
      `?` +
      new URLSearchParams({ saleorApiHost }).toString()
  );

export const createDropInAdyenSession = ({
  saleorApiHost,
  checkoutApiUrl,
  ...body
}: PostDropInAdyenSessionsBody & {
  saleorApiHost: string;
  checkoutApiUrl: string;
}): FetchResponse<AdyenDropInCreateSessionResponse> => {
  return fetch(
    urlJoinTrailingSlash(checkoutApiUrl, "drop-in", "adyen", "sessions") +
      `?` +
      new URLSearchParams({ saleorApiHost }).toString(),
    {
      method: "POST",
      body: JSON.stringify(body),
    }
  );
};

export const createDropInAdyenPayment = ({
  saleorApiHost,
  checkoutApiUrl,
  ...body
}: PostDropInAdyenPaymentsBody & {
  saleorApiHost: string;
  checkoutApiUrl: string;
}): FetchResponse<PostAdyenDropInPaymentsResponse | { message: string }> => {
  return fetch(
    urlJoinTrailingSlash(checkoutApiUrl, "drop-in", "adyen", "payments") +
      `?` +
      new URLSearchParams({ saleorApiHost }).toString(),
    {
      method: "POST",
      body: JSON.stringify(body),
    }
  );
};

export const handleDropInAdyenPaymentDetails = ({
  saleorApiHost,
  checkoutApiUrl,
  ...body
}: PostDropInAdyenPaymentsDetailsBody & {
  saleorApiHost: string;
  checkoutApiUrl: string;
}): FetchResponse<PostAdyenDropInPaymentsDetailsResponse | { message: string }> => {
  return fetch(
    urlJoinTrailingSlash(checkoutApiUrl, "drop-in", "adyen", "payments", "details") +
      `?` +
      new URLSearchParams({ saleorApiHost }).toString(),
    {
      method: "POST",
      body: JSON.stringify(body),
    }
  );
};

export const dummyPay = ({
  checkoutApiUrl,
  saleorApiHost,
  ...body
}: DummyPayRequestBody): FetchResponse<DummyPayRequestResult> =>
  fetch(
    urlJoinTrailingSlash(checkoutApiUrl, "dummy-pay") +
      `?` +
      new URLSearchParams({ saleorApiHost }).toString(),
    {
      method: "POST",
      body: JSON.stringify(body),
    }
  );
