import {
  CheckoutFormData,
  CheckoutUpdateStateScope,
} from "@/checkout-storefront/sections/CheckoutForm/types";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

export const useCheckoutUpdateStateTrigger = (
  scope: CheckoutUpdateStateScope,
  updating: boolean
) => {
  const { setValue } = useFormContext<CheckoutFormData>();

  useEffect(() => {
    setValue(`updateState.${scope}`, updating);
  }, [updating, scope]);
};
