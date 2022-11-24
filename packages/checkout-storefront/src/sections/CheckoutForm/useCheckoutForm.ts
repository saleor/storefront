import { useCheckoutUpdateState } from "@/checkout-storefront/state/updateStateStore";
import {
  useCheckoutValidationActions,
  useCheckoutValidationState,
} from "@/checkout-storefront/state/checkoutValidationStateStore";
import { useCallback, useEffect, useState } from "react";
import { useCheckoutFinalize } from "@/checkout-storefront/sections/CheckoutForm/useCheckoutFinalize";

export const useCheckoutForm = () => {
  const { validateAllForms } = useCheckoutValidationActions();
  const { validating, validationState } = useCheckoutValidationState();
  const { updateState, loadingCheckout } = useCheckoutUpdateState();
  const { checkoutFinalize } = useCheckoutFinalize();

  const [submitInProgress, setSubmitInProgress] = useState(false);

  const submitInitialize = () => {
    setSubmitInProgress(true);
    validateAllForms();
  };

  const updateStateValues = Object.values(updateState);

  const anyRequestsInProgress = updateStateValues.some((status) => status === "loading");

  const finishedApiChangesWithNoError =
    !updateStateValues.some((status) => status === "loading") &&
    !updateStateValues.some((status) => status === "error") &&
    !loadingCheckout;

  const allFormsValid =
    !validating && !Object.values(validationState).every((value) => value === "valid");

  const handleSubmit = useCallback(async () => {
    console.log({ updateState, submitInProgress, finishedApiChangesWithNoError, allFormsValid });
    if (submitInProgress && finishedApiChangesWithNoError && allFormsValid) {
      void checkoutFinalize();
      return;
    }

    if (!anyRequestsInProgress) {
      setSubmitInProgress(false);
    }
  }, [
    submitInProgress,
    finishedApiChangesWithNoError,
    allFormsValid,
    checkoutFinalize,
    anyRequestsInProgress,
  ]);

  useEffect(
    () => void handleSubmit(),

    [handleSubmit]
  );

  return {
    handleSubmit: submitInitialize,
    isProcessing: submitInProgress && anyRequestsInProgress,
  };
};
