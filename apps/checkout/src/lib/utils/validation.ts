import { useErrorMessages } from "@/checkout/hooks/useErrorMessages";
import {
  ValidationError,
  ValidationErrorCode,
} from "@/checkout/lib/globalTypes";
import { ApiErrors } from "@/checkout/providers/ErrorsProvider";
import { camelCase } from "lodash-es";
import { useCallback } from "react";
import { FieldErrors } from "react-hook-form";
import { ValidationError as ValidationErrorObject } from "yup";
import { OptionalObjectSchema } from "yup/lib/object";

export const getAllValidationErrors = <TFormData>({
  inner,
  ...rest
}: ValidationErrorObject): ValidationError<TFormData>[] => {
  if (inner) {
    return inner.map(extractValidationError);
  }

  return [extractValidationError(rest)];
};

export const extractValidationError = <TFormData>({
  type,
  path,
  message,
}: Pick<
  ValidationErrorObject,
  "type" | "path" | "message"
>): ValidationError<TFormData> => ({
  type: type as ValidationErrorCode,
  path: path as keyof TFormData,
  message,
});

export const getErrorsAsObject = <TFormData extends Record<string, any>>(
  errors: ValidationError<TFormData>[]
): FieldErrors<TFormData> =>
  errors.reduce(
    (result, { path, ...rest }) => ({ ...result, [path]: rest }),
    {} as FieldErrors<TFormData>
  );

export const useValidationResolver = <
  TFormData extends Record<string, any>,
  TShape extends Record<keyof TFormData, any>
>(
  schema: OptionalObjectSchema<TShape>
) =>
  useCallback(
    async (data: TFormData) => {
      try {
        const values = await schema.validate(data, {
          abortEarly: false,
        });

        return {
          values,
          errors: {},
        };
      } catch (error) {
        const errors = getErrorsAsObject(
          getAllValidationErrors(error as ValidationErrorObject)
        );
        return { values: {}, errors };
      }
    },
    [schema]
  );

export const useGetFormErrorsFromApiErrors = (): (<TFormData>(
  apiErrors: ApiErrors<TFormData>
) => FieldErrors<TFormData>) => {
  const { getMessageByErrorCode } = useErrorMessages();

  const getErrorsFromApi = <TFormData>(apiErrors: ApiErrors<TFormData>) => {
    if (!apiErrors) {
      return {} as FieldErrors<TFormData>;
    }

    return apiErrors.reduce((result, { field, code }) => {
      const errorCode = camelCase(code) as ValidationErrorCode;

      return {
        ...result,
        [field]: { code: errorCode, message: getMessageByErrorCode(errorCode) },
      };
    }, {} as FieldErrors<TFormData>);
  };

  return getErrorsFromApi;
};
