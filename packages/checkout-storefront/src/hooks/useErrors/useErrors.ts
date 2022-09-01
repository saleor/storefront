import { useGetParsedApiErrors } from "./useGetParsedApiErrors";
import { useState } from "react";
import { ApiErrors, Errors } from "./types";

export interface UseErrors<TFormData> {
  errors: Errors<TFormData>;
  setApiErrors: (apiErrors: ApiErrors<TFormData>) => void;
  clearErrors: () => void;
  hasErrors: boolean;
}

export const useErrors = <TFormData>(): UseErrors<TFormData> => {
  const [errors, setErrors] = useState<Errors<TFormData>>({});
  const getParsedApiErrors = useGetParsedApiErrors<TFormData>();

  const getParsedErrors = (apiErrors: ApiErrors<TFormData>) => {
    if (!apiErrors) {
      return {} as Errors<TFormData>;
    }

    return getParsedApiErrors(apiErrors).reduce((result, { field, ...rest }) => {
      return {
        ...result,
        [field]: {
          ...rest,
        },
      };
    }, {} as Errors<TFormData>);
  };

  const setApiErrors = (apiErrors: ApiErrors<TFormData>) => setErrors(getParsedErrors(apiErrors));

  const clearErrors = () => setErrors({});

  const hasErrors = Object.keys(errors).length > 0;

  return {
    errors,
    setApiErrors,
    clearErrors,
    hasErrors,
  };
};
