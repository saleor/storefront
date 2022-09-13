import { createDropInAdyenSession } from "@/checkout-storefront/fetch/requests";
import { useCheckout, useFetch } from "@/checkout-storefront/hooks";
import { useAppConfig } from "@/checkout-storefront/providers/AppConfigProvider";
import AdyenCheckout from "@adyen/adyen-web";
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

  const [_adyenCheckoutInstance, setAdyenCheckoutInstance] = useState<AdyenCheckoutInstance | null>(
    null
  );

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

  useEffect(() => {
    if (!dropinContainerElRef.current || !adyenSessionResponse.data) {
      return;
    }

    createAdyenCheckout(adyenSessionResponse.data)
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

function createAdyenCheckout(adyenSessionResponse: AdyenDropInCreateSessionResponse) {
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
