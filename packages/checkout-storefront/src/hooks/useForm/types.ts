import { FormikConfig, FormikErrors, FormikHelpers, useFormik } from "formik";
import { FocusEvent } from "react";

export type FormDataBase = Record<string, any>;

export type FormErrors<TData extends FormDataBase> = FormikErrors<TData>;

export type FormDataField<TData extends FormDataBase> = Extract<keyof TData, string>;

// we make these types more strict than default formik ones
export type UseFormReturn<TData extends FormDataBase> = Omit<
  ReturnType<typeof useFormik<TData>>,
  "setFieldValue"
> & {
  // we use keyof FormData instead of plain string
  setFieldValue: <TFieldName extends FormDataField<TData>>(
    field: TFieldName,
    value: TData[TFieldName]
  ) => void;
};

export type FormProps<TData> = FormikConfig<TData> & { initialDirty?: boolean };

export type FormHelpers<TData extends FormDataBase> = FormikHelpers<TData>;

export type ChangeHandler<TElement = any> = (e: React.ChangeEvent<TElement>) => void;

export type BlurHandler = (event: FocusEvent<HTMLInputElement>) => void;

export type FormConfig<TData extends FormDataBase> = Omit<FormikConfig<TData>, "onSubmit"> & {
  onSubmit: (formData: TData, formHelpers: FormHelpers<TData>) => void | Promise<any>;
};
