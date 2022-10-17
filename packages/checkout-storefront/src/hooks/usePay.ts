import { pay as payRequest, PaySuccessResult } from "@/checkout-storefront/fetch";
import { useFetch } from "@/checkout-storefront/hooks/useFetch";
import { getQueryParams, replaceUrl } from "@/checkout-storefront/lib/utils/url";
import { OrderBody, CheckoutBody } from "checkout-common";
import { useCallback } from "react";
import { useAppConfig } from "../providers/AppConfigProvider";

const getRedirectUrl = (saleorApiHost: string) => {
  const url = new URL(window.location.href);
  const redirectUrl = url.searchParams.get("redirectUrl");

  // get redirectUrl from query params (passed from storefront)
  if (redirectUrl) {
    return redirectUrl;
  }

  url.searchParams.set("saleorApiHost", saleorApiHost);
  // return existing url without any other search params
  return location.origin + location.pathname;
};

export const usePay = () => {
  const [{ loading, error, data }, pay] = useFetch(payRequest, { skip: true });
  const {
    env: { checkoutApiUrl },
    saleorApiHost,
  } = useAppConfig();

  const checkoutPay = useCallback(
    async ({ provider, method, checkoutId, totalAmount }: Omit<CheckoutBody, "redirectUrl">) => {
      const redirectUrl = getRedirectUrl(saleorApiHost);
      const result = await pay({
        saleorApiHost,
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
        replaceUrl({
          query: {
            locale: getQueryParams().locale,
            checkout: undefined,
            order: orderId,
            saleorApiHost,
            // @todo remove `domain`
            // https://github.com/saleor/saleor-dashboard/issues/2387
            // https://github.com/saleor/saleor-app-sdk/issues/87
            domain: saleorApiHost,
          },
        });
        window.location.href = paymentUrl;
      }
      if (!result?.ok && result?.orderId) {
        // Order created, payment creation failed, checkout doesn't exist
        const newUrl = replaceUrl({
          query: {
            locale: getQueryParams().locale,
            checkout: undefined,
            order: result?.orderId,
            saleorApiHost,
            // @todo remove `domain`
            // https://github.com/saleor/saleor-dashboard/issues/2387
            // https://github.com/saleor/saleor-app-sdk/issues/87
            domain: saleorApiHost,
          },
        });
        window.location.href = newUrl;
      }
      return result;
    },
    [checkoutApiUrl, pay, saleorApiHost]
  );

  const orderPay = async ({
    provider,
    orderId,
    method,
  }: Omit<OrderBody, "redirectUrl" | "checkoutApiUrl">) => {
    const redirectUrl = getRedirectUrl(saleorApiHost);
    const result = await pay({
      saleorApiHost,
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
