import {
  useCheckoutUpdateState,
  useCheckoutUpdateStateActions,
} from "@/checkout-storefront/state/updateStateStore";
import {
  useCheckoutValidationActions,
  useCheckoutValidationState,
} from "@/checkout-storefront/state/checkoutValidationStateStore";
import { useCallback, useEffect } from "react";
import { useCheckoutFinalize } from "@/checkout-storefront/sections/CheckoutForm/useCheckoutFinalize";
import { useUser } from "@/checkout-storefront/hooks/useUser";

export const useCheckoutSubmit = () => {
  const { user } = useUser();
  const { validateAllForms } = useCheckoutValidationActions();
  const { validating, validationState } = useCheckoutValidationState();
  console.log({ validationState });
  const { updateState, loadingCheckout, submitInProgress } = useCheckoutUpdateState();
  const { setShouldRegisterUser, setSubmitInProgress } = useCheckoutUpdateStateActions();
  const { checkoutFinalize, finalizing } = useCheckoutFinalize();

  const submitInitialize = useCallback(() => {
    setSubmitInProgress(true);
    setShouldRegisterUser(true);

    // only guest forms should be validated here
    if (!user) {
      validateAllForms();
    }
  }, [setShouldRegisterUser, setSubmitInProgress, user, validateAllForms]);

  const updateStateValues = Object.values(updateState);

  const anyRequestsInProgress =
    updateStateValues.some((status) => status === "loading") || loadingCheckout;

  const finishedApiChangesWithNoError =
    !anyRequestsInProgress && updateStateValues.every((status) => status === "success");

  const allFormsValid =
    !validating && Object.values(validationState).every((value) => value === "valid");

  const handleSubmit = useCallback(async () => {
    if (submitInProgress && finishedApiChangesWithNoError && allFormsValid) {
      void checkoutFinalize();
      return;
    }

    if (!validating && !anyRequestsInProgress) {
      setSubmitInProgress(false);
    }
  }, [
    submitInProgress,
    finishedApiChangesWithNoError,
    allFormsValid,
    anyRequestsInProgress,
    checkoutFinalize,
    setSubmitInProgress,
    validating,
  ]);

  useEffect(() => void handleSubmit(), [handleSubmit]);

  return {
    handleSubmit: submitInitialize,
    isProcessing: (submitInProgress && anyRequestsInProgress) || finalizing,
    validateAllForms,
    allFormsValid,
  };
};
