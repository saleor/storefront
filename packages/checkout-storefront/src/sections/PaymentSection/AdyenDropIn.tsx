import {
  createDropInAdyenPayment,
  createDropInAdyenSession,
} from "@/checkout-storefront/fetch/requests";
import { useCheckout, useFetch } from "@/checkout-storefront/hooks";
import { useAppConfig } from "@/checkout-storefront/providers/AppConfigProvider";
import AdyenCheckout from "@adyen/adyen-web";
import { CardElementData } from "@adyen/adyen-web/dist/types/components/Card/types";
import DropinElement from "@adyen/adyen-web/dist/types/components/Dropin";
import { AdyenDropInCreateSessionResponse } from "checkout-common";
import { memo, useEffect, useRef, useState } from "react";

type AdyenCheckoutInstance = Awaited<ReturnType<typeof AdyenCheckout>>;

interface AdyenDropInProps {}

export const AdyenDropIn = memo<AdyenDropInProps>(({}) => {
  const {
    env: { checkoutApiUrl },
  } = useAppConfig();

  const dropinContainerElRef = useRef<HTMLDivElement>(null);
  const dropinComponentRef = useRef<DropinElement | null>(null);

  const [adyenCheckoutInstance, setAdyenCheckoutInstance] = useState<AdyenCheckoutInstance | null>(
    null
  );

  console.log(adyenCheckoutInstance);

  const { checkout, loading: isCheckoutLoading } = useCheckout();

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

  useEffect(() => {
    if (!dropinContainerElRef.current || !adyenSessionResponse.data) {
      return;
    }

    AdyenCheckout({
      environment: "test",
      clientKey: adyenSessionResponse.data.clientKey,
      session: {
        id: adyenSessionResponse.data.session.id,
        sessionData: adyenSessionResponse.data.session.sessionData,
      },
      onPaymentCompleted: (result: any, component: any) => {
        console.info(result, component);
      },
      onError: (error: any, component: any) => {
        console.error(error.name, error.message, error.stack, component);
      },
      onSubmit: async (state: {
        isValid?: boolean;
        data: CardElementData & Record<string, any>;
      }) => {
        console.log({ "checkout.totalPrice.gross.amount": checkout.totalPrice.gross.amount });
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
        console.dir(result.payment);
        if (result?.payment.action) {
          // @todo Drop-in will handle the required action, depending on the action.type.
          // You will then need to make one more API call to verify the payment result.
          return;
        } else {
          const newUrl = `?order=${result.orderId}`;
          window.location.href = newUrl;
          return;
        }
      },
      onAdditionalDetails: (
        state: { isValid?: boolean; data: CardElementData & Record<string, any> },
        component: DropinElement
      ) => {
        //  Your function calling your server to make a `/payments/details` request
        console.log("onAdditionalDetails", state, component);
      },
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
    })
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
