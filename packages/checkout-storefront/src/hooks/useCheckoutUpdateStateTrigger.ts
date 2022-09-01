import {
  CheckoutFormData,
  CheckoutUpdateStateScope,
} from "@/checkout-storefront/sections/CheckoutForm/types";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

export const useCheckoutUpdateStateTrigger = (
  checkoutScope: CheckoutUpdateStateScope,
  updating: boolean
) => {
  const { setValue } = useFormContext<CheckoutFormData>();

  useEffect(() => {
    setValue(`updateState.${checkoutScope}`, updating);
  }, [updating, checkoutScope]);
};
