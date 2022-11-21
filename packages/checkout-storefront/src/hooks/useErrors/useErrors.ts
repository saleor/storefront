import { useGetParsedApiErrors } from "./useGetParsedApiErrors";
import { useCallback, useState } from "react";
import { ApiErrors, Errors } from "./types";
import { FieldValues } from "react-hook-form";

export interface UseErrors<TFormData extends FieldValues> {
  errors: Errors<TFormData>;
  setApiErrors: (apiErrors: ApiErrors<TFormData>) => void;
  clearErrors: () => void;
  hasErrors: boolean;
}

export const useErrors = <TFormData extends FieldValues>(): UseErrors<TFormData> => {
  const [errors, setErrors] = useState<Errors<TFormData>>({});
  const { getFormErrorsFromApiErrors } = useGetParsedApiErrors<TFormData>();

  const setApiErrors = useCallback(
    (apiErrors: ApiErrors<TFormData>) => setErrors(getFormErrorsFromApiErrors(apiErrors)),
    [setErrors, getFormErrorsFromApiErrors]
  );

  const clearErrors = () => setErrors({});

  const hasErrors = Object.keys(errors).length > 0;

  return {
    errors,
    setApiErrors,
    clearErrors,
    hasErrors,
  };
};
