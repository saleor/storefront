import { FormikConfig, FormikErrors, FormikHelpers, useFormik } from "formik";
import { FocusEvent } from "react";

export type FormDataBase = Record<string, any>;

export type FormErrors<TData extends FormDataBase> = FormikErrors<TData>;

export type UseFormReturn<TData extends FormDataBase> = Omit<
  ReturnType<typeof useFormik<TData>>,
  "setFieldValue"
> & {
  setFieldValue: <TfieldName extends keyof TData>(
    field: TfieldName,
    value: TData[TfieldName],
    shouldValidate?: boolean | undefined
  ) => Promise<FormErrors<TData>> | Promise<void>;
};

export type FormProps<TData> = FormikConfig<TData>;

export type FormHelpers<TData> = FormikHelpers<TData>;

export type ChangeHandler = (e: React.ChangeEvent<any>) => void;

export type BlurHandler = (event: FocusEvent<HTMLInputElement>) => void;
