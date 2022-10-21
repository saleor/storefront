import { FieldError, FieldValues, Path, UseFormSetError } from "react-hook-form";
import { Errors } from "@/checkout-storefront/hooks/useErrors";
import { forEach } from "lodash-es";
import { useCallback, useEffect } from "react";

function useSetFormErrors<TFormData extends FieldValues>({
  setError,
  errors,
}: {
  setError: UseFormSetError<TFormData>;
  errors?: Errors<TFormData>;
}) {
  const setFormErrors = useCallback(() => {
    // because we don't get this prop when setting errors from hook form
    const hasErrors = typeof errors === "object" ? !!Object.keys(errors).length : false;

    if (hasErrors) {
      forEach(errors, (error, key) => {
        setError(key as Path<TFormData>, {
          message: (error as unknown as FieldError).message,
        });
      });
    }
  }, [errors, setError]);

  useEffect(() => {
    setFormErrors();
  }, [errors, setFormErrors]);
}

export { useSetFormErrors };
