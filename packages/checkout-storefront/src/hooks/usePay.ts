import { pay as payRequest, PaySuccessResult } from "@/checkout-storefront/fetch";
import { useFetch } from "@/checkout-storefront/hooks/useFetch";
import { getQueryParams, replaceUrl } from "@/checkout-storefront/lib/utils/url";
import { OrderBody, CheckoutBody } from "checkout-common";
import { useCallback } from "react";
import { useAppConfig } from "../providers/AppConfigProvider";

const getRedirectUrl = (saleorApiUrl: string) => {
  const url = new URL(window.location.href);
  const redirectUrl = url.searchParams.get("redirectUrl");

  // get redirectUrl from query params (passed from storefront)
  if (redirectUrl) {
    return redirectUrl;
  }

  url.searchParams.set("saleorApiUrl", saleorApiUrl);
  // return existing url without any other search params
  return location.origin + location.pathname;
};

export const usePay = () => {
  const [{ loading, error, data }, pay] = useFetch(payRequest, { skip: true });
  const {
    env: { checkoutApiUrl },
    saleorApiUrl,
  } = useAppConfig();

  const checkoutPay = useCallback(
    async ({ provider, method, checkoutId, totalAmount }: Omit<CheckoutBody, "redirectUrl">) => {
      const redirectUrl = getRedirectUrl(saleorApiUrl);
      const result = await pay({
        saleorApiUrl,
        checkoutApiUrl,
        provider,
        method,
        checkoutId,
        totalAmount,
        redirectUrl,
      });
      if ((result as PaySuccessResult)?.data?.paymentUrl) {
        const {
          orderId,
          data: { paymentUrl },
        } = result as PaySuccessResult;
        const domain = new URL(saleorApiUrl).hostname;
        replaceUrl({
          query: {
            locale: getQueryParams().locale,
            checkout: undefined,
            order: orderId,
            saleorApiUrl,
            // @todo remove `domain`
            // https://github.com/saleor/saleor-dashboard/issues/2387
            // https://github.com/saleor/saleor-app-sdk/issues/87
            domain,
          },
        });
        window.location.href = paymentUrl;
      }
      if (!result?.ok && result?.orderId) {
        // Order created, payment creation failed, checkout doesn't exist
        const domain = new URL(saleorApiUrl).hostname;
        const newUrl = replaceUrl({
          query: {
            locale: getQueryParams().locale,
            checkout: undefined,
            order: result?.orderId,
            saleorApiUrl,
            // @todo remove `domain`
            // https://github.com/saleor/saleor-dashboard/issues/2387
            // https://github.com/saleor/saleor-app-sdk/issues/87
            domain,
          },
        });
        window.location.href = newUrl;
      }
      return result;
    },
    [checkoutApiUrl, pay, saleorApiUrl]
  );

  const orderPay = async ({
    provider,
    orderId,
    method,
  }: Omit<OrderBody, "redirectUrl" | "checkoutApiUrl">) => {
    const redirectUrl = getRedirectUrl(saleorApiUrl);
    const result = await pay({
      saleorApiUrl,
      checkoutApiUrl,
      provider,
      method,
      orderId,
      redirectUrl,
    });

    if ((result as PaySuccessResult)?.data?.paymentUrl) {
      window.location.href = (result as PaySuccessResult).data.paymentUrl;
    }

    return result;
  };

  return { orderPay, checkoutPay, loading, error, data };
};
