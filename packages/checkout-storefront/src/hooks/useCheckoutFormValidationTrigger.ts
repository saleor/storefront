import { FormDataBase, UseFormReturn } from "@/checkout-storefront/hooks/useForm";
import {
  CheckoutFormScope,
  useCheckoutValidationActions,
  useCheckoutValidationState,
} from "@/checkout-storefront/state/checkoutValidationStateStore";
import { useCallback, useEffect } from "react";

interface UseCheckoutFormValidationTriggerProps<TData extends FormDataBase> {
  scope: CheckoutFormScope;
  form: Pick<UseFormReturn<TData>, "validateForm" | "values">;
}

// tells forms to validate once the pay button is clicked
export const useCheckoutFormValidationTrigger = <TData extends FormDataBase>({
  scope,
  form,
}: UseCheckoutFormValidationTriggerProps<TData>) => {
  const { setValidationState } = useCheckoutValidationActions();
  const { validating } = useCheckoutValidationState();

  const { values, validateForm } = form;

  const handleGlobalValidationTrigger = useCallback(async () => {
    if (validating) {
      const formValid = await validateForm(values);
      if (formValid) {
        setValidationState(scope, "valid");
        return;
      }

      setValidationState(scope, "invalid");
    }
  }, [scope, setValidationState, validateForm, validating, values]);

  useEffect(() => {
    void handleGlobalValidationTrigger();
  }, [handleGlobalValidationTrigger]);
};
