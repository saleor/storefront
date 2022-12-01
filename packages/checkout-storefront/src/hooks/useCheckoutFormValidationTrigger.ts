import {
  CheckoutFormScope,
  useCheckoutValidationActions,
  useCheckoutValidationState,
} from "@/checkout-storefront/state/checkoutValidationStateStore";
import { FormDataBase } from "@/checkout-storefront/lib/globalTypes";
import { useCallback, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

interface UseCheckoutFormValidationTriggerProps<TData extends FormDataBase> {
  scope: CheckoutFormScope;
  formProps: Pick<UseFormReturn<TData>, "trigger" | "formState">;
}

// tells forms to validate once the pay button is clicked
export const useCheckoutFormValidationTrigger = <TData extends FormDataBase>({
  scope,
  formProps,
}: UseCheckoutFormValidationTriggerProps<TData>) => {
  const { setValidationState } = useCheckoutValidationActions();
  const { validating } = useCheckoutValidationState();

  const { trigger } = formProps;

  const handleGlobalValidationTrigger = useCallback(async () => {
    if (validating) {
      const formValid = await trigger();
      if (formValid) {
        setValidationState(scope, "valid");
        return;
      }

      setValidationState(scope, "invalid");
    }
  }, [scope, setValidationState, trigger, validating]);

  useEffect(() => {
    void handleGlobalValidationTrigger();
  }, [handleGlobalValidationTrigger]);
};
