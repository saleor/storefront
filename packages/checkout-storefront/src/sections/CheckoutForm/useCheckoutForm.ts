import { Errors, useCheckout, useErrorMessages } from "@/checkout-storefront/hooks";
import { useValidationResolver } from "@/checkout-storefront/lib/utils";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useCheckoutFormValidation } from "@/checkout-storefront/sections/CheckoutForm/useCheckoutFormValidation";
import { CheckoutFormData } from "@/checkout-storefront/sections/CheckoutForm/types";
import { useSetFormErrors } from "@/checkout-storefront/hooks/useSetFormErrors/useSetFormErrors";
import { useCheckoutUpdateStateStore } from "@/checkout-storefront/hooks/useCheckoutUpdateStateStore";
import shallow from "zustand/shallow";

export type UseCheckoutFormProps = {
  userRegisterErrors: Errors<CheckoutFormData>;
  checkoutFinalize: (formData: CheckoutFormData) => void;
};

export const useCheckoutForm = ({ userRegisterErrors, checkoutFinalize }: UseCheckoutFormProps) => {
  const { errorMessages } = useErrorMessages();
  const { checkout } = useCheckout();
  const { updateState, loadingCheckout } = useCheckoutUpdateStateStore(
    ({ updateState, loadingCheckout }) => ({ updateState, loadingCheckout }),
    shallow
  );

  const hasFinishedApiChangesWithNoError =
    !Object.values(updateState).some((status) => status === "loading") &&
    !Object.values(updateState).some((status) => status === "error") &&
    !loadingCheckout;

  const [isProcessingApiChanges, setIsProcessingApiChanges] = useState(false);
  const [submitInProgress, setSubmitInProgress] = useState(false);

  const schema = useMemo(
    () =>
      object({
        password: string().required(errorMessages.required),
        email: string().email(errorMessages.invalid).required(errorMessages.required),
      }),
    [errorMessages.invalid, errorMessages.required]
  );

  const resolver = useValidationResolver(schema);
  // will be used for e.g. account creation at checkout finalization
  const methods = useForm<CheckoutFormData>({
    resolver,
    mode: "onBlur",
    defaultValues: {
      createAccount: false,
      email: checkout?.email || "",
      password: "",
      validating: false,
    },
  });

  useSetFormErrors<CheckoutFormData>({
    setError: methods.setError,
    errors: userRegisterErrors,
  });

  const { getValues } = methods;

  const ensureValidCheckout = useCheckoutFormValidation({
    ...methods,
    schema,
  });

  // not using form handleSubmit because it wouldn't allow us to have
  // a flow with steps and errors in between
  const handleSubmit = useCallback(() => {
    if (!hasFinishedApiChangesWithNoError) {
      setIsProcessingApiChanges(true);
      setSubmitInProgress(true);
      return;
    }

    setSubmitInProgress(false);
    if (!ensureValidCheckout()) {
      return;
    }

    checkoutFinalize(getValues());
  }, [checkoutFinalize, ensureValidCheckout, getValues, hasFinishedApiChangesWithNoError]);

  useEffect(() => {
    if (!hasFinishedApiChangesWithNoError) {
      return;
    }

    setIsProcessingApiChanges(false);

    if (submitInProgress) {
      handleSubmit();
    }
  }, [handleSubmit, submitInProgress, hasFinishedApiChangesWithNoError]);

  return { methods, handleSubmit, isProcessingApiChanges };
};
