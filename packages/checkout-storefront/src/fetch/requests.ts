import { FetchResponse } from "@/checkout-storefront/hooks/useFetch";
import { AppConfig } from "@/checkout-storefront/providers/AppConfigProvider/types";
import { DummyPayRequestResult, DummyPayRequestBody } from "checkout-common";
import { urlJoinTrailingSlash } from "./urlJoin";

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
