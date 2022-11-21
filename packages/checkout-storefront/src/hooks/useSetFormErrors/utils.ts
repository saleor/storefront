import { Errors } from "@/checkout-storefront/hooks/useErrors";
import { FieldError, FieldValues, Path, UseFormSetError } from "react-hook-form";
import { forEach } from "lodash-es";

export interface SetFormErrorsProps<TFormData extends FieldValues> {
  setError: UseFormSetError<TFormData>;
  errors?: Errors<TFormData>;
}

export const setFormErrors = <TFormData extends FieldValues>({
  setError,
  errors,
}: SetFormErrorsProps<TFormData>) => {
  forEach(errors, (error, key) => {
    setError(key as Path<TFormData>, {
      message: (error as unknown as FieldError).message,
    });
  });
};
