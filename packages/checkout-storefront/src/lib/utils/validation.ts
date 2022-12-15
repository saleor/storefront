import { FormDataBase } from "@/checkout-storefront/hooks/useForm";
import { ValidationError, ErrorCode } from "@/checkout-storefront/lib/globalTypes";
import { FormikErrors } from "formik";
import { useCallback } from "react";
import { ObjectSchema, ValidationError as YupValidationErrorObject } from "yup";

export const getAllValidationErrors = <TFormData>({
  inner,
  ...rest
}: YupValidationErrorObject): ValidationError<TFormData>[] => {
  if (inner) {
    return inner.map(extractValidationError);
  }

  return [extractValidationError(rest)];
};

export const extractValidationError = <TFormData>({
  type,
  path,
  message,
}: Pick<YupValidationErrorObject, "type" | "path" | "message">): ValidationError<TFormData> => ({
  type: type as ErrorCode,
  path: path as keyof TFormData,
  message,
});

export const getErrorsAsObject = <TFormData extends Record<string, any>>(
  errors: ValidationError<TFormData>[]
): FormikErrors<TFormData> =>
  errors.reduce(
    (result, { path, ...rest }) => ({ ...result, [path]: rest }),
    {} as FormikErrors<TFormData>
  );

export const useValidationResolver = <
  TFormData extends FormDataBase,
  TShape extends Record<keyof TFormData, any>
>(
  schema: ObjectSchema<TShape>
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
        const errors = getErrorsAsObject(getAllValidationErrors(error as YupValidationErrorObject));
        return { values: {}, errors };
      }
    },
    [schema]
  );
