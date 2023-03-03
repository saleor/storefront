import { FormDataBase, hasErrors, UseFormReturn } from "@/checkout-storefront/hooks/useForm";
import {
  CheckoutFormScope,
  useCheckoutValidationActions,
  useCheckoutValidationState,
} from "@/checkout-storefront/state/checkoutValidationStateStore";
import { useCheckoutUpdateStateActions } from "@/checkout-storefront/state/updateStateStore";
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
  const { setSubmitInProgress } = useCheckoutUpdateStateActions();
  const { setValidationState } = useCheckoutValidationActions();
  const { validating } = useCheckoutValidationState();

  const { values, validateForm, setTouched } = form;

  console.log({ validating });

  const handleGlobalValidationTrigger = useCallback(async () => {
    console.log(`handleGlobalValidationTrigger`, validating);
    if (validating) {
      const formErrors = await validateForm(values);
      console.log({ formErrors });
      if (!hasErrors(formErrors)) {
        setValidationState(scope, "valid");
        return;
      }

      await setTouched(
        Object.keys(formErrors).reduce((result, key) => ({ ...result, [key]: true }), {})
      );

      setSubmitInProgress(false);
      setValidationState(scope, "invalid");
    }
  }, [
    scope,
    setSubmitInProgress,
    setTouched,
    setValidationState,
    validateForm,
    validating,
    values,
  ]);

  useEffect(() => {
    console.log({ skip });
    if (!skip) {
      void handleGlobalValidationTrigger();
    }
  }, [handleGlobalValidationTrigger, skip]);
};
