import {
  CheckoutFormScope,
  useCheckoutValidationActions,
  useCheckoutValidationState,
} from "@/checkout-storefront/hooks/state/useCheckoutValidationStateStore";
import { FormDataBase } from "@/checkout-storefront/lib/globalTypes";
import { useCallback, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

interface UseCheckoutFormValidationTriggerProps<TData extends FormDataBase> {
  scope: CheckoutFormScope;
  formProps: Pick<UseFormReturn<TData>, "trigger" | "formState">;
}

export const useCheckoutFormValidationTrigger = <TData extends FormDataBase>({
  scope,
  formProps,
}: UseCheckoutFormValidationTriggerProps<TData>) => {
  const { setValidationState, setValidating } = useCheckoutValidationActions();
  const { validating } = useCheckoutValidationState();

  const { trigger } = formProps;

  const handleGlobalValidationTrigger = useCallback(async () => {
    if (validating) {
      const formValid = await trigger();
      if (formValid) {
        setValidating(false);
        return;
      }

      setValidationState(scope, "invalid");
    }
  }, [scope, setValidating, setValidationState, trigger, validating]);

  useEffect(() => {
    void handleGlobalValidationTrigger();
  }, [handleGlobalValidationTrigger]);
};
