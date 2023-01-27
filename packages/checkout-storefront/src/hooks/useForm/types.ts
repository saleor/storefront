import { FormikConfig, FormikHelpers, useFormik } from "formik";
import { FocusEvent } from "react";

export type FormDataBase = Record<string, any>;

export type FormErrors<TData extends FormDataBase> = Record<keyof TData, string>;

// we make these types more strict than default formik ones
export type UseFormReturn<TData extends FormDataBase> = Omit<
  ReturnType<typeof useFormik<TData>>,
  "setFieldValue" | "setErrors" | "validateForm"
> & {
  // we use keyof FormData instead of plain string
  setFieldValue: <TfieldName extends keyof TData>(
    field: TfieldName,
    value: TData[TfieldName],
    shouldValidate?: boolean | undefined
  ) => Promise<FormErrors<TData>> | Promise<void>;
  // in formik errors can be { key: undefined | string },
  // we do either a string or key removed altogether
  setErrors: (errors: FormErrors<TData>) => void;
  validateForm: (values: Partial<TData>) => Promise<FormErrors<TData>>;
};

export type FormProps<TData> = FormikConfig<TData> & { initialDirty?: boolean };

export type FormHelpers<TData extends FormDataBase> = Omit<FormikHelpers<TData>, "setErrors"> &
  Pick<UseFormReturn<TData>, "setErrors">;

export type ChangeHandler = (e: React.ChangeEvent<any>) => void;

export type BlurHandler = (event: FocusEvent<HTMLInputElement>) => void;

export type FormConfig<TData extends FormDataBase> = Omit<FormikConfig<TData>, "onSubmit"> & {
  onSubmit: (formData: TData, formHelpers: FormHelpers<TData>) => void | Promise<any>;
};
