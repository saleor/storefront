import {
  createDropInAdyenPayment,
  createDropInAdyenSession,
} from "@/checkout-storefront/fetch/requests";
import { useCheckout, useFetch } from "@/checkout-storefront/hooks";
import { useAppConfig } from "@/checkout-storefront/providers/AppConfigProvider";
import AdyenCheckout from "@adyen/adyen-web";
import { CardElementData } from "@adyen/adyen-web/dist/types/components/Card/types";
import DropinElement from "@adyen/adyen-web/dist/types/components/Dropin";
import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { PaymentResponse as AdyenPaymentResponse } from "@adyen/api-library/lib/src/typings/checkout/paymentResponse";
import { AdyenDropInCreateSessionResponse } from "checkout-common";

type AdyenCheckoutInstance = Awaited<ReturnType<typeof AdyenCheckout>>;

const useEvent = <Args extends unknown[], R>(handler: (...args: Args) => R) => {
  const handlerRef = useRef<null | ((...args: Args) => R)>(null);

  useLayoutEffect(() => {
    handlerRef.current = handler;
  });

  return useCallback((...args: Args) => {
    return handlerRef.current?.(...args) as R;
  }, []);
};

interface AdyenDropInProps {}

type AdyenCheckoutInstanceOnSubmit = (
  state: {
    isValid?: boolean;
    data: CardElementData & Record<string, any>;
  },
  component: DropinElement
) => Promise<void> | void;

type AdyenCheckoutInstanceOnAdditionalDetails = (
  state: { isValid?: boolean; data: CardElementData & Record<string, any> },
  component: DropinElement
) => Promise<void> | void;

export const AdyenDropIn = memo<AdyenDropInProps>(({}) => {
  const {
    env: { checkoutApiUrl },
  } = useAppConfig();

  const dropinContainerElRef = useRef<HTMLDivElement>(null);
  const dropinComponentRef = useRef<DropinElement | null>(null);

  const [adyenCheckoutInstance, setAdyenCheckoutInstance] = useState<AdyenCheckoutInstance | null>(
    null
  );

  const { checkout, loading: isCheckoutLoading } = useCheckout();
  const getCheckout = () => checkout;

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

  useEffect(() => {
    if (!dropinContainerElRef.current || !adyenSessionResponse.data) {
      return;
    }

    createAdyenCheckoutInstance(adyenSessionResponse.data, { onSubmit, onAdditionalDetails })
      .then((adyenCheckout) => {
        setAdyenCheckoutInstance(adyenCheckout);
        dropinComponentRef.current = adyenCheckout
          .create("dropin")
          .mount(dropinContainerElRef.current!);
      })
      .catch(console.error);

    return () => {
      dropinComponentRef.current?.unmount();
    };
  }, [adyenSessionResponse.data]);

  return <div ref={dropinContainerElRef} />;
});
AdyenDropIn.displayName = "AdyenDropIn";

function createAdyenCheckoutInstance(
  adyenSessionResponse: AdyenDropInCreateSessionResponse,
  {
    onSubmit,
    onAdditionalDetails,
  }: {
    onSubmit: AdyenCheckoutInstanceOnSubmit;
    onAdditionalDetails: AdyenCheckoutInstanceOnAdditionalDetails;
  }
) {
  return AdyenCheckout({
    environment: "test",
    clientKey: adyenSessionResponse.clientKey,
    session: {
      id: adyenSessionResponse.session.id,
      sessionData: adyenSessionResponse.session.sessionData,
    },
    onPaymentCompleted: (result: any, component: any) => {
      console.info(result, component);
    },
    onError: (error: any, component: any) => {
      console.error(error.name, error.message, error.stack, component);
    },
    onSubmit,
    onAdditionalDetails,
    // Any payment method specific configuration. Find the configuration specific to each payment method: https://docs.adyen.com/payment-methods
    // For example, this is 3D Secure configuration for cards:
    paymentMethodsConfiguration: {
      card: {
        hasHolderName: true,
        holderNameRequired: true,
        billingAddressRequired: false,
      },
    },
    analytics: {
      enabled: false,
    },
  });
}
