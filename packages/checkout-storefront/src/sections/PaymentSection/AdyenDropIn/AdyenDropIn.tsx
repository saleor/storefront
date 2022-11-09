import {
  createDropInAdyenPayment,
  createDropInAdyenSession,
  handleDropInAdyenPaymentDetails,
} from "@/checkout-storefront/fetch/requests";

import type { PaymentResponse as AdyenWebPaymentResponse } from "@adyen/adyen-web/dist/types/components/types";

import { useAlerts, useCheckout, useFetch } from "@/checkout-storefront/hooks";
import { useAppConfig } from "@/checkout-storefront/providers/AppConfigProvider";
import AdyenCheckout from "@adyen/adyen-web";
import { memo, useEffect, useRef, useState } from "react";
import { useEvent } from "@/checkout-storefront/hooks/useEvent";
import {
  AdyenCheckoutInstanceOnAdditionalDetails,
  AdyenCheckoutInstanceOnSubmit,
  createAdyenCheckoutInstance,
  handlePaymentResult,
} from "./createAdyenCheckout";
import { Checkout } from "@/checkout-storefront/graphql";

type AdyenCheckoutInstance = Awaited<ReturnType<typeof AdyenCheckout>>;

interface AdyenDropInProps {}

// fake function just to get the type because can't import it :(
const _hack = (adyenCheckout: AdyenCheckoutInstance) =>
  adyenCheckout.create("dropin").mount("#dropin-container");
type DropinElement = ReturnType<typeof _hack>;

export const AdyenDropIn = memo<AdyenDropInProps>(() => {
  const {
    env: { checkoutApiUrl },
  } = useAppConfig();

  const { checkout, loading: isCheckoutLoading } = useCheckout();

  const { showCustomErrors } = useAlerts("checkoutPay");

  const [, fetchCreateDropInAdyenPayment] = useFetch(createDropInAdyenPayment, {
    skip: true,
  });
  const [, fetchHandleDropInAdyenPaymentDetails] = useFetch(handleDropInAdyenPaymentDetails, {
    skip: true,
  });

  const onSubmit: AdyenCheckoutInstanceOnSubmit = useEvent(async (state, component) => {
    component.setStatus("loading");

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
      console.error(result);
      showCustomErrors([{ message: result?.message || "Something went wrong…" }]);
      component.setStatus("ready");
      return;
    }

    if (result.payment.action) {
      component.handleAction(
        // discrepancy between adyen-api and adyen-web types 🤦‍♂️
        result.payment.action as unknown as Exclude<AdyenWebPaymentResponse["action"], undefined>
      );
      return;
    } else {
      return handlePaymentResult(result, component);
    }
  });

  const onAdditionalDetails: AdyenCheckoutInstanceOnAdditionalDetails = useEvent(
    async (state, component) => {
      const result = await fetchHandleDropInAdyenPaymentDetails({
        checkoutApiUrl,
        adyenStateData: state.data,
      });
      if (!result || "message" in result) {
        console.error(result);
        showCustomErrors([{ message: result?.message || "Something went wrong…" }]);
        component.setStatus("ready");
        return;
      }

      return handlePaymentResult(result, component);
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
  const [adyenCheckoutInstanceCreationStatus, setAdyenCheckoutInstanceCreationStatus] = useState<
    "IDLE" | "IN_PROGRESS" | "DONE" | "ERROR"
  >("IDLE");

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
    if (
      !dropinContainerElRef.current ||
      !adyenSessionResponse.data ||
      "message" in adyenSessionResponse.data ||
      adyenCheckoutInstanceCreationStatus === "IN_PROGRESS" ||
      adyenCheckoutInstanceCreationStatus === "DONE"
    ) {
      return;
    }

    setAdyenCheckoutInstanceCreationStatus("IN_PROGRESS");
    createAdyenCheckoutInstance(adyenSessionResponse.data, { onSubmit, onAdditionalDetails })
      .then((adyenCheckout) => {
        dropinComponentRef.current = adyenCheckout
          .create("dropin")
          .mount(dropinContainerElRef?.current as HTMLDivElement);
        setAdyenCheckoutInstanceCreationStatus("DONE");
      })
      .catch((err) => {
        setAdyenCheckoutInstanceCreationStatus("ERROR");
        console.error(err);
      });

    return () => {
      dropinComponentRef.current?.unmount();
    };
  }, [
    adyenCheckoutInstanceCreationStatus,
    adyenSessionResponse.data,
    onAdditionalDetails,
    onSubmit,
  ]);

  return { dropinContainerElRef };
}
