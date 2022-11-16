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
  saleorApiUrl: string;
  channelId: string;
  checkoutApiUrl: string;
};

export const getPaymentMethods = ({
  saleorApiUrl,
  checkoutApiUrl,
  channelId,
}: PaymentMethodsRequestArgs): FetchResponse<ChannelActivePaymentProvidersByChannel> =>
  fetch(
    urlJoinTrailingSlash(checkoutApiUrl, "active-payment-providers", channelId) +
      `?` +
      new URLSearchParams({ saleorApiUrl }).toString()
  );

export const pay = ({
  checkoutApiUrl,
  saleorApiUrl,
  ...body
}: PayRequestBody & {
  saleorApiUrl: string;
  checkoutApiUrl: string;
}): FetchResponse<PayResult> =>
  fetch(
    urlJoinTrailingSlash(checkoutApiUrl, "pay") +
      `?` +
      new URLSearchParams({ saleorApiUrl }).toString(),
    {
      method: "POST",
      body: JSON.stringify(body),
    }
  );

export const getAppConfig = ({
  saleorApiUrl,
  checkoutApiUrl,
}: {
  saleorApiUrl: string;
  checkoutApiUrl: string;
}): FetchResponse<AppConfig> =>
  fetch(
    urlJoinTrailingSlash(checkoutApiUrl, "customization-settings") +
      `?` +
      new URLSearchParams({ saleorApiUrl }).toString()
  );

export const getOrderPaymentStatus = ({
  saleorApiUrl,
  orderId,
  checkoutApiUrl,
}: {
  saleorApiUrl: string;
  orderId: string;
  checkoutApiUrl: string;
}): FetchResponse<PaymentStatusResponse> =>
  fetch(
    urlJoinTrailingSlash(checkoutApiUrl, "payment-status", orderId) +
      `?` +
      new URLSearchParams({ saleorApiUrl }).toString()
  );

export const createDropInAdyenSession = ({
  saleorApiUrl,
  checkoutApiUrl,
  ...body
}: PostDropInAdyenSessionsBody & {
  saleorApiUrl: string;
  checkoutApiUrl: string;
}): FetchResponse<AdyenDropInCreateSessionResponse> => {
  return fetch(
    urlJoinTrailingSlash(checkoutApiUrl, "drop-in", "adyen", "sessions") +
      `?` +
      new URLSearchParams({ saleorApiUrl }).toString(),
    {
      method: "POST",
      body: JSON.stringify(body),
    }
  );
};

export const createDropInAdyenPayment = ({
  saleorApiUrl,
  checkoutApiUrl,
  ...body
}: PostDropInAdyenPaymentsBody & {
  saleorApiUrl: string;
  checkoutApiUrl: string;
}): FetchResponse<PostAdyenDropInPaymentsResponse | { message: string }> => {
  return fetch(
    urlJoinTrailingSlash(checkoutApiUrl, "drop-in", "adyen", "payments") +
      `?` +
      new URLSearchParams({ saleorApiUrl }).toString(),
    {
      method: "POST",
      body: JSON.stringify(body),
    }
  );
};

export const handleDropInAdyenPaymentDetails = ({
  saleorApiUrl,
  checkoutApiUrl,
  ...body
}: PostDropInAdyenPaymentsDetailsBody & {
  saleorApiUrl: string;
  checkoutApiUrl: string;
}): FetchResponse<PostAdyenDropInPaymentsDetailsResponse | { message: string }> => {
  return fetch(
    urlJoinTrailingSlash(checkoutApiUrl, "drop-in", "adyen", "payments", "details") +
      `?` +
      new URLSearchParams({ saleorApiUrl }).toString(),
    {
      method: "POST",
      body: JSON.stringify(body),
    }
  );
};

export const dummyPay = ({
  checkoutApiUrl,
  saleorApiUrl,
  ...body
}: DummyPayRequestBody): FetchResponse<DummyPayRequestResult> =>
  fetch(
    urlJoinTrailingSlash(checkoutApiUrl, "dummy-pay") +
      `?` +
      new URLSearchParams({ saleorApiUrl }).toString(),
    {
      method: "POST",
      body: JSON.stringify(body),
    }
  );
