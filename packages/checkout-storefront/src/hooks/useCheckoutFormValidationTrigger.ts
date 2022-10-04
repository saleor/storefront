import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

export const useCheckoutFormValidationTrigger = (callback: () => Promise<any>) => {
  const { watch: watchContext } = useFormContext();

  const validating = watchContext("validating");

  useEffect(() => {
    if (validating) {
      void callback();
    }
  }, [validating]);
};
