import { urlJoinTrailingSlash } from "./urlJoin";
import { type FetchResponse } from "@/checkout/src/hooks/useFetch";
import { type AppConfig } from "@/checkout/src/providers/AppConfigProvider/types";

export const PaymentMethods = ["creditCard", "applePay", "paypal", "dropin", "dummy"] as const;
export type PaymentMethodID = typeof PaymentMethods[number];

export type MollieProviderSettingID = "profileId" | "apiKey";
export const adyenProviderSettingIDs = [
  "merchantAccount",
  "hmac",
  "username",
  "password",
  "apiKey",
  "clientKey",
] as const;
export type AdyenProviderSettingID = typeof adyenProviderSettingIDs[number];

export type StripeProviderSettingID = "publishableKey" | "secretKey" | "webhookSecret";

export type PaymentProviderToSettings = {
  mollie: MollieProviderSettingID;
  adyen: AdyenProviderSettingID;
  stripe: StripeProviderSettingID;
  dummy: "dummyKey";
};

export const PaymentProviders: readonly (keyof PaymentProviderToSettings)[] = [
  "mollie",
  "adyen",
  "stripe",
  "dummy",
] as const;
export type PaymentProviderID = typeof PaymentProviders[number];

type BaseBody = {
  provider: PaymentProviderID;
  method: PaymentMethodID;
  redirectUrl: string;
  // captureAmount?: number; // support for partial payments
};

export type OrderBody = {
  orderId: string;
} & BaseBody;

export type DummyPayRequestBody = {
  checkoutApiUrl: string;
  saleorApiUrl: string;
  amountCharged: {
    amount: number;
    currency: string;
  };
} & Pick<OrderBody, "orderId">;

export type DummyPayRequestResult =
  | {
      ok: true;
    }
  | { ok: false; error: string };

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
