import {
  createDropInAdyenPayment,
  createDropInAdyenSession,
  handleDropInAdyenPaymentDetails,
} from "@/checkout-storefront/fetch/requests";

import type { PaymentResponse as AdyenWebPaymentResponse } from "@adyen/adyen-web/dist/types/components/types";

import { useAlerts, useCheckout, useFetch } from "@/checkout-storefront/hooks";
import { useAppConfig } from "@/checkout-storefront/providers/AppConfigProvider";
import AdyenCheckout from "@adyen/adyen-web";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useEvent } from "@/checkout-storefront/hooks/useEvent";
import {
  AdyenCheckoutInstanceOnAdditionalDetails,
  AdyenCheckoutInstanceOnSubmit,
  AdyenCheckoutInstanceState,
  createAdyenCheckoutInstance,
  handlePaymentResult,
} from "./createAdyenCheckout";
import { Checkout } from "@/checkout-storefront/graphql";
import { useCheckoutSubmit } from "../../CheckoutForm/useCheckoutSubmit";
import { useCheckoutValidationState } from "@/checkout-storefront/state/checkoutValidationStateStore";
import { useLocale } from "@/checkout-storefront/hooks/useLocale";

type AdyenCheckoutInstance = Awaited<ReturnType<typeof AdyenCheckout>>;

interface AdyenDropInProps {}

// fake function just to get the type because can't import it :(
const _hack = (adyenCheckout: AdyenCheckoutInstance) =>
  adyenCheckout.create("dropin").mount("#dropin-container");
type DropinElement = ReturnType<typeof _hack>;

export const AdyenDropIn = memo<AdyenDropInProps>(() => {
  const {
    env: { checkoutApiUrl },
    saleorApiUrl,
  } = useAppConfig();

  const { checkout, loading: isCheckoutLoading } = useCheckout();
  const { validating } = useCheckoutValidationState();
  const { allFormsValid, validateAllForms } = useCheckoutSubmit();

  const { showCustomErrors } = useAlerts("checkoutPay");

  const [, fetchCreateDropInAdyenPayment] = useFetch(createDropInAdyenPayment, {
    skip: true,
  });
  const [, fetchHandleDropInAdyenPaymentDetails] = useFetch(handleDropInAdyenPaymentDetails, {
    skip: true,
  });

  const [adyenCheckoutSubmitParams, setAdyenCheckoutSubmitParams] = useState<{
    state: AdyenCheckoutInstanceState;
    component: DropinElement;
  } | null>(null);

  const onSubmit: AdyenCheckoutInstanceOnSubmit = useEvent(async (state, component) => {
    component.setStatus("loading");
    validateAllForms();
    setAdyenCheckoutSubmitParams({ state, component });
  });

  const afterSubmit = useCallback(async () => {
    if (!validating && !allFormsValid && adyenCheckoutSubmitParams) {
      // validated, failed, let's reset the state
      adyenCheckoutSubmitParams.component.setStatus("ready");
      setAdyenCheckoutSubmitParams(null);
      return;
    }

    if (!allFormsValid || !adyenCheckoutSubmitParams || validating) {
      // not validated yet, or still validating, or not all forms valid
      return;
    }

    const result = await fetchCreateDropInAdyenPayment({
      checkoutApiUrl,
      saleorApiUrl,
      totalAmount: checkout.totalPrice.gross.amount,
      checkoutId: checkout.id,
      method: "dropin",
      provider: "adyen",
      redirectUrl: window.location.href,
      adyenStateData: adyenCheckoutSubmitParams.state.data,
    });

    if (!result || "message" in result) {
      console.error(result);
      showCustomErrors([{ message: result?.message || "Something went wrong…" }]);
      adyenCheckoutSubmitParams.component.setStatus("ready");
      return;
    }

    if (result.payment.action) {
      adyenCheckoutSubmitParams.component.handleAction(
        // discrepancy between adyen-api and adyen-web types 🤦‍♂️
        result.payment.action as unknown as Exclude<AdyenWebPaymentResponse["action"], undefined>
      );
      return;
    } else {
      return handlePaymentResult(saleorApiUrl, result, adyenCheckoutSubmitParams.component);
    }
  }, [
    adyenCheckoutSubmitParams,
    allFormsValid,
    checkout.id,
    checkout.totalPrice.gross.amount,
    checkoutApiUrl,
    fetchCreateDropInAdyenPayment,
    saleorApiUrl,
    showCustomErrors,
    validating,
  ]);

  useEffect(() => {
    void afterSubmit();
  }, [afterSubmit]);

  const onAdditionalDetails: AdyenCheckoutInstanceOnAdditionalDetails = useEvent(
    async (state, component) => {
      const result = await fetchHandleDropInAdyenPaymentDetails({
        saleorApiUrl,
        checkoutApiUrl,
        adyenStateData: state.data,
      });
      if (!result || "message" in result) {
        console.error(result);
        showCustomErrors([{ message: result?.message || "Something went wrong…" }]);
        component.setStatus("ready");
        return;
      }

      return handlePaymentResult(saleorApiUrl, result, component);
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
  const { saleorApiUrl } = useAppConfig();
  const { locale } = useLocale();
  const previousLocale = useRef(locale);

  const [adyenSessionResponse] = useFetch(createDropInAdyenSession, {
    args: {
      checkoutApiUrl,
      saleorApiUrl,
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

  // reset dropin on locale change
  useEffect(() => {
    if (previousLocale.current !== locale) {
      if (dropinComponentRef.current) {
        dropinComponentRef.current.unmount();
      }
      setAdyenCheckoutInstanceCreationStatus("IDLE");
    }
    previousLocale.current = locale;
  }, [locale]);

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
    createAdyenCheckoutInstance(adyenSessionResponse.data, {
      onSubmit,
      onAdditionalDetails,
      locale,
    })
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
    locale,
  ]);

  return { dropinContainerElRef };
}
