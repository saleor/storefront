import { FormDataBase } from "@/checkout-storefront/hooks/useForm";
import { GenericErrorCode } from "@/checkout-storefront/lib/globalTypes";
import { camelCase } from "lodash-es";
import { useCallback } from "react";
import { useErrorMessages } from "../useErrorMessages";
import { Error, ApiErrors, Errors } from "./types";

type UseGetParsedErrors<TFormData extends FormDataBase> = {
  getParsedApiErrors: (apiErrors: ApiErrors<TFormData>) => Error<TFormData>[];
  getFormErrorsFromApiErrors: (apiErrors: ApiErrors<TFormData>) => Errors<TFormData>;
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
      }) as Error<TFormData>[],
    [getMessageByErrorCode]
  );

  const getFormErrorsFromApiErrors = useCallback(
    (apiErrors: ApiErrors<TFormData>) =>
      getParsedApiErrors(apiErrors).reduce(
        (result, { field, ...rest }) => ({ ...result, [field]: rest }),
        {}
      ),

    [getParsedApiErrors]
  );

  return { getParsedApiErrors, getFormErrorsFromApiErrors };
};
