import { FormDataBase } from "@/checkout-storefront/hooks/useForm";
import { GenericErrorCode } from "@/checkout-storefront/lib/globalTypes";
import { camelCase } from "lodash-es";
import { useCallback } from "react";
import { useErrorMessages } from "../useErrorMessages";
import { ApiErrors, FormErrors, ParsedApiErrors } from "./types";

type UseGetParsedErrors<TFormData extends FormDataBase> = {
  getParsedApiErrors: (apiErrors: ApiErrors<TFormData>) => ParsedApiErrors<TFormData>;
  getFormErrorsFromApiErrors: (apiErrors: ApiErrors<TFormData>) => FormErrors<TFormData>;
};

export const useGetParsedErrors = <
  TFormData extends FormDataBase
>(): UseGetParsedErrors<TFormData> => {
  const { getMessageByErrorCode } = useErrorMessages();

  const getParsedApiErrors = useCallback(
    (apiErrors: ApiErrors<TFormData>) =>
      apiErrors.map(({ code, field }) => {
        const errorCode = camelCase(code);

        return {
          field,
          code: errorCode,
          message: getMessageByErrorCode(errorCode as GenericErrorCode),
        };
      }) as ParsedApiErrors<TFormData>,
    [getMessageByErrorCode]
  );

  const getFormErrorsFromApiErrors = useCallback(
    (apiErrors: ApiErrors<TFormData>) =>
      getParsedApiErrors(apiErrors).reduce(
        (result, { field, message }) => ({ ...result, [field]: message }),
        {}
      ) as FormErrors<TFormData>,
    [getParsedApiErrors]
  );

  return { getParsedApiErrors, getFormErrorsFromApiErrors };
};
