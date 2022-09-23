import {
  createDropInAdyenPayment,
  createDropInAdyenSession,
} from "@/checkout-storefront/fetch/requests";
import { useCheckout, useFetch } from "@/checkout-storefront/hooks";
import { useAppConfig } from "@/checkout-storefront/providers/AppConfigProvider";
import AdyenCheckout from "@adyen/adyen-web";
import { memo, useEffect, useRef } from "react";
import { PaymentResponse as AdyenPaymentResponse } from "@adyen/api-library/lib/src/typings/checkout/paymentResponse";
import { useEvent } from "@/checkout-storefront/hooks/useEvent";
import {
  AdyenCheckoutInstanceOnAdditionalDetails,
  AdyenCheckoutInstanceOnSubmit,
  createAdyenCheckoutInstance,
} from "./createAdyenCheckout";
import { Checkout } from "@/checkout-storefront/graphql";

type AdyenCheckoutInstance = Awaited<ReturnType<typeof AdyenCheckout>>;

interface AdyenDropInProps {}

// fake function just to get the type because can't import it :(
const _hack = (adyenCheckout: AdyenCheckoutInstance) =>
  adyenCheckout.create("dropin").mount("#dropin-container");
type DropinElement = ReturnType<typeof _hack>;

export const AdyenDropIn = memo<AdyenDropInProps>(({}) => {
  const {
    env: { checkoutApiUrl },
  } = useAppConfig();

  const { checkout, loading: isCheckoutLoading } = useCheckout();

  const [, fetchCreateDropInAdyenPayment] = useFetch(createDropInAdyenPayment, {
    skip: true,
  });

  const onSubmit: AdyenCheckoutInstanceOnSubmit = useEvent(async (state, component) => {
    const result = await fetchCreateDropInAdyenPayment({
      checkoutApiUrl,
      totalAmount: checkout.totalPrice.gross.amount,
      checkoutId: checkout.id,
      method: "dropin",
      provider: "adyen",
      redirectUrl: window.location.href,
      adyenStateData: state.data,
    });

    if (!result || "message" in result) {
      // @todo handle error ?
      console.error(result);
      return;
    }
    if (result?.payment.action) {
      // @todo Drop-in will handle the required action, depending on the action.type.
      // You will then need to make one more API call to verify the payment result.
      return;
    } else {
      switch (result.payment.resultCode) {
        // @todo https://docs.adyen.com/online-payments/payment-result-codes
        case AdyenPaymentResponse.ResultCodeEnum.AuthenticationFinished:
        case AdyenPaymentResponse.ResultCodeEnum.Cancelled:
        case AdyenPaymentResponse.ResultCodeEnum.ChallengeShopper:
        case AdyenPaymentResponse.ResultCodeEnum.Error:
        case AdyenPaymentResponse.ResultCodeEnum.IdentifyShopper:
        case AdyenPaymentResponse.ResultCodeEnum.Pending:
        case AdyenPaymentResponse.ResultCodeEnum.PresentToShopper:
        case AdyenPaymentResponse.ResultCodeEnum.Received:
        case AdyenPaymentResponse.ResultCodeEnum.RedirectShopper:
        case AdyenPaymentResponse.ResultCodeEnum.Refused: {
          console.error(result);
          component.setStatus("error", {
            message: `${result.payment.resultCode}: ${result.payment.refusalReason}`,
          });
          return;
        }

        case AdyenPaymentResponse.ResultCodeEnum.Authorised:
        case AdyenPaymentResponse.ResultCodeEnum.Success: {
          const newUrl = `?order=${result.orderId}`;
          window.location.href = newUrl;
          return;
        }
      }
    }
  });

  const onAdditionalDetails: AdyenCheckoutInstanceOnAdditionalDetails = useEvent(
    (_state, _component) => {
      // @todo Your function calling your server to make a `/payments/details` request
    }
  );

  const { dropinContainerElRef } = useDropinAdyenElement(
    checkoutApiUrl,
    checkout,
    isCheckoutLoading,
    onSubmit,
    onAdditionalDetails
  );

  return <div ref={dropinContainerElRef} />;
});
AdyenDropIn.displayName = "AdyenDropIn";

function useDropinAdyenElement(
  checkoutApiUrl: string,
  checkout: Checkout,
  isCheckoutLoading: boolean,
  onSubmit: AdyenCheckoutInstanceOnSubmit,
  onAdditionalDetails: AdyenCheckoutInstanceOnAdditionalDetails
) {
  const dropinContainerElRef = useRef<HTMLDivElement>(null);
  const dropinComponentRef = useRef<DropinElement | null>(null);

  const [adyenSessionResponse] = useFetch(createDropInAdyenSession, {
    args: {
      checkoutApiUrl,
      checkoutId: checkout?.id,
      // we send 0 here and update it later inside `onSubmit`
      totalAmount: 0,
      currency: checkout?.totalPrice?.gross?.currency,
      provider: "adyen",
      method: "dropin",
      redirectUrl: window.location.href,
    },
    skip: isCheckoutLoading,
  });

  useEffect(() => {
    if (!dropinContainerElRef.current || !adyenSessionResponse.data) {
      return;
    }

    createAdyenCheckoutInstance(adyenSessionResponse.data, { onSubmit, onAdditionalDetails })
      .then((adyenCheckout) => {
        dropinComponentRef.current = adyenCheckout
          .create("dropin")
          .mount(dropinContainerElRef.current!);
      })
      .catch(console.error);

    return () => {
      dropinComponentRef.current?.unmount();
    };
  }, [adyenSessionResponse.data]);

  return { dropinContainerElRef };
}
