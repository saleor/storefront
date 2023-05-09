import { FormDataBase, UseFormReturn } from "@/checkout-storefront/hooks/useForm";
import { useSetCheckoutFormValidationState } from "@/checkout-storefront/hooks/useSetCheckoutFormValidationState";
import {
  CheckoutFormScope,
  useCheckoutValidationActions,
  useCheckoutValidationState,
} from "@/checkout-storefront/state/checkoutValidationStateStore";
import { useCallback, useEffect } from "react";

interface UseCheckoutFormValidationTriggerProps<TData extends FormDataBase> {
  scope: CheckoutFormScope;
  form: UseFormReturn<TData>;
  skip?: boolean;
}

// tells forms to validate once the pay button is clicked
export const useCheckoutFormValidationTrigger = <TData extends FormDataBase>({
  scope,
  form,
  skip = false,
}: UseCheckoutFormValidationTriggerProps<TData>) => {
  const { validationState } = useCheckoutValidationState();
  const { setCheckoutFormValidationState } = useSetCheckoutFormValidationState(scope);
  const { setValidationState } = useCheckoutValidationActions();

  const validating = validationState[scope] === "validating";

  const handleGlobalValidationTrigger = useCallback(async () => {
    if (validating) {
      if (skip) {
        // we don't validate this form, so just set valid
        setValidationState(scope, "valid");
        return;
      }

      void setCheckoutFormValidationState(form);
    }
  }, [form, scope, setCheckoutFormValidationState, setValidationState, skip, validating]);

  useEffect(() => {
    void handleGlobalValidationTrigger();
  }, [handleGlobalValidationTrigger]);
};
