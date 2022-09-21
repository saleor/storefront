import {
  CheckoutFormData,
  CheckoutUpdateStateScope,
} from "@/checkout-storefront/sections/CheckoutForm/types";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

// used to auto set in checkout form that a
// given part of the checkout is still loading data
export const useCheckoutUpdateStateTrigger = (
  scope: CheckoutUpdateStateScope,
  updating: boolean
) => {
  const { setValue } = useFormContext<CheckoutFormData>();

  useEffect(() => {
    setValue(`updateState.${scope}`, updating);
  }, [updating, scope]);
};
