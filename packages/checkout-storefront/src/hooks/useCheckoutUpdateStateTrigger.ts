import { CheckoutScope } from "@/checkout-storefront/hooks/useAlerts";
import { CheckoutFormData } from "@/checkout-storefront/sections/CheckoutForm/useCheckoutForm";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

export const useCheckoutUpdateStateTrigger = (checkoutScope: CheckoutScope, updating: boolean) => {
  const { setValue } = useFormContext<CheckoutFormData>();

  useEffect(() => {
    setValue(`updateState.${checkoutScope}`, updating);
  }, [updating]);
};
