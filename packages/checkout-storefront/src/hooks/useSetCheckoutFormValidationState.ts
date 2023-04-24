import { FormDataBase, hasErrors, UseFormReturn } from "@/checkout-storefront/hooks/useForm";
import {
  CheckoutFormScope,
  useCheckoutValidationActions,
} from "@/checkout-storefront/state/checkoutValidationStateStore";
import { useCallback } from "react";

export const useSetCheckoutFormValidationState = (scope: CheckoutFormScope) => {
  const { setValidationState } = useCheckoutValidationActions();

  const setCheckoutFormValidationState = useCallback(
    async <TData extends FormDataBase>({
      validateForm,
      setTouched,
      values,
    }: Pick<UseFormReturn<TData>, "validateForm" | "setTouched" | "values">) => {
      const formErrors = validateForm(values);

      if (!hasErrors(formErrors)) {
        setValidationState(scope, "valid");
        return;
      }

      await setTouched(
        Object.keys(formErrors).reduce((result, key) => ({ ...result, [key]: true }), {})
      );

      setValidationState(scope, "invalid");
    },
    [scope, setValidationState]
  );

  return {
    setCheckoutFormValidationState,
  };
};
