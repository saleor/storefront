import { pay as payRequest, PaySuccessResult } from "@/checkout/fetch";
import { useFetch } from "@/checkout/hooks/useFetch";
import { OrderBody, CheckoutBody } from "checkout-app/types/api/pay";

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
  const [{ loading }, pay] = useFetch(payRequest, { skip: true });

  const checkoutPay = async ({
    provider,
    checkoutId,
    totalAmount,
  }: Omit<CheckoutBody, "redirectUrl">) => {
    const redirectUrl = getRedirectUrl();
    const result = await pay({
      provider,
      checkoutId,
      totalAmount,
      redirectUrl,
    });

    if ((result as PaySuccessResult)?.data?.paymentUrl) {
      const {
        orderId,
        data: { paymentUrl },
      } = result as PaySuccessResult;

      const newUrl = `?order=${orderId}`;

      window.history.replaceState(
        { ...window.history.state, as: newUrl, url: newUrl },
        "",
        newUrl
      );
      window.location.href = paymentUrl;
    }

    return result;
  };

  const orderPay = async ({
    provider,
    orderId,
  }: Omit<OrderBody, "redirectUrl">) => {
    const redirectUrl = getRedirectUrl();
    const result = await pay({
      provider,
      orderId,
      redirectUrl,
    });

    if ((result as PaySuccessResult)?.data?.paymentUrl) {
      window.location.href = (result as PaySuccessResult).data.paymentUrl;
    }

    return result;
  };

  return { orderPay, checkoutPay, loading };
};
