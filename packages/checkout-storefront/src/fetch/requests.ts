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
  saleorApiDomain: string;
};

export const getPaymentMethods = ({
  checkoutApiUrl,
  channelId,
  saleorApiDomain,
}: PaymentMethodsRequestArgs): FetchResponse<ChannelActivePaymentProvidersByChannel> =>
  fetch(
    urlJoin(checkoutApiUrl, "active-payment-providers", channelId, `?domain=${saleorApiDomain}`)
  );

export const pay = ({ checkoutApiUrl, ...body }: PayRequestBody): FetchResponse<PayResult> =>
  fetch(urlJoin(checkoutApiUrl, "pay"), {
    method: "POST",
    body: JSON.stringify(body),
  });

export const getAppConfig = ({
  checkoutApiUrl,
  saleorApiDomain,
}: {
  checkoutApiUrl: string;
  saleorApiDomain: string;
}): FetchResponse<AppConfig> =>
  fetch(urlJoin(checkoutApiUrl, `customization-settings?domain=${saleorApiDomain}`));

export const getOrderPaymentStatus = ({
  orderId,
  checkoutApiUrl,
  saleorApiDomain,
}: {
  orderId: string;
  checkoutApiUrl: string;
  saleorApiDomain: string;
}): FetchResponse<PaymentStatusResponse> =>
  fetch(urlJoin(checkoutApiUrl, "payment-status", orderId, `?domain=${saleorApiDomain}`));
