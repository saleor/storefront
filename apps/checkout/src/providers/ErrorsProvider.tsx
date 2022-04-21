import { useGetFormErrorsFromApiErrors } from "@/lib/utils";
import { PropsWithChildren, useState } from "react";
import { FieldErrors } from "react-hook-form";
import createSafeContext from "./createSafeContext";

export type ApiErrors<TFormData> = Array<{
  field: keyof TFormData;
  code: "REQUIRED" | "INVALID";
  message: string;
}>;

export type Errors<TFormData> = Partial<FieldErrors<TFormData>>;

export type ErrorsContextConsumerProps<TFormData = any> = {
  errors: Errors<TFormData>;
  hasErrors: boolean;
  setErrorsFromApi: (apiErrors: ApiErrors<TFormData>) => void;
  setErrors: (errors: FieldErrors<TFormData>) => void;
  clearErrors: () => void;
};

interface ErrorsProviderProps<TFormData> {
  apiErrors: ApiErrors<TFormData>;
}

export const [useErrorsContext, Provider] =
  createSafeContext<ErrorsContextConsumerProps>();

export const ErrorsProvider = function <TFormData>({
  apiErrors,
  children,
}: PropsWithChildren<ErrorsProviderProps<TFormData>>) {
  const getErrorsFromApi = useGetFormErrorsFromApiErrors<TFormData>();

  const [errors, setErrors] = useState<Partial<FieldErrors<TFormData>>>(
    getErrorsFromApi(apiErrors)
  );

  const hasErrors = Object.keys(errors).length > 0;

  const setErrorsFromApi = (apiErrors: ApiErrors<TFormData>) => {
    setErrors(getErrorsFromApi(apiErrors));
  };

  const clearErrors = () => setErrors({});

  const providerValues: ErrorsContextConsumerProps<TFormData> = {
    errors,
    hasErrors,
    setErrors,
    setErrorsFromApi,
    clearErrors,
  };

  return <Provider value={providerValues}>{children}</Provider>;
};
