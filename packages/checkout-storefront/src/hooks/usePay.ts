import { pay as payRequest, PaySuccessResult } from "@/checkout-storefront/fetch";
import { useFetch } from "@/checkout-storefront/hooks/useFetch";
import { getQueryParams, replaceUrl } from "@/checkout-storefront/lib/utils";
import { OrderBody, CheckoutBody } from "checkout-common";
import { useCallback } from "react";
import { useAppConfig } from "../providers/AppConfigProvider";

const getRedirectUrl = () => {
  const url = new URL(window.location.href);
  const redirectUrl = url.searchParams.get("redirectUrl");

  // get redirectUrl from query params (passed from storefront)
  if (redirectUrl) {
    return redirectUrl;
  }

  // return existing url without any search params
  return location.origin + location.pathname;
};

export const usePay = () => {
  const [{ loading, error, data }, pay] = useFetch(payRequest, { skip: true });
  const {
    env: { checkoutApiUrl },
  } = useAppConfig();

  const checkoutPay = useCallback(
    async ({ provider, method, checkoutId, totalAmount }: Omit<CheckoutBody, "redirectUrl">) => {
      const redirectUrl = getRedirectUrl();
      const result = await pay({
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
          query: { locale: getQueryParams().locale, checkout: undefined, order: orderId },
        });
        window.location.href = paymentUrl;
      }
      if (!result?.ok && result?.orderId) {
        // Order created, payment creation failed, checkout doesn't exist
        const newUrl = replaceUrl({
          query: { checkout: undefined, order: result?.orderId },
        });
        window.location.href = newUrl;
      }
      return result;
    },
    [checkoutApiUrl, pay]
  );

  const orderPay = async ({
    provider,
    orderId,
    method,
  }: Omit<OrderBody, "redirectUrl" | "checkoutApiUrl">) => {
    const redirectUrl = getRedirectUrl();
    const result = await pay({
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
