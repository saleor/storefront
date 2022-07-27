import { FieldError, Path, UseFormSetError } from "react-hook-form";
import { Errors } from "@/checkout-storefront/hooks/useErrors";
import { forEach } from "lodash-es";
import { useEffect } from "react";

function useSetFormErrors<TFormData>(data: {
  setError: UseFormSetError<TFormData>;
  errors?: Errors<TFormData>;
}): () => void;

function useSetFormErrors<TFormData>({ setError, errors }: any) {
  const setFormErrors = () => {
    // because we don't get this prop when setting errors from hook form
    const hasErrors =
      typeof errors === "object" ? !!Object.keys(errors).length : false;

    if (hasErrors) {
      forEach(errors, (error, key) => {
        setError(key as Path<TFormData>, {
          message: (error as unknown as FieldError).message,
        });
      });
    }
  };

  useEffect(() => {
    setFormErrors();
  }, [errors]);

  return setFormErrors;
}

export { useSetFormErrors };
