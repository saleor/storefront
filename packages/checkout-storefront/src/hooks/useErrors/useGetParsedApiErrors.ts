import { ErrorCode } from "@/checkout-storefront/lib/globalTypes";
import { camelCase } from "lodash-es";
import { useErrorMessages } from "../useErrorMessages";
import { Error, ApiErrors } from "./types";

type GetErrorsFromApiErrors<TFormData> = (apiErrors: ApiErrors<TFormData>) => Error<TFormData>[];

export const useGetParsedApiErrors = <TFormData>(): GetErrorsFromApiErrors<TFormData> => {
  const { getMessageByErrorCode } = useErrorMessages();

  const getParsedApiErrors = (apiErrors: ApiErrors<TFormData>) =>
    apiErrors.map(({ code, field }) => {
      const errorCode = camelCase(code);

      return {
        field,
        code: errorCode,
        message: getMessageByErrorCode(errorCode as ErrorCode),
      };
    }) as Error<TFormData>[];

  return getParsedApiErrors;
};
