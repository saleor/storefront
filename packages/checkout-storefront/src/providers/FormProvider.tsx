import { FormDataBase, UseFormReturn } from "@/checkout-storefront/hooks/useForm";
import { FormikProvider } from "formik";
import { PropsWithChildren } from "react";
import { Form } from "formik";

export const FormProvider = <TData extends FormDataBase>({
  form,
  children,
}: PropsWithChildren<{
  form: UseFormReturn<TData>;
}>) => (
  <FormikProvider value={form}>
    <Form action="post">{children}</Form>
  </FormikProvider>
);
