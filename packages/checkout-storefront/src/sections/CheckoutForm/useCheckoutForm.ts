import { Errors, useCheckout, useErrorMessages } from "@/checkout-storefront/hooks";
import { useValidationResolver } from "@/checkout-storefront/lib/utils";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import { useSetFormErrors } from "@/checkout-storefront/hooks/useSetFormErrors";
import { useEffect, useState } from "react";
import { useCheckoutFormValidation } from "@/checkout-storefront/sections/CheckoutForm/useCheckoutFormValidation";
import { CheckoutFormData } from "@/checkout-storefront/sections/CheckoutForm/types";

const defaultUpdateState = {
  checkoutShippingUpdate: false,
  checkoutCustomerAttach: false,
  checkoutBillingUpdate: false,
  checkoutAddPromoCode: false,
  checkoutDeliveryMethodUpdate: false,
  checkoutLinesUpdate: false,
  checkoutEmailUpdate: false,
};

export type UseCheckoutFormProps = {
  userRegisterErrors: Errors<CheckoutFormData>;
  checkoutFinalize: (formData: CheckoutFormData) => void;
};

export const useCheckoutForm = ({ userRegisterErrors, checkoutFinalize }: UseCheckoutFormProps) => {
  const { errorMessages } = useErrorMessages();
  const { checkout, loading: loadingCheckout } = useCheckout();

  const [isProcessingApiChanges, setIsProcessingApiChanges] = useState(false);
  const [submitInProgress, setSubmitInProgress] = useState(false);

  const schema = object({
    password: string().required(errorMessages.required),
    email: string().email(errorMessages.invalid).required(errorMessages.required),
  });

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
      updateState: defaultUpdateState,
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

  const hasFinishedApiChanges =
    !Object.values(methods.watch("updateState")).some((value) => value) && !loadingCheckout;

  // not using form handleSubmit because it wouldn't allow us to have
  // a flow with steps and errors in between
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

    checkoutFinalize(getValues());
  };

  useEffect(() => {
    if (!hasFinishedApiChanges) {
      return;
    }

    setIsProcessingApiChanges(false);

    if (submitInProgress) {
      handleSubmit();
    }
  }, [hasFinishedApiChanges]);

  return { methods, handleSubmit, isProcessingApiChanges };
};
