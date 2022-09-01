import { useEffect, useState } from "react";

interface UseCheckoutFormSubmit {}

export const useCheckoutFormSubmit = () => {
  const [isProcessingApiChanges, setIsProcessingApiChanges] = useState(false);
  const [submitInProgress, setSubmitInProgress] = useState(false);

  const hasFinishedApiChanges = !Object.values(methods.watch("updateState")).some((value) => value);

  useEffect(() => {
    if (!hasFinishedApiChanges) {
      return;
    }

    setIsProcessingApiChanges(false);

    if (submitInProgress) {
      handleSubmit();
    }
  }, [hasFinishedApiChanges]);

  // not using form handleSubmit on purpose
  const handleSubmit = () => {
    if (!hasFinishedApiChanges) {
      setIsProcessingApiChanges(true);
      setSubmitInProgress(true);
      return;
    }

    setSubmitInProgress(false);
    if (!ensureValidCheckout()) {
      return;
    }

    void checkoutFinalize(getFormData());
  };

  return {
    handleSubmit,
    isProcessingApiChanges,
  };
};
