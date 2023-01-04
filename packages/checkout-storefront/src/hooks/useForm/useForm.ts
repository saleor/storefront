import { FormDataBase, FormProps, UseFormReturn } from "@/checkout-storefront/hooks/useForm/types";
import { useFormik, useFormikContext } from "formik";
import { useCallback } from "react";

export const useForm = <TData extends FormDataBase>(
  formProps: FormProps<TData>
): UseFormReturn<TData> => {
  const form = useFormik<TData>(formProps);

  const { dirty, handleSubmit: handleFormikSubmit } = form;

  const handleSubmit = useCallback(
    (e?: React.FormEvent<HTMLFormElement>) => {
      // we do it here because formik doesn't pass props like dirty to onSubmit
      if (dirty) {
        handleFormikSubmit(e);
      }
    },
    [dirty, handleFormikSubmit]
  );

  //@ts-ignore beause keyof Record<string, any> is not string
  return { ...form, handleSubmit };
};

export const useFormContext = useFormikContext;
