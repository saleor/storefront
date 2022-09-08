import { createDropInAdyenSession } from "@/checkout-storefront/fetch/requests";
import { useFetch } from "@/checkout-storefront/hooks";
import { useAppConfig } from "@/checkout-storefront/providers/AppConfigProvider";
import AdyenCheckout from "@adyen/adyen-web";
import DropinElement from "@adyen/adyen-web/dist/types/components/Dropin";
import { useEffect, useRef, useState } from "react";

type AdyenCheckoutInstance = Awaited<ReturnType<typeof AdyenCheckout>>;

interface AdyenDropInProps {}

export const AdyenDropIn = ({}: AdyenDropInProps) => {
  const {
    env: { checkoutApiUrl },
  } = useAppConfig();

  const dropinContainerElRef = useRef<HTMLDivElement>(null);
  const dropinComponentRef = useRef<DropinElement | null>(null);

  const [checkout, setCheckout] = useState<AdyenCheckoutInstance | null>(null);

  const [adyenSession] = useFetch(createDropInAdyenSession, {
    args: { checkoutApiUrl },
  });

  useEffect(() => {
    if (dropinContainerElRef.current && adyenSession.data) {
      AdyenCheckout({
        environment: "test", // Change to 'live' for the live environment.
        clientKey: adyenSession.data.clientKey,
        session: {
          id: adyenSession.data.session.id,
          sessionData: adyenSession.data.session.sessionData,
        },
        onPaymentCompleted: (result: any, component: any) => {
          console.info(result, component);
        },
        onError: (error: any, component: any) => {
          console.error(error.name, error.message, error.stack, component);
        },
        // Any payment method specific configuration. Find the configuration specific to each payment method:  https://docs.adyen.com/payment-methods
        // For example, this is 3D Secure configuration for cards:
        paymentMethodsConfiguration: {
          card: {
            hasHolderName: true,
            holderNameRequired: true,
            billingAddressRequired: true,
          },
        },
        analytics: {
          enabled: false,
        },
      })
        .then((c) => {
          setCheckout(c);
          dropinComponentRef.current = c.create("dropin").mount("#dropin-container");
        })
        .catch(console.error);
    }

    return () => {
      dropinComponentRef.current?.unmount();
    };
  }, [adyenSession.data]);

  return <div ref={dropinContainerElRef} />;
};
