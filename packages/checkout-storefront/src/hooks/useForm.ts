import { FormikConfig, useFormik } from "formik";
import { useCallback } from "react";

export type FormDataBase = Record<string, any>;

export type UseFormReturn<TData extends FormDataBase> = ReturnType<typeof useFormik<TData>>;

export const useForm = <TData extends FormDataBase>(formProps: FormikConfig<TData>) => {
  const form = useFormik<TData>(formProps);
  const { dirty, handleSubmit: handleFormikSubmit } = form;

  const handleSubmit = useCallback(
    (e?: React.FormEvent<HTMLFormElement>) => {
      // we do it here because formik doesn't pass props like dirty to onSubmit :(
      if (dirty) {
        handleFormikSubmit(e);
      }
    },
    [dirty, handleFormikSubmit]
  );

  return { ...form, handleSubmit };
};
