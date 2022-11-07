import { FieldValues } from "react-hook-form";
import { useCallback, useEffect } from "react";
import {
  setFormErrors,
  SetFormErrorsProps,
} from "@/checkout-storefront/hooks/useSetFormErrors/utils";

function useSetFormErrors<TFormData extends FieldValues>({
  setError,
  errors,
}: SetFormErrorsProps<TFormData>) {
  const handleSetFormErrors = useCallback(() => {
    // because we don't get this prop when setting errors from hook form
    const hasErrors = typeof errors === "object" && !!Object.keys(errors).length;

    if (hasErrors) {
      setFormErrors({ setError, errors });
    }
  }, [errors, setError]);

  useEffect(() => {
    handleSetFormErrors();
  }, [errors, handleSetFormErrors]);
}

export { useSetFormErrors };
