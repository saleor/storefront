import { GenericErrorCode } from "@/checkout-storefront/lib/globalTypes";
import { camelCase } from "lodash-es";
import { useCallback } from "react";
import { FieldValues } from "react-hook-form";
import { useErrorMessages } from "../useErrorMessages";
import { Error, ApiErrors, Errors } from "./types";

type GetErrorsFromApiErrors<TFormData extends FieldValues> = {
  getParsedApiErrors: (apiErrors: ApiErrors<TFormData>) => Error<TFormData>[];
  getFormErrorsFromApiErrors: (apiErrors: ApiErrors<TFormData>) => Errors<TFormData>;
};

export const useGetParsedApiErrors = <
  TFormData extends FieldValues
>(): GetErrorsFromApiErrors<TFormData> => {
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
