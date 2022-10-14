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
  const stateKey = `updateState.${scope}` as keyof CheckoutFormData;

  useEffect(() => {
    if (updating) {
      setValue(stateKey, updating);
    } else {
      // temporary solution to make sure we wait for checkout fetch
      // that'd happen soon after any mutations. will be fixed
      // once we implement advanced caching for urql
      setTimeout(() => {
        setValue(stateKey, updating);
      }, 2000);
    }
  }, [updating, scope, setValue, stateKey]);
};
