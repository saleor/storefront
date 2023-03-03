import { FormDataBase, FormProps, UseFormReturn } from "@/checkout-storefront/hooks/useForm/types";
import { useFormik, useFormikContext } from "formik";
import { useCallback } from "react";

export const useForm = <TData extends FormDataBase>({
  initialDirty,
  ...formProps
}: FormProps<TData>): UseFormReturn<TData> => {
  const form = useFormik<TData>(formProps);

  const { dirty, handleSubmit: handleFormikSubmit } = form;

  const handleSubmit = useCallback(
    (event?: React.FormEvent<HTMLFormElement>) => {
      event?.preventDefault();

      // we do it here because formik doesn't pass props like dirty to onSubmit
      if (initialDirty || dirty) {
        handleFormikSubmit(event);
      }
    },
    [dirty, handleFormikSubmit, initialDirty]
  );

  return { ...form, handleSubmit };
};

export const useFormContext = useFormikContext;
