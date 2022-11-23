import {
  CheckoutFormScope,
  useCheckoutValidationActions,
  useCheckoutValidationState,
} from "@/checkout-storefront/hooks/state/useCheckoutValidationStateStore";
import { useAlerts } from "@/checkout-storefront/hooks/useAlerts";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { FormDataBase } from "@/checkout-storefront/lib/globalTypes";
import { useCallback, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { MessageDescriptor } from "react-intl";

interface UseCheckoutFormValidationTriggerProps<TData extends FormDataBase> {
  scope: CheckoutFormScope;
  formProps: Pick<UseFormReturn<TData>, "trigger" | "formState">;
  errorMessage: MessageDescriptor;
}

export const useCheckoutFormValidationTrigger = <TData extends FormDataBase>({
  scope,
  formProps,
  errorMessage,
}: UseCheckoutFormValidationTriggerProps<TData>) => {
  const { showCustomErrors } = useAlerts();
  const { setValidationState, setValidating } = useCheckoutValidationActions();
  const { validating } = useCheckoutValidationState();
  const formatMessage = useFormattedMessages();

  const { trigger } = formProps;

  const handleGlobalValidationTrigger = useCallback(async () => {
    if (validating) {
      const formValid = await trigger();
      console.log("WHY?QQQ", { formValid });
      if (formValid) {
        setValidating(false);
        return;
      }

      console.log("WHAT?");
      showCustomErrors([{ message: formatMessage(errorMessage) }]);
      setValidationState(scope, "invalid");
    }
  }, [
    errorMessage,
    formatMessage,
    scope,
    setValidating,
    setValidationState,
    showCustomErrors,
    trigger,
    validating,
  ]);

  useEffect(() => {
    void handleGlobalValidationTrigger();
  }, [handleGlobalValidationTrigger]);
};
