import {
  CheckoutFormScope,
  useCheckoutValidationActions,
  useCheckoutValidationState,
} from "@/checkout-storefront/hooks/state/useCheckoutValidationStateStore";
import { FormDataBase } from "@/checkout-storefront/lib/globalTypes";
import { useCallback, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

export const useCheckoutFormValidationTrigger = <TData extends FormDataBase>(
  scope: CheckoutFormScope,
  formProps: Pick<UseFormReturn<TData>, "trigger" | "formState">
) => {
  const { setValidationState } = useCheckoutValidationActions();
  const validating = useCheckoutValidationState();

  const { trigger, formState } = formProps;

  const handleGlobalValidationTrigger = useCallback(async () => {
    if (validating) {
      const formValid = await trigger();
      if (formValid) {
        return;
      }

      setValidationState(scope, "invalid");
    }
  }, [formState.errors, trigger, validating]);

  useEffect(() => {
    void handleGlobalValidationTrigger();
  }, [handleGlobalValidationTrigger]);
};
